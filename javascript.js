document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONSTANTS AND DOM ELEMENTS
    // ==========================================
    const ONE_DAY_MS = 86400000;

    // Settings Elements
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    // Theme & Color Elements
    const themeLightBtn = document.getElementById('theme-light');
    const themeDarkBtn = document.getElementById('theme-dark');
    const colorDots = document.querySelectorAll('.color-dot');

    // Main Action Buttons
    const btnTimePrev = document.getElementById('btn-time-prev');
    const btnTimeNext = document.getElementById('btn-time-next');
    const btnRemoveUd = document.getElementById('btn-remove-ud');

    // Audio Instance
    const barkAudio = new Audio(chrome.runtime.getURL('ladrito.mp3'));

    // ==========================================
    // 2. LOAD PREFERENCES FROM STORAGE
    // ==========================================
    chrome.storage.local.get(['theme', 'accentColor'], (result) => {
        const currentTheme = result.theme || 'light';
        applyTheme(currentTheme);

        const currentColor = result.accentColor || '#007bff';
        applyAccentColor(currentColor);
    });

    // ==========================================
    // 3. MODAL CONTROLS
    // ==========================================
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && settingsModal) {
        closeModalBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 4. THEME & ACCENT COLOR LOGIC
    // ==========================================
    if (themeLightBtn && themeDarkBtn) {
        themeLightBtn.addEventListener('click', () => {
            applyTheme('light');
            chrome.storage.local.set({ theme: 'light' });
        });

        themeDarkBtn.addEventListener('click', () => {
            applyTheme('dark');
            chrome.storage.local.set({ theme: 'dark' });
        });
    }

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

    colorDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const selectedColor = e.target.getAttribute('data-color');
            applyAccentColor(selectedColor);
            chrome.storage.local.set({ accentColor: selectedColor });
        });
    });

    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--btn-bg', color);

        colorDots.forEach((dot) => {
            if (dot.getAttribute('data-color') === color) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 5. AUXILIARY FUNCTIONS (AUDIO & TABS)
    // ==========================================
    function playBarkSound() {
        try {
            const audioUrl = chrome.runtime.getURL('ladrito.mp3');
            const barkAudio = new Audio(audioUrl);
            barkAudio.currentTime = 0;
            barkAudio.play().catch((err) => {
                console.warn('Playback prevented or file not found:', err);
            });
        } catch (e) {
            console.error('Error getting runtime URL for audio:', e);
        }
    }

    function shiftDateParam(millisecondsChange) {
        playBarkSound();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || !tabs[0] || !tabs[0].url) return;

            const currentUrl = tabs[0].url;
            const dateRegex = /(&date=)(\d+)/;
            const match = currentUrl.match(dateRegex);

            if (match) {
                const currentTimestamp = parseInt(match[2], 10);
                const newTimestamp = currentTimestamp + millisecondsChange;
                const newUrl = currentUrl.replace(dateRegex, `$1${newTimestamp}`);

                chrome.tabs.update(tabs[0].id, { url: newUrl }, () => {
                    chrome.tabs.reload(tabs[0].id);
                });
            } else {
                console.warn('Parameter &date= not found in the current URL.');
            }
        });
    }

    // ==========================================
    // 6. MAIN BUTTON LISTENERS
    // ==========================================
    if (btnTimePrev) {
        btnTimePrev.addEventListener('click', () => shiftDateParam(-ONE_DAY_MS));
    }

    if (btnTimeNext) {
        btnTimeNext.addEventListener('click', () => shiftDateParam(ONE_DAY_MS));
    }

    if (btnRemoveUd) {
        btnRemoveUd.addEventListener('click', () => {
            playBarkSound();
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.id) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: () => {
                            console.log('Doge Helper: Show 0 UD triggered');
                        }
                    });
                }
            });
        });
    }
});