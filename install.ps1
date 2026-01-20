# TorYod Universal CMS - Git Installation Script (PowerShell)
# วิธีใช้: .\install.ps1

Write-Host "🎨 TorYod Universal CMS - Git Installation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่า git ติดตั้งแล้วหรือยัง
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git ไม่ได้ติดตั้ง กรุณาติดตั้ง Git ก่อน" -ForegroundColor Red
    exit 1
}

# ถาม path ที่ต้องการติดตั้ง
$installPath = Read-Host "📁 ระบุ path ที่ต้องการติดตั้ง CMS (default: .\cms)"
if ([string]::IsNullOrWhiteSpace($installPath)) {
    $installPath = ".\cms"
}

# ถามว่าจะ clone หรือใช้ local
$installMethod = Read-Host "🔗 ต้องการ clone จาก GitHub หรือใช้ไฟล์ local? (github/local) [github]"
if ([string]::IsNullOrWhiteSpace($installMethod)) {
    $installMethod = "github"
}

if ($installMethod -eq "github") {
    Write-Host ""
    Write-Host "📥 กำลัง clone repository..." -ForegroundColor Blue
    
    # Clone repository
    if (Test-Path $installPath) {
        Write-Host "⚠️  Directory $installPath มีอยู่แล้ว" -ForegroundColor Yellow
        $overwrite = Read-Host "ต้องการลบและ clone ใหม่หรือไม่? (y/n) [n]"
        if ($overwrite -eq "y" -or $overwrite -eq "Y") {
            Remove-Item -Path $installPath -Recurse -Force
        } else {
            Write-Host "❌ ยกเลิกการติดตั้ง" -ForegroundColor Red
            exit 1
        }
    }
    
    git clone https://github.com/StarchyBomb/CMS.git $installPath
    Set-Location $installPath
    
    Write-Host "✅ Clone สำเร็จ!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "📁 ใช้ไฟล์ local..." -ForegroundColor Blue
    
    if (-not (Test-Path $installPath)) {
        New-Item -ItemType Directory -Path $installPath -Force | Out-Null
    }
    
    # Copy ไฟล์ที่จำเป็น
    $files = @("cms-widget.js", "cms-admin.html", "cms-admin.js", "cms-admin.css", "install.js", "setup.html")
    $allExist = $true
    
    foreach ($file in $files) {
        if (-not (Test-Path $file)) {
            $allExist = $false
            break
        }
    }
    
    if (-not $allExist) {
        Write-Host "❌ ไม่พบไฟล์ CMS ใน directory ปัจจุบัน" -ForegroundColor Red
        Write-Host "กรุณารัน script นี้จาก directory ที่มีไฟล์ CMS" -ForegroundColor Red
        exit 1
    }
    
    Copy-Item -Path $files -Destination $installPath -Force
    Set-Location $installPath
    
    Write-Host "✅ Copy ไฟล์สำเร็จ!" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ ติดตั้งสำเร็จ!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 ขั้นตอนต่อไป:" -ForegroundColor Cyan
Write-Host "   1. เปิดไฟล์: $installPath\setup.html"
Write-Host "   2. ทำตามขั้นตอนใน Setup Wizard"
Write-Host "   3. หรือเพิ่มโค้ดนี้ในเว็บไซต์:"
Write-Host ""
Write-Host "   <script src=`"$installPath\cms-widget.js`"></script>"
Write-Host "   <script>"
Write-Host "     TorYodCMS.init({"
Write-Host "       adminUrl: '$(Get-Location)\cms-admin.html',"
Write-Host "       storageKey: 'toryod-cms-config'"
Write-Host "     });"
Write-Host "   </script>"
Write-Host ""
Write-Host "🎉 พร้อมใช้งานแล้ว!" -ForegroundColor Green
