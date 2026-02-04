/* ============================================
   SPECIALIZED SERVICOS - MAIN JAVASCRIPT
   Vanilla JS ES6+
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initNavbar();
    initSmoothScroll();
    initCounters();
    initGalleryFilter();
    initLightGallery();
    initTestimonialSlider();
    initForms();
    initBackToTop();
    initAOS();
    initPhoneMask();
    initScrollProgress();
});

/* ============ PRELOADER ============ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const preloaderStats = preloader.querySelectorAll('.stat-number');
    
    // Animate preloader counters
    preloaderStats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target) {
            animateCounter(stat, 0, target, 1500);
        }
    });
    
    // Hide preloader after animation
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 2500);
    });
    
    // Fallback - hide after 4 seconds max
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 4000);
}

/* ============ NAVBAR ============ */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

/* ============ SMOOTH SCROLL ============ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============ COUNTER ANIMATION ============ */
function initCounters() {
    const counters = document.querySelectorAll('.hero-stats .counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.floor(easeOutQuart * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/* ============ GALLERY FILTER ============ */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/* ============ LIGHTGALLERY ============ */
function initLightGallery() {
    const gallery = document.getElementById('lightgallery');
    if (gallery && typeof window.lightGallery !== 'undefined') {
        window.lightGallery(gallery, {
            selector: '.gallery-link',
            speed: 500,
            download: true,
            counter: true
        });
    }
}

/* ============ TESTIMONIAL SLIDER ============ */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play
    let autoPlay = setInterval(nextSlide, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 5000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (diff > swipeThreshold) {
            nextSlide();
        } else if (diff < -swipeThreshold) {
            prevSlide();
        }
    }
}

/* ============ FORMS - WHATSAPP INTEGRATION ============ */
function initForms() {
    // Career Form
    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) return;
            
            const name = document.getElementById('careerName').value;
            const phone = document.getElementById('careerPhone').value;
            const email = document.getElementById('careerEmail').value;
            const area = document.getElementById('careerArea').value;
            const experience = document.getElementById('careerExperience').value;
            
            const message = `*CANDIDATURA - TRABALHE CONOSCO*%0A%0A` +
                `*Nome:* ${name}%0A` +
                `*Telefone:* ${phone}%0A` +
                `*E-mail:* ${email}%0A` +
                `*Area de Interesse:* ${area}%0A` +
                `*Experiencia:* ${experience || 'Nao informada'}%0A%0A` +
                `_Enviado pelo site Specialized Servicos_`;
            
            // Select WhatsApp number based on area
            let whatsappNumber = '5561982449781'; // default
            if (area === 'Portaria') whatsappNumber = '5561981999789';
            if (area === 'Jardinagem') whatsappNumber = '5561993566227';
            
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            
            // Show success and reset form
            showFormSuccess(this);
            this.reset();
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) return;
            
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const email = document.getElementById('contactEmail').value;
            const service = document.getElementById('contactService').value;
            const messageText = document.getElementById('contactMessage').value;
            
            const message = `*CONTATO - SOLICITACAO DE ORCAMENTO*%0A%0A` +
                `*Nome:* ${name}%0A` +
                `*Telefone:* ${phone}%0A` +
                `*E-mail:* ${email || 'Nao informado'}%0A` +
                `*Servico:* ${service}%0A` +
                `*Mensagem:* ${messageText}%0A%0A` +
                `_Enviado pelo site Specialized Servicos_`;
            
            // Select WhatsApp number based on service
            let whatsappNumber = '5561982449781'; // default
            if (service === 'Portaria') whatsappNumber = '5561981999789';
            if (service === 'Jardinagem') whatsappNumber = '5561993566227';
            
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            
            // Show success and reset form
            showFormSuccess(this);
            this.reset();
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFormSuccess(form) {
    // Create success message
    let successDiv = form.querySelector('.form-success');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = '<i class="fas fa-check-circle"></i><p>Mensagem enviada com sucesso!</p>';
        form.appendChild(successDiv);
    }
    
    successDiv.classList.add('show');
    
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}

/* ============ PHONE MASK ============ */
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 0) {
                value = '(' + value;
            }
            if (value.length > 3) {
                value = value.slice(0, 3) + ') ' + value.slice(3);
            }
            if (value.length > 10) {
                value = value.slice(0, 10) + '-' + value.slice(10);
            }
            
            e.target.value = value;
        });
    });
}

/* ============ BACK TO TOP ============ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============ AOS ANIMATION ============ */
function initAOS() {
    if (typeof window.AOS !== 'undefined') {
        window.AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    }
}

/* ============ SCROLL PROGRESS INDICATOR ============ */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #c9a227, #dbb84d);
        z-index: 10000;
        transition: width 0.1s ease;
        width: 0;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

/* ============ LOCAL STORAGE FOR FORMS ============ */
function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.id) {
            formData[input.id] = input.value;
        }
    });
    
    localStorage.setItem(formId + '_data', JSON.stringify(formData));
}

function loadFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const savedData = localStorage.getItem(formId + '_data');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        Object.keys(formData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = formData[key];
            }
        });
    }
}

// Auto-save forms every 30 seconds
setInterval(() => {
    saveFormData('careerForm');
    saveFormData('contactForm');
}, 30000);

// Load saved data on page load
window.addEventListener('load', () => {
    loadFormData('careerForm');
    loadFormData('contactForm');
});

/* ============ RIPPLE EFFECT FOR BUTTONS ============ */
document.querySelectorAll('.btn-primary-custom, .btn-service, .btn-cta-primary, .btn-orcamento').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============ LAZY LOADING IMAGES ============ */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

/* ============ KEYBOARD NAVIGATION ============ */
document.addEventListener('keydown', function(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    }
});

/* ============ CONSOLE MESSAGE ============ */
console.log('%c SPECIALIZED SERVICOS ', 'background: #c9a227; color: #0a0a0a; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c Site desenvolvido com excelencia! ', 'color: #c9a227; font-size: 14px;');
