@echo off
:: Solicitar permisos de Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador para desinstalar...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Eliminando Doge Helper del sistema...

set "EXTENSION_ID=ndhlbdkodheoiiomjcgojdgjcgppddnl"

:: Eliminar clave del Registro de Google Chrome
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\Extensions\%EXTENSION_ID%" /f >nul 2>&1

:: Eliminar clave del Registro de Brave Browser
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\BraveSoftware\Brave-Browser\Extensions\%EXTENSION_ID%" /f >nul 2>&1

:: Eliminar clave del Registro de Microsoft Edge
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Edge\Extensions\%EXTENSION_ID%" /f >nul 2>&1

echo.
echo ¡Doge Helper ha sido eliminado del registro correctamente!
pause