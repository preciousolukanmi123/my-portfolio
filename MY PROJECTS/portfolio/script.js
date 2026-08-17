
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.style.transform = navMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.style.transform = 'rotate(0)';
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});


const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.classList.add('active');
});


const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDots = document.getElementById('lightboxDots');
const projectImageBoxes = document.querySelectorAll('.project-image');

let currentGallery = [];
let currentIndex = 0;

projectImageBoxes.forEach(box => {
    const img = box.querySelector('img');
    if (!img) return;

    img.addEventListener('click', () => {
        const imagesAttr = box.getAttribute('data-images');
        currentGallery = imagesAttr
            ? imagesAttr.split(',').map(src => src.trim())
            : [img.getAttribute('src')];

        const startSrc = img.getAttribute('src');
        const startIndex = currentGallery.indexOf(startSrc);
        currentIndex = startIndex !== -1 ? startIndex : 0;

        openLightbox();
    });
});

function openLightbox() {
    updateLightboxImage();
    lightboxOverlay.classList.add('active');
}

function updateLightboxImage() {
    lightboxImg.src = currentGallery[currentIndex];
    lightboxImg.alt = `Project preview ${currentIndex + 1} of ${currentGallery.length}`;

    const hasMultiple = currentGallery.length > 1;
    lightboxPrev.classList.toggle('hidden', !hasMultiple);
    lightboxNext.classList.toggle('hidden', !hasMultiple);

    if (hasMultiple) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        lightboxCounter.style.display = 'block';

        lightboxDots.innerHTML = '';
        currentGallery.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === currentIndex ? ' active' : '');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateLightboxImage();
            });
            lightboxDots.appendChild(dot);
        });
        lightboxDots.style.display = 'flex';
    } else {
        lightboxCounter.style.display = 'none';
        lightboxDots.innerHTML = '';
        lightboxDots.style.display = 'none';
    }
}

function showPrevImage() {
    if (currentGallery.length < 2) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
}

function showNextImage() {
    if (currentGallery.length < 2) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    lightboxImg.src = '';
    currentGallery = [];
    currentIndex = 0;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});


const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

const CONTACT_EMAIL = 'nifemiprecious456@gmail.com';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[name="name"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const subject = contactForm.querySelector('input[name="subject"]').value;
    const message = contactForm.querySelector('textarea[name="message"]').value;

    if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message,
                _subject: `Portfolio contact: ${subject}`
            })
        });

        if (response.ok) {
            showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon! 🚀', 'success');
            contactForm.reset();
        } else {
            showFormMessage('Something went wrong sending your message. Please try emailing me directly instead.', 'error');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showFormMessage('Something went wrong sending your message. Please try emailing me directly instead.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;

    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}


const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

const progressBars = document.querySelectorAll('.progress');
let animated = false;

const animateProgressBars = () => {
    if (animated) return;
    
    const skillsSection = document.querySelector('.skills');
    const skillsPosition = skillsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (skillsPosition < windowHeight) {
        animated = true;
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
};

window.addEventListener('scroll', animateProgressBars);

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.backgroundPosition = `0px ${scrollPosition * 0.5}px`;
    }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#') {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});


window.addEventListener('load', () => {
    console.log('Portfolio loaded successfully! 🚀');
});


function getCurrentYear() {
    return new Date().getFullYear();
}

console.log('%cWelcome to my portfolio! 👋', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cI\'m a junior web developer learning MERN stack. Let\'s connect!', 'font-size: 14px; color: #cbd5e1;');
console.log('%cEmail: nifemiprecious456@gmail.com', 'font-size: 12px; color: #94a3b8;');


document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.style.transform = 'rotate(0)';
    }
});


window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0.95';
document.body.style.transition = 'opacity 0.3s ease';
