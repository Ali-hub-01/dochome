/* DocHome — интерактив лэндинга (чистый JS, без библиотек) */
(function () {
  'use strict';

  var C = window.DOCHOME || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Google Ads: подключаем тег только если указан ID в config.js ---------- */
  if (C.googleAdsId) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.googleAdsId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', C.googleAdsId);
  }
  function conversion(kind) {
    var id = C.conversions && C.conversions[kind];
    if (!id || typeof window.gtag !== 'function') return;
    try { window.gtag('event', 'conversion', { send_to: id, value: 1.0, currency: 'USD' }); } catch (e) {}
  }
  window.dochomeConversion = conversion;

  /* ---------- Прогресс прокрутки + header ---------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var mobileBar = document.getElementById('mobileBar');
  var hero = document.getElementById('hero');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 20);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      if (mobileBar) mobileBar.classList.toggle('show', y > (hero ? hero.offsetHeight * 0.6 : 400) && !formInView);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });

  /* ---------- Reveal-анимации ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-up, #steps');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Счётчики ---------- */
  var counters = document.querySelectorAll('.count');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduced) { el.textContent = String(target); return; }
    var duration = 1500, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && !reduced) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Параллакс и наклон в герое (только мышь) ---------- */
  var heroVisual = document.getElementById('heroVisual');
  if (heroVisual && finePointer && !reduced) {
    var layers = heroVisual.querySelectorAll('.parallax');
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(step);
    });
    hero.addEventListener('mouseleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); });
    function step() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 0.05;
        el.style.transform = 'translate(' + (cx * d * 400) + 'px,' + (cy * d * 400) + 'px)';
      });
      raf = (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(step) : null;
    }
  }

  /* ---------- Магнитные кнопки ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + x + 'px,' + (y - 3) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Врачи: фильтр, «показать ещё», 3D-наклон ---------- */
  var chips = document.querySelectorAll('#docFilter .chip');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.doc-card'));
  var docEmpty = document.getElementById('docEmpty');
  var moreBtn = document.getElementById('docMore');
  var moreWrap = moreBtn ? moreBtn.parentElement : null;
  var LIMIT = 8;
  var expanded = false;
  var currentFilter = 'all';

  function applyDoctors() {
    var visible = 0;
    cards.forEach(function (card) {
      var specs = (card.getAttribute('data-spec') || '').split(/\s+/);
      var match = currentFilter === 'all' || specs.indexOf(currentFilter) !== -1;
      card.classList.toggle('hidden-by-filter', !match);
      if (match) {
        visible++;
        var beyond = !expanded && currentFilter === 'all' && visible > LIMIT;
        card.classList.toggle('hidden-by-more', beyond);
        if (!beyond) card.classList.add('in');
      } else {
        card.classList.remove('hidden-by-more');
      }
    });
    if (docEmpty) docEmpty.hidden = visible > 0;
    if (moreWrap) moreWrap.hidden = !(currentFilter === 'all' && cards.length > LIMIT);
    if (moreBtn) {
      moreBtn.classList.toggle('is-open', expanded);
      moreBtn.querySelector('span').textContent = expanded ? 'Свернуть' : 'Показать всех врачей';
    }
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      currentFilter = chip.getAttribute('data-filter');
      applyDoctors();
    });
  });
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      expanded = !expanded;
      applyDoctors();
      if (!expanded) document.getElementById('vrachi').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  }
  applyDoctors();

  if (finePointer && !reduced) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (x * 10) + 'deg');
        card.style.setProperty('--rx', (-y * 10) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ---------- Форма заявки → WhatsApp (+ Telegram, + конверсия) ---------- */
  var WA = C.wa || '77078141226';
  var form = document.getElementById('leadForm');
  var success = document.getElementById('formSuccess');
  var formInView = false;
  var zayavka = document.getElementById('zayavka');
  if (zayavka && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      formInView = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.2 }).observe(zayavka);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var service = form.elements.service.value;
      var address = form.elements.address.value.trim();
      var comment = form.elements.comment.value.trim();

      var valid = true;
      [form.elements.name, form.elements.phone].forEach(function (input) {
        var bad = !input.value.trim() || (input.type === 'tel' && input.value.replace(/\D/g, '').length < 10);
        input.classList.toggle('invalid', bad);
        if (bad) valid = false;
      });
      if (!valid) { (name ? form.elements.phone : form.elements.name).focus(); return; }

      var lines = ['Здравствуйте! Заявка с сайта DocHome:', 'Имя: ' + name, 'Телефон: ' + phone];
      if (service) lines.push('Услуга: ' + service);
      if (address) lines.push('Район/адрес: ' + address);
      if (comment) lines.push('Комментарий: ' + comment);

      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');

      form.hidden = true;
      success.hidden = false;

      conversion('lead');
      if (window.dochomeSendLead) {
        window.dochomeSendLead({ name: name, phone: phone, service: service, address: address, comment: comment, source: 'форма на сайте' });
      }
    });
    form.addEventListener('input', function (e) {
      if (e.target.classList && e.target.classList.contains('invalid') && e.target.value.trim()) e.target.classList.remove('invalid');
    });
  }

  /* ---------- Клики по телефону / WhatsApp → конверсии ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) conversion('phone');
    else if (href.indexOf('wa.me') !== -1) conversion('contact');
  });

  /* ---------- Год в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
