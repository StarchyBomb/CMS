# 🎨 TorYod CMS - Standalone App

แอพ CMS แยกต่างหากที่ทำงานได้เองโดยไม่ต้องพึ่งเว็บไซต์

## ✨ คุณสมบัติ

- ✅ **Standalone App** - ทำงานได้เองโดยไม่ต้องพึ่งเว็บไซต์
- ✅ **Desktop App** - ติดตั้งเป็น Desktop Application ได้
- ✅ **PWA Support** - ติดตั้งเป็น Progressive Web App ได้
- ✅ **Offline Support** - ทำงานได้แม้ไม่มีอินเทอร์เน็ต
- ✅ **Cross Platform** - รองรับ Windows, Mac, Linux

## 🚀 วิธีใช้งาน

### วิธีที่ 1: ใช้เป็น PWA (Progressive Web App)

1. **เปิดแอพใน Browser**
   ```bash
   # ใช้ local server
   npx http-server -p 8080 -o cms-app.html
   ```

2. **ติดตั้งเป็น PWA**
   - Chrome/Edge: คลิกไอคอน "ติดตั้ง" ใน address bar
   - Firefox: ไปที่ Menu → Install
   - Safari: Share → Add to Home Screen

3. **เปิดแอพ**
   - เปิดจาก Desktop shortcut
   - หรือจาก Applications folder

### วิธีที่ 2: ใช้เป็น Desktop App (Electron)

#### ติดตั้ง Dependencies

```bash
npm install
```

#### รันแอพ

```bash
npm start
```

#### Build สำหรับ Production

```bash
# Build สำหรับทุก platform
npm run build

# Build เฉพาะ Windows
npm run build:win

# Build เฉพาะ Mac
npm run build:mac

# Build เฉพาะ Linux
npm run build:linux
```

## 📦 ไฟล์ที่เกี่ยวข้อง

### Core Files
- `cms-app.html` - Main app wrapper
- `cms-admin.html` - Admin panel (included)
- `cms-admin.js` - Admin logic
- `cms-admin.css` - Admin styles

### App Files
- `manifest.json` - PWA manifest
- `sw.js` - Service Worker
- `main.js` - Electron main process
- `preload.js` - Electron preload script
- `package-electron.json` - Electron package config

## 🔧 Configuration

### PWA Configuration

แก้ไข `manifest.json`:
```json
{
  "name": "TorYod CMS",
  "start_url": "/cms-app.html",
  "display": "standalone"
}
```

### Electron Configuration

แก้ไข `package-electron.json`:
```json
{
  "build": {
    "appId": "com.toryod.cms",
    "productName": "TorYod CMS"
  }
}
```

## 📱 การติดตั้ง

### PWA Installation

1. เปิด `cms-app.html` ใน browser
2. Browser จะแสดงปุ่ม "ติดตั้ง" (ถ้ารองรับ)
3. คลิกติดตั้ง
4. แอพจะถูกเพิ่มใน Applications

### Electron Installation

#### Windows
- ดาวน์โหลด `.exe` installer
- รัน installer
- ติดตั้งตามขั้นตอน

#### Mac
- ดาวน์โหลด `.dmg` file
- เปิดและลากแอพไปยัง Applications
- เปิดแอพจาก Applications

#### Linux
- ดาวน์โหลด `.AppImage`
- ให้สิทธิ์ execute: `chmod +x app.AppImage`
- รัน: `./app.AppImage`

## 🎯 วิธีใช้งานแอพ

1. **เปิดแอพ** - จาก Desktop หรือ Applications
2. **จัดการ Content** - ใช้ Admin Panel เหมือนเดิม
3. **Export/Import** - ส่งออกและนำเข้าข้อมูล
4. **ทำงาน Offline** - ไม่ต้องมีอินเทอร์เน็ต

## 🔄 อัพเดท

### PWA
- อัพเดทอัตโนมัติเมื่อ Service Worker ตรวจพบการเปลี่ยนแปลง
- หรือ refresh หน้าเว็บ

### Electron
- ดาวน์โหลดเวอร์ชันใหม่
- ติดตั้งทับเวอร์ชันเก่า

## 🛠️ Development

### Local Development

```bash
# PWA
npx http-server -p 8080 -o cms-app.html

# Electron
npm install
npm start
```

### Build

```bash
# Install electron-builder
npm install -g electron-builder

# Build
npm run build
```

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - เอกสารหลัก
- [APP_README.md](./APP_README.md) - Installer App
- [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md) - CMS Documentation

---

**Version**: 1.0.0  
**Last Updated**: 2024
