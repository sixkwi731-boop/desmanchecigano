/* =============================================
   Popup de boas-vindas
   ============================================= */
(function () {
  var overlay  = document.getElementById('popupOverlay');
  var closeBtn = document.getElementById('popupClose');
  var skipBtn  = document.getElementById('popupSkip');

  if (!overlay) return;

  function openPopup() {
    overlay.classList.add('popup--visible');
  }

  function closePopup() {
    overlay.classList.remove('popup--visible');
    sessionStorage.setItem('popupShown', '1');
  }

  // Só mostra uma vez por sessão
  if (!sessionStorage.getItem('popupShown')) {
    setTimeout(openPopup, 4000);
  }

  closeBtn.addEventListener('click', closePopup);
  skipBtn.addEventListener('click', closePopup);

  // Fecha ao clicar fora da caixa
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  // Fecha com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });
})();

/* =============================================
   Botão Flutuante WhatsApp — mensagens rotativas
   ============================================= */
(function () {
  var bubble     = document.getElementById('wppBubble');
  var bubbleText = document.getElementById('wppBubbleText');
  var closeBtn   = document.getElementById('wppBubbleClose');

  if (!bubble || !bubbleText) return;

  var messages = [
    '🚗 <span>Temos todas as peças</span> que você precisa!',
    '🇧🇷 Entregamos para <span>todo o Brasil</span> com agilidade.',
    '🔧 Motores, câmbios, suspensão e muito mais!',
    '📦 <span>Entrega rápida</span> para qualquer estado.',
    '✅ Peças com <span>Nota Fiscal e garantia</span>.',
    '🚀 Solicite seu orçamento <span>agora pelo WhatsApp!</span>',
    '🏆 <span>+13 anos</span> entregando confiança no Brasil.',
    '🔩 Nacionais e importados em <span>estoque próprio</span>.',
  ];

  var current   = 0;
  var hidden    = false;
  var SHOW_MS   = 4500;
  var FADE_MS   = 350;

  function showMessage(idx) {
    if (hidden) return;
    bubbleText.style.animation = 'none';
    bubbleText.offsetHeight; /* reflow */
    bubbleText.innerHTML = messages[idx];
    bubbleText.style.animation = 'wppTextFade 0.35s ease both';
  }

  function rotate() {
    if (hidden) return;
    current = (current + 1) % messages.length;
    showMessage(current);
  }

  /* Inicia após 2s */
  setTimeout(function () {
    showMessage(0);
    setInterval(rotate, SHOW_MS);
  }, 2000);

  /* Fechar balão */
  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    hidden = true;
    bubble.style.transition = 'opacity 0.3s, transform 0.3s';
    bubble.style.opacity = '0';
    bubble.style.transform = 'scale(0.7)';
    setTimeout(function () { bubble.classList.add('wpp-bubble--hidden'); }, 320);
  });
})();

/* =============================================
   Header: scroll shadow + hamburger mobile
   ============================================= */
(function () {
  var header    = document.getElementById('header');
  var hamburger = document.getElementById('hamburger');
  var nav       = document.getElementById('headerNav');

  /* Sombra ao rolar */
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Hamburger toggle */
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    /* Fecha ao clicar em um link */
    nav.querySelectorAll('.header-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Fecha ao clicar fora */
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* =============================================
   Carrossel de Depoimentos
   ============================================= */
(function () {
  var track    = document.getElementById('depoimentosTrack');
  var dotsWrap = document.getElementById('depDots');
  var btnPrev  = document.getElementById('depPrev');
  var btnNext  = document.getElementById('depNext');

  if (!track) return;

  var cards      = Array.from(track.querySelectorAll('.depoimento-card'));
  var total      = cards.length;
  var current    = 0;
  var autoTimer  = null;
  var AUTO_MS    = 4000;
  var perView    = getPerView();

  /* --- Criação dos dots --- */
  var numGroups = Math.ceil(total / perView);
  var dots = [];

  for (var i = 0; i < numGroups; i++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dep-dot';
    dot.setAttribute('aria-label', 'Grupo ' + (i + 1) + ' de depoimentos');
    dot.dataset.idx = i;
    dot.addEventListener('click', onDotClick);
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  /* --- Quantos cards por vez dependendo do viewport --- */
  function getPerView() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  /* --- Calcula a posição correta do track --- */
  function getOffset(groupIdx) {
    var cardWidth  = cards[0].offsetWidth;
    var gap        = 24; // 1.5rem = 24px
    return groupIdx * perView * (cardWidth + gap);
  }

  /* --- Atualiza a posição do carrossel --- */
  function goTo(groupIdx) {
    current = Math.max(0, Math.min(groupIdx, numGroups - 1));
    var offset = getOffset(current);
    track.style.transform = 'translateX(-' + offset + 'px)';

    /* Destaque do card ativo (primeiro do grupo) */
    cards.forEach(function (c, i) {
      c.classList.toggle('active', i >= current * perView && i < (current + 1) * perView);
    });

    /* Dots */
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function next() {
    goTo(current < numGroups - 1 ? current + 1 : 0);
  }

  function prev() {
    goTo(current > 0 ? current - 1 : numGroups - 1);
  }

  /* --- Autoplay --- */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, AUTO_MS);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* --- Eventos de botão --- */
  btnNext.addEventListener('click', function () { next(); resetAuto(); });
  btnPrev.addEventListener('click', function () { prev(); resetAuto(); });

  function onDotClick(e) {
    goTo(parseInt(e.currentTarget.dataset.idx));
    resetAuto();
  }

  /* --- Pausa ao hover --- */
  var slider = document.querySelector('.depoimentos-slider');
  if (slider) {
    slider.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    slider.addEventListener('mouseleave', startAuto);
  }

  /* --- Suporte a swipe (touch) --- */
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  /* --- Recalcula ao redimensionar --- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newPer = getPerView();
      if (newPer !== perView) {
        perView   = newPer;
        numGroups = Math.ceil(total / perView);

        /* Recria os dots */
        dotsWrap.innerHTML = '';
        dots = [];
        for (var i = 0; i < numGroups; i++) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'dep-dot';
          dot.setAttribute('aria-label', 'Grupo ' + (i + 1) + ' de depoimentos');
          dot.dataset.idx = i;
          dot.addEventListener('click', onDotClick);
          dotsWrap.appendChild(dot);
          dots.push(dot);
        }
      }
      current = Math.min(current, numGroups - 1);
      goTo(current);
    }, 150);
  });

  /* --- Init --- */
  goTo(0);
  startAuto();
})();

/* ==============================================
   Animações de Scroll (Intersection Observer)
   ============================================== */
(function () {
  /* Hero: dispara imediatamente sem esperar scroll */
  document.querySelectorAll('.hero .anim').forEach(function (el) {
    el.classList.add('is-visible');
  });

  /* Verifica suporte ao IntersectionObserver */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.anim').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); /* Anima só uma vez */
      }
    });
  }, {
    threshold: 0.12,   /* 12% do elemento visível já dispara */
    rootMargin: '0px 0px -40px 0px'
  });

  /* Observa todos os elementos animáveis (exceto hero, já visível) */
  document.querySelectorAll('.anim:not(.hero .anim)').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ==============================================
   Contador animado nos Stats
   ============================================== */
(function () {
  var counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  var observed = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el     = entry.target;
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      var start  = 0;
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        /* Easing out quart */
        var ease = 1 - Math.pow(1 - progress, 4);
        var current = Math.round(ease * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observed.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observed.observe(el); });
})();
