document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. CARGA DEL AUDIO (LADRIDO)
    // ==========================================
    const audioLadrido = new Audio(chrome.runtime.getURL('ladrito.mp3'));

    function reproducirLadrido() {
        audioLadrido.currentTime = 0;
        audioLadrido.play().catch(error => {
            console.error("Error al reproducir el ladrido:", error);
        });
    }

    // ==========================================
    // 1. REFERENCIAS A ELEMENTOS DEL DOM
    // ==========================================
    const modal = document.getElementById('modalSettings');
    const btnSettings = document.getElementById('btnSettings');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnGuardarConfig = document.getElementById('btnGuardarConfig');

    const btnModeLight = document.getElementById('btnModeLight');
    const btnModeDark = document.getElementById('btnModeDark');
    const colorDots = document.querySelectorAll('.color-dot');

    const btnTimeLeft = document.getElementById('btnTimeLeft');
    const btnTimeRight = document.getElementById('btnTimeRight');
    const btnIniciar = document.getElementById('btnIniciar');

    const ONE_DAY_MS = 86400000;

    let currentTheme = 'light';
    let currentColor = '#007bff';

    // ==========================================
    // 2. CARGAR Y APLICAR CONFIGURACIÓN GUARDADA
    // ==========================================
    if (localStorage.getItem('doggy_theme') === 'dark') {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    if (localStorage.getItem('doggy_color')) {
        applyColor(localStorage.getItem('doggy_color'));
    }

    // ==========================================
    // 3. EVENTOS DEL MODAL DE CONFIGURACIÓN
    // ==========================================
    btnSettings.addEventListener('click', () => {
        modal.style.setProperty('display', 'flex', 'important');
    });

    btnCloseModal.addEventListener('click', () => {
        modal.style.setProperty('display', 'none', 'important');
    });

    btnModeLight.addEventListener('click', () => applyTheme('light'));
    btnModeDark.addEventListener('click', () => applyTheme('dark'));

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.getAttribute('data-color');
            applyColor(color);
        });
    });

    btnGuardarConfig.addEventListener('click', () => {
        localStorage.setItem('doggy_theme', currentTheme);
        localStorage.setItem('doggy_color', currentColor);
        modal.style.setProperty('display', 'none', 'important');
    });

    // ==========================================
    // 4. FUNCIONES AUXILIARES DE TEMA Y COLOR
    // ==========================================
    function applyTheme(theme) {
        currentTheme = theme;
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            btnModeDark.classList.add('active');
            btnModeLight.classList.remove('active');
        } else {
            document.body.classList.remove('dark-mode');
            btnModeLight.classList.add('active');
            btnModeDark.classList.remove('active');
        }
    }

    function applyColor(color) {
        currentColor = color;
        document.documentElement.style.setProperty('--btn-bg', color);

        colorDots.forEach(dot => {
            if (dot.getAttribute('data-color') === color) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        const activeThemeBtn = document.querySelector('.switch-btn.active');
        if (activeThemeBtn) {
            activeThemeBtn.style.setProperty('background-color', color, 'important');
        }
    }

    // ==========================================
    // 5. NAVEGACIÓN Y MANIPULACIÓN DE &date=
    // ==========================================
    function shiftDateParam(millisecondsChange) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || !tabs[0] || !tabs[0].url) return;

            const currentUrl = tabs[0].url;
            const dateRegex = /(&date=)(\d+)/;
            const match = currentUrl.match(dateRegex);

            if (match) {
                const currentTimestamp = parseInt(match[2], 10);
                const newTimestamp = currentTimestamp + millisecondsChange;
                const newUrl = currentUrl.replace(dateRegex, `$1${newTimestamp}`);

                // Actualiza la URL y fuerza la recarga de la página
                chrome.tabs.update(tabs[0].id, { url: newUrl }, () => {
                    chrome.tabs.reload(tabs[0].id);
                });
            } else {
                console.warn('El parámetro &date= no existe en la URL actual.');
            }
        });
    }

    btnTimeLeft.addEventListener('click', () => {
        shiftDateParam(-ONE_DAY_MS);
    });

    btnTimeRight.addEventListener('click', () => {
        shiftDateParam(ONE_DAY_MS);
    });

    // ==========================================
    // 6. ACCIÓN PARA EL BOTÓN UD (BOTÓN INICIAR)
    // ==========================================
    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            reproducirLadrido();
            console.log('Botón UD presionado');
        });
    }
});