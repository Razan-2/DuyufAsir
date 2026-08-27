from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator


# Project paths
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent

INDEX_FILE = FRONTEND_DIR / "index.html"
STYLE_FILE = FRONTEND_DIR / "style.css"
MAIN_SCRIPT_FILE = FRONTEND_DIR / "main.js"
SECTION_SCRIPT_FILE = FRONTEND_DIR / "section-page.js"
ASSETS_DIR = FRONTEND_DIR / "assets"


app = FastAPI(
    title="واجهة برمجة ضيوف عسير",
    description="الواجهة الخلفية لمنصة ضيوف عسير متعددة الوكلاء الذكيين.",
    version="1.0.0",
)


# Development-only CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve images, videos, and other assets
if ASSETS_DIR.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=ASSETS_DIR),
        name="assets",
    )


AgentId = Literal[
    "housing",
    "transportation",
    "human-resources",
    "education",
    "entertainment",
]


AGENTS = [
    {
        "id": "housing",
        "name": "وكيل السكن",
        "description": (
            "اكتشف خيارات السكن والفنادق وقارن الأسعار "
            "والمواقع والخدمات المناسبة."
        ),
        "icon": "🏠",
    },
    {
        "id": "transportation",
        "name": "وكيل المواصلات",
        "description": (
            "خطط لمسارك واكتشف وسائل المواصلات "
            "المناسبة لرحلتك."
        ),
        "icon": "🚌",
    },
    {
        "id": "human-resources",
        "name": "وكيل الموارد البشرية",
        "description": (
            "استكشف الوظائف وفرص التدريب واحصل "
            "على إرشاد مهني عملي."
        ),
        "icon": "💼",
    },
    {
        "id": "education",
        "name": "وكيل التعليم",
        "description": (
            "اكتشف المدارس والجامعات والدورات "
            "والفرص التعليمية."
        ),
        "icon": "🎓",
    },
    {
        "id": "entertainment",
        "name": "وكيل الترفيه",
        "description": (
            "اعثر على الأنشطة والفعاليات والوجهات "
            "والتجارب الممتعة."
        ),
        "icon": "🎟️",
    },
]


AGENT_RESPONSES = {
    "housing": (
        "يمكنني مساعدتك في مقارنة خيارات السكن والفنادق. "
        "اذكر المدينة والميزانية والتاريخ وعدد الأشخاص."
    ),
    "transportation": (
        "يمكنني مساعدتك في تخطيط المواصلات. "
        "اذكر نقطة الانطلاق والوجهة ووقت الرحلة وعدد الركاب."
    ),
    "human-resources": (
        "يمكنني مساعدتك في الفرص المهنية. "
        "اذكر تخصصك وخبرتك والوظيفة أو الشركة التي تبحث عنها."
    ),
    "education": (
        "يمكنني مساعدتك في استكشاف الخيارات التعليمية. "
        "اذكر المرحلة أو التخصص والمدينة والميزانية."
    ),
    "entertainment": (
        "يمكنني اقتراح خيارات ترفيهية مناسبة. "
        "اذكر اهتماماتك والتاريخ وعدد الأشخاص والميزانية."
    ),
}


ALLOWED_HTML_PAGES = {
    "about": FRONTEND_DIR / "about.html",
    "agents": FRONTEND_DIR / "agents.html",
    "contact": FRONTEND_DIR / "contact.html",
    "services": FRONTEND_DIR / "services.html",
}


class ChatRequest(BaseModel):
    # Pydantic validates incoming chat data
    agent: AgentId
    message: str = Field(min_length=1, max_length=2000)

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("يجب ألا تكون الرسالة فارغة.")

        return cleaned_value


class ChatResponse(BaseModel):
    selected_agent: str
    user_message: str
    ai_response: str
    success: bool


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, __) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "detail": "تحقق من اختيار الوكيل وكتابة رسالة صحيحة."
        },
    )


def return_file(
    file_path: Path,
    media_type: str,
    error_message: str,
) -> FileResponse:
    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=error_message,
        )

    return FileResponse(
        path=file_path,
        media_type=media_type,
    )


# Main frontend page
@app.get("/", include_in_schema=False)
async def root() -> FileResponse:
    return return_file(
        INDEX_FILE,
        "text/html",
        "ملف index.html غير موجود.",
    )


# Support links that explicitly request index.html
@app.get("/index.html", include_in_schema=False)
async def serve_index_page() -> FileResponse:
    return return_file(
        INDEX_FILE,
        "text/html",
        "ملف index.html غير موجود.",
    )


# Frontend styles
@app.get("/style.css", include_in_schema=False)
async def serve_style() -> FileResponse:
    return return_file(
        STYLE_FILE,
        "text/css",
        "ملف style.css غير موجود.",
    )


# Main frontend JavaScript
@app.get("/main.js", include_in_schema=False)
async def serve_main_script() -> FileResponse:
    return return_file(
        MAIN_SCRIPT_FILE,
        "application/javascript",
        "ملف main.js غير موجود.",
    )


# JavaScript used by internal pages
@app.get("/section-page.js", include_in_schema=False)
async def serve_section_script() -> FileResponse:
    return return_file(
        SECTION_SCRIPT_FILE,
        "application/javascript",
        "ملف section-page.js غير موجود.",
    )


# Compatibility with older script references
@app.get("/script.js", include_in_schema=False)
async def serve_legacy_script() -> FileResponse:
    return return_file(
        MAIN_SCRIPT_FILE,
        "application/javascript",
        "ملف main.js غير موجود.",
    )


# Serve allowed HTML pages safely
@app.get("/{page_name}.html", include_in_schema=False)
async def serve_html_page(page_name: str) -> FileResponse:
    page_file = ALLOWED_HTML_PAGES.get(page_name)

    if page_file is None:
        raise HTTPException(
            status_code=404,
            detail="الصفحة المطلوبة غير موجودة.",
        )

    return return_file(
        page_file,
        "text/html",
        f"ملف {page_name}.html غير موجود.",
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"message": "Backend is running"}


# GET available agents
@app.get("/agents")
async def get_agents() -> list[dict[str, str]]:
    return AGENTS


# POST a message to a selected agent
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    selected_agent = next(
        (
            agent
            for agent in AGENTS
            if agent["id"] == request.agent
        ),
        None,
    )

    if selected_agent is None:
        raise HTTPException(
            status_code=404,
            detail="الوكيل المحدد غير موجود.",
        )

    return ChatResponse(
        selected_agent=selected_agent["name"],
        user_message=request.message,
        ai_response=AGENT_RESPONSES[request.agent],
        success=True,
    )