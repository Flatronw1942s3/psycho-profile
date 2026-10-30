@echo off
chcp 65001 >nul
echo Starting PSYCHO-PROFILE // ANALYZER Local Server on http://localhost:8080/ ...
start "" "http://localhost:8080/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1" -Port 8080
