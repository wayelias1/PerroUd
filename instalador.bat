@echo off
:: Solicitar permisos de Administrador si no los tiene
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Instalando Doge Helper para todos los perfiles...

:: ID de tu extensión obtenida al empaquetarla
set "EXTENSION_ID=ndhlbdkodheoiiomjcgojdgjcgppddnl"
:: URL de tu updates.xml en GitHub Pages
set "UPDATE_URL=https://wayelias1.github.io/PerroUd/updates.xml"

:: Registrar en Google Chrome
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\Extensions\%EXTENSION_ID%" /v "update_url" /t REG_SZ /d "%UPDATE_URL%" /f

:: Registrar en Brave Browser
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\BraveSoftware\Brave-Browser\Extensions\%EXTENSION_ID%" /v "update_url" /t REG_SZ /d "%UPDATE_URL%" /f

:: Registrar en Microsoft Edge
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Edge\Extensions\%EXTENSION_ID%" /v "update_url" /t REG_SZ /d "%UPDATE_URL%" /f

echo.
echo ¡Instalacion completada!
echo Abre tu navegador y acepta el mensaje de confirmacion.
pause