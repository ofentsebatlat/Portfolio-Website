import { debounce, $, $$ } from './utils.js';

class AnimationManager {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupResizeHandler();
    }

    setupIntersectionObservers() {
        // Options for the Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        // Create observer for skill bars
        this.skillBarsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = progress + '%';
                }
            });
        }, { threshold: 0.5 });

        // Create observer for fade-in elements
        this.fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all skill bars
        $$('.skill-progress').forEach(bar => {
            bar.style.width = '0%';
            this.skillBarsObserver.observe(bar);
        });

        // Observe all elements with animation classes
        const animatedElements = $$('.skill-card, .project-card, .achievement-card, .timeline-item');
        animatedElements.forEach(el => {
            el.classList.add('will-animate');
            this.fadeInObserver.observe(el);
        });
    }

    setupScrollAnimations() {
        // Debounced scroll handler for nav highlighting
        const handleScroll = debounce(() => {
            const sections = $$('section');
            const navLinks = $$('.nav-links a');
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = '#' + section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === current) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupResizeHandler() {
        // Debounced resize handler
        const handleResize = debounce(() => {
            // Handle any responsive layout changes here
        }, 250);

        window.addEventListener('resize', handleResize, { passive: true });
    }

    // Cleanup method to disconnect observers
    cleanup() {
        if (this.skillBarsObserver) this.skillBarsObserver.disconnect();
        if (this.fadeInObserver) this.fadeInObserver.disconnect();
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

export { AnimationManager };
