document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DETECCIÓN DE ENTORNO (Web vs Extensión)
    // ==========================================
    const isExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // ==========================================
    // 2. REFERENCIAS A ELEMENTOS DEL DOM
    // ==========================================
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    const themeLightBtn = document.getElementById('theme-light');
    const themeDarkBtn = document.getElementById('theme-dark');
    const colorDots = document.querySelectorAll('.color-dot');

    const btnTimePrev = document.getElementById('btn-time-prev');
    const btnTimeNext = document.getElementById('btn-time-next');
    const btnRemoveUd = document.getElementById('btn-remove-ud');

    // ==========================================
    // 3. REPRODUCCIÓN DE AUDIO HÍBRIDA & DEFENSIVA
    // ==========================================
    function playBarkSound() {
        try {
            let soundUrl = 'ladrito.mp3';

            if (isExtension && chrome.runtime && chrome.runtime.getURL) {
                soundUrl = chrome.runtime.getURL('ladrito.mp3');
            }

            const audio = new Audio(soundUrl);
            audio.currentTime = 0;

            // Fallback a .wav si el archivo .mp3 falla o no existe
            audio.onerror = () => {
                let fallbackUrl = 'ladrito.mp3';
                if (isExtension && chrome.runtime && chrome.runtime.getURL) {
                    fallbackUrl = chrome.runtime.getURL('ladrito.mp3');
                }
                const fallbackAudio = new Audio(fallbackUrl);
                fallbackAudio.play().catch(e => console.warn('Fallback de audio bloqueado:', e));
            };

            audio.play().catch(e => console.warn('Audio bloqueado por política del navegador:', e));
        } catch (err) {
            console.warn('Error al intentar reproducir audio:', err);
        }
    }

    // ==========================================
    // 4. FUNCIONES DE TEMAS Y COLOR DE ACENTO
    // ==========================================
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeDarkBtn?.classList.add('active');
            themeLightBtn?.classList.remove('active');
        } else {
            document.body.classList.remove('dark-mode');
            themeLightBtn?.classList.add('active');
            themeDarkBtn?.classList.remove('active');
        }
    }

    function applyAccentColor(color) {
        if (!color) return;

        document.documentElement.style.setProperty('--btn-bg', color);

        colorDots.forEach((dot) => {
            if (dot.getAttribute('data-color') === color) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function saveTheme(themeValue) {
        applyTheme(themeValue);

        if (isExtension) {
            chrome.storage.local.set({ theme: themeValue }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error al guardar el tema:', chrome.runtime.lastError);
                }
            });
        } else {
            localStorage.setItem('theme', themeValue);
        }
    }

    function saveAccentColor(colorValue) {
        applyAccentColor(colorValue);

        if (isExtension) {
            chrome.storage.local.set({ accentColor: colorValue }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error al guardar el color:', chrome.runtime.lastError);
                }
            });
        } else {
            localStorage.setItem('accentColor', colorValue);
        }
    }

    // ==========================================
    // 5. CARGA INICIAL DE PREFERENCIAS
    // ==========================================
    if (isExtension) {
        chrome.storage.local.get(['theme', 'accentColor'], (result) => {
            applyTheme(result.theme || 'light');
            applyAccentColor(result.accentColor || '#007bff');
        });
    } else {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedColor = localStorage.getItem('accentColor') || '#007bff';
        applyTheme(savedTheme);
        applyAccentColor(savedColor);
    }

    // ==========================================
    // 6. LÓGICA DE LA INTERFAZ Y ACCIONES
    // ==========================================

    // Control del Modal de Ajustes
    if (btnSettings && settingsModal) {
        btnSettings.addEventListener('click', () => {
            settingsModal.classList.add('show');
        });
    }

    if (btnCloseModal && settingsModal) {
        btnCloseModal.addEventListener('click', () => {
            settingsModal.classList.remove('show');
        });
    }

    // Cerrar modal al hacer clic en el fondo oscuro
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('show');
            }
        });
    }

    // Cambiar Tema
    if (themeLightBtn && themeDarkBtn) {
        themeLightBtn.addEventListener('click', () => saveTheme('light'));
        themeDarkBtn.addEventListener('click', () => saveTheme('dark'));
    }

    // Cambiar Color de Acento
    colorDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const selectedColor = e.currentTarget.getAttribute('data-color');
            if (selectedColor) {
                saveAccentColor(selectedColor);
            }
        });
    });

    // Lógica de manipulación de fechas (Shift Time)
    function shiftDateParam(offsetMs) {
        if (isExtension && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs[0]?.url) return;
                try {
                    const urlObj = new URL(tabs[0].url);
                    let currentDate = new Date();

                    if (urlObj.searchParams.has('date')) {
                        const parsed = new Date(urlObj.searchParams.get('date'));
                        if (!isNaN(parsed.getTime())) currentDate = parsed;
                    }

                    const newDate = new Date(currentDate.getTime() + offsetMs);
                    const formatted = newDate.toISOString().split('T')[0];
                    urlObj.searchParams.set('date', formatted);

                    chrome.tabs.update(tabs[0].id, { url: urlObj.toString() });
                } catch (e) {
                    console.error('Error procesando la URL de la pestaña:', e);
                }
            });
        } else {
            console.log(`[Modo Web Demo] Desplazamiento de fecha solicitado: ${offsetMs / ONE_DAY_MS} día(s).`);
        }
    }

    // Listeners de los botones principales con Sonido
    if (btnTimePrev) {
        btnTimePrev.addEventListener('click', () => {
            playBarkSound();
            shiftDateParam(-ONE_DAY_MS);
        });
    }

    if (btnTimeNext) {
        btnTimeNext.addEventListener('click', () => {
            playBarkSound();
            shiftDateParam(ONE_DAY_MS);
        });
    }

    if (btnRemoveUd) {
        btnRemoveUd.addEventListener('click', () => {
            playBarkSound();
            if (isExtension && chrome.tabs) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle_0ud' }).catch(err => {
                            console.warn('No se pudo enviar el mensaje a la pestaña activa:', err);
                        });
                    }
                });
            } else {
                console.log(' "Show 0 UD" executed.');
            }
        });
    }

});