/**
 * 3D Software ocean effect with Canvas2D
 * You can change properties under comment "Effect properties"
 */

// Init Context
let c = document.createElement("canvas");
let postctx = document.createElement("canvas");
let canvasContainer = document.querySelector('.canvas-container');
canvasContainer.appendChild(c);
canvasContainer.appendChild(postctx.canvas);

let ctx = c.getContext("2d");
postctx = postctx.getContext("2d");
let canvas = c;
let vertices = [];

// Set canvas size to window size
function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    [c, postctx.canvas].forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    });
}

// Initial resize
resizeCanvas();

// Add resize listener
window.addEventListener('resize', resizeCanvas);

// Optimize for mobile
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        vertexCount = 3500;
        vertexSize = 2;
        oceanWidth = 102; // Reduced ocean width for mobile
        gridSize = 16;    // Smaller grid size for mobile
    } else {
        vertexCount = 7000;
        vertexSize = 3;
        oceanWidth = 204;
        gridSize = 32;
    }
}

// Call optimize function on load and resize
optimizeForMobile();
window.addEventListener('resize', optimizeForMobile);

// Effect Properties
let vertexCount = 7000;    // Number of points in the ocean
let vertexSize = 3;        // Size of each point
let oceanWidth = 204;      // Width of the ocean grid
let oceanHeight = -80;     // Vertical offset
let gridSize = 32;         // Space between points
let waveSize = 16;         // Height of waves
let perspective = 100;     // 3D perspective value

// Common variables
let depth = (vertexCount / oceanWidth) * gridSize;
let frame = 0;
let { sin, cos, tan, PI } = Math;

// Add touch event handling
function handleTouchMove(event) {
    // Prevent default only if touching the canvas
    if (event.target.tagName.toLowerCase() === 'canvas') {
        event.preventDefault();
    }
}

document.addEventListener('touchmove', handleTouchMove, { passive: false });

// Memory management - clean up when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        animationFrameId = requestAnimationFrame(loop);
    }
});

// Add animation frame ID tracking
let animationFrameId;

// Performance monitoring
let fps = 60;
let frameCount = 0;
let lastTime = performance.now();

// FPS throttling for mobile
function updateFPS(timestamp) {
    frameCount++;
    if (timestamp - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = timestamp;
        
        // Reduce complexity if FPS drops
        if (fps < 30 && window.innerWidth < 768) {
            vertexCount = Math.max(1500, vertexCount - 500);
            waveSize = Math.max(8, waveSize - 2);
        }
    }
}

// Debounce resize handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedResize = debounce(() => {
    resizeCanvas();
    optimizeForMobile();
}, 250);

window.removeEventListener('resize', resizeCanvas);
window.removeEventListener('resize', optimizeForMobile);
window.addEventListener('resize', debouncedResize);

// Battery API optimization
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2) {
                vertexCount = Math.min(vertexCount, 2000);
                waveSize = Math.min(waveSize, 8);
            }
        });
    });
}

// Render loop
let oldTimeStamp = performance.now();
let loop = (timeStamp) => {
    updateFPS(timeStamp);
    oldTimeStamp = timeStamp;
    
    // Store animation frame ID
    animationFrameId = requestAnimationFrame(loop);
};

// Generating dots
for (let i = 0; i < vertexCount; i++) {
  let x = i % oceanWidth;
  let y = 0;
  let z = (i / oceanWidth) >> 0;
  let offset = oceanWidth / 2;
  vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize]);
}

loop(performance.now());
document.addEventListener("DOMContentLoaded", function () {
    const typingH1 = document.getElementById("typing-h1");
    const typingH2 = document.getElementById("typing-h2");
    const typingH3 = document.getElementById("typing-h3");

    const textH1 = "Hello, Welcome";
    const textH2 = "This Is Our Testing Website";
    const textH3 = "Its Me Talking Join Us Now";

    // Add the new welcome-text class
    typingH1.classList.add('welcome-text');
    
    // Split text into spans for individual letter animation
    function createLetterSpans(element, text) {
        element.innerHTML = text.split('').map((char, i) => 
            `<span style="animation-delay: ${i * 0.1}s">${char}</span>`
        ).join('');
    }

    // Initialize texts with fade-in effect
    function initializeText(element, text, delay) {
        setTimeout(() => {
            element.style.opacity = '0';
            createLetterSpans(element, text);
            element.style.transition = 'opacity 1s ease';
            element.style.opacity = '1';
        }, delay);
    }

    // Initialize all texts with delays
    initializeText(typingH1, textH1, 0);
    initializeText(typingH2, textH2, 1000);
    initializeText(typingH3, textH3, 2000);

    // Add hover effect for interactive elements
    [typingH1, typingH2, typingH3].forEach(element => {
        element.addEventListener('mouseover', () => {
            element.style.transform = 'scale(1.05)';
            element.style.transition = 'transform 0.3s ease';
        });

        element.addEventListener('mouseout', () => {
            element.style.transform = 'scale(1)';
        });
    });
});

// - Noel Delgado | @pixelia_me

const nodes = [].slice.call(document.querySelectorAll("li"), 0);
const directions = { 0: "top", 1: "right", 2: "bottom", 3: "left" };
const classNames = ["in", "out"]
  .map((p) => Object.values(directions).map((d) => `${p}-${d}`))
  .reduce((a, b) => a.concat(b));

const getDirectionKey = (ev, node) => {
  const { width, height, top, left } = node.getBoundingClientRect();
  const l = ev.pageX - (left + window.pageXOffset);
  const t = ev.pageY - (top + window.pageYOffset);
  const x = l - (width / 2) * (width > height ? height / width : 1);
  const y = t - (height / 2) * (height > width ? width / height : 1);
  return Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
};

class Item {
  constructor(element) {
    this.element = element;
    this.element.addEventListener("mouseover", (ev) => this.update(ev, "in"));
    this.element.addEventListener("mouseout", (ev) => this.update(ev, "out"));
  }

  update(ev, prefix) {
    this.element.classList.remove(...classNames);
    this.element.classList.add(
      `${prefix}-${directions[getDirectionKey(ev, this.element)]}`
    );
  }
}

nodes.forEach((node) => new Item(node));






