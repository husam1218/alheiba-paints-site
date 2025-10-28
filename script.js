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

// Mobile drawer toggle (uses #side-drawer and #drawer-overlay)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
const sideDrawer = document.getElementById('side-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerCloseBtn = document.querySelector('.drawer-close-btn');

function openDrawer() {
  if (!sideDrawer || !drawerOverlay) return;
  sideDrawer.setAttribute('aria-hidden', 'false');
  drawerOverlay.hidden = false;
  drawerOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  // focus first focusable element inside drawer
  const first = sideDrawer.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
  if (first) first.focus();
}

function closeDrawer() {
  if (!sideDrawer || !drawerOverlay) return;
  sideDrawer.setAttribute('aria-hidden', 'true');
  drawerOverlay.hidden = true;
  drawerOverlay.style.display = '';
  document.body.style.overflow = '';
  if (mobileMenuBtn) mobileMenuBtn.focus();
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

// close on Escape
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && sideDrawer && sideDrawer.getAttribute('aria-hidden') === 'false') {
    closeDrawer();
  }
});

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

// Close drawer when clicking on any nav link
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function() {
    // if desktop nav, no drawer to close; just ensure overlay/drawer closed
    closeDrawer();
    // Also remove any active class on mainNav if present
    if (mainNav) mainNav.classList.remove('active');
  });
});

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