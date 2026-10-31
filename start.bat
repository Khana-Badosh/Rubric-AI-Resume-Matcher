@echo off
cd /d "%~dp0"

echo Make sure MySQL is running in the XAMPP Control Panel.
echo Wait for "Application startup complete" in the Python window before analyzing.

rem Use the project venv when it works. Otherwise fall back to the Python on PATH.
set "PYRUN=python"
pushd python
if exist venv\Scripts\python.exe (
    venv\Scripts\python.exe -c "import fastapi" >nul 2>&1
    if not errorlevel 1 set "PYRUN=venv\Scripts\python.exe"
)
popd
if "%PYRUN%"=="python" echo No working venv found, using the Python on PATH. Run setup.bat if the Python service fails to start.

start "Python service - 5001" cmd /k "cd /d python && %PYRUN% -m uvicorn app:app --port 5001"
start "Server - 5000" cmd /k "cd /d server && npm run dev"
start "Client - 5173" cmd /k "cd /d client && npm run dev"

timeout /t 8 >nul
start http://localhost:5173
