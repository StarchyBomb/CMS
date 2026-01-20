/**
 * TorYod Universal CMS Widget
 * ติดตั้งได้ในเว็บไซต์ใดก็ได้ - แก้ไข CSS/HTML โดยไม่ต้องแก้โค้ด
 * 
 * การติดตั้ง:
 * <script src="cms-widget.js"></script>
 * <script>
 *   TorYodCMS.init({
 *     apiKey: 'your-api-key',
 *     adminUrl: 'https://your-domain.com/admin.html'
 *   });
 * </script>
 */

(function(window) {
    'use strict';

    const TorYodCMS = {
        config: {
            apiKey: null,
            adminUrl: null,
            storageKey: 'toryod-cms-config',
            version: '1.0.0'
        },

        // เก็บ configuration ทั้งหมด
        configData: {
            styles: {},      // CSS overrides
            content: {},     // Content replacements
            attributes: {},  // HTML attributes
            customCSS: '',  // Custom CSS code
            enabled: true
        },

        // เริ่มต้นระบบ
        init: function(options) {
            Object.assign(this.config, options);
            this.loadConfig();
            this.applyConfig();
            this.setupObserver();
            this.injectAdminButton();
            
            console.log('✅ TorYod CMS Widget Loaded');
        },

        // โหลด configuration จาก localStorage หรือ API
        loadConfig: function() {
            try {
                const saved = localStorage.getItem(this.config.storageKey);
                if (saved) {
                    this.configData = JSON.parse(saved);
                }
            } catch (e) {
                console.error('CMS: Failed to load config', e);
            }
        },

        // บันทึก configuration
        saveConfig: function() {
            try {
                localStorage.setItem(
                    this.config.storageKey,
                    JSON.stringify(this.configData)
                );
            } catch (e) {
                console.error('CMS: Failed to save config', e);
            }
        },

        // นำ configuration ไปใช้กับเว็บไซต์
        applyConfig: function() {
            if (!this.configData.enabled) return;

            // Apply custom CSS
            this.applyCustomCSS();

            // Apply style overrides
            this.applyStyleOverrides();

            // Apply content changes
            this.applyContentChanges();

            // Apply attribute changes
            this.applyAttributeChanges();
        },

        // ใช้ Custom CSS
        applyCustomCSS: function() {
            if (!this.configData.customCSS) return;

            let styleElement = document.getElementById('toryod-cms-custom-css');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'toryod-cms-custom-css';
                document.head.appendChild(styleElement);
            }
            styleElement.textContent = this.configData.customCSS;
        },

        // ใช้ Style Overrides
        applyStyleOverrides: function() {
            Object.keys(this.configData.styles).forEach(selector => {
                const elements = document.querySelectorAll(selector);
                const styles = this.configData.styles[selector];
                
                elements.forEach(element => {
                    Object.keys(styles).forEach(property => {
                        element.style.setProperty(property, styles[property], 'important');
                    });
                });
            });
        },

        // ใช้ Content Changes
        applyContentChanges: function() {
            Object.keys(this.configData.content).forEach(selector => {
                const elements = document.querySelectorAll(selector);
                const content = this.configData.content[selector];
                
                elements.forEach(element => {
                    if (content.text !== undefined) {
                        element.textContent = content.text;
                    }
                    if (content.html !== undefined) {
                        element.innerHTML = content.html;
                    }
                });
            });
        },

        // ใช้ Attribute Changes
        applyAttributeChanges: function() {
            Object.keys(this.configData.attributes).forEach(selector => {
                const elements = document.querySelectorAll(selector);
                const attrs = this.configData.attributes[selector];
                
                elements.forEach(element => {
                    Object.keys(attrs).forEach(attr => {
                        element.setAttribute(attr, attrs[attr]);
                    });
                });
            });
        },

        // ตั้งค่า MutationObserver เพื่อ detect DOM changes
        setupObserver: function() {
            if (!window.MutationObserver) return;

            const observer = new MutationObserver(() => {
                // Re-apply config เมื่อ DOM เปลี่ยน
                setTimeout(() => this.applyConfig(), 100);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
        },

        // Inject Admin Button
        injectAdminButton: function() {
            if (!this.config.adminUrl) return;
            if (document.getElementById('toryod-cms-admin-btn')) return;

            const btn = document.createElement('div');
            btn.id = 'toryod-cms-admin-btn';
            btn.innerHTML = `
                <a href="${this.config.adminUrl}" target="_blank" 
                   style="position: fixed; bottom: 20px; right: 20px; 
                          background: #FF8C5A; color: white; padding: 12px 20px; 
                          border-radius: 25px; text-decoration: none; 
                          box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                          z-index: 999999; font-family: Arial; font-size: 14px;
                          display: flex; align-items: center; gap: 8px;">
                    <span>⚙️</span>
                    <span>CMS Admin</span>
                </a>
            `;
            document.body.appendChild(btn);
        },

        // API Methods สำหรับ Admin Panel
        setStyle: function(selector, property, value) {
            if (!this.configData.styles[selector]) {
                this.configData.styles[selector] = {};
            }
            this.configData.styles[selector][property] = value;
            this.saveConfig();
            this.applyConfig();
        },

        removeStyle: function(selector, property) {
            if (this.configData.styles[selector]) {
                delete this.configData.styles[selector][property];
                if (Object.keys(this.configData.styles[selector]).length === 0) {
                    delete this.configData.styles[selector];
                }
                this.saveConfig();
                this.applyConfig();
            }
        },

        setContent: function(selector, content, type = 'text') {
            if (!this.configData.content[selector]) {
                this.configData.content[selector] = {};
            }
            this.configData.content[selector][type] = content;
            this.saveConfig();
            this.applyConfig();
        },

        setAttribute: function(selector, attr, value) {
            if (!this.configData.attributes[selector]) {
                this.configData.attributes[selector] = {};
            }
            this.configData.attributes[selector][attr] = value;
            this.saveConfig();
            this.applyConfig();
        },

        setCustomCSS: function(css) {
            this.configData.customCSS = css;
            this.saveConfig();
            this.applyConfig();
        },

        getConfig: function() {
            return JSON.parse(JSON.stringify(this.configData));
        },

        exportConfig: function() {
            return JSON.stringify(this.configData, null, 2);
        },

        importConfig: function(jsonString) {
            try {
                const imported = JSON.parse(jsonString);
                this.configData = { ...this.configData, ...imported };
                this.saveConfig();
                this.applyConfig();
                return true;
            } catch (e) {
                console.error('CMS: Import failed', e);
                return false;
            }
        },

        reset: function() {
            this.configData = {
                styles: {},
                content: {},
                attributes: {},
                customCSS: '',
                enabled: true
            };
            this.saveConfig();
            location.reload();
        }
    };

    // Expose to window
    window.TorYodCMS = TorYodCMS;

    // Auto-init if config provided
    if (window.TorYodCMSConfig) {
        TorYodCMS.init(window.TorYodCMSConfig);
    }

})(window);
