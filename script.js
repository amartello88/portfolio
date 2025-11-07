// ====== Mobile menu toggle + lock scroll ======
document.addEventListener("DOMContentLoaded", () => {
  let backdropEl = null;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav-menu');

  if (!toggle || !nav) return; // Evita errores si no existen

  function openMenu() {
    document.body.classList.add('no-scroll');
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    addBackdrop();
  }

  function closeMenu() {
    document.body.classList.remove('no-scroll');
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    removeBackdrop();
  }

  // Backdrop semitransparente para cerrar al tocar afuera
  function addBackdrop() {
    if (backdropEl) return;
    backdropEl = document.createElement('div');
    backdropEl.style.position = 'fixed';
    backdropEl.style.inset = '0';
    backdropEl.style.background = 'rgba(0,0,0,.25)';
    backdropEl.style.zIndex = '900'; // menor que el nav (que está en 1100)
    backdropEl.addEventListener('click', closeMenu);
    document.body.appendChild(backdropEl);
  }

  function removeBackdrop() {
    if (!backdropEl) return;
    backdropEl.removeEventListener('click', closeMenu);
    document.body.removeChild(backdropEl);
    backdropEl = null;
  }

  // Toggle del menú
  toggle.addEventListener('click', () => {
    console.log('🔥 clic detectado'); // para verificar que anda
    const isOpen = nav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Cierra menú al hacer click en un enlace
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });

  // Cierra menú si se redimensiona a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });

  // ====== Scroll spy (marca el link activo) ======
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = links.find(l => l.getAttribute('href') === id);
      if (link && entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
});
