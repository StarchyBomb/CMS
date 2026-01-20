#!/bin/bash

# TorYod Universal CMS - Git Installation Script
# วิธีใช้: bash <(curl -s https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.sh)

set -e

echo "🎨 TorYod Universal CMS - Git Installation"
echo "=========================================="
echo ""

# สีสำหรับ output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ตรวจสอบว่า git ติดตั้งแล้วหรือยัง
if ! command -v git &> /dev/null; then
    echo "❌ Git ไม่ได้ติดตั้ง กรุณาติดตั้ง Git ก่อน"
    exit 1
fi

# ถาม path ที่ต้องการติดตั้ง
read -p "📁 ระบุ path ที่ต้องการติดตั้ง CMS (default: ./cms): " INSTALL_PATH
INSTALL_PATH=${INSTALL_PATH:-./cms}

# ถามว่าจะ clone หรือใช้ local
read -p "🔗 ต้องการ clone จาก GitHub หรือใช้ไฟล์ local? (github/local) [github]: " INSTALL_METHOD
INSTALL_METHOD=${INSTALL_METHOD:-github}

if [ "$INSTALL_METHOD" = "github" ]; then
    echo ""
    echo "${BLUE}📥 กำลัง clone repository...${NC}"
    
    # Clone repository
    if [ -d "$INSTALL_PATH" ]; then
        echo "${YELLOW}⚠️  Directory $INSTALL_PATH มีอยู่แล้ว${NC}"
        read -p "ต้องการลบและ clone ใหม่หรือไม่? (y/n) [n]: " OVERWRITE
        if [ "$OVERWRITE" = "y" ] || [ "$OVERWRITE" = "Y" ]; then
            rm -rf "$INSTALL_PATH"
        else
            echo "❌ ยกเลิกการติดตั้ง"
            exit 1
        fi
    fi
    
    git clone https://github.com/StarchyBomb/CMS.git "$INSTALL_PATH"
    cd "$INSTALL_PATH"
    
    echo "${GREEN}✅ Clone สำเร็จ!${NC}"
else
    echo ""
    echo "${BLUE}📁 ใช้ไฟล์ local...${NC}"
    
    if [ ! -d "$INSTALL_PATH" ]; then
        mkdir -p "$INSTALL_PATH"
    fi
    
    # Copy ไฟล์ที่จำเป็น
    cp -r cms-widget.js cms-admin.html cms-admin.js cms-admin.css install.js setup.html "$INSTALL_PATH/" 2>/dev/null || {
        echo "❌ ไม่พบไฟล์ CMS ใน directory ปัจจุบัน"
        echo "กรุณารัน script นี้จาก directory ที่มีไฟล์ CMS"
        exit 1
    }
    
    cd "$INSTALL_PATH"
    echo "${GREEN}✅ Copy ไฟล์สำเร็จ!${NC}"
fi

echo ""
echo "${GREEN}✅ ติดตั้งสำเร็จ!${NC}"
echo ""
echo "📋 ขั้นตอนต่อไป:"
echo "   1. เปิดไฟล์: $INSTALL_PATH/setup.html"
echo "   2. ทำตามขั้นตอนใน Setup Wizard"
echo "   3. หรือเพิ่มโค้ดนี้ในเว็บไซต์:"
echo ""
echo "   <script src=\"$INSTALL_PATH/cms-widget.js\"></script>"
echo "   <script>"
echo "     TorYodCMS.init({"
echo "       adminUrl: '$(pwd)/cms-admin.html',"
echo "       storageKey: 'toryod-cms-config'"
echo "     });"
echo "   </script>"
echo ""
echo "🎉 พร้อมใช้งานแล้ว!"
