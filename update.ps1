# TorYod Universal CMS - Update Script (PowerShell)
# วิธีใช้: .\update.ps1

Write-Host "🔄 TorYod Universal CMS - Update" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่าเป็น git repository หรือไม่
if (-not (Test-Path ".git")) {
    Write-Host "❌ ไม่ใช่ Git repository" -ForegroundColor Red
    Write-Host "กรุณา clone repository ก่อน:"
    Write-Host "  git clone https://github.com/StarchyBomb/CMS.git"
    exit 1
}

# ตรวจสอบว่า git ติดตั้งแล้วหรือยัง
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git ไม่ได้ติดตั้ง" -ForegroundColor Red
    exit 1
}

# ตรวจสอบ remote
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host "⚠️  ไม่พบ remote 'origin'" -ForegroundColor Yellow
    $addRemote = Read-Host "ต้องการเพิ่ม remote หรือไม่? (y/n) [y]"
    if ([string]::IsNullOrWhiteSpace($addRemote) -or $addRemote -eq "y") {
        git remote add origin https://github.com/StarchyBomb/CMS.git
        Write-Host "✅ เพิ่ม remote สำเร็จ" -ForegroundColor Green
    } else {
        Write-Host "❌ ยกเลิกการอัพเดท" -ForegroundColor Red
        exit 1
    }
}

# เก็บการเปลี่ยนแปลงปัจจุบัน (ถ้ามี)
Write-Host "📦 กำลังตรวจสอบการเปลี่ยนแปลง..." -ForegroundColor Blue
$status = git status --short
if ($status) {
    Write-Host "⚠️  พบการเปลี่ยนแปลงในไฟล์" -ForegroundColor Yellow
    Write-Host "การเปลี่ยนแปลงที่ยังไม่ได้ commit:"
    git status --short
    
    $stash = Read-Host "ต้องการเก็บการเปลี่ยนแปลงหรือไม่? (y/n) [y]"
    if ([string]::IsNullOrWhiteSpace($stash) -or $stash -eq "y") {
        $stashMessage = "Stash before update $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
        git stash push -m $stashMessage
        Write-Host "✅ เก็บการเปลี่ยนแปลงแล้ว" -ForegroundColor Green
        $stashed = $true
    } else {
        Write-Host "❌ ยกเลิกการอัพเดท" -ForegroundColor Red
        exit 1
    }
} else {
    $stashed = $false
}

# Fetch และ pull
Write-Host ""
Write-Host "📥 กำลังดึงอัพเดทจาก GitHub..." -ForegroundColor Blue
git fetch origin

# ตรวจสอบว่ามีอัพเดทหรือไม่
$local = git rev-parse @
$remote = git rev-parse @{u}

if ($local -eq $remote) {
    Write-Host "✅ คุณใช้เวอร์ชันล่าสุดแล้ว!" -ForegroundColor Green
    
    # Restore stash ถ้ามี
    if ($stashed) {
        $restore = Read-Host "ต้องการคืนค่าการเปลี่ยนแปลงที่เก็บไว้หรือไม่? (y/n) [y]"
        if ([string]::IsNullOrWhiteSpace($restore) -or $restore -eq "y") {
            git stash pop
            Write-Host "✅ คืนค่าการเปลี่ยนแปลงแล้ว" -ForegroundColor Green
        }
    }
    exit 0
}

# Pull อัพเดท
Write-Host "⬇️  กำลังอัพเดท..." -ForegroundColor Blue
git pull origin main

Write-Host ""
Write-Host "✅ อัพเดทสำเร็จ!" -ForegroundColor Green

# Restore stash ถ้ามี
if ($stashed) {
    Write-Host ""
    $restore = Read-Host "ต้องการคืนค่าการเปลี่ยนแปลงที่เก็บไว้หรือไม่? (y/n) [y]"
    if ([string]::IsNullOrWhiteSpace($restore) -or $restore -eq "y") {
        try {
            git stash pop
            Write-Host "✅ คืนค่าการเปลี่ยนแปลงแล้ว" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  มี conflict ในการคืนค่า กรุณาแก้ไขด้วยตนเอง" -ForegroundColor Yellow
            Write-Host "ใช้คำสั่ง: git stash list (เพื่อดู stash)"
            Write-Host "ใช้คำสั่ง: git stash pop (เพื่อคืนค่า)"
        }
    }
}

Write-Host ""
Write-Host "📋 ขั้นตอนต่อไป:" -ForegroundColor Cyan
Write-Host "   1. ตรวจสอบการเปลี่ยนแปลง: git log"
Write-Host "   2. ตรวจสอบไฟล์ที่เปลี่ยน: git diff HEAD~1"
Write-Host "   3. ทดสอบระบบ: เปิด setup.html ใน browser"
Write-Host ""
Write-Host "🎉 พร้อมใช้งานแล้ว!" -ForegroundColor Green
