# 🎨 TorYod Universal CMS

ระบบจัดการเนื้อหาสากลที่ติดตั้งได้ในเว็บไซต์ใดก็ได้ - แก้ไข CSS และ HTML โดยไม่ต้องแก้โค้ด!

## ✨ คุณสมบัติหลัก

- 🎯 **แก้ไข CSS แบบ Real-time** - เปลี่ยน styles ของ elements ใดก็ได้
- 📝 **แก้ไข Content** - เปลี่ยนข้อความและ HTML โดยไม่ต้องแก้โค้ด
- 🎨 **Custom CSS Editor** - เขียน CSS แบบกำหนดเอง
- 🔧 **Style Manager** - จัดการ styles แบบละเอียด
- 📥 **Export/Import** - ส่งออกและนำเข้าการตั้งค่า
- 🚀 **ติดตั้งง่าย** - เพียงแค่เพิ่ม script tag เดียว
- 💾 **LocalStorage** - เก็บข้อมูลใน browser (หรือเชื่อมต่อ backend ได้)

## 🚀 Quick Start

### 🔥 วิธีติดตั้งผ่าน Git (แนะนำ!)

#### สำหรับ Linux/Mac:
```bash
bash <(curl -s https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.sh)
```

#### สำหรับ Windows (PowerShell):
```powershell
iwr -useb https://raw.githubusercontent.com/StarchyBomb/CMS/main/install.ps1 | iex
```

#### หรือ Clone โดยตรง:
```bash
git clone https://github.com/StarchyBomb/CMS.git
cd CMS
```

#### สำหรับ Node.js:
```bash
npm install toryod-universal-cms
# หรือ
npx toryod-universal-cms
```

---

### ⚡ วิธีติดตั้งแบบง่ายที่สุด (กดไม่กี่ปุ่ม!)

1. **เปิดไฟล์ `setup.html`** - Setup Wizard จะช่วยคุณติดตั้ง
2. **กรอกข้อมูล** - 3 ขั้นตอนง่ายๆ
3. **คัดลอกโค้ด** - วางในเว็บไซต์
4. **เสร็จ!** 🎉

ดูรายละเอียดที่ [AUTO_INSTALL.md](./AUTO_INSTALL.md)

---

### วิธีติดตั้งแบบ Manual

### 1. ดาวน์โหลดไฟล์

```
cms-widget.js      # Widget script สำหรับ inject เข้าเว็บไซต์
cms-admin.html     # Admin Panel
cms-admin.js       # Admin Panel Logic
cms-admin.css      # Admin Panel Styles
```

### 2. ติดตั้งในเว็บไซต์

เพิ่มโค้ดนี้ก่อน `</body>`:

```html
<script src="cms-widget.js"></script>
<script>
  TorYodCMS.init({
    adminUrl: 'https://your-domain.com/cms-admin.html',
    storageKey: 'toryod-cms-config'
  });
</script>
```

### 3. เปิด Admin Panel

ไปที่ `cms-admin.html` หรือคลิกปุ่ม "CMS Admin" ที่มุมล่างขวาของเว็บไซต์

## 📖 เอกสาร

- [📦 คู่มือการติดตั้ง](./INSTALLATION.md) - วิธีติดตั้งและใช้งาน
- [🔧 API Reference](./CMS_API_REFERENCE.md) - เอกสาร API
- [🏗️ Architecture](./CMS_ARCHITECTURE.md) - สถาปัตยกรรมระบบ
- [📚 Documentation](./CMS_DOCUMENTATION.md) - เอกสารฉบับเต็ม

## 🎯 ตัวอย่างการใช้งาน

### แก้ไข CSS

```javascript
// ใน Admin Panel → CSS Editor → Style Overrides
Selector: .header
Property: background-color
Value: #FF8C5A
```

### แก้ไข Content

```javascript
// ใน Admin Panel → Content Editor
Selector: h1.title
Type: Text
Content: ข้อความใหม่
```

### Custom CSS

```css
/* ใน Admin Panel → CSS Editor → Custom CSS */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🔧 API Methods

```javascript
// ตั้งค่า Style
TorYodCMS.setStyle('.header', 'background-color', 'red');

// ตั้งค่า Content
TorYodCMS.setContent('.title', 'New Title', 'text');

// ตั้งค่า Custom CSS
TorYodCMS.setCustomCSS('body { background: red; }');

// Export Config
const config = TorYodCMS.exportConfig();

// Import Config
TorYodCMS.importConfig(jsonString);

// Reset
TorYodCMS.reset();
```

## 🔄 การอัพเดท

### อัพเดทผ่าน Update Script:
```bash
# Linux/Mac
bash update.sh

# Windows
.\update.ps1
```

### อัพเดทผ่าน Git:
```bash
git pull origin main
```

**ดูรายละเอียดที่ [UPDATE.md](./UPDATE.md)**

---

## 🎨 Standalone App

### แอพ CMS แยกต่างหาก

แอพ CMS ที่ทำงานได้เองโดยไม่ต้องพึ่งเว็บไซต์:

#### PWA (Progressive Web App)
- ✅ ติดตั้งเป็น Desktop App ได้
- ✅ ทำงาน Offline ได้
- ✅ เปิดไฟล์ `cms-app.html` ใน browser

#### Desktop App (Electron)
- ✅ ติดตั้งเป็น Desktop Application
- ✅ รองรับ Windows, Mac, Linux
- ✅ ใช้คำสั่ง `npm start`

**ดูรายละเอียดที่ [APP_STANDALONE.md](./APP_STANDALONE.md)**

---

## 📦 Installer App

### แอพติดตั้งสำหรับ Local

เปิดไฟล์ `app.html` เพื่อใช้แอพติดตั้ง CMS ที่:
- ✅ อัปโหลดไฟล์ CMS ได้
- ✅ ติดตั้งอัตโนมัติ
- ✅ ทำงานได้เฉพาะ Local เท่านั้น

**ดูรายละเอียดที่ [APP_README.md](./APP_README.md)**

---

## 📁 โครงสร้างไฟล์

```
CMS/
├── cms-widget.js          # Widget script (สำหรับ inject)
├── cms-admin.html         # Admin Panel UI
├── cms-admin.js          # Admin Panel Logic
├── cms-admin.css         # Admin Panel Styles
├── example.html          # ตัวอย่างเว็บไซต์
├── INSTALLATION.md       # คู่มือการติดตั้ง
├── README.md             # เอกสารนี้
├── CMS_API_REFERENCE.md  # API Reference
├── CMS_ARCHITECTURE.md   # Architecture
└── CMS_DOCUMENTATION.md  # Documentation
```

## 🎨 หน้าจอ Admin Panel

- **Visual Editor** - เลือกและแก้ไข elements แบบ visual
- **CSS Editor** - แก้ไข CSS และ Custom CSS
- **Content Editor** - จัดการการเปลี่ยนแปลงเนื้อหา
- **Style Manager** - จัดการ styles แบบละเอียด
- **Settings** - การตั้งค่าระบบ

## 🔒 Security

- ⚠️ **ปัจจุบัน**: ข้อมูลเก็บใน LocalStorage (client-side only)
- ✅ **แนะนำ**: เพิ่ม backend API สำหรับ production
- ✅ **แนะนำ**: เพิ่ม authentication system

## 🛠️ Development

### Local Development

1. เปิด `example.html` ใน browser
2. เปิด `cms-admin.html` ใน browser อีก tab
3. เริ่มแก้ไข!

### Testing

```bash
# ใช้ local server (แนะนำ)
python -m http.server 8000
# หรือ
npx serve
```

## 📝 Roadmap

- [ ] Visual Element Picker (คลิกเลือก element บนเว็บ)
- [ ] Real-time Preview
- [ ] Backend API Integration
- [ ] User Authentication
- [ ] Multi-language Support
- [ ] Version Control
- [ ] Cloud Storage Integration

## 🤝 Contributing

ยินดีรับ contributions! กรุณา:

1. Fork repository
2. สร้าง feature branch
3. Commit changes
4. Push และสร้าง Pull Request

## 📄 License

MIT License - ใช้ได้ฟรีทั้ง commercial และ personal projects

## 🙏 Credits

พัฒนาโดย TorYod Development Team

---

**Version**: 1.0.0  
**Last Updated**: 2024
