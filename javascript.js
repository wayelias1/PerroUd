document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DOM ELEMENTS SELECTION
    // ==========================================
    // Settings & Modal Elements
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    const themeLightBtn = document.getElementById('theme-light');
    const themeDarkBtn = document.getElementById('theme-dark');
    const colorDots = document.querySelectorAll('.color-dot');

    // Extension Main Action Buttons
    const btnTimePrev = document.getElementById('btn-time-prev');
    const btnTimeNext = document.getElementById('btn-time-next');
    const btnRemoveUd = document.getElementById('btn-remove-ud');

    // Audio Element
    const barkAudio = new Audio(chrome.runtime.getURL('ladrito.mp3'));

    // ==========================================
    // 2. LOAD STORED PREFERENCES (THEME & COLOR)
    // ==========================================
    chrome.storage.local.get(['theme', 'accentColor'], (result) => {
        // Load Theme (Default: 'light')
        const currentTheme = result.theme || 'light';
        applyTheme(currentTheme);

        // Load Accent Color (Default: '#007bff')
        const currentColor = result.accentColor || '#007bff';
        applyAccentColor(currentColor);
    });

    // ==========================================
    // 3. MODAL CONTROLS (OPEN / CLOSE)
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

    // Close modal when clicking on the overlay background
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 4. THEME SWITCHING (LIGHT / DARK)
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

    // ==========================================
    // 5. ACCENT COLOR SELECTION
    // ==========================================
    colorDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const selectedColor = e.target.getAttribute('data-color');
            applyAccentColor(selectedColor);
            chrome.storage.local.set({ accentColor: selectedColor });
        });
    });

    function applyAccentColor(color) {
        // Set CSS custom property for color
        document.documentElement.style.setProperty('--btn-bg', color);

        // Update active class state on color dots
        colorDots.forEach((dot) => {
            if (dot.getAttribute('data-color') === color) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 6. HELPER FUNCTIONS FOR DOM INJECTION & AUDIO
    // ==========================================
    function playBarkSound() {
        barkAudio.currentTime = 0;
        barkAudio.play().catch((err) => console.log('Audio playback blocked or failed:', err));
    }

    function executeScriptOnActiveTab(funcToInject) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: funcToInject
                });
            }
        });
    }

    // ==========================================
    // 7. MAIN EXTENSION BUTTON ACTIONS
    // ==========================================

    // Time Navigation: Previous
    if (btnTimePrev) {
        btnTimePrev.addEventListener('click', () => {
            playBarkSound();
            executeScriptOnActiveTab(() => {
                // DOM interaction code on active tab
                //console.log('Doge Helper: Triggered Previous Time');
            });
        });
    }

    // Time Navigation: Next
    if (btnTimeNext) {
        btnTimeNext.addEventListener('click', () => {
            playBarkSound();
            executeScriptOnActiveTab(() => {
                // DOM interaction code on active tab
                //console.log('Doge Helper: Triggered Next Time');
            });
        });
    }

    // Main Action: Show / Remove 0 UD
    if (btnRemoveUd) {
        btnRemoveUd.addEventListener('click', () => {
            playBarkSound();
            executeScriptOnActiveTab(() => {
                // DOM interaction code on active tab
                //console.log('Doge Helper: Appeared 0 UD');
            });
        });
    }
});