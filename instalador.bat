@echo off
set "EXT_PATH=%~dp0"

echo Installing Doge Helper...

:: Intenta abrir en Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --load-extension="%EXT_PATH%\"
    goto exito
)

:: Intenta abrir en Brave
if exist "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe" (
    start "" "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe" --load-extension="%EXT_PATH%\"
    goto exito
)

:: Intenta abrir en Edge
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --load-extension="%EXT_PATH%\"
    goto exito
)

:exito
echo Extension loaded correctly.
pause