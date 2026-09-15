(() => {
  const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/S89J89Y9DM';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7')) v = '7' + v;
      v = v.slice(0, 11);
      let out = '+7';
      if (v.length > 1) out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      e.target.value = out;
    });
  });

  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });

    if (payload._gotcha) return;

    if (!payload.name || (!payload.phone && !payload.contact)) {
      alert('Заполните имя и контактные данные');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      const resp = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      btn.textContent = 'Заявка отправлена ✓';
      form.reset();
    } catch (err) {
      console.error(err);
      btn.textContent = 'Ошибка, попробуйте ещё раз';
    } finally {
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== CASES GALLERY =====
  const CASES = [
    { title: 'Квартира на Герцена', desc: 'Ремонт под ключ: кухня-гостиная, спальни', photos: ['img/apt-gertsena-1.jpg', 'img/apt-gertsena-2.jpg', 'img/apt-gertsena-3.jpg'] },
    { title: 'Квартира на Миначева', desc: 'Ремонт под ключ, 19к-120', photos: ['img/apt-minacheva-1.jpg', 'img/apt-minacheva-2.jpg', 'img/apt-minacheva-3.jpg', 'img/apt-minacheva-4.jpg'] },
    { title: 'Квартира на Гагарина', desc: 'Ремонт под ключ, 36-50', photos: ['img/apt-gagarina-1.jpg', 'img/apt-gagarina-2.jpg', 'img/apt-gagarina-3.jpg'] },
    { title: 'Квартира на Калинина', desc: 'Ремонт под ключ, 86-197', photos: ['img/apt-kalinina-1.jpg', 'img/apt-kalinina-2.jpg', 'img/apt-kalinina-3.jpg', 'img/apt-kalinina-4.jpg'] },
    { title: 'Квартира на Кадыкова', desc: 'Ремонт под ключ, 40к1-1', photos: ['img/apt-kadykova-1.jpg', 'img/apt-kadykova-2.jpg', 'img/apt-kadykova-3.jpg', 'img/apt-kadykova-4.jpg'] },
    { title: 'Дом в СНТ Волга', desc: 'Полный ремонт загородного дома под ключ', photos: ['img/house-volga-1.jpg', 'img/house-volga-2.jpg', 'img/house-volga-3.jpg'] },
    { title: 'Баня в Шомиково', desc: 'Внутренняя отделка бани из бревна', photos: ['img/banya-shomikovo-1.jpg', 'img/banya-shomikovo-2.jpg', 'img/banya-shomikovo-3.jpg'] },
    { title: 'Баня в Русской Сорме', desc: 'Отделка бани под ключ', photos: ['img/banya-sorma-1.jpg', 'img/banya-sorma-2.jpg', 'img/banya-sorma-3.jpg', 'img/banya-sorma-4.jpg'] },
    { title: 'Дом-баня в Альгешево', desc: 'Строительство и отделка бани из бруса', photos: ['img/dom-algeshevo-1.jpg', 'img/dom-algeshevo-2.jpg', 'img/dom-algeshevo-3.jpg', 'img/dom-algeshevo-4.jpg'] },
    { title: 'Баня в Козловке', desc: 'Отделка бани под ключ', photos: ['img/banya-kozlovka-1.jpg', 'img/banya-kozlovka-2.jpg', 'img/banya-kozlovka-3.jpg', 'img/banya-kozlovka-4.jpg'] },
  ];

  const casesGrid = document.getElementById('casesGrid');
  if (casesGrid) {
    casesGrid.innerHTML = CASES.map((c, i) => `
      <button type="button" class="case" data-case-index="${i}">
        <div class="case__img-wrap">
          <img src="${c.photos[0]}" alt="${c.title}" loading="lazy">
          <span class="case__count"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${c.photos.length}</span>
        </div>
        <div class="case__body"><h3>${c.title}</h3><p>${c.desc}</p></div>
      </button>
    `).join('');
  }

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let curCase = 0, curPhoto = 0;

  function showPhoto() {
    const c = CASES[curCase];
    lightboxImg.src = c.photos[curPhoto];
    lightboxImg.alt = c.title;
    lightboxTitle.textContent = c.title;
    lightboxCounter.textContent = (curPhoto + 1) + ' / ' + c.photos.length;
  }
  function openLightbox(caseIndex) {
    curCase = caseIndex;
    curPhoto = 0;
    showPhoto();
    lightbox.classList.add('is-open');
  }
  function closeLightbox() { lightbox.classList.remove('is-open'); }
  function nextPhoto() { curPhoto = (curPhoto + 1) % CASES[curCase].photos.length; showPhoto(); }
  function prevPhoto() { curPhoto = (curPhoto - 1 + CASES[curCase].photos.length) % CASES[curCase].photos.length; showPhoto(); }

  casesGrid?.addEventListener('click', e => {
    const btn = e.target.closest('.case');
    if (!btn) return;
    openLightbox(parseInt(btn.dataset.caseIndex, 10));
  });
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxNext')?.addEventListener('click', nextPhoto);
  document.getElementById('lightboxPrev')?.addEventListener('click', prevPhoto);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  const targets = document.querySelectorAll(
    '.adv, .service, .step, .case, .faq__item, .form-card, .map-card, .hero__card, .price-highlight, .price-table, .channels__inner'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));

  const counters = document.querySelectorAll('[data-target]');
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      if (Number.isNaN(target)) return;
      const dur = 1100, start = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countIO.observe(el));
})();
