/* ---------- HEADER SCROLL ---------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---------- HERO PARALLAX ---------- */
const heroBg = document.getElementById('heroBg');

setTimeout(() => heroBg.classList.add('loaded'), 100);

window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1) translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ---------- MOBILE NAV ---------- */
const mobileNav = document.getElementById('mobileNav');
const hamburger = document.getElementById('hamburger');

window.toggleMobileNav = function () {
  mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}

window.closeMobileNav = function () {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- COUNTERS ---------- */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.getElementById('n1'), 200, 1500);
      animateCounter(document.getElementById('n2'), 15, 1200);
      animateCounter(document.getElementById('n3'), 98, 1500);
      animateCounter(document.getElementById('n4'), 50, 1200);
      obs.disconnect();
    }
  });
});

statsObserver.observe(document.querySelector('.hero-stats'));

/* ---------- REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ---------- FILTER PROJETOS ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? '' : 'none';
      card.style.opacity = match ? '1' : '0';
    });
  });
});

/* ---------- TESTIMONIALS ---------- */
(function () {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const cards = track.querySelectorAll('.testimonial-card');

  let current = 0;
  let perView = 3;
  let total = 0;

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
      dot.onclick = () => goTo(i);
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, total - 1));

    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function init() {
    perView = getPerView();
    current = 0;
    buildDots();
    goTo(0);
  }

  document.getElementById('prevBtn').onclick = () => goTo(current - 1);
  document.getElementById('nextBtn').onclick = () => goTo(current + 1);

  window.addEventListener('resize', init);

  init();

  setInterval(() => {
    let next = current + 1;
    if (next >= total) next = 0;
    goTo(next);
  }, 5000);
})();

/* ---------- FORM ---------- */
const form = document.getElementById('orcamentoForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const email = document.getElementById('email').value.trim();
  const btn = form.querySelector('.btn-submit');

  if (nome.length < 3) return showMsg('Nome inválido', 'error');
  if (tel.length < 10) return showMsg('Telefone inválido', 'error');
  if (!email.includes('@')) return showMsg('Email inválido', 'error');

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const response = await fetch("https://formspree.io/f/xpqnqzry", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    });

    if (response.ok) {
      showMsg('Enviado com sucesso!', 'success');
      form.reset();
    } else {
      showMsg('Erro ao enviar.', 'error');
    }
  } catch (err) {
    showMsg('Erro de conexão.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Solicitação';
  }
});

function showMsg(msg, type) {
  formMsg.textContent = msg;
  formMsg.className = 'form-msg ' + type;
  formMsg.style.display = 'block';

  setTimeout(() => {
    formMsg.style.display = 'none';
  }, 5000);
}