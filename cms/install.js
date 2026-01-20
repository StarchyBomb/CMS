/**
 * TorYod CMS - One-Click Installation Script
 * 
 * วิธีใช้:
 * 1. เพิ่ม script นี้ในหน้าเว็บ
 * 2. เรียกใช้ TorYodCMSInstaller.install()
 */

(function(window) {
    'use strict';

    const TorYodCMSInstaller = {
        // ติดตั้งอัตโนมัติ
        install: function(options = {}) {
            const defaults = {
                cmsPath: '/cms/',
                adminUrl: null,
                storageKey: 'toryod-cms-config',
                autoInject: true
            };

            const config = Object.assign({}, defaults, options);

            // สร้าง admin URL ถ้าไม่ได้ระบุ
            if (!config.adminUrl) {
                config.adminUrl = window.location.origin + config.cmsPath + 'cms-admin.html';
            }

            // ตรวจสอบว่า widget ถูกโหลดแล้วหรือยัง
            if (window.TorYodCMS) {
                console.log('✅ TorYod CMS already loaded');
                return;
            }

            // โหลด widget script
            this.loadScript(config.cmsPath + 'cms-widget.js', function() {
                if (window.TorYodCMS) {
                    window.TorYodCMS.init({
                        adminUrl: config.adminUrl,
                        storageKey: config.storageKey
                    });
                    console.log('✅ TorYod CMS installed successfully!');
                } else {
                    console.error('❌ Failed to load TorYod CMS widget');
                }
            });
        },

        // โหลด script แบบ dynamic
        loadScript: function(src, callback) {
            const script = document.createElement('script');
            script.src = src;
            script.onload = callback;
            script.onerror = function() {
                console.error('❌ Failed to load script:', src);
                console.log('💡 Make sure cms-widget.js is uploaded to:', src);
            };
            document.head.appendChild(script);
        },

        // ตรวจสอบว่าติดตั้งแล้วหรือยัง
        isInstalled: function() {
            return typeof window.TorYodCMS !== 'undefined';
        },

        // แสดงปุ่มติดตั้ง (ถ้ายังไม่ได้ติดตั้ง)
        showInstallButton: function(options = {}) {
            if (this.isInstalled()) {
                return; // ติดตั้งแล้ว ไม่ต้องแสดงปุ่ม
            }

            const button = document.createElement('div');
            button.id = 'toryod-cms-install-btn';
            button.innerHTML = `
                <div style="position: fixed; bottom: 20px; right: 20px; 
                           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                           color: white; padding: 16px 24px; border-radius: 25px; 
                           box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
                           z-index: 999999; cursor: pointer;
                           font-family: Arial, sans-serif; font-size: 14px;
                           display: flex; align-items: center; gap: 10px;
                           animation: pulse 2s infinite;">
                    <span style="font-size: 20px;">⚡</span>
                    <div>
                        <div style="font-weight: bold;">ติดตั้ง CMS</div>
                        <div style="font-size: 12px; opacity: 0.9;">คลิกเพื่อติดตั้ง</div>
                    </div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                </style>
            `;

            button.addEventListener('click', () => {
                this.install(options);
                button.remove();
            });

            document.body.appendChild(button);
        }
    };

    // Expose to window
    window.TorYodCMSInstaller = TorYodCMSInstaller;

    // Auto-install ถ้ามี config
    if (window.TorYodCMSAutoInstall) {
        TorYodCMSInstaller.install(window.TorYodCMSAutoInstall);
    }

})(window);
