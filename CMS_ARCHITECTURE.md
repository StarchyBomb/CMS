# TorYod CMS Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [State Management](#state-management)
5. [Event System](#event-system)
6. [Storage Architecture](#storage-architecture)
7. [Integration Points](#integration-points)
8. [Scalability Considerations](#scalability-considerations)

---

## System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TorYod CMS System                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Admin Panel        │      │   Main Website       │    │
│  │   (admin.html)       │      │   (index.html)       │    │
│  │                      │      │                      │    │
│  │  ┌────────────────┐ │      │  ┌────────────────┐ │    │
│  │  │  UI Layer      │ │      │  │  UI Layer      │ │    │
│  │  │  - Forms       │ │      │  │  - Display     │ │    │
│  │  │  - Navigation  │ │      │  │  - Content     │ │    │
│  │  └──────┬─────────┘ │      │  └──────┬─────────┘ │    │
│  │         │            │      │         │            │    │
│  │  ┌──────▼─────────┐ │      │  ┌──────▼─────────┐ │    │
│  │  │  Logic Layer   │ │      │  │  Logic Layer   │ │    │
│  │  │  admin.js      │ │      │  │  script.js     │ │    │
│  │  │  - CMS Engine  │ │      │  │  - App Logic   │ │    │
│  │  │  - Validation   │ │      │  │  - Payments     │ │    │
│  │  └──────┬─────────┘ │      │  └──────┬─────────┘ │    │
│  └─────────┼────────────┘      └─────────┼────────────┘    │
│            │                              │                  │
│            └──────────┬───────────────────┘                │
│                       │                                     │
│            ┌──────────▼──────────┐                        │
│            │   Storage Layer      │                        │
│            │   LocalStorage       │                        │
│            │   - admin-data       │                        │
│            │   - translations     │                        │
│            └──────────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Presentation | HTML5, CSS3 | UI Structure & Styling |
| Logic | JavaScript (ES6+) | Business Logic |
| Storage | LocalStorage API | Data Persistence |
| Build | Vite 5.0 | Development Server |
| External | Stripe.js (optional) | Payment Processing |

---

## Component Architecture

### 2.1 Admin Panel Components

```
admin.html
├── Sidebar Navigation
│   ├── Navigation Items
│   └── Export/Import Buttons
│
├── Main Content Area
│   ├── Hero Section Editor
│   ├── Story Section Editor
│   ├── Roadmap Section Editor
│   ├── Store Section Editor
│   ├── Trust Section Editor
│   ├── Statistics Editor
│   ├── Design & Theme Editor
│   └── Settings Editor
│
└── Header
    ├── Section Title
    └── Action Buttons (Save, Preview)
```

### 2.2 Main Website Components

```
index.html
├── Navigation Bar
│   ├── Brand Logo
│   ├── Navigation Links
│   └── Language Toggle
│
├── Hero Section
│   ├── Hero Image
│   └── Hero Text (Title + Subtitle)
│
├── Main Content
│   ├── Story Column (Left)
│   └── Roadmap Column (Right)
│
├── Store Section
│   └── Product Cards Grid
│
├── Trust Section
│   └── Trust Cards Grid
│
└── Footer
```

### 2.3 JavaScript Modules

```
admin.js (CMS Engine)
├── Data Management
│   ├── loadAdminData()
│   ├── saveData()
│   └── populateForm()
│
├── Image Management
│   ├── setupImageUploads()
│   └── updateImagePreviews()
│
├── Export/Import
│   ├── exportData()
│   └── importData()
│
├── Theme Management
│   └── applyTheme()
│
└── Navigation
    └── showSection()

script.js (Main Website)
├── Payment System
│   ├── initializeStripe()
│   ├── handleStripePayment()
│   └── handleQRPayment()
│
├── Progress Tracking
│   └── updateProgress()
│
└── Event Handlers
    └── setupEventListeners()

translations.js (Translation System)
├── Translation Data
│   └── window.translations
│
├── Language Management
│   ├── setLanguage()
│   └── initLanguage()
│
└── Dynamic Content
    └── updateDynamicContent()
```

---

## Data Flow Diagrams

### 3.1 Save Flow

```
User Input
    │
    ▼
Form Field [data-key="hero.title.en"]
    │
    ▼
Auto-Save Timer (1s debounce)
    │
    ▼
adminData['hero.title.en'] = value
    │
    ▼
saveData()
    │
    ├─► Collect all [data-key] elements
    │
    ├─► Build adminData object
    │
    ├─► localStorage.setItem('toryod-admin-data', JSON)
    │
    ├─► updateMainSiteTranslations()
    │   │
    │   ├─► Update window.translations.en
    │   │
    │   └─► localStorage.setItem('toryod-translations', JSON)
    │
    └─► showSaveStatus('success')
```

### 3.2 Load Flow (Main Website)

```
Page Load (index.html)
    │
    ├─► Load translations.js
    │   └─► window.translations created
    │
    ├─► Load script.js
    │   └─► Initialize variables
    │
    └─► CMS Integration Script
        │
        ├─► Check localStorage['toryod-admin-data']
        │
        ├─► If exists:
        │   │
        │   ├─► Parse JSON
        │   │
        │   ├─► Update window.translations
        │   │   ├─► .en translations
        │   │   └─► .th translations
        │   │
        │   ├─► Update Stats
        │   │   ├─► totalRaised
        │   │   ├─► goalAmount
        │   │   └─► supportersCount
        │   │
        │   ├─► Update Images
        │   │   ├─► Hero image
        │   │   └─► Product images
        │   │
        │   ├─► Apply Theme
        │   │   └─► CSS Variables
        │   │
        │   └─► Update Meta Tags
        │
        └─► Call setLanguage()
            │
            └─► Update all [data-i18n] elements
```

### 3.3 Image Upload Flow

```
User selects image file
    │
    ▼
File Input Change Event
    │
    ▼
FileReader.readAsDataURL(file)
    │
    ├─► Convert to Base64
    │
    ├─► Update adminData[key] = dataURL
    │
    ├─► Update input[type="text"] value
    │
    └─► Update Preview
        │
        └─► <img src="dataURL"> in preview box
```

---

## State Management

### 4.1 State Structure

```javascript
// Global State
window.adminData = {
    // Content data
    'hero.title.en': string,
    'hero.title.th': string,
    // ... more fields
    
    // Statistics
    'stats.totalRaised': number,
    'stats.goalAmount': number,
    'stats.supportersCount': number,
    
    // Design
    'design.primaryColor': string (hex),
    // ...
};

// Translation State
window.translations = {
    en: { [key: string]: string },
    th: { [key: string]: string }
};

// Current Language
window.currentLanguage = 'en' | 'th';

// UI State
currentSection = 'hero' | 'story' | 'roadmap' | ...;
stripeLoaded = boolean;
cardElement = StripeElement | null;
```

### 4.2 State Updates

#### Unidirectional Data Flow

```
User Action
    │
    ▼
Event Handler
    │
    ▼
Update adminData
    │
    ▼
Save to LocalStorage
    │
    ▼
Update Translations
    │
    ▼
Update DOM (Main Website)
```

#### State Synchronization

```javascript
// Admin Panel → LocalStorage → Main Website

// Step 1: Admin Panel updates adminData
adminData['hero.title.en'] = 'New Title';

// Step 2: Save to localStorage
localStorage.setItem('toryod-admin-data', JSON.stringify(adminData));

// Step 3: Main Website reads from localStorage
const data = JSON.parse(localStorage.getItem('toryod-admin-data'));

// Step 4: Update translations
window.translations.en['hero.title'] = data['hero.title.en'];

// Step 5: Apply to DOM
document.querySelector('[data-i18n="hero.title"]').textContent = 
    window.translations.en['hero.title'];
```

---

## Event System

### 5.1 Event Types

#### 1. Input Events (Auto-Save)

```javascript
// Triggered on every input change
element.addEventListener('input', () => {
    // Update state
    adminData[key] = element.value;
    
    // Debounce save
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveData(false);
    }, 1000);
});
```

#### 2. File Upload Events

```javascript
// Triggered when user selects file
input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    // Process file
    // Update preview
    // Update adminData
});
```

#### 3. Navigation Events

```javascript
// Triggered when user clicks nav item
navItem.addEventListener('click', () => {
    showSection(sectionId);
});
```

#### 4. Save Events

```javascript
// Triggered when user clicks Save button
saveButton.addEventListener('click', () => {
    saveData(true);
});
```

### 5.2 Event Propagation

```
User Interaction
    │
    ├─► Browser Event
    │   │
    │   └─► Event Listener
    │       │
    │       ├─► Update State
    │       │
    │       ├─► Update UI
    │       │
    │       └─► Persist Data
    │
    └─► Custom Event (if needed)
        └─► Custom Handler
```

---

## Storage Architecture

### 6.1 LocalStorage Structure

```
localStorage
├── toryod-admin-data
│   └── JSON string of adminData object
│
├── toryod-translations
│   └── JSON string of translations object
│
├── toryod-language
│   └── 'en' | 'th'
│
└── toryod-theme (optional)
    └── JSON string of theme object
```

### 6.2 Storage Limits

| Browser | Limit | Notes |
|---------|-------|-------|
| Chrome | ~10MB | Per origin |
| Firefox | ~10MB | Per origin |
| Safari | ~5MB | Per origin |
| Edge | ~10MB | Per origin |

### 6.3 Storage Optimization

#### Strategy 1: Compress Images

```javascript
function compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed data URL
                const compressed = canvas.toDataURL('image/jpeg', quality);
                resolve(compressed);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}
```

#### Strategy 2: Use External Storage

```javascript
// Instead of storing Base64 in localStorage
// Upload to cloud storage and store URL

async function uploadImageToCloud(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });
    
    const { url } = await response.json();
    return url; // Store URL instead of Base64
}
```

---

## Integration Points

### 7.1 Translation System Integration

```javascript
// CMS updates translations
adminData['hero.title.en'] = 'New Title';

// Translation system reads from adminData
window.translations.en['hero.title'] = adminData['hero.title.en'];

// DOM updates via translation system
setLanguage('en'); // Updates all [data-i18n] elements
```

### 7.2 Main Website Integration

```javascript
// CMS data loader in index.html
document.addEventListener('DOMContentLoaded', () => {
    const adminData = localStorage.getItem('toryod-admin-data');
    if (adminData) {
        const data = JSON.parse(adminData);
        
        // Update translations
        updateTranslations(data);
        
        // Update stats
        updateStats(data);
        
        // Update images
        updateImages(data);
        
        // Apply theme
        applyTheme(data);
    }
});
```

### 7.3 Payment System Integration

```javascript
// Payment system reads from adminData
const productPrice = adminData['product.tshirt.price'];
// Parse and use in payment flow
```

---

## Scalability Considerations

### 8.1 Current Limitations

1. **Single User**: ไม่รองรับหลาย users พร้อมกัน
2. **No Conflict Resolution**: ไม่มีระบบจัดการ conflict
3. **Limited Storage**: LocalStorage มีขนาดจำกัด
4. **No Versioning**: ไม่มี history ของการเปลี่ยนแปลง

### 8.2 Scalability Solutions

#### Solution 1: Multi-User Support

```javascript
// Add user context to data
adminData = {
    ...contentData,
    _meta: {
        userId: 'user123',
        lastModified: new Date().toISOString(),
        version: 1
    }
};

// Conflict resolution
function mergeData(localData, serverData) {
    // Compare timestamps
    if (serverData._meta.lastModified > localData._meta.lastModified) {
        // Server is newer, use server data
        return serverData;
    }
    // Local is newer, use local data
    return localData;
}
```

#### Solution 2: Pagination for Large Data

```javascript
// Split large data into chunks
function saveLargeData(data) {
    const chunks = chunkArray(data, 100); // 100 items per chunk
    chunks.forEach((chunk, index) => {
        localStorage.setItem(`toryod-data-chunk-${index}`, JSON.stringify(chunk));
    });
    localStorage.setItem('toryod-data-chunks', chunks.length);
}
```

#### Solution 3: IndexedDB for Large Files

```javascript
// Use IndexedDB for images
function saveImageToIndexedDB(imageData, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('toryod-cms', 1);
        request.onsuccess = (e) => {
            const db = e.target.result;
            const transaction = db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            store.put(imageData, key);
            resolve();
        };
    });
}
```

---

## Performance Metrics

### 8.1 Current Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Load Admin Data | ~50ms | From localStorage |
| Save Data | ~100ms | To localStorage + update translations |
| Populate Form | ~200ms | Depends on number of fields |
| Apply Theme | ~10ms | CSS variable update |
| Image Preview | ~50ms | Depends on image size |

### 8.2 Optimization Opportunities

1. **Lazy Loading**: โหลด sections เมื่อต้องการ
2. **Virtual Scrolling**: สำหรับ forms ที่มี fields เยอะ
3. **Web Workers**: สำหรับ image processing
4. **Service Workers**: สำหรับ caching

---

## Security Architecture

### 9.1 Current Security Model

```
┌─────────────────────────────────────┐
│   Admin Panel (No Authentication)   │
│   - Anyone can access               │
│   - Client-side validation only     │
└─────────────────────────────────────┘
```

### 9.2 Recommended Security Model

```
┌─────────────────────────────────────┐
│   Authentication Layer               │
│   - JWT Tokens                       │
│   - Role-Based Access Control       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Admin Panel                        │
│   - Authenticated users only         │
│   - Server-side validation          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Layer                          │
│   - Rate limiting                    │
│   - Input sanitization               │
│   - CSRF protection                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Database                           │
│   - Encrypted sensitive data         │
│   - Audit logs                       │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

### 10.1 Current Deployment

```
Development
    │
    ├─► Local Vite Server (localhost:3000)
    │
    └─► Static Files
        ├─► admin.html
        ├─► index.html
        └─► Assets (CSS, JS)
```

### 10.2 Production Deployment (Recommended)

```
┌─────────────────────────────────────┐
│   CDN (Cloudflare/CloudFront)        │
│   - Static assets                    │
│   - Image optimization               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Web Server (Nginx/Apache)          │
│   - Serve HTML                       │
│   - SSL/TLS                          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Server (Node.js)       │
│   - API endpoints                    │
│   - Authentication                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Database (PostgreSQL/MongoDB)       │
│   - CMS data                         │
│   - User data                        │
└─────────────────────────────────────┘
```

---

## Monitoring and Logging

### 11.1 Recommended Monitoring

```javascript
// Add analytics
function trackCMSAction(action, data) {
    // Send to analytics service
    if (window.analytics) {
        window.analytics.track('CMS Action', {
            action: action,
            timestamp: new Date().toISOString(),
            data: data
        });
    }
}

// Usage
trackCMSAction('save', { section: 'hero' });
trackCMSAction('export', { format: 'json' });
```

### 11.2 Error Logging

```javascript
// Error tracking
function logError(error, context) {
    console.error('CMS Error:', error, context);
    
    // Send to error tracking service
    if (window.errorTracker) {
        window.errorTracker.log({
            error: error.message,
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString()
        });
    }
}
```

---

## Conclusion

TorYod CMS ใช้สถาปัตยกรรมแบบ client-side ที่เรียบง่ายแต่มีประสิทธิภาพ โดยใช้ LocalStorage เป็น storage layer และสามารถขยายไปยัง backend ได้ในอนาคต

**Key Strengths**:
- ✅ Simple architecture
- ✅ No backend required
- ✅ Fast performance
- ✅ Easy to extend

**Areas for Improvement**:
- ⚠️ Add backend for production
- ⚠️ Implement authentication
- ⚠️ Add version control
- ⚠️ Improve error handling

---

**Document Version**: 1.0.0  
**Last Updated**: 2024
