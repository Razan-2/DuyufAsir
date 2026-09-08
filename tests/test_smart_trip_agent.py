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


def test_agent_collects_multiple_profile_fields_without_reasking(client):
    provider = FakeProvider([
        tool_call("save_trip_profile", '{"days":3,"people_count":4,"budget":"متوسطة","guide":false,"interests":["طبيعة","كوفيهات"]}'),
    ])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        payload = client.post("/api/agent/chat", json={"message": "نحن 4 أشخاص، 3 أيام، ميزانيتنا متوسطة ونحب الطبيعة والكوفيهات وما نبي مرشد"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert payload["trip_profile"]["people_count"] == 4
    assert payload["profile"]["days"] == 3
    assert payload["profile"]["guide"] is False
    assert "people_count" not in payload["missing_fields"]
    assert "days" not in payload["missing_fields"]


def test_agent_accepts_ten_people_for_agritourism(client):
    provider = FakeProvider([
        tool_call("save_trip_profile", '{"trip_type":"سياحة زراعية","people_count":10,"interests":["مزارع","كشتات"]}'),
    ])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        payload = client.post("/api/agent/chat", json={"message": "نحن 10 أشخاص ونبغى رحلة سياحة زراعية فيها مزارع وكشتات"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert payload["trip_profile"]["people_count"] == 10
    assert payload["profile"]["trip_type"] == "سياحة زراعية"
    assert "people_count" not in payload["missing_fields"]


def test_single_answer_never_builds_trip_early(client):
    provider = FakeProvider([{
        "output": [
            tool_call("save_trip_profile", '{"trip_type":"سياحة زراعية"}')["output"][0],
            tool_call("build_trip")["output"][0],
        ]
    }])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        payload = client.post("/api/agent/chat", json={"session_id": "early-build-session", "message": "سياحة زراعية"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert payload["trip"] == []
    assert payload["ready_to_build"] is False
    assert "trip_created" not in payload["actions"]
    assert "trip_type" not in payload["missing_fields"]
    assert "guide" in payload["missing_fields"]


def test_profile_is_retained_by_backend_between_messages(client):
    provider = FakeProvider([
        tool_call("save_trip_profile", '{"trip_type":"سياحة زراعية"}'),
        tool_call("save_trip_profile", '{"days":3}'),
    ])
    agent = SmartTripAgent(provider)
    app.dependency_overrides[get_smart_trip_agent] = lambda: agent
    try:
        first = client.post("/api/agent/chat", json={"session_id": "retained-session", "message": "سياحة زراعية"}).json()
        second = client.post("/api/agent/chat", json={"session_id": "retained-session", "message": "3 أيام"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert first["trip_profile"]["trip_type"] == "سياحة زراعية"
    assert "كم يوم" in first["reply"]
    assert second["trip_profile"]["trip_type"] == "سياحة زراعية"
    assert second["trip_profile"]["days"] == 3
    assert "نوع التجربة" not in second["reply"]
    assert "عدد الأشخاص" in second["reply"]
    assert "trip_type" not in second["missing_fields"]
    assert "days" not in second["missing_fields"]


def test_trip_is_built_only_when_profile_is_complete(client):
    complete = '{"trip_type":"طبيعة","guide":false,"start_date":"2026-09-10","days":1,"day_start_time":"16:00","day_end_time":"23:00","budget":800,"people_count":4,"group_type":"عائلة","interests":["طبيعة","مطاعم"],"weather_preference":"يفضل الصحو"}'
    provider = FakeProvider([
        {"output": [tool_call("save_trip_profile", complete)["output"][0], tool_call("build_trip", '{"days":1,"start_time":"16:00","end_time":"23:00","budget":800,"people":4,"interests":["طبيعة","مطاعم"]}')["output"][0]]},
        {"output": [], "output_text": "اكتملت البيانات وبنيت الرحلة."},
    ])
    app.dependency_overrides[get_smart_trip_agent] = lambda: SmartTripAgent(provider)
    try:
        payload = client.post("/api/agent/chat", json={"session_id": "complete-session", "message": "هذه كل معلومات الرحلة"}).json()
    finally:
        app.dependency_overrides.pop(get_smart_trip_agent, None)
    assert payload["missing_fields"] == []
    assert payload["ready_to_build"] is True
    assert payload["trip"]
    assert "trip_created" in payload["actions"]


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
