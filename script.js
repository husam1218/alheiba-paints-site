// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

mobileMenuBtn.addEventListener('click', function() {
    mainNav.classList.toggle('active');
});

// Header hide on scroll
const header = document.getElementById('main-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scroll down
        header.classList.add('hide');
    } else {
        // Scroll up
        header.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
});

// Close menu when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        mainNav.classList.remove('active');
    });
});

// Form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('شكراً لتواصلكم! سنرد عليكم في أقرب وقت.');
    this.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a, .hero .btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});