@echo off
title RupyaNivesh Dev Server
cd /d "%~dp0"
echo Starting RupyaNivesh...
start "" "chrome.exe" "http://localhost:3000"
npm run dev
pause
