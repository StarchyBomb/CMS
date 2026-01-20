# 🔥 ติดตั้งผ่าน Git

## วิธีติดตั้งผ่าน Git (ง่ายและเร็ว!)

### วิธีที่ 1: ใช้ Installation Script (แนะนำ)

#### สำหรับ Linux/Mac:
```bash
bash <(curl -s https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.sh)
```

#### สำหรับ Windows (PowerShell):
```powershell
iwr -useb https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.ps1 | iex
```

#### สำหรับ Windows (CMD):
```cmd
powershell -Command "iwr -useb https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.ps1 | iex"
```

---

### วิธีที่ 2: Clone โดยตรง

```bash
# Clone repository
git clone https://github.com/StarchyBomb/CMS.git

# เข้าไปใน directory
cd CMS

# เปิด Setup Wizard
# เปิดไฟล์ setup.html ใน browser
```

---

### วิธีที่ 3: ใช้ npm (ถ้ามี package)

```bash
# ติดตั้งผ่าน npm
npm install toryod-universal-cms

# หรือใช้ npx
npx toryod-universal-cms
```

---

### วิธีที่ 4: Download ZIP

1. ไปที่ https://github.com/StarchyBomb/CMS
2. คลิก "Code" → "Download ZIP"
3. Extract ไฟล์
4. เปิด `setup.html` ใน browser

---

## 📋 หลังติดตั้ง

### ขั้นตอนที่ 1: เปิด Setup Wizard

```bash
# เปิดไฟล์ setup.html
open setup.html        # Mac
xdg-open setup.html    # Linux
start setup.html       # Windows
```

### ขั้นตอนที่ 2: ทำตาม Setup Wizard

1. กรอกข้อมูล (URL, Path)
2. คัดลอกโค้ด
3. วางโค้ดในเว็บไซต์

### ขั้นตอนที่ 3: เริ่มใช้งาน

เปิด Admin Panel และเริ่มแก้ไขเว็บไซต์!

---

## 🔧 Manual Installation

ถ้าต้องการติดตั้งด้วยตนเอง:

### 1. Clone Repository

```bash
git clone https://github.com/StarchyBomb/CMS.git cms
cd cms
```

### 2. Copy ไฟล์ที่จำเป็น

```bash
# Copy ไฟล์ไปยังเว็บไซต์
cp cms-widget.js /path/to/website/
cp cms-admin.html /path/to/website/
cp cms-admin.js /path/to/website/
cp cms-admin.css /path/to/website/
```

### 3. เพิ่ม Script ในเว็บไซต์

```html
<script src="/path/to/cms-widget.js"></script>
<script>
  TorYodCMS.init({
    adminUrl: '/path/to/cms-admin.html',
    storageKey: 'toryod-cms-config'
  });
</script>
```

---

## 🎯 ตัวอย่างการใช้งาน

### ติดตั้งใน Local Development

```bash
# Clone
git clone https://github.com/StarchyBomb/CMS.git
cd CMS

# เปิด local server
python -m http.server 8000
# หรือ
npx serve

# เปิด browser
# http://localhost:8000/setup.html
```

### ติดตั้งใน Production

```bash
# Clone ไปยัง production server
git clone https://github.com/StarchyBomb/CMS.git /var/www/cms

# หรือใช้ deployment script
./deploy.sh
```

---

## 🔄 Update

### อัปเดตผ่าน Update Script (แนะนำ)

#### Linux/Mac:
```bash
bash update.sh
```

#### Windows (PowerShell):
```powershell
.\update.ps1
```

### อัปเดตผ่าน Git Command

```bash
cd CMS
git pull origin main
```

### อัปเดตแบบปลอดภัย (เก็บการเปลี่ยนแปลง)

```bash
cd CMS
git stash              # เก็บการเปลี่ยนแปลง
git pull origin main   # ดึงอัปเดต
git stash pop          # คืนค่าการเปลี่ยนแปลง
```

**ดูรายละเอียดที่ [UPDATE.md](./UPDATE.md)**

### อัปเดตผ่าน npm

```bash
npm update toryod-universal-cms
```

---

## ❓ Troubleshooting

### ปัญหา: Git ไม่ได้ติดตั้ง

**แก้ไข:**
- Linux: `sudo apt-get install git` (Ubuntu/Debian)
- Mac: `brew install git` หรือดาวน์โหลดจาก https://git-scm.com
- Windows: ดาวน์โหลดจาก https://git-scm.com/download/win

### ปัญหา: Script ไม่ทำงาน

**แก้ไข:**
- ตรวจสอบว่า Git ติดตั้งแล้ว
- ตรวจสอบ internet connection
- ลอง clone โดยตรง: `git clone https://github.com/StarchyBomb/CMS.git`

### ปัญหา: Permission Denied

**แก้ไข:**
```bash
# Linux/Mac
chmod +x install.sh
./install.sh
```

---

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - เอกสารหลัก
- [INSTALLATION.md](./INSTALLATION.md) - คู่มือติดตั้งฉบับเต็ม
- [AUTO_INSTALL.md](./AUTO_INSTALL.md) - ติดตั้งแบบอัตโนมัติ
- [QUICK_START.md](./QUICK_START.md) - เริ่มต้นใช้งาน

---

**Version**: 1.0.0  
**Last Updated**: 2024
