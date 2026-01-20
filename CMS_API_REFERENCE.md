# TorYod CMS API Reference

## Overview

เอกสารนี้อธิบาย API และ Functions ทั้งหมดในระบบ TorYod CMS สำหรับนักพัฒนาที่ต้องการขยายหรือปรับแต่งระบบ

---

## Global Objects

### `window.adminData`
Object หลักที่เก็บข้อมูลทั้งหมดของ CMS

**Type**: `Object`  
**Structure**: ดูที่ [Data Structure](#data-structure)  
**Access**: `window.adminData` หรือ `adminData` (ใน admin.js scope)

**Example**:
```javascript
// Read
const heroTitle = adminData['hero.title.en'];

// Write
adminData['hero.title.en'] = 'New Title';
```

---

### `window.translations`
Object ที่เก็บ translations ทั้งหมด (EN และ TH)

**Type**: `Object`  
**Structure**:
```javascript
{
    en: {
        'hero.title': '...',
        'hero.subtitle': '...',
        // ...
    },
    th: {
        'hero.title': '...',
        'hero.subtitle': '...',
        // ...
    }
}
```

---

## Core Functions

### `loadAdminData()`

โหลดข้อมูลจาก localStorage หรือใช้ค่า default

**Signature**:
```javascript
function loadAdminData()
```

**Returns**: `void`

**Behavior**:
1. ตรวจสอบ localStorage สำหรับ key `toryod-admin-data`
2. ถ้ามี: Parse JSON และ populate form
3. ถ้าไม่มี: เรียก `loadDefaultData()`

**Example**:
```javascript
loadAdminData();
// Form fields จะถูกเติมข้อมูลอัตโนมัติ
```

---

### `saveData(showMessage)`

บันทึกข้อมูลทั้งหมดจาก form ไปยัง localStorage

**Signature**:
```javascript
function saveData(showMessage = true)
```

**Parameters**:
- `showMessage` (boolean, optional): แสดง success message หรือไม่ (default: `true`)

**Returns**: `void`

**Behavior**:
1. เก็บข้อมูลจากทุก `[data-key]` elements
2. อัปเดต `adminData` object
3. บันทึกไปยัง localStorage
4. เรียก `updateMainSiteTranslations()`
5. แสดง success message (ถ้า `showMessage === true`)

**Example**:
```javascript
// Save with message
saveData(true);

// Silent save
saveData(false);
```

**Side Effects**:
- อัปเดต `localStorage['toryod-admin-data']`
- อัปเดต `window.translations`
- อัปเดต `localStorage['toryod-translations']`

---

### `populateForm()`

เติมข้อมูลจาก `adminData` ลงใน form fields

**Signature**:
```javascript
function populateForm()
```

**Returns**: `void`

**Behavior**:
1. Loop through ทุก `[data-key]` elements
2. อ่านค่าจาก `adminData[key]`
3. Set value ลงใน element
4. เรียก `updateImagePreviews()`

**Example**:
```javascript
// After loading data
loadAdminData(); // This calls populateForm() internally

// Or manually
populateForm();
```

---

### `updateMainSiteTranslations()`

อัปเดต translation objects ใน main website

**Signature**:
```javascript
function updateMainSiteTranslations()
```

**Returns**: `void`

**Behavior**:
1. Loop through `adminData` keys
2. ถ้า key ลงท้ายด้วย `.en`: อัปเดต `window.translations.en`
3. ถ้า key ลงท้ายด้วย `.th`: อัปเดต `window.translations.th`
4. บันทึก translations ไปยัง localStorage

**Example**:
```javascript
// After saving data
saveData();
// This automatically calls updateMainSiteTranslations()
```

---

## Image Management

### `setupImageUploads()`

ตั้งค่า event listeners สำหรับ image upload

**Signature**:
```javascript
function setupImageUploads()
```

**Returns**: `void`

**Behavior**:
1. หา file inputs ทั้งหมด (`input[type="file"]`)
2. เพิ่ม `change` event listener
3. เมื่อเลือกไฟล์: อ่านเป็น Data URL
4. อัปเดต input field และ preview

**Example**:
```javascript
// Called during initialization
setupImageUploads();
```

---

### `updateImagePreviews()`

อัปเดต image previews จากข้อมูลที่บันทึกไว้

**Signature**:
```javascript
function updateImagePreviews()
```

**Returns**: `void`

**Behavior**:
1. หา image input fields (`[data-key$=".image"]`)
2. อ่านค่า image URL จาก `adminData`
3. แสดง preview ใน preview box

**Example**:
```javascript
// After loading data
updateImagePreviews();
```

---

## Export/Import

### `exportData()`

ส่งออกข้อมูลเป็น JSON file

**Signature**:
```javascript
function exportData()
```

**Returns**: `void`

**Behavior**:
1. Convert `adminData` เป็น JSON string (formatted)
2. สร้าง Blob object
3. สร้าง download link
4. Trigger download
5. Clean up URL object

**Example**:
```javascript
// User clicks export button
exportData();
// Downloads: toryod-cms-data-2024-01-01.json
```

**File Format**:
```json
{
  "hero.title.en": "...",
  "hero.title.th": "...",
  ...
}
```

---

### `importData(file)`

นำเข้าข้อมูลจาก JSON file

**Signature**:
```javascript
function importData(file: File)
```

**Parameters**:
- `file` (File): JSON file object จาก file input

**Returns**: `void`

**Behavior**:
1. อ่านไฟล์เป็น text
2. Parse JSON
3. Merge กับ `adminData` ปัจจุบัน
4. Populate form
5. Save data

**Example**:
```javascript
const fileInput = document.getElementById('import-file');
fileInput.addEventListener('change', (e) => {
    importData(e.target.files[0]);
});
```

**Error Handling**:
- ถ้า JSON ไม่ valid: แสดง error message
- ถ้า parse สำเร็จ: แสดง success message

---

## Theme Management

### `applyTheme(data)`

ใช้ธีมที่กำหนดใน main website

**Signature**:
```javascript
function applyTheme(data: Object)
```

**Parameters**:
- `data`: Admin data object ที่มี design properties

**Returns**: `void`

**Behavior**:
1. อ่านสีจาก `data['design.primaryColor']` etc.
2. ใช้ค่า default ถ้าไม่มี
3. อัปเดต CSS custom properties:
   - `--light-orange`
   - `--orange-peach`
   - `--orange-dark`
   - `--text-dark`

**Example**:
```javascript
applyTheme(adminData);
// Website colors update immediately
```

**CSS Variables Updated**:
```css
:root {
    --light-orange: #FFB88C;
    --orange-peach: #FFD4B3;
    --orange-dark: #FF8C5A;
    --text-dark: #1A1A1A;
}
```

---

## Navigation

### `showSection(sectionId)`

แสดง section ที่เลือกใน admin panel

**Signature**:
```javascript
function showSection(sectionId: string)
```

**Parameters**:
- `sectionId`: ID ของ section (เช่น `'hero'`, `'story'`)

**Returns**: `void`

**Behavior**:
1. อัปเดต active nav item
2. ซ่อน sections ทั้งหมด
3. แสดง section ที่เลือก
4. อัปเดต header title

**Example**:
```javascript
showSection('hero');
// Shows hero section, hides others
```

---

## Utility Functions

### `showSaveStatus(type, message)`

แสดงสถานะการบันทึก

**Signature**:
```javascript
function showSaveStatus(type: string, message: string)
```

**Parameters**:
- `type`: `'success'` หรือ `'error'`
- `message`: ข้อความที่แสดง

**Returns**: `void`

**Example**:
```javascript
showSaveStatus('success', '✅ บันทึกสำเร็จ!');
showSaveStatus('error', '❌ บันทึกล้มเหลว');
```

---

### `showSuccessMessage(message)`

แสดง success message (legacy function)

**Signature**:
```javascript
function showSuccessMessage(message: string)
```

**Parameters**:
- `message`: ข้อความที่แสดง

**Returns**: `void`

**Example**:
```javascript
showSuccessMessage('Operation completed successfully!');
```

---

## Main Website Integration

### CMS Data Loader (ใน index.html)

Script ที่โหลดข้อมูลจาก CMS และ apply ไปยัง website

**Location**: `index.html` (bottom script)

**Functions**:

#### `loadCMSData()`
โหลดและ apply CMS data

**Behavior**:
1. อ่าน `localStorage['toryod-admin-data']`
2. อัปเดต `window.translations`
3. อัปเดต stats (`totalRaised`, `goalAmount`, etc.)
4. อัปเดต images
5. Apply theme
6. อัปเดต meta tags
7. เรียก `setLanguage()` และ `updateProgress()`

#### `updateImage(imgId, placeholderId, imageUrl)`
อัปเดตรูปภาพ

**Parameters**:
- `imgId`: ID ของ img element
- `placeholderId`: ID ของ placeholder element
- `imageUrl`: URL ของรูปภาพ

#### `applyTheme(data)`
ใช้ธีม (duplicate ของ admin.js version)

---

## Event System

### Auto-Save Events

ทุก `[data-key]` element มี auto-save listener:

```javascript
element.addEventListener('input', () => {
    adminData[key] = element.value;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveData(false);
    }, 1000);
});
```

### Image Upload Events

File inputs มี change listener:

```javascript
input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        // Update adminData and preview
    };
    reader.readAsDataURL(file);
});
```

---

## Data Structure Reference

### Key Patterns

1. **Text Fields (Multi-language)**:
   - `{section}.{field}.en` - English
   - `{section}.{field}.th` - Thai

2. **Single Value Fields**:
   - `{section}.{field}` - ไม่ต้องแปล

3. **Nested Objects**:
   - `{category}.{item}.{property}` - เช่น `product.tshirt.price`

### Complete Key List

#### Hero Section
- `hero.title.en`
- `hero.title.th`
- `hero.subtitle.en`
- `hero.subtitle.th`
- `hero.image`

#### Story Section
- `story.title.en/th`
- `story.problem.title.en/th`
- `story.problem.text.en/th`
- `story.progress.title.en/th`

#### Roadmap Section
- `roadmap.title.en/th`
- `roadmap.phase1.title.en/th`
- `roadmap.phase1.desc.en/th`
- `roadmap.phase2.title.en/th`
- `roadmap.phase2.desc.en/th`
- `roadmap.phase3.title.en/th`
- `roadmap.phase3.desc.en/th`

#### Store Section
- `store.title.en/th`
- `product.tshirt.name.en/th`
- `product.tshirt.price`
- `product.tshirt.image`
- `product.seed.name.en/th`
- `product.seed.price`
- `product.seed.image`
- `product.foundation.name.en/th`
- `product.foundation.price`
- `product.foundation.image`
- `product.custom.name.en/th`
- `product.custom.price`
- `product.custom.image`

#### Trust Section
- `trust.title.en/th`

#### Statistics
- `stats.totalRaised` (number)
- `stats.goalAmount` (number)
- `stats.supportersCount` (number)

#### Design
- `design.primaryColor` (hex color)
- `design.secondaryColor` (hex color)
- `design.darkColor` (hex color)
- `design.textColor` (hex color)

#### Settings
- `settings.siteTitle` (string)
- `settings.metaDescription` (string)
- `settings.footerText` (string)

---

## Error Handling

### Common Errors

1. **QuotaExceededError**
   - สาเหตุ: LocalStorage เต็ม
   - แก้ไข: ลดขนาดข้อมูล หรือใช้ IndexedDB

2. **JSON Parse Error**
   - สาเหตุ: ข้อมูลใน localStorage เสียหาย
   - แก้ไข: ใช้ `safeJSONParse()` หรือ reset data

3. **Missing Element**
   - สาเหตุ: DOM element ไม่มี
   - แก้ไข: ตรวจสอบ element ก่อนใช้งาน

### Error Handling Pattern

```javascript
try {
    const data = JSON.parse(localStorage.getItem('key'));
} catch (e) {
    console.error('Parse error:', e);
    // Fallback to default
    loadDefaultData();
}
```

---

## Performance Considerations

### Optimization Tips

1. **Debounce Auto-Save**
   - ใช้ timeout เพื่อลดการเขียน localStorage

2. **Batch DOM Updates**
   - ใช้ DocumentFragment สำหรับหลาย updates

3. **Lazy Load Images**
   - โหลดรูปภาพเมื่อจำเป็นเท่านั้น

4. **Cache Translations**
   - เก็บ translations ใน memory

---

## Security Notes

### Current Limitations

1. **No Authentication**: ใครก็เข้าถึง admin panel ได้
2. **Client-Side Only**: ข้อมูลอยู่ที่ browser
3. **XSS Risk**: ต้อง sanitize user input

### Recommendations

1. เพิ่ม authentication
2. Validate และ sanitize ทุก input
3. ใช้ HTTPS ใน production
4. Implement CSRF protection

---

## Migration Guide

### จาก LocalStorage ไป Backend

```javascript
// Step 1: Create API client
class CMSAPIClient {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }
    
    async save(data) {
        const response = await fetch(`${this.baseURL}/api/cms/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
    
    async load() {
        const response = await fetch(`${this.baseURL}/api/cms/load`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return response.json();
    }
}

// Step 2: Update saveData function
async function saveData(showMessage = true) {
    // Save to localStorage (backup)
    localStorage.setItem('toryod-admin-data', JSON.stringify(adminData));
    
    // Save to backend
    try {
        const api = new CMSAPIClient('https://api.example.com', getAuthToken());
        await api.save(adminData);
        if (showMessage) {
            showSaveStatus('success', '✅ บันทึกสำเร็จ!');
        }
    } catch (error) {
        showSaveStatus('error', '❌ บันทึกล้มเหลว แต่เก็บไว้ในเครื่องแล้ว');
    }
}
```

---

## Testing

### Unit Test Examples

```javascript
// Test loadAdminData
describe('loadAdminData', () => {
    it('should load data from localStorage', () => {
        localStorage.setItem('toryod-admin-data', JSON.stringify({
            'hero.title.en': 'Test Title'
        }));
        loadAdminData();
        expect(adminData['hero.title.en']).toBe('Test Title');
    });
    
    it('should use defaults if no data exists', () => {
        localStorage.removeItem('toryod-admin-data');
        loadAdminData();
        expect(adminData).toBeDefined();
    });
});

// Test saveData
describe('saveData', () => {
    it('should save to localStorage', () => {
        adminData['hero.title.en'] = 'New Title';
        saveData(false);
        const saved = JSON.parse(localStorage.getItem('toryod-admin-data'));
        expect(saved['hero.title.en']).toBe('New Title');
    });
});
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic CRUD operations
- Image upload support
- Export/Import functionality
- Theme management
- Auto-save mechanism

---

**Last Updated**: 2024  
**Maintainer**: TorYod Development Team
