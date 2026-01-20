@echo off
echo ========================================
echo TorYod CMS - Building .exe
echo ========================================
echo.

REM ตรวจสอบว่า Node.js ติดตั้งแล้วหรือไม่
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js ไม่ได้ติดตั้ง
    echo กรุณาติดตั้ง Node.js จาก https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] กำลังติดตั้ง dependencies...
call npm install

echo.
echo [INFO] กำลัง build .exe...
call npm run build:win

echo.
echo [SUCCESS] Build เสร็จสิ้น!
echo ไฟล์ .exe อยู่ในโฟลเดอร์ dist/
echo.
pause
