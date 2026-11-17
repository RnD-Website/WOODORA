@echo off
title WOODORA local server
cd /d "%~dp0"
set PORT=8080
echo.
echo  WOODORA - starting local server on http://localhost:%PORT%
echo  Keep this window open while you browse. Close it to stop the server.
echo.

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/index.html"
  python -m http.server %PORT%
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/index.html"
  py -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/index.html"
  npx --yes http-server -p %PORT% -c-1
  goto :eof
)

echo  Could not find Python or Node.js on this computer.
echo  Install one of them (python.org or nodejs.org), then run this file again.
echo  Or simply double-click index.html to open the site without a server.
pause
