# Duof Asir - Multi AI Agents Platform

A single FastAPI service that serves the existing Duof Asir website and provides SQLite-backed users, conversation history, AI chat, and prayer times.

## Setup

```powershell
uv sync
```

The `.env` file is ignored by Git. Add a Gemini key only when using Gemini:

```text
GEMINI_API_KEY=your_real_key
```

## AI provider

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
