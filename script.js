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

// Mobile menu toggle (adds aria support and click-outside close)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

if (mobileMenuBtn && mainNav) {
  // accessibility
  mobileMenuBtn.setAttribute('aria-controls', 'main-nav');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');

  mobileMenuBtn.addEventListener('click', function(e) {
    const isActive = mainNav.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
    e.stopPropagation();
  });

  // close menu when clicking outside
  document.addEventListener('click', function(ev) {
    if (!mainNav.contains(ev.target) && !mobileMenuBtn.contains(ev.target)) {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
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

// Netlify Forms handling
const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    // Optional: Add loading state for better UX
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;
    
    // Let Netlify handle the submission
    // The form will be submitted normally
    
    // Show success message after a short delay
    setTimeout(() => {
      // This will show after Netlify processes the form
      alert('شكراً لتواصلكم! سنرد عليكم في أقرب وقت.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
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