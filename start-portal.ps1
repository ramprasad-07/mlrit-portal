# MLRIT Unified College Portal - PowerShell Launcher
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "    MLRIT INSTITUTE OF TECHNOLOGY - UNIFIED COLLEGE PORTAL        " -ForegroundColor Cyan
Write-Host "    Automated Dual-Process Launcher (Backend + Frontend)          " -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend
Write-Host "`n[1/2] Starting Spring Boot Backend on Port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host 'Starting MLRIT Backend...'; .\mvnw.cmd spring-boot:run"

# Wait
Start-Sleep -Seconds 5

# 2. Start Frontend
Write-Host "[2/2] Starting React Frontend on Port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; Write-Host 'Starting MLRIT Frontend...'; npm run dev"

Write-Host "`n===================================================================" -ForegroundColor Green
Write-Host "  Both processes launched in separate windows!" -ForegroundColor Green
Write-Host "  - Frontend URL : http://localhost:5173" -ForegroundColor White
Write-Host "  - Student/Staff: http://localhost:5173/login" -ForegroundColor White
Write-Host "  - Admin Portal : http://localhost:5173/admin" -ForegroundColor White
Write-Host "  - Backend API  : http://localhost:8080" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Green
