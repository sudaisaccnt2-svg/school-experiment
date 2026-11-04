@echo off
rem Starts the Atoms 3D app (all films, games and AR) for iPads / VR headsets on this Wi-Fi.
cd /d "%~dp0"
if not exist certs\server.crt python scripts\make_cert.py
python web\serve.py
pause
