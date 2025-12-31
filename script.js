// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initContactForm();
});

// Navigation functionality
function initNavigation() {
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  function updateOnScroll() {
    const scrollPos = window.scrollY;

    // Show/hide header based on scroll position
    if (header) {
      const firstContentSection = document.querySelector('section.content-section');
      let threshold = 400;
      if (firstContentSection) {
        threshold = firstContentSection.offsetTop - 100;
      }

      if (scrollPos > threshold) {
        header.classList.add('visible');
      } else {
        header.classList.remove('visible');
      }
    }

    // Update active nav link based on scroll position
    const navOffset = scrollPos + 150;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (navOffset >= top && navOffset < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('load', updateOnScroll);
  updateOnScroll();
}

// Scroll reveal animations
function initScrollReveal() {
  const sections = document.querySelectorAll('.content-section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // Remove revealed class when scrolling back up past the section
          const rect = entry.target.getBoundingClientRect();
          if (rect.top > 0) {
            entry.target.classList.remove('revealed');
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '-50px 0px',
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Contact form handling
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    if (document.getElementById('website').value) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbxBq7P9RcynDkfr-L1ohQP_zBE1FuljC2gm186nFAe1FB2zakKZqP2zhrLNWk-2o-hU/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ company, email, message })
        }
      );
      alert('Thanks! Your info has been submitted.');
      form.reset();
    } catch (error) {
      alert('Network error. Please try again later.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
}