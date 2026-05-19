/* ---------- HEADER SCROLL ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ---------- HERO PARALLAX BG ---------- */
const heroBg = document.getElementById('heroBg');
setTimeout(() => { heroBg.classList.add('loaded'); }, 100);
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroBg.style.transform = `scale(1.0) translateY(${scrolled * 0.25}px)`;
  }
}, { passive: true });

/* ---------- MOBILE NAV ---------- */
const mobileNav = document.getElementById('mobileNav');
const hamburger = document.getElementById('hamburger');
function toggleMobileNav() {
  mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(document.getElementById('n1'), 200, 1500);
      animateCounter(document.getElementById('n2'), 15, 1200);
      animateCounter(document.getElementById('n3'), 98, 1500);
      animateCounter(document.getElementById('n4'), 50, 1200);
      statsObserver.disconnect();
    }
  });
});
statsObserver.observe(document.querySelector('.hero-stats'));

/* ---------- REVEAL ON SCROLL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- PROJECT FILTERS ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      if (filter === 'all' || cat === filter) {
        card.style.display = '';
        card.style.opacity = '1';
      } else {
        card.style.opacity = '0';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ---------- TESTIMONIAL CAROUSEL ---------- */
(function() {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let perView = 3;
  let total;

  function getPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, total - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function init() {
    perView = getPerView();
    current = 0;
    buildDots();
    goTo(0);
  }

  document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => { init(); });
  init();

  // Auto-advance
  setInterval(() => {
    let next = current + 1;
    if (next >= total) next = 0;
    goTo(next);
  }, 5000);
})();

/* ---------- FORM VALIDATION ---------- */
const form = document.getElementById('orcamentoForm');
const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const email = document.getElementById('email').value.trim();
  const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nome || nome.length < 3) {
    showMsg('Por favor, insira seu nome completo.', 'error');
    return;
  }
  if (!tel || tel.length < 10) {
    showMsg('Por favor, insira um telefone válido.', 'error');
    return;
  }
  if (!email || !emailRgx.test(email)) {
    showMsg('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  // Simulate submission
  const btn = form.querySelector('.btn-submit');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    showMsg('✓ Solicitação enviada com sucesso! Entraremos em contato em até 24 horas.', 'success');
    form.reset();
    btn.textContent = 'Enviar Solicitação';
    btn.disabled = false;
  }, 1600);
});

function showMsg(msg, type) {
  formMsg.textContent = msg;
  formMsg.className = 'form-msg ' + type;
  formMsg.style.display = 'block';
  setTimeout(() => { formMsg.style.display = 'none'; }, 6000);
}