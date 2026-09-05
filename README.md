# Duof Asir Tourism Platform

The existing FastAPI website plus a structured SQLite tourism database using SQLAlchemy 2.x, Alembic, and Pydantic v2.

## Setup

```powershell
uv sync
Copy-Item .env.example .env
```

The `.env` file is ignored by Git. Add a Gemini key only when using Gemini:

```text
GEMINI_API_KEY=your_real_key
```

Set a long random `JWT_SECRET_KEY` in `.env`. Never commit real secrets.

## Database migrations

```powershell
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "describe change"
```

The app safely upgrades the legacy users table on startup.

## Existing AI provider

Open `main.py` and change one line:

```python
AI_PROVIDER = "ollama"
```

Use `"ollama"` for local Gemma 3 or `"gemini"` for the Gemini API.

For Ollama, install the model and start Ollama:

```powershell
ollama pull gemma3
ollama serve
```

## Run

```powershell
uv run uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`.

## API routes

Tourism resources are under `/api`: users, destinations, accommodations, restaurants, events, trips and stops, favorites, reviews, and preferences. The four public catalog lists support `page` and `page_size`.

Passwords use Argon2 and are never returned. JWT helpers are prepared in `app/core/security.py` for a later login phase.

## Tests

```powershell
uv run pytest
```

Tests use a separate `test_app.db`.

- `GET /agents`
- `POST /chat`
- `GET /conversations`
- `POST /register-user`
- `GET /users`
- `GET /prayer-times/{city}`
- `POST /payments/checkout`
- `GET /health`

SQLite data is stored in `app.db`. Prayer times are requested from AlAdhan and are not stored.

## Payments

Copy the payment variables from `.env.example` into `.env` after receiving production credentials from Tabby, Tamara, and an Apple Pay payment service provider. Never add merchant secrets to frontend files. A public HTTPS domain is required for live return URLs and Apple Pay domain verification.
