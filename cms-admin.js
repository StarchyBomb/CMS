/**
 * TorYod Universal CMS - Admin Panel Logic
 */

(function() {
    'use strict';

    // State
    let currentSection = 'visual-editor';
    let selectedElement = null;
    let selectedSelector = null;
    let elementPickerActive = false;

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initVisualEditor();
        initCSSEditor();
        initContentEditor();
        initStyleManager();
        initSettings();
        initButtons();
        loadConfig();
        updateInstallationCode();
    });

    // Navigation
    function initNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
            });
        });
    }

    function showSection(sectionId) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        currentSection = sectionId;
    }

    // Visual Editor
    function initVisualEditor() {
        const pickerMode = document.getElementById('element-picker-mode');
        const openSiteBtn = document.getElementById('open-site-btn');

        pickerMode.addEventListener('change', function() {
            elementPickerActive = this.checked;
            if (elementPickerActive) {
                showMessage('เปิดโหมดเลือก Element แล้ว - เปิดเว็บไซต์ในหน้าต่างใหม่เพื่อเลือก element', 'info');
            }
        });

        openSiteBtn.addEventListener('click', function() {
            const websiteUrl = document.getElementById('website-url').value || window.location.origin;
            window.open(websiteUrl, '_blank');
        });
    }

    // CSS Editor
    function initCSSEditor() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                switchTab(tab);
            });
        });

        // Custom CSS
        const cssEditor = document.getElementById('custom-css-editor');
        const applyCssBtn = document.getElementById('apply-css-btn');
        const clearCssBtn = document.getElementById('clear-css-btn');

        // Load saved CSS
        const savedCSS = getCMSConfig().customCSS || '';
        cssEditor.value = savedCSS;

        applyCssBtn.addEventListener('click', function() {
            const css = cssEditor.value;
            setCustomCSS(css);
            showMessage('✅ ใช้ CSS สำเร็จ!', 'success');
        });

        clearCssBtn.addEventListener('click', function() {
            if (confirm('ต้องการล้าง CSS ทั้งหมดหรือไม่?')) {
                cssEditor.value = '';
                setCustomCSS('');
                showMessage('🗑️ ล้าง CSS แล้ว', 'info');
            }
        });

        // Style Overrides
        const addOverrideBtn = document.getElementById('add-style-override-btn');
        addOverrideBtn.addEventListener('click', function() {
            showAddStyleOverrideModal();
        });

        updateStyleOverridesList();
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    function updateStyleOverridesList() {
        const list = document.getElementById('style-overrides-list');
        const styles = getCMSConfig().styles || {};

        if (Object.keys(styles).length === 0) {
            list.innerHTML = '<p class="placeholder">ยังไม่มี style overrides</p>';
            return;
        }

        list.innerHTML = '';
        Object.keys(styles).forEach(selector => {
            const ruleItem = createStyleRuleItem(selector, styles[selector]);
            list.appendChild(ruleItem);
        });
    }

    function createStyleRuleItem(selector, properties) {
        const item = document.createElement('div');
        item.className = 'style-rule-item';
        item.innerHTML = `
            <div class="rule-header">
                <span class="rule-selector">${escapeHtml(selector)}</span>
                <div class="rule-actions">
                    <button class="btn btn-sm btn-secondary edit-rule-btn">✏️ แก้ไข</button>
                    <button class="btn btn-sm btn-danger delete-rule-btn">🗑️ ลบ</button>
                </div>
            </div>
            <div class="rule-properties">
                ${Object.keys(properties).map(prop => `
                    <div class="property-item">
                        <span class="property-name">${escapeHtml(prop)}</span>
                        <span class="property-value">${escapeHtml(properties[prop])}</span>
                    </div>
                `).join('')}
            </div>
        `;

        item.querySelector('.edit-rule-btn').addEventListener('click', () => {
            showEditStyleOverrideModal(selector, properties);
        });

        item.querySelector('.delete-rule-btn').addEventListener('click', () => {
            if (confirm(`ต้องการลบ style rule สำหรับ "${selector}" หรือไม่?`)) {
                removeStyleOverride(selector);
            }
        });

        return item;
    }

    function showAddStyleOverrideModal() {
        showModal('เพิ่ม Style Override', `
            <div class="form-group">
                <label>CSS Selector:</label>
                <input type="text" id="modal-selector" class="form-control" 
                       placeholder=".example, #header, h1, etc.">
            </div>
            <div class="form-group">
                <label>CSS Property:</label>
                <input type="text" id="modal-property" class="form-control" 
                       placeholder="color, font-size, background-color, etc.">
            </div>
            <div class="form-group">
                <label>CSS Value:</label>
                <input type="text" id="modal-value" class="form-control" 
                       placeholder="red, 18px, #FF0000, etc.">
            </div>
            <div class="form-group">
                <button id="modal-save-btn" class="btn btn-primary">💾 บันทึก</button>
                <button class="btn btn-secondary modal-close-btn">ยกเลิก</button>
            </div>
        `);

        document.getElementById('modal-save-btn').addEventListener('click', function() {
            const selector = document.getElementById('modal-selector').value.trim();
            const property = document.getElementById('modal-property').value.trim();
            const value = document.getElementById('modal-value').value.trim();

            if (!selector || !property || !value) {
                showMessage('❌ กรุณากรอกข้อมูลให้ครบ', 'error');
                return;
            }

            addStyleOverride(selector, property, value);
            closeModal();
            showMessage('✅ เพิ่ม Style Override สำเร็จ!', 'success');
        });
    }

    function showEditStyleOverrideModal(selector, properties) {
        const propsList = Object.keys(properties).map(prop => 
            `<div style="margin-bottom: 0.5rem;">
                <strong>${escapeHtml(prop)}</strong>: ${escapeHtml(properties[prop])}
                <button class="btn btn-sm btn-danger remove-prop-btn" data-prop="${escapeHtml(prop)}">ลบ</button>
            </div>`
        ).join('');

        showModal(`แก้ไข Style Override: ${escapeHtml(selector)}`, `
            <div class="form-group">
                <label>CSS Selector:</label>
                <input type="text" id="modal-selector" class="form-control" 
                       value="${escapeHtml(selector)}" readonly>
            </div>
            <div class="form-group">
                <label>Properties:</label>
                <div id="modal-properties-list">${propsList}</div>
            </div>
            <div class="form-group">
                <label>เพิ่ม Property ใหม่:</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="modal-new-property" class="form-control" 
                           placeholder="property" style="flex: 1;">
                    <input type="text" id="modal-new-value" class="form-control" 
                           placeholder="value" style="flex: 1;">
                    <button id="modal-add-prop-btn" class="btn btn-primary">+</button>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-secondary modal-close-btn">ปิด</button>
            </div>
        `);

        // Remove property buttons
        document.querySelectorAll('.remove-prop-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const prop = this.getAttribute('data-prop');
                removeStyleProperty(selector, prop);
                closeModal();
                showEditStyleOverrideModal(selector, getCMSConfig().styles[selector] || {});
            });
        });

        // Add property button
        document.getElementById('modal-add-prop-btn').addEventListener('click', function() {
            const prop = document.getElementById('modal-new-property').value.trim();
            const value = document.getElementById('modal-new-value').value.trim();

            if (!prop || !value) {
                showMessage('❌ กรุณากรอกข้อมูลให้ครบ', 'error');
                return;
            }

            addStyleProperty(selector, prop, value);
            document.getElementById('modal-new-property').value = '';
            document.getElementById('modal-new-value').value = '';
            closeModal();
            showEditStyleOverrideModal(selector, getCMSConfig().styles[selector] || {});
        });
    }

    // Content Editor
    function initContentEditor() {
        const addBtn = document.getElementById('add-content-rule-btn');
        addBtn.addEventListener('click', function() {
            showAddContentRuleModal();
        });

        updateContentList();
    }

    function updateContentList() {
        const list = document.getElementById('content-list');
        const content = getCMSConfig().content || {};

        if (Object.keys(content).length === 0) {
            list.innerHTML = '<p class="placeholder">ยังไม่มีการแก้ไขเนื้อหา</p>';
            return;
        }

        list.innerHTML = '';
        Object.keys(content).forEach(selector => {
            const ruleItem = createContentRuleItem(selector, content[selector]);
            list.appendChild(ruleItem);
        });
    }

    function createContentRuleItem(selector, contentData) {
        const item = document.createElement('div');
        item.className = 'content-rule-item';
        
        const contentPreview = contentData.text || contentData.html || '(ไม่มี)';
        item.innerHTML = `
            <div class="rule-header">
                <span class="rule-selector">${escapeHtml(selector)}</span>
                <div class="rule-actions">
                    <button class="btn btn-sm btn-secondary edit-content-btn">✏️ แก้ไข</button>
                    <button class="btn btn-sm btn-danger delete-content-btn">🗑️ ลบ</button>
                </div>
            </div>
            <div class="rule-properties">
                <div class="property-item">
                    <span class="property-name">Content</span>
                    <span class="property-value">${escapeHtml(contentPreview.substring(0, 50))}...</span>
                </div>
            </div>
        `;

        item.querySelector('.edit-content-btn').addEventListener('click', () => {
            showEditContentRuleModal(selector, contentData);
        });

        item.querySelector('.delete-content-btn').addEventListener('click', () => {
            if (confirm(`ต้องการลบ content rule สำหรับ "${selector}" หรือไม่?`)) {
                removeContentRule(selector);
            }
        });

        return item;
    }

    function showAddContentRuleModal() {
        showModal('เพิ่ม Content Rule', `
            <div class="form-group">
                <label>CSS Selector:</label>
                <input type="text" id="modal-selector" class="form-control" 
                       placeholder=".example, #header, h1, etc.">
            </div>
            <div class="form-group">
                <label>ประเภท:</label>
                <select id="modal-content-type" class="form-control">
                    <option value="text">Text Content</option>
                    <option value="html">HTML Content</option>
                </select>
            </div>
            <div class="form-group">
                <label>Content:</label>
                <textarea id="modal-content" class="form-control" rows="5"></textarea>
            </div>
            <div class="form-group">
                <button id="modal-save-btn" class="btn btn-primary">💾 บันทึก</button>
                <button class="btn btn-secondary modal-close-btn">ยกเลิก</button>
            </div>
        `);

        document.getElementById('modal-save-btn').addEventListener('click', function() {
            const selector = document.getElementById('modal-selector').value.trim();
            const type = document.getElementById('modal-content-type').value;
            const content = document.getElementById('modal-content').value;

            if (!selector || !content) {
                showMessage('❌ กรุณากรอกข้อมูลให้ครบ', 'error');
                return;
            }

            setContent(selector, content, type);
            closeModal();
            showMessage('✅ เพิ่ม Content Rule สำเร็จ!', 'success');
        });
    }

    function showEditContentRuleModal(selector, contentData) {
        const currentType = contentData.html ? 'html' : 'text';
        const currentContent = contentData.html || contentData.text || '';

        showModal(`แก้ไข Content Rule: ${escapeHtml(selector)}`, `
            <div class="form-group">
                <label>CSS Selector:</label>
                <input type="text" id="modal-selector" class="form-control" 
                       value="${escapeHtml(selector)}" readonly>
            </div>
            <div class="form-group">
                <label>ประเภท:</label>
                <select id="modal-content-type" class="form-control">
                    <option value="text" ${currentType === 'text' ? 'selected' : ''}>Text Content</option>
                    <option value="html" ${currentType === 'html' ? 'selected' : ''}>HTML Content</option>
                </select>
            </div>
            <div class="form-group">
                <label>Content:</label>
                <textarea id="modal-content" class="form-control" rows="5">${escapeHtml(currentContent)}</textarea>
            </div>
            <div class="form-group">
                <button id="modal-save-btn" class="btn btn-primary">💾 บันทึก</button>
                <button class="btn btn-secondary modal-close-btn">ยกเลิก</button>
            </div>
        `);

        document.getElementById('modal-save-btn').addEventListener('click', function() {
            const type = document.getElementById('modal-content-type').value;
            const content = document.getElementById('modal-content').value;

            if (!content) {
                showMessage('❌ กรุณากรอกข้อมูลให้ครบ', 'error');
                return;
            }

            setContent(selector, content, type);
            closeModal();
            showMessage('✅ แก้ไข Content Rule สำเร็จ!', 'success');
        });
    }

    // Style Manager
    function initStyleManager() {
        const addBtn = document.getElementById('add-style-rule-btn');
        addBtn.addEventListener('click', function() {
            showAddStyleRuleModal();
        });

        updateStyleManagerList();
    }

    function updateStyleManagerList() {
        const list = document.getElementById('style-manager-list');
        const styles = getCMSConfig().styles || {};

        if (Object.keys(styles).length === 0) {
            list.innerHTML = '<p class="placeholder">ยังไม่มีการจัดการ styles</p>';
            return;
        }

        list.innerHTML = '';
        Object.keys(styles).forEach(selector => {
            const ruleItem = createStyleRuleItem(selector, styles[selector]);
            list.appendChild(ruleItem);
        });
    }

    function showAddStyleRuleModal() {
        showAddStyleOverrideModal();
    }

    // Settings
    function initSettings() {
        const enabledCheckbox = document.getElementById('cms-enabled');
        const websiteUrl = document.getElementById('website-url');

        // Load saved settings
        const config = getCMSConfig();
        enabledCheckbox.checked = config.enabled !== false;

        enabledCheckbox.addEventListener('change', function() {
            setCMSEnabled(this.checked);
        });

        websiteUrl.addEventListener('change', function() {
            updateInstallationCode();
        });

        // Copy installation code
        document.getElementById('copy-install-code-btn').addEventListener('click', function() {
            const code = document.getElementById('installation-code').value;
            copyToClipboard(code);
            showMessage('✅ คัดลอก Installation Code แล้ว!', 'success');
        });
    }

    function updateInstallationCode() {
        const websiteUrl = document.getElementById('website-url').value || window.location.origin;
        const storageKey = document.getElementById('storage-key').value;
        const adminUrl = window.location.href;

        const code = `<!-- TorYod Universal CMS -->
<script src="${adminUrl.replace('admin.html', 'cms-widget.js')}"></script>
<script>
  TorYodCMS.init({
    adminUrl: '${adminUrl}',
    storageKey: '${storageKey}'
  });
</script>`;

        document.getElementById('installation-code').value = code;
    }

    // Buttons
    function initButtons() {
        // Save
        document.getElementById('save-btn').addEventListener('click', function() {
            saveConfig();
            showMessage('✅ บันทึกสำเร็จ!', 'success');
        });

        // Export
        document.getElementById('export-btn').addEventListener('click', function() {
            exportConfig();
        });

        // Import
        document.getElementById('import-btn').addEventListener('click', function() {
            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (importConfig(event.target.result)) {
                        showMessage('✅ Import สำเร็จ!', 'success');
                        location.reload();
                    } else {
                        showMessage('❌ Import ล้มเหลว - ไฟล์ไม่ถูกต้อง', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });

        // Reset
        document.getElementById('reset-btn').addEventListener('click', function() {
            if (confirm('⚠️ ต้องการรีเซ็ตการตั้งค่าทั้งหมดหรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้!')) {
                resetConfig();
            }
        });

        // Preview
        document.getElementById('preview-btn').addEventListener('click', function() {
            const websiteUrl = document.getElementById('website-url').value || window.location.origin;
            window.open(websiteUrl, '_blank');
        });
    }

    // CMS API Functions
    function getCMSConfig() {
        if (window.TorYodCMS) {
            return window.TorYodCMS.getConfig();
        }
        // Fallback to localStorage
        try {
            const saved = localStorage.getItem('toryod-cms-config');
            return saved ? JSON.parse(saved) : {
                styles: {},
                content: {},
                attributes: {},
                customCSS: '',
                enabled: true
            };
        } catch (e) {
            return {
                styles: {},
                content: {},
                attributes: {},
                customCSS: '',
                enabled: true
            };
        }
    }

    function saveConfig() {
        if (window.TorYodCMS) {
            window.TorYodCMS.saveConfig();
        } else {
            // Fallback
            const config = getCMSConfig();
            localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        }
    }

    function loadConfig() {
        const config = getCMSConfig();
        // Update UI with loaded config
        updateStyleOverridesList();
        updateContentList();
        updateStyleManagerList();
    }

    function setCustomCSS(css) {
        if (window.TorYodCMS) {
            window.TorYodCMS.setCustomCSS(css);
        } else {
            const config = getCMSConfig();
            config.customCSS = css;
            localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        }
    }

    function addStyleOverride(selector, property, value) {
        if (window.TorYodCMS) {
            window.TorYodCMS.setStyle(selector, property, value);
        } else {
            const config = getCMSConfig();
            if (!config.styles[selector]) {
                config.styles[selector] = {};
            }
            config.styles[selector][property] = value;
            localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        }
        updateStyleOverridesList();
    }

    function addStyleProperty(selector, property, value) {
        addStyleOverride(selector, property, value);
    }

    function removeStyleOverride(selector) {
        const config = getCMSConfig();
        delete config.styles[selector];
        localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        if (window.TorYodCMS) {
            // Need to re-apply config
            window.TorYodCMS.configData = config;
            window.TorYodCMS.applyConfig();
        }
        updateStyleOverridesList();
    }

    function removeStyleProperty(selector, property) {
        const config = getCMSConfig();
        if (config.styles[selector]) {
            delete config.styles[selector][property];
            if (Object.keys(config.styles[selector]).length === 0) {
                delete config.styles[selector];
            }
            localStorage.setItem('toryod-cms-config', JSON.stringify(config));
            if (window.TorYodCMS) {
                window.TorYodCMS.configData = config;
                window.TorYodCMS.applyConfig();
            }
        }
        updateStyleOverridesList();
    }

    function setContent(selector, content, type) {
        if (window.TorYodCMS) {
            window.TorYodCMS.setContent(selector, content, type);
        } else {
            const config = getCMSConfig();
            if (!config.content[selector]) {
                config.content[selector] = {};
            }
            config.content[selector][type] = content;
            localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        }
        updateContentList();
    }

    function removeContentRule(selector) {
        const config = getCMSConfig();
        delete config.content[selector];
        localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        if (window.TorYodCMS) {
            window.TorYodCMS.configData = config;
            window.TorYodCMS.applyConfig();
        }
        updateContentList();
    }

    function setCMSEnabled(enabled) {
        const config = getCMSConfig();
        config.enabled = enabled;
        localStorage.setItem('toryod-cms-config', JSON.stringify(config));
        if (window.TorYodCMS) {
            window.TorYodCMS.configData.enabled = enabled;
            window.TorYodCMS.applyConfig();
        }
    }

    function exportConfig() {
        const config = getCMSConfig();
        const json = JSON.stringify(config, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toryod-cms-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showMessage('✅ Export สำเร็จ!', 'success');
    }

    function importConfig(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            localStorage.setItem('toryod-cms-config', JSON.stringify(imported));
            if (window.TorYodCMS) {
                window.TorYodCMS.importConfig(jsonString);
            }
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    }

    function resetConfig() {
        localStorage.removeItem('toryod-cms-config');
        if (window.TorYodCMS) {
            window.TorYodCMS.reset();
        } else {
            location.reload();
        }
    }

    // Modal Functions
    function showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').style.display = 'flex';

        // Close buttons
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
    }

    function closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    }

    // Utility Functions
    function showMessage(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

})();
