# TorYod CMS: Content Management System Documentation

## สารบัญ

1. [บทนำ](#บทนำ)
2. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
3. [โครงสร้างข้อมูล](#โครงสร้างข้อมูล)
4. [API และ Functions](#api-และ-functions)
5. [การทำงานของระบบ](#การทำงานของระบบ)
6. [การขยายระบบ](#การขยายระบบ)
7. [Best Practices](#best-practices)
8. [ข้อจำกัดและแนวทางแก้ไข](#ข้อจำกัดและแนวทางแก้ไข)
9. [แนวทางการพัฒนาต่อ](#แนวทางการพัฒนาต่อ)
10. [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)

---

## บทนำ

### 1.1 วัตถุประสงค์

TorYod CMS (Content Management System) เป็นระบบจัดการเนื้อหาสำหรับเว็บไซต์ TorYod ที่ออกแบบมาเพื่อให้ผู้ใช้ที่ไม่มีความรู้ด้านการเขียนโค้ดสามารถแก้ไขเนื้อหา รูปภาพ และการตั้งค่าต่างๆ ของเว็บไซต์ได้ผ่านทาง User Interface ที่ใช้งานง่าย

### 1.2 ขอบเขตของระบบ

ระบบ CMS ครอบคลุมการจัดการ:
- **เนื้อหาข้อความ**: ข้อความภาษาไทยและอังกฤษทุกส่วนของเว็บไซต์
- **รูปภาพ**: Hero images, Product images
- **สถิติ**: จำนวนเงินที่ระดมได้, เป้าหมาย, จำนวนผู้สนับสนุน
- **ธีมและสี**: Primary color, Secondary color, Dark color, Text color
- **การตั้งค่า**: Site title, Meta description, Footer text

### 1.3 เทคโนโลยีที่ใช้

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage
- **Architecture**: Client-side only (no backend required)
- **Build Tool**: Vite 5.0

---

## สถาปัตยกรรมระบบ

### 2.1 โครงสร้างไฟล์

```
TorYodMarket/
├── admin.html          # Admin Panel Interface
├── admin.css           # Admin Panel Styling
├── admin.js            # Admin Panel Logic & CMS Engine
├── index.html          # Main Website (Consumer-facing)
├── styles.css          # Main Website Styling
├── script.js           # Main Website Logic
├── translations.js     # Translation System
└── vite.config.js     # Build Configuration
```

### 2.2 สถาปัตยกรรมแบบ Client-Side CMS

```
┌─────────────────────────────────────────────────┐
│           Admin Panel (admin.html)              │
│  ┌──────────────────────────────────────────┐  │
│  │  User Input → Form Fields                │  │
│  └──────────────┬────────────────────────────┘  │
│                 │                                 │
│  ┌─────────────▼────────────────────────────┐  │
│  │  admin.js - CMS Engine                    │  │
│  │  - Data Collection                        │  │
│  │  - Validation                             │  │
│  │  - Storage Management                     │  │
│  └──────────────┬────────────────────────────┘  │
│                 │                                 │
└─────────────────┼─────────────────────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  LocalStorage   │
         │  (Browser)      │
         └────────┬────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        Main Website (index.html)                │
│  ┌──────────────────────────────────────────┐  │
│  │  CMS Data Loader                         │  │
│  │  - Read from LocalStorage                 │  │
│  │  - Apply to Translations                  │  │
│  │  - Update DOM Elements                    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 2.3 Data Flow

```
User Input (Admin Panel)
    ↓
Form Validation
    ↓
Data Structure Creation
    ↓
LocalStorage Persistence
    ↓
Translation System Update
    ↓
DOM Update (Main Website)
    ↓
Visual Changes Applied
```

---

## โครงสร้างข้อมูล

### 3.1 Admin Data Structure

ข้อมูลทั้งหมดถูกเก็บในรูปแบบ JSON object ใน `localStorage` ด้วย key `toryod-admin-data`:

```javascript
{
    // Hero Section
    "hero.title.en": "Founder's Content is Storytelling Pitch Portal",
    "hero.title.th": "เนื้อหาผู้ก่อตั้งคือพอร์ทัลการเล่าเรื่อง",
    "hero.subtitle.en": "Connecting Thai creators...",
    "hero.subtitle.th": "เชื่อมต่อครีเอเตอร์ไทย...",
    "hero.image": "data:image/png;base64,..." or "https://...",
    
    // Story Section
    "story.title.en": "Founder's Story",
    "story.title.th": "เรื่องราวผู้ก่อตั้ง",
    "story.problem.title.en": "Honest Problem",
    "story.problem.title.th": "ปัญหาที่ตรงไปตรงมา",
    "story.problem.text.en": "...",
    "story.problem.text.th": "...",
    "story.progress.title.en": "Project Progress",
    "story.progress.title.th": "ความคืบหน้าโครงการ",
    
    // Roadmap Section
    "roadmap.title.en": "Roadmap",
    "roadmap.title.th": "แผนงาน",
    "roadmap.phase1.title.en": "Phase 1: The Survival Stage",
    "roadmap.phase1.title.th": "ระยะที่ 1: ขั้นตอนการอยู่รอด",
    "roadmap.phase1.desc.en": "...",
    "roadmap.phase1.desc.th": "...",
    // ... phase2, phase3
    
    // Store Section
    "store.title.en": "Founder's Store",
    "store.title.th": "ร้านค้าผู้ก่อตั้ง",
    "product.tshirt.name.en": "Founder's Edition T-Shirt",
    "product.tshirt.name.th": "เสื้อยืดรุ่นผู้ก่อตั้ง",
    "product.tshirt.price": "1,500 THB",
    "product.tshirt.image": "...",
    // ... other products
    
    // Trust Section
    "trust.title.en": "Trust & Transparency",
    "trust.title.th": "ความไว้วางใจและความโปร่งใส",
    
    // Statistics
    "stats.totalRaised": 2000,
    "stats.goalAmount": 300000,
    "stats.supportersCount": 0,
    
    // Design Theme
    "design.primaryColor": "#FFB88C",
    "design.secondaryColor": "#FFD4B3",
    "design.darkColor": "#FF8C5A",
    "design.textColor": "#1A1A1A",
    
    // Settings
    "settings.siteTitle": "TorYod - Changing Thailand's SME Landscape",
    "settings.metaDescription": "...",
    "settings.footerText": "© 2024 TorYod..."
}
```

### 3.2 Key Naming Convention

รูปแบบการตั้งชื่อ key:
- `{section}.{field}.{language}` สำหรับข้อความหลายภาษา
- `{section}.{field}` สำหรับค่าที่ไม่ต้องแปล
- `{category}.{item}.{property}` สำหรับ nested objects

ตัวอย่าง:
- `hero.title.en` → Hero section, Title field, English
- `product.tshirt.price` → Product category, T-shirt item, Price property
- `stats.totalRaised` → Statistics category, Total raised value

### 3.3 Image Storage Format

รูปภาพสามารถเก็บได้ 2 รูปแบบ:

1. **Data URL (Base64)**: สำหรับรูปภาพที่อัปโหลดจากเครื่อง
   ```
   "hero.image": "data:image/png;base64,iVBORw0KGgoAAAANS..."
   ```

2. **URL String**: สำหรับรูปภาพจาก external source
   ```
   "hero.image": "https://example.com/image.jpg"
   ```

---

## API และ Functions

### 4.1 Core CMS Functions

#### `loadAdminData()`
โหลดข้อมูลจาก localStorage หรือใช้ค่า default

```javascript
function loadAdminData() {
    const saved = localStorage.getItem('toryod-admin-data');
    if (saved) {
        adminData = JSON.parse(saved);
        populateForm();
    } else {
        loadDefaultData();
    }
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: อัปเดต `adminData` object และ populate form fields

---

#### `saveData(showMessage = true)`
บันทึกข้อมูลทั้งหมดจาก form ไปยัง localStorage

```javascript
function saveData(showMessage = true) {
    // Collect all form data
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (element.type === 'number') {
            adminData[key] = parseInt(element.value) || 0;
        } else {
            adminData[key] = element.value;
        }
    });
    
    localStorage.setItem('toryod-admin-data', JSON.stringify(adminData));
    updateMainSiteTranslations();
    
    if (showMessage) {
        showSaveStatus('success', '✅ บันทึกสำเร็จ!');
    }
}
```

**Parameters**:
- `showMessage` (boolean): แสดงข้อความสำเร็จหรือไม่

**Returns**: `void`  
**Side Effects**: 
- อัปเดต localStorage
- อัปเดต translations ใน main site
- แสดง success message

---

#### `populateForm()`
เติมข้อมูลจาก `adminData` ลงใน form fields

```javascript
function populateForm() {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (adminData[key] !== undefined) {
            if (element.type === 'number') {
                element.value = adminData[key];
            } else {
                element.value = adminData[key];
            }
        }
    });
    updateImagePreviews();
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: อัปเดต form fields และ image previews

---

#### `updateMainSiteTranslations()`
อัปเดต translation objects ใน main website

```javascript
function updateMainSiteTranslations() {
    localStorage.setItem('toryod-admin-data', JSON.stringify(adminData));
    
    if (window.translations) {
        Object.keys(adminData).forEach(key => {
            if (key.endsWith('.en') && window.translations.en) {
                const translationKey = key.replace('.en', '');
                window.translations.en[translationKey] = adminData[key];
            }
            // ... similar for .th
        });
    }
    
    localStorage.setItem('toryod-translations', JSON.stringify(window.translations));
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: อัปเดต `window.translations` และ localStorage

---

### 4.2 Image Management Functions

#### `setupImageUploads()`
ตั้งค่า event listeners สำหรับ image upload

```javascript
function setupImageUploads() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    // Update input field and preview
                };
                reader.readAsDataURL(file);
            }
        });
    });
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: เพิ่ม event listeners สำหรับ file inputs

---

#### `updateImagePreviews()`
อัปเดต image previews จากข้อมูลที่บันทึกไว้

```javascript
function updateImagePreviews() {
    document.querySelectorAll('[data-key$=".image"]').forEach(input => {
        const key = input.getAttribute('data-key');
        const imageUrl = adminData[key];
        if (imageUrl && input.type === 'text') {
            const previewId = input.id + '-preview';
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
                preview.classList.add('show');
            }
        }
    });
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: แสดง image previews

---

### 4.3 Export/Import Functions

#### `exportData()`
ส่งออกข้อมูลเป็น JSON file

```javascript
function exportData() {
    const dataStr = JSON.stringify(adminData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toryod-cms-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
```

**Parameters**: ไม่มี  
**Returns**: `void`  
**Side Effects**: ดาวน์โหลด JSON file

---

#### `importData(file)`
นำเข้าข้อมูลจาก JSON file

```javascript
function importData(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            adminData = { ...adminData, ...imported };
            populateForm();
            saveData();
        } catch (error) {
            showSaveStatus('error', '❌ Import ล้มเหลว: ไฟล์ไม่ถูกต้อง');
        }
    };
    reader.readAsText(file);
}
```

**Parameters**:
- `file` (File): JSON file object

**Returns**: `void`  
**Side Effects**: 
- อัปเดต `adminData`
- Populate form
- บันทึกข้อมูล

---

### 4.4 Theme Management Functions

#### `applyTheme(data)`
ใช้ธีมที่กำหนดใน main website

```javascript
function applyTheme(data) {
    const theme = {
        primaryColor: data['design.primaryColor'] || '#FFB88C',
        secondaryColor: data['design.secondaryColor'] || '#FFD4B3',
        darkColor: data['design.darkColor'] || '#FF8C5A',
        textColor: data['design.textColor'] || '#1A1A1A'
    };
    
    document.documentElement.style.setProperty('--light-orange', theme.primaryColor);
    document.documentElement.style.setProperty('--orange-peach', theme.secondaryColor);
    document.documentElement.style.setProperty('--orange-dark', theme.darkColor);
    document.documentElement.style.setProperty('--text-dark', theme.textColor);
}
```

**Parameters**:
- `data` (Object): Admin data object

**Returns**: `void`  
**Side Effects**: อัปเดต CSS custom properties

---

## การทำงานของระบบ

### 5.1 Initialization Flow

```
1. User opens admin.html
   ↓
2. admin.js loads
   ↓
3. loadAdminData() called
   ↓
4. Check localStorage for 'toryod-admin-data'
   ↓
5a. If exists: Parse JSON → populateForm()
5b. If not: loadDefaultData() → populateForm()
   ↓
6. setupImageUploads()
   ↓
7. setupAutoSave()
   ↓
8. setupExportImport()
   ↓
9. Admin Panel ready
```

### 5.2 Save Flow

```
1. User edits content in form
   ↓
2. Auto-save triggers (after 1 second delay)
   ↓
3. Collect all [data-key] elements
   ↓
4. Build adminData object
   ↓
5. Save to localStorage ('toryod-admin-data')
   ↓
6. Update window.translations
   ↓
7. Save translations to localStorage ('toryod-translations')
   ↓
8. Show success message
```

### 5.3 Main Website Load Flow

```
1. User opens index.html
   ↓
2. translations.js loads → window.translations created
   ↓
3. script.js loads → Initialize variables
   ↓
4. CMS Integration script runs
   ↓
5. Check localStorage for 'toryod-admin-data'
   ↓
6a. If exists: Parse → Update translations → Apply to DOM
6b. If not: Use default translations
   ↓
7. Apply theme (if exists)
   ↓
8. Update images (if exists)
   ↓
9. Update stats (if exists)
   ↓
10. Call setLanguage() → Update all [data-i18n] elements
   ↓
11. Website ready with CMS data
```

### 5.4 Auto-Save Mechanism

ระบบใช้ **debouncing** เพื่อลดจำนวนการบันทึก:

```javascript
let autoSaveTimer = null;

element.addEventListener('input', () => {
    // Update adminData immediately
    adminData[key] = element.value;
    
    // Clear previous timer
    clearTimeout(autoSaveTimer);
    
    // Set new timer (1 second delay)
    autoSaveTimer = setTimeout(() => {
        saveData(false); // Silent save
    }, 1000);
});
```

**Advantages**:
- ลดการเขียน localStorage
- Performance ดีขึ้น
- User experience ดีขึ้น (ไม่รบกวนการพิมพ์)

---

## การขยายระบบ

### 6.1 เพิ่ม Section ใหม่

#### ขั้นตอนที่ 1: เพิ่ม Form ใน admin.html

```html
<section id="new-section" class="content-section">
    <div class="section-header">
        <h3>🆕 New Section</h3>
        <p>แก้ไขเนื้อหาใหม่</p>
    </div>
    
    <div class="form-grid">
        <div class="form-group">
            <label>หัวข้อ (English)</label>
            <input type="text" id="new-title-en" data-key="new.title.en">
        </div>
        <div class="form-group">
            <label>หัวข้อ (ไทย)</label>
            <input type="text" id="new-title-th" data-key="new.title.th">
        </div>
    </div>
</section>
```

#### ขั้นตอนที่ 2: เพิ่ม Navigation Item

```html
<a href="#new-section" class="nav-item" data-section="new-section">
    <span class="nav-icon">🆕</span>
    <span class="nav-text">New Section</span>
</a>
```

#### ขั้นตอนที่ 3: เพิ่ม Default Data ใน admin.js

```javascript
function loadDefaultData() {
    adminData = {
        // ... existing data
        'new.title.en': 'New Section Title',
        'new.title.th': 'หัวข้อส่วนใหม่',
    };
}
```

#### ขั้นตอนที่ 4: เพิ่มใน Main Website

```html
<section id="new-section">
    <h2 data-i18n="new.title">New Section Title</h2>
</section>
```

#### ขั้นตอนที่ 5: เพิ่ม Translations

```javascript
// translations.js
window.translations = {
    en: {
        'new.title': 'New Section Title',
    },
    th: {
        'new.title': 'หัวข้อส่วนใหม่',
    }
};
```

---

### 6.2 เพิ่ม Field Type ใหม่

#### ตัวอย่าง: Rich Text Editor

```javascript
// ใน admin.js
function setupRichTextEditor() {
    document.querySelectorAll('[data-type="richtext"]').forEach(element => {
        // Initialize rich text editor (e.g., TinyMCE, Quill)
        const editor = new RichTextEditor(element.id);
        editor.onChange((content) => {
            const key = element.getAttribute('data-key');
            adminData[key] = content;
        });
    });
}
```

#### ตัวอย่าง: Color Picker

```javascript
// ใน admin.js
function setupColorPickers() {
    document.querySelectorAll('[data-type="color"]').forEach(element => {
        const colorPicker = new ColorPicker(element);
        colorPicker.onChange((color) => {
            const key = element.getAttribute('data-key');
            adminData[key] = color;
        });
    });
}
```

---

### 6.3 เพิ่ม Validation Rules

```javascript
// ใน admin.js
const validationRules = {
    'hero.title.en': {
        required: true,
        minLength: 10,
        maxLength: 100,
        pattern: /^[A-Za-z0-9\s]+$/
    },
    'stats.totalRaised': {
        required: true,
        type: 'number',
        min: 0,
        max: 10000000
    }
};

function validateField(key, value) {
    const rule = validationRules[key];
    if (!rule) return { valid: true };
    
    if (rule.required && !value) {
        return { valid: false, error: 'Field is required' };
    }
    
    if (rule.minLength && value.length < rule.minLength) {
        return { valid: false, error: `Minimum length is ${rule.minLength}` };
    }
    
    // ... more validations
    
    return { valid: true };
}
```

---

### 6.4 เพิ่ม Backend Integration

#### ตัวอย่าง: API Integration

```javascript
// ใน admin.js
async function saveToBackend() {
    try {
        const response = await fetch('/api/cms/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(adminData)
        });
        
        if (!response.ok) {
            throw new Error('Save failed');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Backend save failed:', error);
        // Fallback to localStorage
        saveData();
    }
}
```

---

## Best Practices

### 7.1 Data Management

1. **Always validate before saving**
   ```javascript
   function saveData() {
       // Validate all fields
       const errors = validateAllFields();
       if (errors.length > 0) {
           showErrors(errors);
           return;
       }
       
       // Save if valid
       localStorage.setItem('toryod-admin-data', JSON.stringify(adminData));
   }
   ```

2. **Use debouncing for auto-save**
   - ลดการเขียน localStorage
   - ปรับปรุง performance

3. **Backup before major changes**
   ```javascript
   function createBackup() {
       const backup = JSON.stringify(adminData);
       localStorage.setItem('toryod-admin-data-backup', backup);
   }
   ```

### 7.2 Error Handling

1. **Always wrap localStorage in try-catch**
   ```javascript
   try {
       localStorage.setItem('key', value);
   } catch (e) {
       if (e.name === 'QuotaExceededError') {
           // Handle storage full
       }
   }
   ```

2. **Validate JSON before parsing**
   ```javascript
   function safeJSONParse(str) {
       try {
           return JSON.parse(str);
       } catch (e) {
           console.error('Invalid JSON:', e);
           return null;
       }
   }
   ```

### 7.3 Performance Optimization

1. **Lazy load images**
   ```javascript
   function lazyLoadImage(imgElement, imageUrl) {
       if ('IntersectionObserver' in window) {
           const observer = new IntersectionObserver((entries) => {
               entries.forEach(entry => {
                   if (entry.isIntersecting) {
                       entry.target.src = imageUrl;
                       observer.unobserve(entry.target);
                   }
               });
           });
           observer.observe(imgElement);
       } else {
           imgElement.src = imageUrl;
       }
   }
   ```

2. **Batch DOM updates**
   ```javascript
   function batchUpdateDOM(updates) {
       // Use DocumentFragment for batch updates
       const fragment = document.createDocumentFragment();
       updates.forEach(update => {
           fragment.appendChild(update.element);
       });
       document.body.appendChild(fragment);
   }
   ```

### 7.4 Security Considerations

1. **Sanitize user input**
   ```javascript
   function sanitizeInput(input) {
       const div = document.createElement('div');
       div.textContent = input;
       return div.innerHTML;
   }
   ```

2. **Validate image URLs**
   ```javascript
   function isValidImageUrl(url) {
       if (url.startsWith('data:image/')) return true;
       if (url.startsWith('https://') || url.startsWith('http://')) {
           return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
       }
       return false;
   }
   ```

---

## ข้อจำกัดและแนวทางแก้ไข

### 8.1 ข้อจำกัดปัจจุบัน

#### 8.1.1 LocalStorage Size Limit
- **ปัญหา**: LocalStorage มีขนาดจำกัด (~5-10MB)
- **ผลกระทบ**: รูปภาพขนาดใหญ่ (Base64) อาจทำให้เต็ม
- **แนวทางแก้ไข**:
  - ใช้ external image hosting (Cloudinary, Imgur)
  - Compress images ก่อนอัปโหลด
  - ใช้ IndexedDB สำหรับไฟล์ขนาดใหญ่

#### 8.1.2 Client-Side Only
- **ปัญหา**: ข้อมูลอยู่ที่ browser เท่านั้น
- **ผลกระทบ**: ไม่สามารถ sync ระหว่าง devices ได้
- **แนวทางแก้ไข**:
  - เพิ่ม backend API สำหรับ sync
  - ใช้ Firebase/ Supabase สำหรับ real-time sync

#### 8.1.3 No User Authentication
- **ปัญหา**: ใครก็สามารถเข้าถึง admin panel ได้
- **ผลกระทบ**: ความปลอดภัยต่ำ
- **แนวทางแก้ไข**:
  - เพิ่ม authentication system
  - ใช้ JWT tokens
  - Role-based access control

### 8.2 แนวทางแก้ไขที่แนะนำ

#### Solution 1: Backend Integration

```javascript
// Backend API Structure
POST /api/cms/save
Headers: { Authorization: Bearer <token> }
Body: { adminData: {...} }
Response: { success: true, id: "..." }

GET /api/cms/load
Headers: { Authorization: Bearer <token> }
Response: { adminData: {...} }

POST /api/cms/upload-image
Headers: { Authorization: Bearer <token> }
Body: FormData (file)
Response: { url: "https://cdn.example.com/image.jpg" }
```

#### Solution 2: Cloud Storage Integration

```javascript
// Example: Cloudinary Integration
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'toryod_cms');
    
    const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return data.secure_url; // Return CDN URL
}
```

#### Solution 3: Real-time Sync

```javascript
// Example: Firebase Realtime Database
import { getDatabase, ref, set, onValue } from 'firebase/database';

const db = getDatabase();

// Save to Firebase
function saveToFirebase(adminData) {
    set(ref(db, 'cms/data'), adminData);
}

// Listen for changes
onValue(ref(db, 'cms/data'), (snapshot) => {
    const data = snapshot.val();
    adminData = data;
    populateForm();
});
```

---

## แนวทางการพัฒนาต่อ

### 9.1 Phase 1: Enhanced Features (Short-term)

1. **Rich Text Editor**
   - Integrate TinyMCE or Quill.js
   - Support for formatting, links, lists
   - Image embedding

2. **Media Library**
   - Image gallery management
   - Bulk upload
   - Image cropping and editing

3. **Version Control**
   - Save history of changes
   - Rollback to previous versions
   - Compare versions

4. **Preview Mode**
   - Real-time preview pane
   - Mobile preview
   - Desktop preview

### 9.2 Phase 2: Backend Integration (Medium-term)

1. **RESTful API**
   - Node.js/Express backend
   - MongoDB/PostgreSQL database
   - JWT authentication

2. **User Management**
   - Multiple admin users
   - Role-based permissions
   - Activity logs

3. **Cloud Storage**
   - Image CDN integration
   - File management system
   - Automatic optimization

### 9.3 Phase 3: Advanced Features (Long-term)

1. **Multi-language Support**
   - Support for more languages
   - Translation management
   - Language-specific content

2. **Content Scheduling**
   - Schedule content updates
   - Auto-publish dates
   - Content calendar

3. **Analytics Integration**
   - Track content performance
   - A/B testing
   - User behavior analytics

4. **API for Developers**
   - Public API for content
   - Webhooks for events
   - SDK for integrations

---

## ตัวอย่างการใช้งาน

### 10.1 Basic Usage

```javascript
// 1. Load CMS data
loadAdminData();

// 2. Edit content programmatically
adminData['hero.title.en'] = 'New Title';
adminData['hero.title.th'] = 'หัวข้อใหม่';

// 3. Save changes
saveData();

// 4. Apply to main site
updateMainSiteTranslations();
```

### 10.2 Custom Field Integration

```javascript
// Add custom field handler
function setupCustomField(fieldId, dataKey, validator) {
    const field = document.getElementById(fieldId);
    
    field.addEventListener('input', () => {
        const value = field.value;
        
        // Validate
        if (validator && !validator(value)) {
            field.classList.add('error');
            return;
        }
        
        // Save
        adminData[dataKey] = value;
        saveData(false); // Silent save
    });
}

// Usage
setupCustomField('custom-field', 'custom.value', (val) => val.length > 0);
```

### 10.3 Bulk Operations

```javascript
// Update multiple fields at once
function bulkUpdate(updates) {
    Object.keys(updates).forEach(key => {
        adminData[key] = updates[key];
        const element = document.querySelector(`[data-key="${key}"]`);
        if (element) {
            element.value = updates[key];
        }
    });
    saveData();
}

// Usage
bulkUpdate({
    'hero.title.en': 'New Title',
    'hero.subtitle.en': 'New Subtitle',
    'stats.totalRaised': 5000
});
```

### 10.4 Event Hooks

```javascript
// Add custom hooks
const cmsHooks = {
    beforeSave: [],
    afterSave: [],
    beforeLoad: [],
    afterLoad: []
};

function addHook(hookName, callback) {
    if (cmsHooks[hookName]) {
        cmsHooks[hookName].push(callback);
    }
}

// Usage
addHook('beforeSave', () => {
    console.log('About to save...');
});

addHook('afterSave', () => {
    console.log('Saved successfully!');
});
```

---

## สรุป

TorYod CMS เป็นระบบจัดการเนื้อหาที่ออกแบบมาเพื่อให้ผู้ใช้ที่ไม่มีความรู้ด้านการเขียนโค้ดสามารถจัดการเนื้อหาของเว็บไซต์ได้อย่างง่ายดาย ระบบใช้เทคโนโลยี client-side เป็นหลัก โดยเก็บข้อมูลใน browser localStorage และสามารถขยายไปยัง backend ได้ในอนาคต

### จุดเด่น:
- ✅ ไม่ต้องเขียนโค้ด
- ✅ Real-time updates
- ✅ Export/Import ข้อมูล
- ✅ Theme customization
- ✅ Multi-language support

### จุดที่ควรพัฒนา:
- ⚠️ Backend integration สำหรับ production
- ⚠️ User authentication
- ⚠️ Cloud storage สำหรับรูปภาพ
- ⚠️ Version control
- ⚠️ Rich text editor

---

## References

- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Vite Documentation](https://vitejs.dev/)
- [Stripe.js Documentation](https://stripe.com/docs/js)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: TorYod Development Team
