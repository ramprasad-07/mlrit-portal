@echo off
title MLRIT Unified College Portal - Dual Launcher
color 0B
echo ===================================================================
echo     MLRIT INSTITUTE OF TECHNOLOGY - UNIFIED COLLEGE PORTAL
echo     Automated Dual-Process Launcher (Backend + Frontend)
echo ===================================================================
echo.
echo [1/3] Verifying directories...
cd /d "%~dp0"

echo [2/3] Starting Spring Boot Backend (Java 25 on Port 8080)...
start "MLRIT Backend (Spring Boot :8080)" cmd /k "cd backend && title MLRIT Spring Boot [8080] && .\mvnw.cmd spring-boot:run"

echo Waiting 6 seconds for Spring Boot initialization...
timeout /t 6 /nobreak >nul

echo [3/3] Starting React Frontend (Vite on Port 5173)...
start "MLRIT Frontend (Vite React :5173)" cmd /k "cd frontend && title MLRIT React Vite [5173] && npm run dev"

echo.
echo ===================================================================
echo   PORTAL LAUNCHED SUCCESSFULLY!
echo.
echo   * React Frontend : http://localhost:5173
echo   * Student/Faculty: http://localhost:5173/login
echo   * Admin Portal   : http://localhost:5173/admin
echo   * Backend API    : http://localhost:8080/api
echo.
echo   NOTE: Keep both command windows open while using the portal.
echo   Closing this launcher window will NOT terminate the servers.
echo ===================================================================
timeout /t 8
