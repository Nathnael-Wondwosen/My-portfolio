class ParticleNetwork {
    constructor() {
      this.container = document.querySelector('.particle-container') || document.body;
      this.particles = [];
      this.connections = [];
      this.maxDistance = 150;
      this.connectionOpacity = 0.3;
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      
      this.init();
    }
  
    init() {
      this.createCanvas();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }
  
    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      Object.assign(this.canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      });
      this.container.prepend(this.canvas);
      this.resizeObserver.observe(this.container);
    }
  
    createParticles() {
      // Clear existing
      this.particles = [];
      
      // Calculate particle count based on container size
      const area = this.container.clientWidth * this.container.clientHeight;
      this.particleCount = Math.min(100, Math.floor(area / 4000));
      
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          hue: 200 + Math.random() * 40,
          connections: 0
        });
      }
    }
  
    bindEvents() {
      window.addEventListener('resize', () => this.handleResize());
      
      // Mouse interaction
      this.container.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX - this.container.getBoundingClientRect().left;
        this.mouseY = e.clientY - this.container.getBoundingClientRect().top;
      });
      
      this.container.addEventListener('mouseleave', () => {
        this.mouseX = null;
        this.mouseY = null;
      });
    }
  
    handleResize() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.createParticles();
    }
  
    updateParticles() {
      for (const p of this.particles) {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check with bounce
        if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
        p.x = Math.max(0, Math.min(this.canvas.width, p.x));
        p.y = Math.max(0, Math.min(this.canvas.height, p.y));
        
        // Mouse interaction
        if (this.mouseX !== null && this.mouseY !== null) {
          const dx = p.x - this.mouseX;
          const dy = p.y - this.mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const force = (120 - distance) / 120;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3;
            p.y += Math.sin(angle) * force * 3;
          }
        }
        
        // Reset connection count
        p.connections = 0;
      }
    }
  
    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw connections first (behind particles)
      this.drawConnections();
      
      // Draw particles
      for (const p of this.particles) {
        const gradient = this.ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        );
        
        // Particle glow effect
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 80%, 0.8)`);
        gradient.addColorStop(0.7, `hsla(${p.hue}, 100%, 70%, 0.4)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Connection points glow
        if (p.connections > 0) {
          const glowSize = p.size * (1 + p.connections * 0.2);
          const glowGradient = this.ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowSize
          );
          glowGradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 0.3)`);
          glowGradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
          
          this.ctx.fillStyle = glowGradient;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  
    drawConnections() {
      // Spatial partitioning for performance
      const gridSize = this.maxDistance;
      const grid = {};
      
      // Place particles in grid cells
      this.particles.forEach((p, i) => {
        const cellX = Math.floor(p.x / gridSize);
        const cellY = Math.floor(p.y / gridSize);
        const key = `${cellX},${cellY}`;
        
        if (!grid[key]) grid[key] = [];
        grid[key].push(i);
      });
      
      // Check neighboring cells for connections
      this.ctx.beginPath();
      
      for (const key in grid) {
        const [cellX, cellY] = key.split(',').map(Number);
        
        // Check current cell and adjacent cells
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            const neighborKey = `${cellX + x},${cellY + y}`;
            if (!grid[neighborKey]) continue;
            
            // Check particles in these cells
            for (const i of grid[key]) {
              for (const j of grid[neighborKey]) {
                if (i >= j) continue; // Avoid duplicate checks
                
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSq = dx * dx + dy * dy;
                
                if (distanceSq < this.maxDistance * this.maxDistance) {
                  const distance = Math.sqrt(distanceSq);
                  const opacity = this.connectionOpacity * (1 - distance / this.maxDistance);
                  
                  if (opacity > 0.05) {
                    // Draw connection
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    
                    // Update connection counts
                    p1.connections++;
                    p2.connections++;
                  }
                }
              }
            }
          }
        }
      }
      
      // Style and stroke all connections at once
      this.ctx.strokeStyle = `rgba(100, 200, 255, ${this.connectionOpacity})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();
    }
  
    animate() {
      this.updateParticles();
      this.drawParticles();
      requestAnimationFrame(() => this.animate());
    }
  
    destroy() {
      this.resizeObserver.disconnect();
      this.canvas.remove();
    }
  }
  
  // Initialize
  const particleNetwork = new ParticleNetwork();