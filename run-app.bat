@echo off
echo ========================================
echo TorYod CMS - Starting App
echo ========================================
echo.

REM ตรวจสอบว่า Node.js ติดตั้งแล้วหรือไม่
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js ไม่ได้ติดตั้ง
    echo กรุณาติดตั้ง Node.js จาก https://nodejs.org
    echo.
    echo หรือเปิดไฟล์ cms-app.html โดยตรงใน browser
    pause
    exit /b 1
)

REM ตรวจสอบว่า http-server ติดตั้งแล้วหรือไม่
where http-server >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] กำลังติดตั้ง http-server...
    npm install -g http-server
)

echo [INFO] กำลังเริ่มแอพ...
echo [INFO] เปิด browser อัตโนmัติ...
echo.
echo แอพจะเปิดที่: http://localhost:8080/cms-app.html
echo.
echo กด Ctrl+C เพื่อหยุดแอพ
echo.

start http://localhost:8080/cms-app.html
http-server -p 8080 -o cms-app.html

pause
