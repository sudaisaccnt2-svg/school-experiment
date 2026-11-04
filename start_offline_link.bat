@echo off
rem Gives the Atoms 3D app (all films, games and AR) a trusted https:// link (Cloudflare quick tunnel, no account) so an iPad can
rem install it for offline use. Needs internet on this PC. The link is public while this window is open.
cd /d "%~dp0"
powershell -NoProfile -Command "if (-not (Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue)) { Start-Process -FilePath 'start_ipad_server.bat' -WorkingDirectory '%~dp0' }"
timeout /t 3 >nul
echo.
echo   Starting the https link... look for the line with  https://....trycloudflare.com
echo   Open that link on the iPad in Safari, wait for "offline" in the badge, then Share ^> Add to Home Screen.
echo.
tools\cloudflared.exe tunnel --no-autoupdate --url http://127.0.0.1:8001
pause
