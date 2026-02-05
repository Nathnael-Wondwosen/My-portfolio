(() => {
    const doc = document;
    // Make sure the page stays hidden until we remove the loader
    doc.documentElement.classList.add('preloading');

    // Build preloader immediately so it can paint before content
    const preloader = doc.createElement('div');
    preloader.className = 'preloader';

    const loader = doc.createElement('div');
    loader.className = 'loader';

    for (let i = 0; i < 3; i++) {
        const ring = doc.createElement('div');
        ring.className = 'loader-ring';
        loader.appendChild(ring);
    }

    const text = doc.createElement('div');
    text.className = 'loader-text';
    text.textContent = 'NATI.W';
    loader.appendChild(text);

    const progress = doc.createElement('div');
    progress.className = 'loader-progress';
    const progressBar = doc.createElement('div');
    progressBar.className = 'loader-progress-bar';
    progress.appendChild(progressBar);
    loader.appendChild(progress);

    preloader.appendChild(loader);

    const attach = () => doc.body.appendChild(preloader);
    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', attach, { once: true });
    } else {
        attach();
    }

    window.addEventListener('load', () => {
        setTimeout(() => hidePreloader(), 250);
    });

    // Fallback: hide preloader if load is slow or an asset hangs
    const fallbackTimeout = setTimeout(() => hidePreloader(), 4000);

    function hidePreloader() {
        if (!preloader.parentNode) return;
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.style.opacity = '0';
        clearTimeout(fallbackTimeout);
        setTimeout(() => {
            preloader.remove();
            doc.documentElement.classList.remove('preloading');
        }, 500);
    }
})();

