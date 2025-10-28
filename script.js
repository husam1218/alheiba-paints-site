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

// Mobile menu toggle with enhanced functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
const body = document.body;

if (mobileMenuBtn && mainNav) {
  // Accessibility
  mobileMenuBtn.setAttribute('aria-controls', 'main-nav');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.setAttribute('aria-label', 'قائمة الموقع');

  const toggleMenu = (isActive) => {
    mainNav.classList.toggle('active', isActive);
    mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
    body.style.overflow = isActive ? 'hidden' : '';
    
    // Toggle menu icon between hamburger and close
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (menuIcon) {
      menuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    }
  };

  // Toggle menu on button click
  mobileMenuBtn.addEventListener('click', function(e) {
    const isActive = !mainNav.classList.contains('active');
    toggleMenu(isActive);
    e.stopPropagation();
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(ev) {
    if (mainNav.classList.contains('active') && 
        !mainNav.contains(ev.target) && 
        !mobileMenuBtn.contains(ev.target)) {
      toggleMenu(false);
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Close menu when clicking on a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        toggleMenu(false);
      }
    });
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

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    
    // Only handle internal links that exist on the page
    if (targetId !== '#') {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get the header height to offset the scroll position
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20; // 20px extra spacing

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without adding to browser history
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    }
  });
});

// Handle page load with hash in URL
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        window.scrollTo(0, targetElement.offsetTop - headerHeight);
      }, 100);
    }
  }
});