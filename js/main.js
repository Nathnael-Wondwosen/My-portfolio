(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();

    // Navbar handling
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Active link handling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', e => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    $(document).click(function(event) {
        var clickover = $(event.target);
        var isOpened = $(".navbar-collapse").hasClass("show");
        if (isOpened && !clickover.hasClass("navbar-toggler") && !clickover.closest('.navbar-collapse').length) {
            $(".navbar-toggler").click();
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 500,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                nav: false, // Hide navigation on mobile
                dots: true // Show dots on mobile
            },
            768: {
                nav: true // Show navigation on desktop
            }
        }
    });

    // Enable touch scrolling
    $(document).ready(function() {
        $('body').css('touch-action', 'auto');
        $('.owl-carousel').on('touchmove', function(e) {
            e.stopPropagation();
        });
    });

    // attractions carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Add dynamic particles on hover
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('mouseover', (e) => {
            const rect = link.getBoundingClientRect();
            const particle = document.createElement('div');
            particle.className = 'nav-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #4be1ff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transform: translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px);
            `;
            link.appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.style.transition = 'all 0.6s ease-out';
                particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
                particle.style.opacity = '0';
            });
            
            setTimeout(() => particle.remove(), 600);
        });
    });

    // 3D card effect based on mouse movement
    document.addEventListener('DOMContentLoaded', function() {
        const card = document.querySelector('.about-img-card');
        if (!card) return;

        let bounds;

        function rotateToMouse(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            }
            const distance = Math.sqrt(center.x**2 + center.y**2);
            
            card.style.transform = `
                perspective(1000px)
                scale3d(1.05, 1.05, 1.05)
                rotate3d(
                    ${center.y / 100},
                    ${-center.x / 100},
                    0,
                    ${Math.log(distance) * 2}deg
                )
            `;
        }

        function removeRotation(e) {
            card.style.transform = '';
            card.style.background = '';
        }

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            document.addEventListener('mousemove', rotateToMouse);
        });

        card.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', rotateToMouse);
            removeRotation();
        });
    });

    // Enhanced View More Button Interactions
    document.addEventListener('DOMContentLoaded', function() {
        const viewMoreBtns = document.querySelectorAll('.view-more-btn');
        
        viewMoreBtns.forEach(btn => {
            // Add ripple effect on click
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    width: 100px;
                    height: 100px;
                    left: ${x}px;
                    top: ${y}px;
                    transform: translate(-50%, -50%) scale(0);
                    animation: ripple 0.6s linear;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
            
            // Add hover animation
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });

    // Add this keyframe animation to handle ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Smooth scroll for Hire Me button
    document.addEventListener('DOMContentLoaded', function() {
        const hireMeBtn = document.querySelector('a[href="#contact"].btn-primary');
        
        if (hireMeBtn) {
            hireMeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Skill reveal & hover polish
    document.addEventListener('DOMContentLoaded', function() {
        const skills = document.querySelectorAll('.skills-wrapper .skill-item');
        if (!skills.length) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(skills).indexOf(entry.target);
                    const delay = prefersReduced ? 0 : idx * 60;
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skills.forEach(skill => observer.observe(skill));
    });

    // Portfolio Filter Functionality
    $(document).ready(function() {
        // Portfolio filtering
        $('.portfolio-section button').click(function() {
            $('.portfolio-section button').removeClass('active');
            $(this).addClass('active');
            
            var filterValue = $(this).attr('data-filter');
            
            if (filterValue === 'all') {
                $('.portfolio-item').show();
            } else {
                $('.portfolio-item').hide();
                $('.portfolio-item[data-category="' + filterValue + '"]').show();
            }
        });
    });

})(jQuery);
