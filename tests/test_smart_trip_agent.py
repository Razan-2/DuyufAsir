import httpx
import pytest

from app.agents.smart_trip import SmartTripAgent
from app.agents.tools import ToolContext, build_trip
from app.database import SessionLocal
from app.routers.smart_trip_agent import get_smart_trip_agent
from main import app


class FakeProvider:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    async def create(self, payload):
        self.calls.append(payload)
        result = self.responses.pop(0)
        if isinstance(result, Exception):
            raise result
        return result


def tool_call(name, arguments="{}"):
    return {"output": [{"type": "function_call", "name": name, "arguments": arguments, "call_id": f"call-{name}"}]}


def test_agent_input_validation(client):
    assert client.post("/api/agent/chat", json={"message": "ا"}).status_code == 422
    assert client.post("/api/agent/chat", json={"message": "ا" * 1201}).status_code == 422


def test_ai_provider_failure_returns_safe_arabic_error(client):
    provider = FakeProvider([httpx.ReadTimeout("timeout"), httpx.ReadTimeout("timeout")])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        response = client.post("/api/agent/chat", json={"message": "ابنِ لي رحلة اليوم"})
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert response.status_code == 502
    assert "تعذر الاتصال" in response.json()["detail"]


def test_agent_executes_requested_tool(client):
    provider = FakeProvider([
        tool_call("search_destinations", '{"city":"أبها","interest":"طبيعة"}'),
        {"output": [], "output_text": "وجدت الوجهات المناسبة."},
    ])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        payload = client.post("/api/agent/chat", json={"message": "ابحث عن وجهات طبيعية في أبها"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert "destinations_searched" in payload["actions"]
    assert len(provider.calls) == 2
    assert any(item.get("type") == "function_call_output" for item in provider.calls[1]["input"])


def test_build_trip_handles_no_destination_results():
    with SessionLocal() as db:
        context = ToolContext(db=db, searches={"destinations": []})
        result = build_trip(context)
    assert result["trip"] == []
    assert "لا توجد وجهات" in result["message"]


def test_bad_weather_excludes_outdoor_destination():
    with SessionLocal() as db:
        context = ToolContext(db=db)
        context.searches["destinations"] = [
            {"name": "السودة", "category": "طبيعة", "city": "أبها", "indoor": False, "duration_minutes": 90, "cost": 0},
            {"name": "قصور أبو سراح", "category": "تراث", "city": "أبها", "indoor": True, "duration_minutes": 75, "cost": 30},
        ]
        context.weather["السودة"] = {"suitable_outdoor": False}
        result = build_trip(context)
    names = [stop["name"] for day in result["trip"] for stop in day["stops"]]
    assert "السودة" not in names
    assert "قصور أبو سراح" in names

