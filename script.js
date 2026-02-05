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
    
    // Wait a bit for DOM to be fully ready, then setup pie chart
    setTimeout(() => {
        setupPieChart();
    }, 100);

    // Add loaded class to body when everything is ready
    document.body.classList.add('loaded');
});

// Pie Chart functionality
function setupPieChart() {
    console.log('Setting up pie chart...');
    
    const canvas = document.getElementById('programmingChart');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    console.log('Canvas found:', canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    console.log('Canvas context obtained:', ctx);
    
    // Set canvas size explicitly
    canvas.width = 250;
    canvas.height = 250;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    console.log('Center:', centerX, centerY);
    console.log('Radius:', radius);
    
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Data for the pie chart
    const data = [
        { label: 'Visual Basic', value: 20, color: '#2563eb' },
        { label: 'Java', value: 18, color: '#f59e0b' },
        { label: 'JavaScript', value: 22, color: '#10b981' },
        { label: 'Python', value: 25, color: '#8b5cf6' },
        { label: 'Django', value: 8, color: '#ef4444' },
        { label: 'React', value: 7, color: '#06b6d4' }
    ];
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    console.log('Data total:', total);
    
    // Draw pie chart
    let currentAngle = -Math.PI / 2; // Start from top
    
    data.forEach((segment, index) => {
        const sliceAngle = (segment.value / total) * 2 * Math.PI;
        
        console.log(`Drawing segment ${index}: ${segment.label}, angle: ${sliceAngle}`);
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    console.log('Pie chart drawn successfully');
    
    // Add hover effect
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    });
}
