// ===== Countdown =====
function startCountdown(targetIso) {
  const target = new Date(targetIso).getTime();

  function tick() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// ===== Render celebration schedule =====
function renderSchedule(events) {
  const el = document.getElementById('schedule-list');
  el.innerHTML = events.map(ev => `
    <div class="schedule-item reveal-item">
      <div class="schedule-date">
        <span class="day">${ev.day}</span>
        <span class="mon">${ev.month}</span>
      </div>
      <div class="schedule-body">
        <h3>${ev.title}</h3>
        <p class="schedule-time">${ev.time}</p>
        <p class="schedule-venue">${ev.venue}</p>
        <a class="schedule-map" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery)}">View on map</a>
      </div>
    </div>
  `).join('');
}

// ===== Render album =====
function renderAlbum(seeds) {
  const el = document.getElementById('album-grid');
  el.innerHTML = seeds.map(seed => `<img class="reveal-item" loading="lazy" src="https://picsum.photos/seed/${seed}/400/${300 + (seed.length % 3) * 60}" alt="Wedding moment">`).join('');
}

// ===== Save-the-date scratch cards (day / month / year boxes) =====
function fillDateParts(dateTimeIso) {
  const d = new Date(dateTimeIso);
  const day = document.getElementById('scratch-day');
  const month = document.getElementById('scratch-month');
  const year = document.getElementById('scratch-year');
  if (day) day.textContent = String(d.getDate()).padStart(2, '0');
  if (month) month.textContent = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  if (year) year.textContent = d.getFullYear();
}

function attachScratchBox(card) {
  const canvas = card.querySelector('.scratch-canvas');
  const hint = document.getElementById('scratch-hint');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = card.clientWidth;
  const h = card.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#e6c76b');
  grad.addColorStop(1, '#8a6c37');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(251,243,228,0.9)';
  ctx.font = `600 ${Math.round(w * 0.13)}px Poppins, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Scratch', w / 2, h / 2);

  let scratching = false;
  let revealed = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * (w / rect.width),
      y: (point.clientY - rect.top) * (h / rect.height)
    };
  }

  function erase(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, w * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function checkCleared() {
    if (revealed) return;
    const data = ctx.getImageData(0, 0, w * dpr, h * dpr).data;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 40) {
      total++;
      if (data[i] < 40) transparent++;
    }
    if (total > 0 && transparent / total > 0.5) {
      revealed = true;
      canvas.classList.add('cleared');
      card.classList.add('revealed');
      if (hint && document.querySelectorAll('.scratch-card:not(.revealed)').length === 0) {
        hint.classList.add('hidden');
      }
    }
  }

  function pointerDown(e) {
    scratching = true;
    const p = getPos(e);
    erase(p.x, p.y);
  }

  function pointerMove(e) {
    if (!scratching) return;
    e.preventDefault();
    const p = getPos(e);
    erase(p.x, p.y);
    checkCleared();
  }

  function pointerUp() { scratching = false; }

  canvas.addEventListener('mousedown', pointerDown);
  canvas.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);

  canvas.addEventListener('touchstart', pointerDown, { passive: true });
  canvas.addEventListener('touchmove', pointerMove, { passive: false });
  window.addEventListener('touchend', pointerUp);
}

function initScratchCard() {
  fillDateParts(WEDDING_CONFIG.weddingDateTime);
  document.querySelectorAll('.scratch-card').forEach(attachScratchBox);
}

// ===== Invitation cover =====
function initInviteCover() {
  const cover = document.getElementById('invite-cover');
  const btn = document.getElementById('open-invite-btn');
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');

  document.body.classList.add('locked');

  btn.addEventListener('click', () => {
    cover.classList.add('closing');
    document.body.classList.remove('locked');

    audio.play().then(() => {
      musicBtn.classList.add('playing');
    }).catch(() => {
      // No audio file provided yet (see README) — ignore silently.
    });

    setTimeout(() => cover.remove(), 950);
  }, { once: true });
}

// ===== Background music toggle =====
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        btn.classList.add('playing');
      }).catch(() => {
        // No audio file provided yet (see README) — ignore silently.
      });
    } else {
      audio.pause();
      btn.classList.remove('playing');
    }
  });
}

// ===== Floating petals (hero decoration) =====
function initPetals() {
  const container = document.getElementById('petals');
  const count = window.innerWidth < 640 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
    petal.style.setProperty('--size', `${8 + Math.random() * 10}px`);
    petal.style.animationDuration = `${9 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(petal);
  }
}

// ===== Scroll reveal (sections + individual cards, staggered) =====
function initScrollReveal() {
  const sectionTargets = document.querySelectorAll('.reveal');
  const itemTargets = document.querySelectorAll('.reveal-item');

  itemTargets.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 90}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sectionTargets.forEach(t => observer.observe(t));
  itemTargets.forEach(t => observer.observe(t));
}

// ===== Active nav link on scroll =====
function initNavActive() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ===== Back to top button =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Album lightbox =====
function initLightbox() {
  const grid = document.getElementById('album-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  grid.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG') return;
    lightboxImg.src = e.target.src.replace(/\/400\/\d+$/, '/1000/750');
    lightbox.classList.add('open');
  });

  function close() { lightbox.classList.remove('open'); }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  startCountdown(WEDDING_CONFIG.weddingDateTime);
  initScratchCard();
  renderSchedule(WEDDING_CONFIG.events);
  renderAlbum(WEDDING_CONFIG.albumImageSeeds);
  initInviteCover();
  initMusicToggle();
  initPetals();
  initScrollReveal();
  initNavActive();
  initBackToTop();
  initLightbox();
});
