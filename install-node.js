#!/usr/bin/env node

/**
 * TorYod Universal CMS - Node.js Installation Script
 * วิธีใช้: npm install หรือ node install-node.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 TorYod Universal CMS - Git Installation');
console.log('==========================================\n');

// ตรวจสอบว่า git ติดตั้งแล้วหรือยัง
function checkGit() {
    try {
        execSync('git --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

// Clone repository
function cloneRepo(targetPath) {
    const repoUrl = 'https://github.com/StarchyBomb/CMS.git';
    
    if (fs.existsSync(targetPath)) {
        console.log(`⚠️  Directory ${targetPath} มีอยู่แล้ว`);
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question('ต้องการลบและ clone ใหม่หรือไม่? (y/n) [n]: ', (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'y') {
                    fs.rmSync(targetPath, { recursive: true, force: true });
                    execSync(`git clone ${repoUrl} ${targetPath}`, { stdio: 'inherit' });
                    resolve(true);
                } else {
                    console.log('❌ ยกเลิกการติดตั้ง');
                    resolve(false);
                }
            });
        });
    } else {
        execSync(`git clone ${repoUrl} ${targetPath}`, { stdio: 'inherit' });
        return true;
    }
}

// Copy ไฟล์ที่จำเป็น
function copyFiles(targetPath) {
    const files = [
        'cms-widget.js',
        'cms-admin.html',
        'cms-admin.js',
        'cms-admin.css',
        'install.js',
        'setup.html'
    ];
    
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }
    
    files.forEach(file => {
        const sourcePath = path.join(__dirname, file);
        const targetFilePath = path.join(targetPath, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, targetFilePath);
            console.log(`✅ Copied: ${file}`);
        } else {
            console.log(`⚠️  ไม่พบไฟล์: ${file}`);
        }
    });
}

// Main function
async function main() {
    if (!checkGit()) {
        console.log('❌ Git ไม่ได้ติดตั้ง กรุณาติดตั้ง Git ก่อน');
        process.exit(1);
    }
    
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const installPath = await new Promise((resolve) => {
        rl.question('📁 ระบุ path ที่ต้องการติดตั้ง CMS (default: ./cms): ', (answer) => {
            resolve(answer.trim() || './cms');
        });
    });
    
    const installMethod = await new Promise((resolve) => {
        rl.question('🔗 ต้องการ clone จาก GitHub หรือใช้ไฟล์ local? (github/local) [github]: ', (answer) => {
            resolve(answer.trim() || 'github');
        });
    });
    
    rl.close();
    
    const fullPath = path.resolve(installPath);
    
    if (installMethod === 'github') {
        console.log('\n📥 กำลัง clone repository...\n');
        const success = await cloneRepo(fullPath);
        if (!success) {
            process.exit(1);
        }
    } else {
        console.log('\n📁 ใช้ไฟล์ local...\n');
        copyFiles(fullPath);
    }
    
    console.log('\n✅ ติดตั้งสำเร็จ!\n');
    console.log('📋 ขั้นตอนต่อไป:');
    console.log(`   1. เปิดไฟล์: ${fullPath}/setup.html`);
    console.log('   2. ทำตามขั้นตอนใน Setup Wizard');
    console.log('   3. หรือเพิ่มโค้ดนี้ในเว็บไซต์:\n');
    console.log(`   <script src="${installPath}/cms-widget.js"></script>`);
    console.log('   <script>');
    console.log('     TorYodCMS.init({');
    console.log(`       adminUrl: '${fullPath}/cms-admin.html',`);
    console.log("       storageKey: 'toryod-cms-config'");
    console.log('     });');
    console.log('   </script>\n');
    console.log('🎉 พร้อมใช้งานแล้ว!');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { cloneRepo, copyFiles };
