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
  const numbered = (prefix, count) => Array.from({ length: count }, (_, i) => `img/${prefix}-${i + 1}.jpg`);
  const CASES = [
    { title: '2-комн. квартира, 74,8 м²', desc: '(Новостройка) ул. Герцена 2к1', photos: numbered('apt-gertsena', 20), video: 'https://drive.google.com/file/d/1zwLmzPC9_9W2GvVO2jCL1avQN_nMtNbZ/view' },
    { title: '2-комн. квартира, 87,7 м²', desc: '(Новостройка) ул. Афанасьева 7к3', photos: numbered('apt-afanasyeva', 11), video: 'https://drive.google.com/file/d/10N-kI0lDjKZ5g2378YtySTlUTWiXam5P/view' },
    { title: '2-комн. квартира, 71,1 м²', desc: '(Новостройка) ул. Миначева 19к1', photos: numbered('apt-minacheva', 14), video: 'https://drive.google.com/file/d/1OlYVHappTEo_wyGtaqmlwVsnWLt8r3DX/view' },
    { title: '1-комн. квартира, 33 м²', desc: '(Вторичка) ул. Гагарина 36', photos: numbered('apt-gagarina', 10), video: 'https://drive.google.com/file/d/1a55J3zSnRTqT7xUf2YL_MAFEGqbiC2Td/view' },
    { title: '2-комн. квартира, 97,9 м²', desc: '(Новостройка) ул. Калинина 86', photos: numbered('apt-kalinina', 10), video: 'https://drive.google.com/file/d/1p7U0eCDjlmv8SG7Qhkg6wGNpQqzgpcwm/view' },
    { title: '2-комн. квартира, 63,1 м²', desc: '(Новостройка) ул. Кадыкова 40к1', photos: numbered('apt-kadykova', 10), video: 'https://drive.google.com/file/d/1ih4isC0IUkWGbpI3jLfqb_TWnRLU8eiY/view' },
    { title: 'Дачный дом из блоков 6х6, 1,5 этажа', desc: 'СНТ Волга', photos: numbered('house-volga', 9), video: 'https://drive.google.com/file/d/1iAhJGsjU9MQK3InkVoQn6cP3Rx5XikPi/view' },
    { title: 'Баня из кирпича 9х6,5', desc: 'мкр. Соляное', photos: numbered('dom-solyanoe', 10), video: 'https://drive.google.com/file/d/1_ogkvuUoZSOjuceox8ekxrGQZL1CzIi1/view' },
    { title: 'Баня из сруба 6х8, 41 м²', desc: 'д. Шомиково', photos: numbered('banya-shomikovo', 10), video: 'https://drive.google.com/file/d/13O_S9o4QcWvlYVNRoaetFtpTsyAIKGXk/view' },
    { title: 'Баня из блоков 6,4х4,4, 1,5 этажа', desc: 'д. Русская Сорма', photos: numbered('banya-sorma', 15), video: 'https://drive.google.com/file/d/1RkYLeLsry_weMsnz1GeNC5JwGK_PURAJ/view' },
    { title: 'Дом-баня из бруса 6х6, 2 этажа', desc: 'п. Альгешево', photos: numbered('dom-algeshevo', 9), video: 'https://drive.google.com/file/d/1C2hMMqTciWAkJJgXJqFmtSfildoHXOg-/view' },
    { title: 'Баня из блоков 6х4 с верандой 5х3', desc: 'г. Козловка', photos: numbered('banya-kozlovka', 18), video: 'https://drive.google.com/file/d/1fS33i64sHUylRSjFn_Z4bbrOlV7AD1_Z/view' },
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
  const lightboxVideo = document.getElementById('lightboxVideo');
  let curCase = 0, curPhoto = 0;

  function showPhoto() {
    const c = CASES[curCase];
    lightboxImg.src = c.photos[curPhoto];
    lightboxImg.alt = c.title;
    lightboxTitle.textContent = c.title;
    lightboxCounter.textContent = (curPhoto + 1) + ' / ' + c.photos.length;
    if (lightboxVideo) lightboxVideo.href = c.video || '#';
    if (lightboxVideo) lightboxVideo.hidden = !c.video;
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
