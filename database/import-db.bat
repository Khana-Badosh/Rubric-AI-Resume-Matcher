@echo off
setlocal
set "MYSQL=C:\xampp\mysql\bin\mysql.exe"
set "SCHEMA=%~dp0schema.sql"

if not exist "%MYSQL%" (
    echo [!] XAMPP MySQL client not found at %MYSQL%
    echo     Import database\schema.sql through phpMyAdmin instead - see the README.
    exit /b 1
)

"%MYSQL%" -u root -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [!] Could not connect to MySQL.
    echo     Start MySQL in the XAMPP Control Panel and run database\import-db.bat again.
    echo     If you set a MySQL root password, import through phpMyAdmin instead.
    exit /b 1
)

"%MYSQL%" -u root < "%SCHEMA%"
if errorlevel 1 (
    echo [!] Import failed.
    exit /b 1
)

echo Database ai_resume_analyzer is ready.
