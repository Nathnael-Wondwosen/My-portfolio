class HeroBackground {
    constructor() {
        // Check if the header carousel exists
        const headerCarousel = document.querySelector('.header-carousel');
        if (!headerCarousel) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha
        headerCarousel.prepend(this.canvas);

        // Styling
        Object.assign(this.canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '0'
        });

        // Animation properties with original particle count
        this.particles = [];
        this.numParticles = window.innerWidth < 768 ? 120 : 180; // Restored closer to original count
        this.mouseX = null;
        this.mouseY = null;
        this.mouseRadius = 100;

        // Performance optimizations
        this.connectionDistance = window.innerWidth < 768 ? 60 : 80; // Reduced connection distance
        this.lastFrame = 0;
        this.fpsInterval = 1000 / 30; // Cap at 30 FPS for better performance

        // Initialize the background
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.lastFrame = performance.now();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    createParticles() {
        this.particles = Array.from({ length: this.numParticles }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 1.5 + 0.5, // Smaller particles
            speedX: (Math.random() - 0.5) * 0.5, // Slower movement
            speedY: (Math.random() - 0.5) * 0.5,
            hue: Math.random() * 40 + 190, // Keep existing blue range
            opacity: Math.random() * 0.3 + 0.2
        }));
    }

    bindEvents() {
        // Use debounced resize for better performance
        const debouncedResize = this.debounce(() => this.resize(), 250);
        window.addEventListener('resize', debouncedResize);

        // Throttled mouse events
        const throttledMouseMove = this.throttle((e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        }, 50); // Only update mouse position every 50ms

        window.addEventListener('mousemove', throttledMouseMove);
        window.addEventListener('mouseout', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }

    // Utility functions for performance
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    drawBackground() {
        // Simplified background with fewer gradients
        const baseGradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.width
        );

        baseGradient.addColorStop(0, 'rgba(0, 27, 68, 1)');
        baseGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        this.ctx.fillStyle = baseGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Bottom darkening gradient
        const bottomGradient = this.ctx.createLinearGradient(
            0, this.height * 0.5,
            0, this.height
        );

        bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        bottomGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

        this.ctx.fillStyle = bottomGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    updateParticles() {
        const time = performance.now() * 0.0005; // Slower animation
        const mouseForce = this.mouseX !== null ? 2 : 0;

        for (const particle of this.particles) {
            // Basic movement
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Simplified wave motion
            particle.y += Math.sin(time + particle.x * 0.01) * 0.3;

            // Mouse interaction (only if mouse is present)
            if (mouseForce && this.mouseX !== null) {
                const dx = particle.x - this.mouseX;
                const dy = particle.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouseRadius) {
                    const force = (this.mouseRadius - distance) / this.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    particle.x += Math.cos(angle) * force * mouseForce;
                    particle.y += Math.sin(angle) * force * mouseForce;
                }
            }

            // Simple boundary checking
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
        }
    }

    drawParticles() {
        // Draw directly to main canvas for better performance
        this.ctx.beginPath();

        // Draw particles
        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
            this.ctx.fill();
        }

        // Draw connections between all particles (original behavior)
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;

        // Draw connections between all particles
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    // Calculate opacity based on distance
                    const opacity = 0.2 * (1 - distance / this.connectionDistance);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;

                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate(timestamp) {
        requestAnimationFrame((ts) => this.animate(ts));

        // Throttle rendering for better performance
        if (timestamp - this.lastFrame < this.fpsInterval) return;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.updateParticles();
        this.drawParticles();
        this.lastFrame = timestamp;
    }
}







