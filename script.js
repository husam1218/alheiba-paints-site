// Load homepage content from Netlify CMS
fetch('/content/home.json')
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(data => {
    // Hero section
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroImage = document.getElementById('hero-image');
    
    if (heroTitle) heroTitle.textContent = data.hero_title;
    if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle;
    if (heroImage) heroImage.src = data.hero_image;

    // Projects section
    const projectList = document.getElementById('project-list');
    if (projectList && data.projects) {
      projectList.innerHTML = '';
      data.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}">
          <div class="project-card-overlay">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        `;
        projectList.appendChild(card);
      });
    }

    // Contact section
    const addressEl = document.getElementById('contact-address');
    const phoneEl = document.getElementById('contact-phone');
    const whatsappEl = document.getElementById('contact-whatsapp');
    const emailEl = document.getElementById('contact-email');
    const hoursEl = document.getElementById('contact-hours');
    
    if (addressEl) addressEl.textContent = data.contact.address;
    
    if (phoneEl) {
      phoneEl.textContent = data.contact.phone;
      phoneEl.href = `tel:${data.contact.phone}`;
    }
    
    if (whatsappEl) {
      whatsappEl.textContent = data.contact.whatsapp;
      whatsappEl.href = `https://wa.me/${data.contact.whatsapp}`;
    }
    
    if (emailEl) {
      emailEl.textContent = data.contact.email;
      emailEl.href = `mailto:${data.contact.email}`;
    }
    
    if (hoursEl) hoursEl.innerHTML = data.contact.working_hours;

    // Footer section
    const footerTitle = document.getElementById('footer-title');
    const footerDesc = document.getElementById('footer-description');
    const footerCopyright = document.getElementById('footer-copyright');
    
    if (footerTitle) footerTitle.textContent = data.footer.title;
    if (footerDesc) footerDesc.textContent = data.footer.description;
    if (footerCopyright) footerCopyright.textContent = data.footer.copyright;
    
    // Social links
    const socialLinks = ['facebook', 'instagram', 'twitter', 'whatsapp'];
    socialLinks.forEach(platform => {
      const el = document.getElementById(`footer-${platform}`);
      if (el && data.footer[platform]) {
        el.href = data.footer[platform];
      }
    });
  })
  .catch(err => console.error('Failed to load homepage content:', err));

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', function() {
    mainNav.classList.toggle('active');
  });
}

// Header hide on scroll with throttling
const header = document.getElementById('main-header');
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScrollY = window.scrollY;
  ticking = false;
}

if (header) {
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

// Close menu when clicking on a link
if (mainNav) {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
      mainNav.classList.remove('active');
    });
  });
}

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('شكراً لتواصلكم! سنرد عليكم في أقرب وقت.');
    this.reset();
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a, .hero .btn').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    
    // Only handle internal links
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }
  });
});