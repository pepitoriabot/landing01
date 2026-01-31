// LA COLMENA CROSSFIT - Landing Page Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Honeypot check — bots fill hidden fields
            if (document.getElementById('website').value) {
                formStatus.textContent = 'Mensaje enviado correctamente. Te responderemos pronto.';
                formStatus.className = 'form-status success';
                contactForm.reset();
                return;
            }

            // Turnstile token
            const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;
            if (!turnstileToken) {
                formStatus.textContent = 'Por favor, completa la verificación de seguridad.';
                formStatus.className = 'form-status error';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVIANDO...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const data = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                mensaje: document.getElementById('mensaje').value.trim(),
                'cf-turnstile-response': turnstileToken,
            };

            try {
                const res = await fetch('https://lacolmenacontact.jlmontesj.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (res.ok) {
                    formStatus.textContent = 'Mensaje enviado correctamente. Te responderemos pronto.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    if (typeof turnstile !== 'undefined') turnstile.reset();
                } else {
                    formStatus.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                    formStatus.className = 'form-status error';
                }
            } catch (err) {
                formStatus.textContent = 'Error de conexión. Inténtalo de nuevo.';
                formStatus.className = 'form-status error';
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'ENVIAR MENSAJE';
        });
    }

    // Console welcome message
    console.log('%c🐝 La Colmena CrossFit', 'font-size: 24px; font-weight: bold; color: #FFB800;');
    console.log('%cUn lugar para tod@s', 'font-size: 14px; color: #888;');
});
