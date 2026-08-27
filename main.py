import asyncio
import base64
import binascii
import os
import smtplib
import sqlite3
import ssl
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from threading import Lock
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field, field_validator


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "app.db"
load_dotenv(BASE_DIR / ".env")

# Change this line to "gemini" to use Gemini.
AI_PROVIDER = "ollama"

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/chat")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
SYSTEM_PROMPT = (
    "You are a helpful assistant for Duof Asir. Give clear, concise, and practical "
    "answers related to housing, transportation, employment, education, and entertainment in Asir."
)

AGENTS = [
    {"id": "housing", "name": "Housing Agent", "description": "Find housing and hotels in Asir.", "icon": "house"},
    {"id": "transportation", "name": "Transportation Agent", "description": "Plan transportation and car rentals.", "icon": "car"},
    {"id": "human-resources", "name": "Human Resources Agent", "description": "Explore jobs and career opportunities.", "icon": "briefcase"},
    {"id": "education", "name": "Education Agent", "description": "Find universities, schools, and courses.", "icon": "graduation-cap"},
    {"id": "entertainment", "name": "Entertainment Agent", "description": "Discover restaurants, cafes, and activities.", "icon": "ticket"},
]
AGENT_IDS = {agent["id"] for agent in AGENTS}

database = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
database.row_factory = sqlite3.Row
database_lock = Lock()


def initialize_database() -> None:
    with database_lock:
        database.execute(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                agent TEXT NOT NULL,
                user_message TEXT NOT NULL,
                ai_response TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        database.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            )
            """
        )
        database.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield
    database.close()


app = FastAPI(title="Duof Asir API", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/assets", StaticFiles(directory=BASE_DIR / "assets"), name="assets")


class ChatRequest(BaseModel):
    agent: str = Field(min_length=1, max_length=50)
    message: str = Field(min_length=1, max_length=4000)

    @field_validator("agent", "message")
    @classmethod
    def clean_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("This field cannot be empty.")
        return cleaned


class UserRegistration(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return " ".join(value.split())


class PaymentCheckoutRequest(BaseModel):
    provider: Literal["tabby", "tamara", "applepay"]
    amount: float = Field(gt=0, le=100000)
    description: str = Field(min_length=2, max_length=255)
    customer_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(pattern=r"^05\d{8}$")


class JobApplicationRequest(BaseModel):
    company: Literal["lynx", "stc"]
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(pattern=r"^05\d{8}$")
    role: str = Field(min_length=2, max_length=120)
    message: str = Field(default="", max_length=2000)
    cv_filename: str = Field(min_length=5, max_length=180, pattern=r"(?i)^.+\.pdf$")
    cv_base64: str = Field(min_length=20, max_length=8_000_000)


JOB_RECIPIENTS = {
    "lynx": "info@lynxco.net",
    "stc": "razanalqobti@gmail.com",
}


def send_job_application_email(application: JobApplicationRequest, cv_bytes: bytes) -> None:
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_sender = os.getenv("SMTP_FROM_EMAIL", smtp_user).strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    if not all((smtp_host, smtp_user, smtp_password, smtp_sender)):
        raise RuntimeError("SMTP settings are incomplete.")

    message = EmailMessage()
    message["Subject"] = f"Job application: {application.role} - {application.full_name}"
    message["From"] = smtp_sender
    message["To"] = JOB_RECIPIENTS[application.company]
    message["Reply-To"] = str(application.email)
    message.set_content(
        f"Full name: {application.full_name}\n"
        f"Email: {application.email}\n"
        f"Phone: {application.phone}\n"
        f"Requested role: {application.role}\n\n"
        f"Message:\n{application.message or 'No message provided.'}\n"
    )
    safe_filename = Path(application.cv_filename).name
    message.add_attachment(cv_bytes, maintype="application", subtype="pdf", filename=safe_filename)

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
        smtp.starttls(context=context)
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_, error: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"success": False, "detail": "Invalid request data.", "errors": error.errors()})


@app.exception_handler(sqlite3.Error)
async def sqlite_error_handler(_, error: sqlite3.Error) -> JSONResponse:
    return JSONResponse(status_code=500, content={"success": False, "detail": "Database operation failed."})


def page_response(file_name: str) -> FileResponse:
    file_path = BASE_DIR / file_name
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Page not found.")
    return FileResponse(file_path)


async def ask_ollama(agent: str, message: str) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "stream": False,
        "messages": [
            {"role": "system", "content": f"{SYSTEM_PROMPT} Selected agent: {agent}."},
            {"role": "user", "content": message},
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
            response = await client.post(OLLAMA_URL, json=payload)
            response.raise_for_status()
            answer = response.json().get("message", {}).get("content", "").strip()
    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Ollama is unavailable. Make sure Ollama and Gemma 3 are running.") from error
    if not answer:
        raise HTTPException(status_code=502, detail="Ollama returned an empty response.")
    return answer


async def ask_gemini(agent: str, message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is missing from the .env file.")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    payload = {
        "system_instruction": {"parts": [{"text": f"{SYSTEM_PROMPT} Selected agent: {agent}."}]},
        "contents": [{"role": "user", "parts": [{"text": message}]}],
    }
    try:
        async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
            response = await client.post(url, params={"key": api_key}, json=payload)
            response.raise_for_status()
            candidates = response.json().get("candidates", [])
            answer = candidates[0]["content"]["parts"][0]["text"].strip() if candidates else ""
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Gemini is unavailable or returned an invalid response.") from error
    if not answer:
        raise HTTPException(status_code=502, detail="Gemini returned an empty response.")
    return answer


async def generate_ai_response(agent: str, message: str) -> str:
    if AI_PROVIDER == "ollama":
        return await ask_ollama(agent, message)
    if AI_PROVIDER == "gemini":
        return await ask_gemini(agent, message)
    raise HTTPException(status_code=500, detail="AI_PROVIDER must be either 'ollama' or 'gemini'.")


@app.get("/", include_in_schema=False)
async def homepage() -> FileResponse:
    return page_response("index.html")


@app.get("/index.html", include_in_schema=False)
async def index_page() -> FileResponse:
    return page_response("index.html")


@app.get("/{page_name}.html", include_in_schema=False)
async def html_page(page_name: str) -> FileResponse:
    if page_name not in {"agents", "services", "about", "contact", "payment-preview"}:
        raise HTTPException(status_code=404, detail="Page not found.")
    return page_response(f"{page_name}.html")


@app.get("/style.css", include_in_schema=False)
async def stylesheet() -> FileResponse:
    return page_response("style.css")


@app.get("/main.js", include_in_schema=False)
async def main_script() -> FileResponse:
    return page_response("main.js")


@app.get("/section-page.js", include_in_schema=False)
async def section_script() -> FileResponse:
    return page_response("section-page.js")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"message": "Backend is running"}


@app.get("/agents")
async def get_agents() -> list[dict[str, str]]:
    return AGENTS


@app.post("/chat")
async def chat(request: ChatRequest) -> dict[str, object]:
    if request.agent not in AGENT_IDS:
        raise HTTPException(status_code=404, detail="The selected agent does not exist.")
    agent_name = next(agent["name"] for agent in AGENTS if agent["id"] == request.agent)
    answer = await generate_ai_response(agent_name, request.message)
    created_at = datetime.now(timezone.utc).isoformat()
    with database_lock:
        cursor = database.execute(
            "INSERT INTO conversations (agent, user_message, ai_response, created_at) VALUES (?, ?, ?, ?)",
            (request.agent, request.message, answer, created_at),
        )
        database.commit()
    return {
        "id": cursor.lastrowid,
        "selected_agent": agent_name,
        "user_message": request.message,
        "ai_response": answer,
        "created_at": created_at,
        "success": True,
    }


@app.get("/conversations")
async def get_conversations() -> list[dict[str, object]]:
    with database_lock:
        rows = database.execute(
            "SELECT id, agent, user_message, ai_response, created_at FROM conversations ORDER BY id DESC"
        ).fetchall()
    return [dict(row) for row in rows]


@app.post("/payments/checkout")
async def create_payment_checkout(payment: PaymentCheckoutRequest, request: Request) -> dict[str, object]:
    public_base_url = os.getenv("PUBLIC_BASE_URL", "").strip().rstrip("/") or str(request.base_url).rstrip("/")

    reference_id = f"DUOF-{int(datetime.now(timezone.utc).timestamp())}"
    phone = f"+966{payment.phone[1:]}"
    merchant_urls = {
        "success": f"{public_base_url}/?payment=success",
        "cancel": f"{public_base_url}/?payment=cancel",
        "failure": f"{public_base_url}/?payment=failure",
    }

    if payment.provider == "applepay":
        checkout_url = os.getenv("APPLE_PAY_CHECKOUT_URL", "").strip()
        if not checkout_url:
            raise HTTPException(status_code=503, detail="Apple Pay يحتاج حساب تاجر، نطاق HTTPS موثق، وشهادة أو رابط دفع من مزود معتمد.")
        return {"success": True, "provider": "applepay", "checkout_url": checkout_url, "reference_id": reference_id}

    try:
        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            if payment.provider == "tabby":
                secret_key = os.getenv("TABBY_SECRET_KEY", "").strip()
                merchant_code = os.getenv("TABBY_MERCHANT_CODE", "").strip()
                if not secret_key or not merchant_code:
                    raise HTTPException(status_code=503, detail="أضيفي TABBY_SECRET_KEY وTABBY_MERCHANT_CODE إلى ملف .env بعد تفعيل حساب التاجر.")
                response = await client.post(
                    "https://api.tabby.sa/api/v2/checkout",
                    headers={"Authorization": f"Bearer {secret_key}"},
                    json={
                        "payment": {
                            "amount": f"{payment.amount:.2f}",
                            "currency": "SAR",
                            "description": payment.description,
                            "buyer": {"name": payment.customer_name, "email": str(payment.email), "phone": phone},
                            "order": {"reference_id": reference_id, "items": [{"title": payment.description, "quantity": 1, "unit_price": f"{payment.amount:.2f}", "category": "Local services"}]},
                        },
                        "merchant_code": merchant_code,
                        "merchant_urls": merchant_urls,
                    },
                )
                response.raise_for_status()
                data = response.json()
                checkout_url = data.get("configuration", {}).get("available_products", {}).get("installments", [{}])[0].get("web_url")
            else:
                api_token = os.getenv("TAMARA_API_TOKEN", "").strip()
                if not api_token:
                    raise HTTPException(status_code=503, detail="أضيفي TAMARA_API_TOKEN إلى ملف .env بعد تفعيل حساب التاجر.")
                response = await client.post(
                    "https://api.tamara.co/checkout",
                    headers={"Authorization": f"Bearer {api_token}"},
                    json={
                        "order_reference_id": reference_id,
                        "total_amount": {"amount": payment.amount, "currency": "SAR"},
                        "description": payment.description,
                        "country_code": "SA",
                        "payment_type": "PAY_BY_INSTALMENTS",
                        "locale": "ar_SA",
                        "consumer": {"first_name": payment.customer_name, "last_name": "", "phone_number": phone, "email": str(payment.email)},
                        "items": [{"name": payment.description, "type": "Physical", "reference_id": reference_id, "sku": reference_id, "quantity": 1, "unit_price": {"amount": payment.amount, "currency": "SAR"}, "total_amount": {"amount": payment.amount, "currency": "SAR"}}],
                        "shipping_amount": {"amount": 0, "currency": "SAR"},
                        "tax_amount": {"amount": 0, "currency": "SAR"},
                        "merchant_url": {"success": merchant_urls["success"], "cancel": merchant_urls["cancel"], "failure": merchant_urls["failure"], "notification": f"{public_base_url}/payments/tamara/webhook"},
                        "shipping_address": {"first_name": payment.customer_name, "last_name": "", "line1": "Abha", "city": "Abha", "country_code": "SA"},
                    },
                )
                response.raise_for_status()
                data = response.json()
                checkout_url = data.get("checkout_url")
    except HTTPException:
        raise
    except (httpx.HTTPError, ValueError, IndexError) as error:
        raise HTTPException(status_code=502, detail=f"تعذر إنشاء جلسة دفع عبر {payment.provider}. تحققي من بيانات حساب التاجر.") from error

    if not checkout_url:
        raise HTTPException(status_code=502, detail="لم يُرجع مزود الدفع رابطًا صالحًا لإكمال العملية.")
    return {"success": True, "provider": payment.provider, "checkout_url": checkout_url, "reference_id": reference_id}


@app.post("/job-applications", status_code=201)
async def submit_job_application(application: JobApplicationRequest) -> dict[str, object]:
    try:
        cv_bytes = base64.b64decode(application.cv_base64, validate=True)
    except (binascii.Error, ValueError) as error:
        raise HTTPException(status_code=422, detail="ملف السيرة الذاتية غير صالح.") from error
    if not cv_bytes.startswith(b"%PDF-") or len(cv_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="ارفعي ملف PDF صالحًا لا يتجاوز 5 ميجابايت.")
    try:
        await asyncio.to_thread(send_job_application_email, application, cv_bytes)
    except (OSError, RuntimeError, smtplib.SMTPException, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail="إرسال البريد غير مفعّل بعد. أضيفي بيانات SMTP الصحيحة في ملف .env ثم أعيدي تشغيل الخادم.",
        ) from error
    return {"success": True, "message": "تم إرسال طلب التوظيف بنجاح."}


@app.post("/register-user", status_code=201)
async def register_user(user: UserRegistration) -> dict[str, object]:
    created_at = datetime.now(timezone.utc).isoformat()
    try:
        with database_lock:
            cursor = database.execute(
                "INSERT INTO users (full_name, email, created_at) VALUES (?, ?, ?)",
                (user.full_name, str(user.email).lower(), created_at),
            )
            database.commit()
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=409, detail="A user with this email already exists.") from error
    return {"id": cursor.lastrowid, "full_name": user.full_name, "email": str(user.email).lower(), "created_at": created_at, "success": True}


@app.get("/users")
async def get_users() -> list[dict[str, object]]:
    with database_lock:
        rows = database.execute("SELECT id, full_name, email, created_at FROM users ORDER BY id DESC").fetchall()
    return [dict(row) for row in rows]


@app.get("/prayer-times/{city}")
async def prayer_times(city: str) -> dict[str, object]:
    cleaned_city = city.strip()
    if not cleaned_city or len(cleaned_city) > 80:
        raise HTTPException(status_code=422, detail="Enter a valid city name.")
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            response = await client.get(
                "https://api.aladhan.com/v1/timingsByCity",
                params={"city": cleaned_city, "country": "Saudi Arabia", "method": 4},
            )
            response.raise_for_status()
            timings = response.json()["data"]["timings"]
    except (httpx.HTTPError, KeyError, TypeError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Prayer times are unavailable right now.") from error
    return {"city": cleaned_city, "Fajr": timings["Fajr"], "Dhuhr": timings["Dhuhr"], "Asr": timings["Asr"], "Maghrib": timings["Maghrib"], "Isha": timings["Isha"]}


initialize_database()
