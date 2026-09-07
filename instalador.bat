@echo off
title Instalador Doge Helper
color 0A
echo ========================================================
echo           Instalando Doge Helper en Chrome...
echo ========================================================
echo.

:: Detectar la ruta actual de la carpeta
set EXT_PATH=%~dp0
set EXT_PATH=%EXT_PATH:~0,-1%

:: Ejecutar Chrome cargando la extensión automáticamente
start chrome --load-extension="%EXT_PATH%"

echo Extensión cargada con exito.
timeout /t 3 >nul
exit