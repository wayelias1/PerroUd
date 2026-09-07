@echo off
setlocal
set "TARGET_DIR=%LocalAppData%\DogeHelper"

echo Installing Doge Helper...

:: Create target directory and copy extension files
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
xcopy "%~dp0*" "%TARGET_DIR%\" /E /Y /I >nul

echo Files successfully copied to: %TARGET_DIR%
echo.
echo Opening your browser...

:: Try opening Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions"
    goto instructions
)

:: Try opening Brave Browser
if exist "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe" (
    start "" "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe" "brave://extensions"
    goto instructions
)

:: Try opening Microsoft Edge
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "edge://extensions"
    goto instructions
)

:instructions
echo ========================================================
echo FINAL STEPS TO ENABLE THE EXTENSION:
echo 1. In the browser window that just opened,
echo    ENABLE "Developer mode" (top-right toggle).
echo 2. Click on "Load unpacked".
echo 3. Select the following folder: %TARGET_DIR%
echo ========================================================
echo.
pause