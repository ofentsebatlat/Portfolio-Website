console.log('Theme script loaded');

// Simple helper function to select elements
function $(selector) {
    return document.querySelector(selector);
}

const THEME_KEY = 'portfolio-theme';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        if (this.themeToggle) {
            this.init();
        } else {
            console.error('Theme toggle element not found');
        }
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.DARK;
            this.setTheme(savedTheme, false);
        } catch (error) {
            console.warn('Failed to load theme from localStorage:', error);
            this.setTheme(THEMES.DARK, false);
        }
    }

    setTheme(theme, saveToStorage = true) {
        if (!Object.values(THEMES).includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        
        // Update ARIA attributes for accessibility
        this.themeToggle.setAttribute('aria-pressed', theme === THEMES.DARK ? 'false' : 'true');
        this.themeToggle.setAttribute('aria-label', `Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} mode`);
        
        if (saveToStorage) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            } catch (error) {
                console.warn('Failed to save theme to localStorage:', error);
            }
        }
        
        // Add transition class to body to smooth the transition
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES.DARK;
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        this.setTheme(newTheme);
    }

    setupEventListeners() {
        if (!this.themeToggle) {
            console.error('Theme toggle button not found');
            return;
        }
        
        // Add click event
        this.themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
        
        // Add keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Make it focusable for keyboard navigation
        this.themeToggle.setAttribute('tabindex', '0');
        this.themeToggle.setAttribute('role', 'switch');
        
        // Add animation class on first interaction
        const handleFirstInteraction = () => {
            this.themeToggle.classList.add('has-interaction');
            window.removeEventListener('click', handleFirstInteraction, { once: true });
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        
        console.log('Theme toggle event listeners set up');
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    try {
        window.themeManager = new ThemeManager();
        console.log('Theme manager initialized');
    } catch (error) {
        console.error('Failed to initialize theme manager:', error);
    }
});

// Add debug styles to help with visibility
const style = document.createElement('style');
style.textContent = `
    .theme-toggle {
        position: relative;
        width: 60px;
        height: 30px;
        border-radius: 15px;
        background: #444;
        cursor: pointer;
        transition: all 0.3s;
    }
    .theme-toggle-switch {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 26px;
        height: 26px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s;
    }
    [data-theme="light"] .theme-toggle .theme-toggle-switch {
        left: calc(100% - 28px);
    }
`;
document.head.appendChild(style);
