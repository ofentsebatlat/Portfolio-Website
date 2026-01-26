// Import modules
import { debounce, $, $$ } from '/js/utils.js';
import { ThemeManager } from '/js/theme.js';
import { AnimationManager } from '/js/animations.js';

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize animation manager
    const animationManager = new AnimationManager();

    // Mobile menu toggle
    function setupMobileMenu() {
        const menuToggle = $('.mobile-menu-toggle');
        const navLinks = $('#navLinks');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', 
                    menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            });
            
            // Close menu when clicking on a nav link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    // Profile image handling
    function setupProfileImage() {
        const fileInput = $('#profileFileInput');
        const heroImg = $('#heroProfileImg');
        const aboutImg = $('#aboutProfileImg');
        const STORAGE_KEY = 'profileImage';

        function setProfileImage(dataUrl) {
            if (heroImg) heroImg.src = dataUrl;
            if (aboutImg) aboutImg.src = dataUrl;
        }

        function removeProfileImage() {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.warn('Failed to remove image from localStorage:', error);
            }
            if (heroImg) heroImg.src = '';
            if (aboutImg) aboutImg.src = '';
        }

        // Trigger file chooser when clicking profile images
        [heroImg, aboutImg].forEach(img => {
            if (img) {
                img.addEventListener('click', () => fileInput && fileInput.click());
                img.setAttribute('tabindex', '0');
                img.setAttribute('role', 'button');
                img.setAttribute('aria-label', 'Change profile image');
            }
        });

        // Handle file selection
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file || !file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result;
                    setProfileImage(dataUrl);
                    try {
                        localStorage.setItem(STORAGE_KEY, dataUrl);
                    } catch (error) {
                        console.warn('Failed to save image to localStorage:', error);
                    }
                };
                reader.onerror = () => console.error('Error reading file');
                reader.readAsDataURL(file);
            });
        }

        // Expose functions to global scope (for buttons in HTML)
        window.removeProfileImage = removeProfileImage;
        window.triggerFileInput = () => fileInput && fileInput.click();

        // Load saved image if present
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setProfileImage(saved);
        } catch (error) {
            console.warn('Failed to load image from localStorage:', error);
        }
    }

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = $(targetId);
            if (!target) return;
            
            e.preventDefault();
            
            // Close mobile menu if open
            const navLinks = $('#navLinks');
            const menuToggle = $('.mobile-menu-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, '', targetId);
        });
    }

    // Initialize all components
    setupMobileMenu();
    setupProfileImage();
    setupSmoothScrolling();

    // Add loaded class to body when everything is ready
    document.body.classList.add('loaded');
});
