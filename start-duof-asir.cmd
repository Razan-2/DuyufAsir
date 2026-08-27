@echo off
cd /d "%~dp0"
"%USERPROFILE%\.local\bin\uv.exe" run python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
