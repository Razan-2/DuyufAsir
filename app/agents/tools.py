from __future__ import annotations

from dataclasses import dataclass, field
import inspect
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


DEMO_DESTINATIONS = [
    {"name": "السودة", "category": "طبيعة", "city": "أبها", "latitude": 18.267, "longitude": 42.365, "indoor": False, "duration_minutes": 90, "cost": 0},
    {"name": "قرية المفتاحة", "category": "تراث", "city": "أبها", "latitude": 18.216, "longitude": 42.501, "indoor": True, "duration_minutes": 75, "cost": 0},
    {"name": "قصور أبو سراح", "category": "تراث وتجربة داخلية", "city": "أبها", "latitude": 18.205, "longitude": 42.478, "indoor": True, "duration_minutes": 75, "cost": 30},
    {"name": "ممشى الضباب", "category": "طبيعة", "city": "أبها", "latitude": 18.196, "longitude": 42.489, "indoor": False, "duration_minutes": 60, "cost": 0},
]
DEMO_RESTAURANTS = [
    {"name": "مطعم السدة", "category": "مطعم", "city": "أبها", "indoor": True, "duration_minutes": 75, "cost": 70},
    {"name": "مطعم القرية التراثية", "category": "مطعم محلي", "city": "أبها", "indoor": True, "duration_minutes": 75, "cost": 85},
    {"name": "كوفي إطلالة", "category": "كوفي", "city": "أبها", "indoor": True, "duration_minutes": 60, "cost": 30},
]
DEMO_EVENTS = [
    {"name": "تجربة الفن العسيري", "category": "تجربة", "city": "أبها", "indoor": True, "duration_minutes": 75, "cost": 45},
    {"name": "جولة سوق الثلاثاء", "category": "فعالية محلية", "city": "أبها", "indoor": False, "duration_minutes": 60, "cost": 0},
]
DEMO_ACCOMMODATION = [
    {"name": "نُزل تراثي عسيري", "category": "إقامة تراثية", "city": "أبها", "cost": 350},
    {"name": "فندق بلو إن", "category": "فندق", "city": "أبها", "cost": 420},
]
COORDINATES = {item["name"]: (item["latitude"], item["longitude"]) for item in DEMO_DESTINATIONS}
COORDINATES["أبها"] = (18.2164, 42.5053)


@dataclass
class ToolContext:
    db: Session
    profile: dict[str, Any] = field(default_factory=dict)
    actions: list[str] = field(default_factory=list)
    searches: dict[str, list[dict[str, Any]]] = field(default_factory=dict)
    weather: dict[str, dict[str, Any]] = field(default_factory=dict)
    trip: list[dict[str, Any]] = field(default_factory=list)


PROFILE_FIELDS = ("trip_type", "days", "people_count", "budget", "group_type", "guide", "start_date", "day_start_time", "day_end_time", "interests", "weather_preference")


def save_trip_profile(
    context: ToolContext,
    trip_type: str | None = None,
    guide: bool | None = None,
    start_date: str | None = None,
    days: int | None = None,
    day_start_time: str | None = None,
    day_end_time: str | None = None,
    budget: str | float | None = None,
    people_count: int | None = None,
    group_type: str | None = None,
    interests: list[str] | None = None,
    weather_preference: str | None = None,
    classic_car_experience: bool | None = None,
) -> dict[str, Any]:
    values = locals()
    for field_name in PROFILE_FIELDS:
        value = values[field_name]
        if value is not None and value != []:
            context.profile[field_name] = value
    if classic_car_experience is not None:
        context.profile["classic_car_experience"] = classic_car_experience
    missing = [field_name for field_name in PROFILE_FIELDS if context.profile.get(field_name) in (None, "", [])]
    context.actions.append("profile_updated")
    return {"profile": context.profile, "missing_fields": missing, "ready": not missing}


def _serialize_rows(rows: list[Any], kind: str) -> list[dict[str, Any]]:
    output = []
    for row in rows:
        output.append({
            "name": getattr(row, "name_ar", None) or getattr(row, "name", ""),
            "category": getattr(row, "category", None) or getattr(row, "cuisine_type", None) or getattr(row, "accommodation_type", None) or kind,
            "city": getattr(row, "city", "أبها"),
            "latitude": getattr(row, "latitude", None),
            "longitude": getattr(row, "longitude", None),
            "indoor": kind in {"restaurant", "accommodation"},
            "duration_minutes": getattr(row, "average_visit_duration", None) or 75,
            "cost": getattr(row, "entry_fee", None) or getattr(row, "average_price", None) or getattr(row, "price_per_night", None) or 0,
        })
    return output


async def get_weather(context: ToolContext, location: str, forecast_date: str, visit_time: str = "16:00") -> dict[str, Any]:
    latitude, longitude = COORDINATES.get(location, COORDINATES["أبها"])
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get("https://api.open-meteo.com/v1/forecast", params={
                "latitude": latitude, "longitude": longitude,
                "hourly": "weather_code,precipitation_probability,visibility",
                "timezone": "Asia/Riyadh", "start_date": forecast_date, "end_date": forecast_date,
            })
            response.raise_for_status()
            hourly = response.json()["hourly"]
        target = f"{forecast_date}T{visit_time[:2]}:00"
        index = hourly["time"].index(target)
        code = int(hourly["weather_code"][index])
        rain = int(hourly["precipitation_probability"][index] or 0)
        visibility = float(hourly["visibility"][index] or 0)
        unsafe = code in {45, 48} or 51 <= code <= 67 or 80 <= code <= 82 or 95 <= code <= 99 or rain >= 55 or visibility < 1500
        result = {"location": location, "date": forecast_date, "time": visit_time, "weather_code": code, "rain_probability": rain, "visibility_meters": round(visibility), "suitable_outdoor": not unsafe, "source": "Open-Meteo", "is_demo": False}
    except (httpx.HTTPError, KeyError, ValueError, IndexError):
        result = {"location": location, "date": forecast_date, "time": visit_time, "suitable_outdoor": True, "source": "temporary_fallback", "is_demo": True}
    context.weather[location] = result
    context.actions.append("weather_checked")
    return result


def search_destinations(context: ToolContext, city: str = "أبها", interest: str = "") -> dict[str, Any]:
    rows = context.db.scalars(select(models.Destination).where(models.Destination.is_active.is_(True))).all()
    items = _serialize_rows(rows, "destination") or DEMO_DESTINATIONS
    filtered = [item for item in items if (not city or city in item["city"]) and (not interest or interest in item["category"] or interest in item["name"])]
    context.searches["destinations"] = filtered or items
    context.actions.append("destinations_searched")
    return {"items": context.searches["destinations"], "source": "database" if rows else "demo_catalog"}


def search_restaurants(context: ToolContext, city: str = "أبها", kind: str = "all") -> dict[str, Any]:
    rows = context.db.scalars(select(models.Restaurant).where(models.Restaurant.is_active.is_(True))).all()
    items = _serialize_rows(rows, "restaurant") or DEMO_RESTAURANTS
    if kind == "cafe": items = [item for item in items if "كوفي" in item["category"] or "قهوة" in item["category"]]
    elif kind == "restaurant": items = [item for item in items if "مطعم" in item["category"]]
    context.searches[f"restaurants_{kind}"] = items
    context.actions.append("restaurants_searched")
    return {"items": items, "source": "database" if rows else "demo_catalog"}


def search_events(context: ToolContext, city: str = "أبها", event_date: str | None = None) -> dict[str, Any]:
    rows = context.db.scalars(select(models.Event).where(models.Event.is_active.is_(True))).all()
    items = [{"name": row.name, "category": "فعالية", "city": row.location_name, "indoor": True, "duration_minutes": 75, "cost": row.price or 0} for row in rows] or DEMO_EVENTS
    context.searches["events"] = items
    context.actions.append("events_searched")
    return {"items": items, "source": "database" if rows else "demo_catalog"}


def search_accommodation(context: ToolContext, city: str = "أبها", max_price: float | None = None) -> dict[str, Any]:
    rows = context.db.scalars(select(models.Accommodation).where(models.Accommodation.is_active.is_(True))).all()
    items = _serialize_rows(rows, "accommodation") or DEMO_ACCOMMODATION
    if max_price is not None: items = [item for item in items if item["cost"] <= max_price]
    context.searches["accommodation"] = items
    context.actions.append("accommodation_searched")
    return {"items": items, "source": "database" if rows else "demo_catalog"}


def build_trip(context: ToolContext, days: int = 1, start_time: str = "16:00", end_time: str = "23:00", budget: float = 800, people: int = 1, interests: list[str] | None = None) -> dict[str, Any]:
    if context.profile:
        missing = [field_name for field_name in PROFILE_FIELDS if context.profile.get(field_name) in (None, "", [])]
        if missing:
            return {"trip": [], "message": "ملف الرحلة غير مكتمل بعد.", "missing_fields": missing}
    destinations = context.searches.get("destinations", DEMO_DESTINATIONS)
    safe_destinations = [item for item in destinations if item.get("indoor") or context.weather.get(item["name"], {}).get("suitable_outdoor", True)]
    cafes = context.searches.get("restaurants_cafe") or [item for item in DEMO_RESTAURANTS if item["category"] == "كوفي"]
    restaurants = context.searches.get("restaurants_restaurant") or [item for item in DEMO_RESTAURANTS if "مطعم" in item["category"]]
    events = context.searches.get("events", DEMO_EVENTS)
    if not safe_destinations:
        return {"trip": [], "message": "لا توجد وجهات مناسبة للطقس والتفضيلات حاليًا."}
    try:
        start_minutes = int(start_time[:2]) * 60 + int(start_time[3:5])
        end_minutes = int(end_time[:2]) * 60 + int(end_time[3:5])
    except (TypeError, ValueError):
        start_minutes, end_minutes = 16 * 60, 23 * 60
    if end_minutes <= start_minutes:
        end_minutes += 24 * 60
    interval = max(60, (end_minutes - start_minutes) // 4)
    times = [f"{((start_minutes + interval * index) // 60) % 24:02d}:{(start_minutes + interval * index) % 60:02d}" for index in range(4)]
    trip = []
    for day_number in range(1, min(max(days, 1), 7) + 1):
        candidates = [cafes[day_number % len(cafes)], safe_destinations[(day_number - 1) % len(safe_destinations)], events[(day_number - 1) % len(events)], restaurants[(day_number - 1) % len(restaurants)]]
        stops = [{"time": times[index], "name": item["name"], "category": item["category"], "duration_minutes": item.get("duration_minutes", 60), "estimated_cost": item.get("cost", 0), "reason": "مناسب للطقس واهتماماتك وتسلسل اليوم"} for index, item in enumerate(candidates)]
        trip.append({"day": day_number, "start_time": start_time, "end_time": end_time, "stops": stops})
    context.trip = trip
    context.actions.append("trip_created")
    return {"trip": trip, "estimated_budget": sum(stop["estimated_cost"] for day in trip for stop in day["stops"]) * people, "requested_budget": budget}


def update_trip(context: ToolContext, reason: str = "تغير الطقس") -> dict[str, Any]:
    if not context.trip:
        return {"trip": [], "message": "لا توجد رحلة سابقة لتحديثها."}
    changed = False
    for day in context.trip:
        for index, stop in enumerate(day["stops"]):
            weather = context.weather.get(stop["name"])
            if weather and not weather.get("suitable_outdoor", True):
                replacement = next((item for item in DEMO_DESTINATIONS if item["indoor"]), DEMO_EVENTS[0])
                day["stops"][index] = {**stop, "name": replacement["name"], "category": replacement["category"], "reason": f"بديل بسبب {reason}"}
                changed = True
    context.actions.append("trip_updated")
    return {"trip": context.trip, "changed_only_affected_stops": changed}


TOOL_HANDLERS = {
    "save_trip_profile": save_trip_profile,
    "get_weather": get_weather, "search_destinations": search_destinations,
    "search_restaurants": search_restaurants, "search_events": search_events,
    "search_accommodation": search_accommodation, "build_trip": build_trip, "update_trip": update_trip,
}

TOOL_DEFINITIONS = [
    {"type": "function", "name": "save_trip_profile", "description": "سجل فقط معلومات الرحلة التي ذكرها المستخدم صراحة أو أجاب عنها. لا تخمن القيم الناقصة.", "parameters": {"type": "object", "properties": {"trip_type": {"type": ["string", "null"], "enum": ["سياحة زراعية", "داخل المدينة", "طبيعة", "خليط", None]}, "guide": {"type": ["boolean", "null"]}, "start_date": {"type": ["string", "null"]}, "days": {"type": ["integer", "null"], "minimum": 1, "maximum": 7}, "day_start_time": {"type": ["string", "null"]}, "day_end_time": {"type": ["string", "null"]}, "budget": {"type": ["string", "number", "null"]}, "people_count": {"type": ["integer", "null"], "minimum": 1, "maximum": 30}, "group_type": {"type": ["string", "null"]}, "interests": {"type": ["array", "null"], "items": {"type": "string"}}, "weather_preference": {"type": ["string", "null"], "enum": ["يحب المطر", "يفضل الصحو", None]}, "classic_car_experience": {"type": ["boolean", "null"]}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "get_weather", "description": "افحص طقس وجهة في تاريخ ووقت محددين قبل إضافتها للرحلة.", "parameters": {"type": "object", "properties": {"location": {"type": "string"}, "forecast_date": {"type": "string"}, "visit_time": {"type": "string"}}, "required": ["location", "forecast_date"], "additionalProperties": False}},
    {"type": "function", "name": "search_destinations", "description": "ابحث في وجهات المشروع.", "parameters": {"type": "object", "properties": {"city": {"type": "string"}, "interest": {"type": "string"}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "search_restaurants", "description": "ابحث عن مطاعم أو مقاهٍ.", "parameters": {"type": "object", "properties": {"city": {"type": "string"}, "kind": {"type": "string", "enum": ["all", "cafe", "restaurant"]}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "search_events", "description": "ابحث عن فعاليات وتجارب.", "parameters": {"type": "object", "properties": {"city": {"type": "string"}, "event_date": {"type": ["string", "null"]}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "search_accommodation", "description": "ابحث عن إقامة عند الحاجة.", "parameters": {"type": "object", "properties": {"city": {"type": "string"}, "max_price": {"type": ["number", "null"]}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "build_trip", "description": "أنشئ جدول رحلة من نتائج الأدوات فقط.", "parameters": {"type": "object", "properties": {"days": {"type": "integer", "minimum": 1, "maximum": 7}, "start_time": {"type": "string"}, "end_time": {"type": "string"}, "budget": {"type": "number", "minimum": 0}, "people": {"type": "integer", "minimum": 1, "maximum": 30}, "interests": {"type": "array", "items": {"type": "string"}}}, "required": [], "additionalProperties": False}},
    {"type": "function", "name": "update_trip", "description": "عدّل المحطات المتأثرة فقط في رحلة موجودة.", "parameters": {"type": "object", "properties": {"reason": {"type": "string"}}, "required": [], "additionalProperties": False}},
]

async def execute_tool(context: ToolContext, name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    handler = TOOL_HANDLERS.get(name)
    if handler is None:
        return {"error": "الأداة المطلوبة غير مسموحة."}
    allowed = set(inspect.signature(handler).parameters) - {"context"}
    if not isinstance(arguments, dict) or any(key not in allowed for key in arguments):
        return {"error": "معاملات الأداة غير صالحة."}
    try:
        result = handler(context, **arguments)
    except (TypeError, ValueError):
        return {"error": "تعذر التحقق من معاملات الأداة."}
    if hasattr(result, "__await__"):
        result = await result
    return result
