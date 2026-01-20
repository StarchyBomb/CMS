#!/bin/bash

echo "========================================"
echo "TorYod CMS - Starting App"
echo "========================================"
echo ""

# ตรวจสอบว่า Node.js ติดตั้งแล้วหรือไม่
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js ไม่ได้ติดตั้ง"
    echo "กรุณาติดตั้ง Node.js จาก https://nodejs.org"
    echo ""
    echo "หรือเปิดไฟล์ cms-app.html โดยตรงใน browser"
    exit 1
fi

# ตรวจสอบว่า http-server ติดตั้งแล้วหรือไม่
if ! command -v http-server &> /dev/null; then
    echo "[INFO] กำลังติดตั้ง http-server..."
    npm install -g http-server
fi

echo "[INFO] กำลังเริ่มแอพ..."
echo "[INFO] เปิด browser อัตโนมัติ..."
echo ""
echo "แอพจะเปิดที่: http://localhost:8080/cms-app.html"
echo ""
echo "กด Ctrl+C เพื่อหยุดแอพ"
echo ""

# เปิด browser (รอ 2 วินาที)
sleep 2 && open http://localhost:8080/cms-app.html 2>/dev/null || \
         xdg-open http://localhost:8080/cms-app.html 2>/dev/null || \
         start http://localhost:8080/cms-app.html 2>/dev/null &

# เริ่ม server
http-server -p 8080 -o cms-app.html
