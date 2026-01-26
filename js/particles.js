class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container with ID "${containerId}" not found`);
            return;
        }

        // Default options
        this.options = {
            particleCount: 30,
            minSize: 2,
            maxSize: 6,
            speed: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            minOpacity: 0.1,
            maxOpacity: 0.7,
            lineDistance: 100,
            lineColor: 'rgba(255, 255, 255, 0.2)',
            ...options
        };

        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.start();
        this.setupResizeHandler();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        this.ctx.scale(dpr, dpr);
        this.ctx.translate(rect.width / 2, rect.height / 2);
    }

    createParticles() {
        const { particleCount, minSize, maxSize, minOpacity, maxOpacity } = this.options;
        const rect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * (maxSize - minSize) + minSize;
            const x = (Math.random() - 0.5) * rect.width;
            const y = (Math.random() - 0.5) * rect.height;
            const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
            
            this.particles.push({
                x,
                y,
                size,
                speedX: (Math.random() - 0.5) * this.options.speed,
                speedY: (Math.random() - 0.5) * this.options.speed,
                opacity
            });
        }
    }

    updateParticles() {
        const rect = this.container.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (Math.abs(particle.x) > halfWidth - particle.size) {
                particle.speedX *= -1;
                particle.x = Math.sign(particle.x) * (halfWidth - particle.size);
            }
            
            if (Math.abs(particle.y) > halfHeight - particle.size) {
                particle.speedY *= -1;
                particle.y = Math.sign(particle.y) * (halfHeight - particle.size);
            }
        });
    }

    drawParticles() {
        const { color, lineDistance, lineColor } = this.options;
        const rect = this.container.getBoundingClientRect();
        
        // Clear canvas
        this.ctx.clearRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < lineDistance) {
                    const opacity = 1 - (distance / lineDistance);
                    this.ctx.strokeStyle = lineColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupResizeHandler() {
        const handleResize = () => {
            this.resizeCanvas();
            this.drawParticles();
        };
        
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Store the handler for cleanup
        this.handleResize = handleResize;
    }

    // Cleanup method to remove event listeners and stop animation
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.handleResize);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem('particles', {
        particleCount: 20,
        lineDistance: 150,
        color: 'rgba(100, 150, 255, 0.7)'
    });
});

export { ParticleSystem };
