
  <!-- Script to load homepage content from Netlify CMS -->
<script>
fetch('/content/home.json')
  .then(res => res.json())
  .then(data => {
    // Hero
    document.getElementById('hero-title').textContent = data.hero_title;
    document.getElementById('hero-subtitle').textContent = data.hero_subtitle;
    document.getElementById('about-text').textContent = data.about_text;
    document.getElementById('hero-image').src = data.hero_image;

    // Projects
    const projectList = document.getElementById('project-list');
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

    // Contact
    document.getElementById('contact-address').textContent = data.contact.address;
    document.getElementById('contact-phone').textContent = data.contact.phone;
    document.getElementById('contact-whatsapp').textContent = data.contact.whatsapp;
    document.getElementById('contact-email').textContent = data.contact.email;
    document.getElementById('contact-hours').innerHTML = data.contact.working_hours;

    // Footer
    document.getElementById('footer-title').textContent = data.footer.title;
    document.getElementById('footer-description').textContent = data.footer.description;
    document.getElementById('footer-facebook').href = data.footer.facebook;
    document.getElementById('footer-instagram').href = data.footer.instagram;
    document.getElementById('footer-twitter').href = data.footer.twitter;
    document.getElementById('footer-whatsapp').href = data.footer.whatsapp;
    document.getElementById('footer-copyright').textContent = data.footer.copyright;
  })
  .catch(err => console.error('Failed to load homepage content:', err));
</script>
  



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