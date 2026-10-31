@echo off
setlocal
cd /d "%~dp0"

echo.
echo ===== AI Resume Analyzer - one-time setup =====

echo.
echo [1/4] Python service
cd python
rem A venv that was moved or half installed cannot run the service, so it is rebuilt
if exist venv\Scripts\python.exe (
    venv\Scripts\python.exe -c "import fastapi" >nul 2>&1
    if errorlevel 1 (
        echo     The existing venv is incomplete or points to an old folder. Recreating it.
        rmdir /s /q venv
    )
)
if not exist venv (
    for %%V in (3.12 3.13 3.14 3.11 3.10) do (
        if not exist venv py -%%V -m venv venv >nul 2>&1
    )
)
if not exist venv\Scripts\python.exe (
    echo [!] No Python 3.10 to 3.14 found. Run:  py install 3.12   then run setup.bat again.
    exit /b 1
)
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
pip install -r requirements.txt
if errorlevel 1 goto :failed
python -m spacy download en_core_web_sm
if errorlevel 1 goto :failed
cd ..

echo.
echo [2/4] Server
cd server
call npm install
if errorlevel 1 goto :failed
if not exist .env (
    copy .env.example .env >nul
    echo     Created server\.env - open it and set JWT_SECRET and GEMINI_API_KEY.
)
cd ..

echo.
echo [3/4] Client
cd client
call npm install
if errorlevel 1 goto :failed
cd ..

echo.
echo [4/4] Database
call database\import-db.bat

echo.
echo ===== Setup finished =====
echo   1. Open server\.env and set JWT_SECRET and GEMINI_API_KEY
echo   2. Start MySQL in the XAMPP Control Panel
echo   3. Double-click start.bat
goto :eof

:failed
echo.
echo [!] Setup stopped because a step failed. Read the error above.
exit /b 1
