// Utility functions

/**
 * Debounce function to limit the rate at which a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function to limit the rate at which a function is called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Safe query selector with optional context
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context to search within
 * @returns {Element|null} Found element or null
 */
function $(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Safe query selector all with optional context
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context to search within
 * @returns {NodeList} Found elements
 */
function $$(selector, context = document) {
    return context.querySelectorAll(selector);
}

export { debounce, throttle, $, $$ };

// Add polyfill for older browsers
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}

// IntersectionObserver polyfill for older browsers
if (!window.IntersectionObserver) {
    // Load polyfill from CDN
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}
