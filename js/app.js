// ─────────────────────────────────────────
// APP — Lógica principal y navegación
// ─────────────────────────────────────────

// ── Iconos de tiempo (según weathercode WMO) ──
const WEATHER_ICONS = {
  sun:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  cloudSun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z"/></svg>`,
  cloud:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>`,
  rain:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
  storm:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`,
  fog:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="M3 9h2"/><path d="M12 2a7 7 0 0 1 7 7"/><path d="M4.26 11.81A9 9 0 0 0 12 20h7"/><path d="M3 15h18"/><path d="M3 19h18"/></svg>`,
};

function getWeatherIcon(code) {
  if (code === 0)              return WEATHER_ICONS.sun;
  if (code <= 3)               return WEATHER_ICONS.cloudSun;
  if (code <= 48)              return WEATHER_ICONS.fog;
  if (code <= 67 || code <= 82) return WEATHER_ICONS.rain;
  if (code >= 95)              return WEATHER_ICONS.storm;
  return WEATHER_ICONS.cloud;
}

// ── Iconos SVG (Lucide) ──
const ICONS = {
  wind:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  wave:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  zap:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  timer:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></svg>`,
  compass:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  thermometer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
};

// ── Ilustraciones por estado ──
const ESTADO_ILLUS = {
  'piscina':         'assets/illustrations/Resolucion/Estados/Piscina.svg',
  'muy-agradable':   'assets/illustrations/Resolucion/Estados/Muyagradable.svg',
  'se-puede-salir':  'assets/illustrations/Resolucion/Estados/Sepuedesalir.svg',
  'exigente':        'assets/illustrations/Resolucion/Estados/Exigente.svg',
  'no-recomendable': 'assets/illustrations/Resolucion/Estados/Norecomendable.svg',
};

// ── Iconos SVG para cada franja horaria (v2.1: 4 franjas) ──
const FRANJA_ICONS = [
  // 0 Amanecer — sol saliendo
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>`,
  // 1 Día — sol completo
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  // 2 Tarde — sol bajando
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 6 12 10 8 6"/></svg>`,
  // 3 Noche — luna
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
];

// ── PWA Install ──
let installPrompt = null;

function initInstallButton() {
  const btn = document.getElementById('btn-install');
  if (!btn) return;

  // Ya instalada como PWA → botón nunca aparece
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) return;

  // En browser: siempre visible
  btn.classList.remove('hidden');

  // Capturar el prompt cuando el navegador lo ofrezca (Chrome/Edge/Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
  });

  btn.addEventListener('click', async () => {
    if (installPrompt) {
      // Chrome/Edge/Android: prompt nativo
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      installPrompt = null;
      if (outcome === 'accepted') btn.classList.add('hidden');
    } else {
      // Safari/Firefox: no hay prompt nativo, abrir about sheet con instrucciones
      document.getElementById('about-overlay').classList.add('active');
      document.getElementById('about-sheet').classList.add('active');
    }
  });

  // Ocultar si se instala desde otro punto (p.ej. barra del navegador)
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    btn.classList.add('hidden');
  });
}

// ── Estado ──
let currentSpot   = null;
let currentData   = null;
let currentD        = null;
let currentWarnings = [];
let deleteMode      = null;
let swiper        = null;   // unused — carrusel eliminado
let currentDay    = 0;
let currentFranja = 1;
let showSevenDay  = false;
let _historyNavigation = false;
let _currentState = null;

// ── Vistas ──
let _txTimer = null;

function transitionViews(toId, direction) {
  if (_txTimer) { clearTimeout(_txTimer); _txTimer = null; }

  const homeEl    = document.getElementById('view-home');
  const resultsEl = document.getElementById('view-results');

  if (direction === 'forward') {
    // Home retrocede; Results sube como card
    homeEl.classList.remove('fx-undim');
    homeEl.classList.add('fx-dim');

    resultsEl.classList.remove('fx-exit');
    resultsEl.classList.add('active');
    // doble rAF: garantiza que el browser pinta translateY(100%) antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => {
      resultsEl.classList.add('fx-enter');
    }));

    // Ocultar home tras la animación (queda detrás de results)
    _txTimer = setTimeout(() => {
      homeEl.classList.remove('active');
      _txTimer = null;
    }, 460);

  } else {
    // Results baja; Home vuelve a primer plano
    homeEl.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      homeEl.classList.remove('fx-dim');
      homeEl.classList.add('fx-undim');
    }));

    resultsEl.classList.add('fx-exit');

    _txTimer = setTimeout(() => {
      resultsEl.classList.remove('active', 'fx-enter', 'fx-exit');
      homeEl.classList.remove('fx-undim');
      _txTimer = null;
    }, 320);
  }

  document.body.dataset.view = toId;
}

function _applyView(id) {
  // Usado solo para el estado inicial y popstate
  transitionViews(id, id === 'view-home' ? 'back' : 'forward');
}

function showView(id) {
  const state = history.state;
  const newState = { view: id };
  if (id === 'view-results' && !state?.sheet && state?.view === 'view-home') {
    history.pushState(newState, '');
  } else {
    history.replaceState(newState, '');
  }
  _currentState = newState;
  transitionViews(id, id === 'view-results' ? 'forward' : 'back');
}

// ── Abreviatura de ciudad ──
const CITY_ABBREVS = {
  // Cataluña
  'barcelona': 'BCN', 'badalona': 'BDN', 'tarragona': 'TGN',
  'sitges': 'STG', 'vilanova i la geltru': 'VNG', 'mataro': 'MAT',
  'blanes': 'BLN', 'lloret de mar': 'LLM', 'roses': 'ROS',
  'cadaques': 'CDQ', 'l\'escala': 'ESC', 'palamos': 'PLS',
  // Comunitat Valenciana
  'valencia': 'VLC', 'alicante': 'ALC', 'gandia': 'GND',
  'denia': 'DEN', 'javea': 'JAV', 'calpe': 'CPE',
  'benidorm': 'BND', 'altea': 'ALT', 'torrevieja': 'TRV',
  // Andalucía
  'malaga': 'MAG', 'cadiz': 'CDZ', 'huelva': 'HUE',
  'almeria': 'ALM', 'marbella': 'MBL', 'tarifa': 'TRF',
  'algeciras': 'ALG', 'nerja': 'NJA', 'roquetas de mar': 'RQT',
  // País Vasco / Cantabria / Galicia
  'san sebastian': 'SSB', 'donostia': 'SSB', 'bilbao': 'BIO',
  'santander': 'SDR', 'castro urdiales': 'CTU', 'laredo': 'LRD',
  'vigo': 'VGO', 'a coruna': 'COR', 'pontevedra': 'PON',
  'baiona': 'BAI',
  // Asturias
  'gijon': 'GJN', 'oviedo': 'OVD', 'aviles': 'AVL',
  // Islas Baleares
  'palma': 'PMI', 'ibiza': 'IBZ', 'eivissa': 'IBZ',
  'mahon': 'MAH', 'ciudadela': 'CIU', 'formentera': 'FRM',
  // Islas Canarias
  'las palmas': 'LPA', 'santa cruz de tenerife': 'TFN',
  'tenerife': 'TFN', 'lanzarote': 'LZT', 'fuerteventura': 'FTV',
  // Otras
  'madrid': 'MAD', 'murcia': 'MRC', 'castellon': 'CST',
};

function cityAbbrev(spot) {
  if (spot.abbrev) return spot.abbrev;
  if (!spot.city) return '';
  // Normalizar: minúsculas + sin acentos
  const key = spot.city.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (CITY_ABBREVS[key]) return CITY_ABBREVS[key];
  // Fallback: primeras 3 consonantes del nombre
  const consonants = spot.city.toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
    .replace(/[AEIOU]/g, '');
  return consonants.slice(0, 3) || spot.city.slice(0, 3).toUpperCase();
}

// ── Home ──
function renderSpotList() {
  const container = document.getElementById('spots-row');
  const spots     = getAllSpots();
  container.innerHTML = '';

  // Estado A — sin playas guardadas
  if (spots.length === 0) {
    const searchBtn = document.createElement('button');
    searchBtn.className = 'btn-search-main';
    searchBtn.id = 'btn-search-main';
    searchBtn.innerHTML = `
      <span class="btn-search-main__label">Busca tu playa favorita</span>
      <span class="btn-search-main__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </span>
    `;
    searchBtn.addEventListener('click', () => openSearch(searchBtn));
    container.appendChild(searchBtn);

    const sub = document.createElement('p');
    sub.className = 'home-state-a__sub';
    sub.textContent = 'Y te cuento si está para salir con la tabla';
    container.appendChild(sub);
    return;
  }

  // Estado B — con playas guardadas
  spots.forEach((spot, index) => {
    const spotRow = document.createElement('div');
    spotRow.className = 'spot-row';

    // Abbrev fuera del botón, a la izquierda
    const abbrevEl = document.createElement('span');
    abbrevEl.className = 'spot-abbrev';
    abbrevEl.textContent = cityAbbrev(spot);
    spotRow.appendChild(abbrevEl);

    // Botón spot
    const btn = document.createElement('button');
    btn.className = 'spot-item' + (deleteMode === spot.id ? ' spot-item--delete-mode' : '');
    btn.dataset.id = spot.id;
    btn.innerHTML = `
      <span class="spot-item__name">${spot.name}</span>
      <span class="spot-item__delete" data-delete="${spot.id}">✕</span>
    `;

    btn.addEventListener('click', (e) => {
      if (e.target.dataset.delete) return;
      loadSpot(spot);
    });

    let pressTimer;
    btn.addEventListener('pointerdown', () => {
      pressTimer = setTimeout(() => {
        deleteMode = spot.id;
        renderSpotList();
      }, 600);
    });
    btn.addEventListener('pointerup',    () => clearTimeout(pressTimer));
    btn.addEventListener('pointerleave', () => clearTimeout(pressTimer));

    spotRow.appendChild(btn);

    // Columna derecha: botón búsqueda en el último spot, placeholder en los demás
    if (index === spots.length - 1) {
      const searchCircle = document.createElement('button');
      searchCircle.className = 'btn-search-circle';
      searchCircle.id = 'btn-search-circle';
      searchCircle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      searchCircle.addEventListener('click', () => openSearch(searchCircle));
      spotRow.appendChild(searchCircle);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'spot-row__spacer';
      spotRow.appendChild(spacer);
    }

    container.appendChild(spotRow);
  });

  // Botones borrar
  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeUserSpot(btn.dataset.delete);
      deleteMode = null;
      renderSpotList();
    });
  });
}

// ── Navegación temporal v2.0 ──

// Day tabs: Hoy | Mañana | 7 días
function positionDayIndicator(animate) {
  const container = document.querySelector('.results__day-tabs');
  if (!container) return;
  const indicator = container.querySelector('.results__day-indicator');
  const activeTab = container.querySelector('.results__day-tab--active');
  if (!indicator || !activeTab) return;

  if (!animate) {
    indicator.classList.add('no-transition');
    // forzar reflow antes de mover sin transición
    indicator.getBoundingClientRect();
  } else {
    indicator.classList.remove('no-transition');
  }

  indicator.style.width     = activeTab.offsetWidth + 'px';
  indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

function renderDayTabs(animate = false) {
  document.querySelectorAll('.results__day-tab').forEach(tab => {
    const day = tab.dataset.day;
    const isActive = showSevenDay ? day === '7' : day === String(currentDay);
    tab.classList.toggle('results__day-tab--active', isActive);
  });
  if (animate) {
    positionDayIndicator(true);
  } else {
    requestAnimationFrame(() => positionDayIndicator(false));
  }
}

// Mueve el indicator al pill indicado (con o sin animación)
function positionFranjaIndicator(index, animate) {
  const container = document.getElementById('results-franjas-pills');
  if (!container) return;
  const indicator = container.querySelector('.results__franja-indicator');
  const pills     = container.querySelectorAll('.results__franja-pill');
  if (!indicator || !pills[index]) return;
  const pill = pills[index];
  if (!animate) indicator.classList.add('no-transition');
  else          indicator.classList.remove('no-transition');
  indicator.style.width     = pill.offsetWidth + 'px';
  indicator.style.transform = `translateX(${pill.offsetLeft}px)`;
}

// Fade out → render → fade in para refrescos de datos (cambio de día)
function refreshWithFade(el, renderFn, inClass, outMs) {
  el.classList.remove('data-refresh-in--day');
  el.classList.add('data-refreshing');
  setTimeout(() => {
    renderFn();
    el.classList.remove('data-refreshing');
    el.classList.add(inClass);
    setTimeout(() => el.classList.remove(inClass), 300);
  }, outMs);
}

// Slide direccional → render → spring in + stagger opacity (cambio de franja)
function refreshFranjaContent(oldIndex, newIndex) {
  const el  = document.getElementById('results-main-content');
  const dir = newIndex > oldIndex ? 1 : -1; // 1 = siguiente, -1 = anterior

  // Reducir movimiento si el usuario lo prefiere
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    renderResults(sliderIndex(currentDay, newIndex));
    return;
  }

  // ── Fase 1: salida (exit) ──────────────────────────────────────────────
  el.style.transition = 'transform 0.14s cubic-bezier(0.4, 0, 1, 1), opacity 0.10s ease';
  el.style.transform  = `translateX(${dir * -50}px)`;
  el.style.opacity    = '0';
  el.style.pointerEvents = 'none';

  setTimeout(() => {
    // ── Fase 2: snap al lado contrario + render ────────────────────────
    el.style.transition = 'none';
    el.style.transform  = `translateX(${dir * 70}px)`;
    el.style.opacity    = '1';

    renderResults(sliderIndex(currentDay, newIndex));

    // Pre-ocultar elementos para el stagger
    const items = [
      el.querySelector('.bocadillo'),
      el.querySelector('.diagnosis__croc'),
    ].filter(Boolean);
    items.forEach(item => {
      item.style.transition = 'none';
      item.style.opacity    = '0';
    });

    // Forzar reflow — garantiza que el browser aplica el estado inicial
    el.getBoundingClientRect();

    // ── Fase 3a: spring del contenedor ────────────────────────────────
    el.style.transition    = 'transform 0.42s cubic-bezier(0.34, 1.12, 0.64, 1)';
    el.style.transform     = 'translateX(0)';
    el.style.pointerEvents = 'auto';

    // ── Fase 3b: stagger de elementos (solo opacity) ───────────────────
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.22s ease';
        item.style.opacity    = '1';
        setTimeout(() => {
          item.style.transition = '';
          item.style.opacity    = '';
        }, 240);
      }, i * 40); // diagnosis 0ms · bloque1 40ms · bloque2 80ms · bloque3 120ms
    });

    // Limpiar contenedor tras el spring
    setTimeout(() => {
      el.style.transition    = '';
      el.style.transform     = '';
      el.style.opacity       = '';
      el.style.pointerEvents = '';
    }, 460);

  }, 110); // overlap: exit 140ms, entrance arranca a 110ms
}

// Franjas — nombre + icono weather real + temperatura
function renderFranjas() {
  const container = document.getElementById('results-franjas-pills');
  container.innerHTML = '';

  // Indicator — se renderiza primero para quedar detrás de los pills (z-index)
  const indicator = document.createElement('div');
  indicator.className = 'results__franja-indicator no-transition';
  container.appendChild(indicator);

  FRANJAS.forEach((f, i) => {
    let weatherIcon = '';
    let tempStr = '';
    if (currentData) {
      const d = getDataForSlider(sliderIndex(currentDay, i), currentData.marine, currentData.forecast);
      weatherIcon = getWeatherIcon(d.weathercode);
      tempStr = `${Math.round(d.tempC)}°`;
    }
    const pill = document.createElement('button');
    pill.className = 'results__franja-pill' + (i === currentFranja ? ' active' : '');
    pill.innerHTML = `
      <span class="results__franja-name">${f.label}</span>
      <span class="results__franja-weather">
        <span class="results__franja-icon">${weatherIcon}</span>
        <span class="results__franja-temp">${tempStr}</span>
      </span>
    `;
    pill.addEventListener('click', () => {
      if (showSevenDay) return;
      const oldFranja = currentFranja;
      currentFranja = i;
      positionFranjaIndicator(i, true);
      container.querySelectorAll('.results__franja-pill').forEach((p, idx) => {
        p.classList.toggle('active', idx === i);
      });
      if (oldFranja !== currentFranja) refreshFranjaContent(oldFranja, currentFranja);
    });
    container.appendChild(pill);
  });

  // Posicionar indicator tras pintar el DOM (sin animación)
  requestAnimationFrame(() => positionFranjaIndicator(currentFranja, false));
}

// ── Cargar datos y mostrar resultados ──
async function loadSpot(spot) {
  currentSpot   = spot;
  currentDay    = 0;
  currentFranja = getCurrentFranjaIndex();
  showSevenDay  = false;
  setActiveSpot(spot.id);
  showView('view-results');

  document.getElementById('results-spot-name').textContent = spot.name;
  document.getElementById('ctx-city').textContent         = spot.city || '—';
  document.getElementById('diagnosis-title').textContent = 'Cargando...';
  document.getElementById('diagnosis-illus').innerHTML   = '';
  document.getElementById('nb-encounter-title').textContent = '—';
  document.getElementById('nb-encounter-desc').textContent  = '—';
  document.getElementById('nb-demand-title').textContent    = '—';
  document.getElementById('nb-demand-desc').textContent     = '—';
  document.getElementById('nb-fit-title').textContent       = '—';
  document.getElementById('nb-fit-desc').textContent        = '—';
  document.getElementById('tech-blocks').innerHTML          = '';
  document.getElementById('results-main-content').classList.remove('hidden');
  document.getElementById('results-seven-day').classList.add('hidden');

  renderDayTabs();
  renderFranjas();
  updateFavoriteBtn();

  try {
    currentData = await fetchSpotData(spot);
    renderResults(sliderIndex(currentDay, currentFranja));
  } catch (err) {
    document.getElementById('diagnosis-title').textContent = 'Sin conexión';
  }
}

function renderResults(sliderIdx) {
  if (!currentData) return;
  const { marine, forecast } = currentData;
  const d = getDataForSlider(sliderIdx, marine, forecast);

  // Diagnóstico
  currentD = d;
  const { estado, warnings } = diagnosticar(d, currentSpot, d.weathercode);
  currentWarnings = warnings;
  const info = ESTADOS[estado];

  // Ciudad (actualizar por si acaso)
  document.getElementById('ctx-city').textContent = currentSpot.city || '—';

  // Título diagnóstico (bocadillo)
  document.getElementById('diagnosis-title').textContent = info.titulo;

  // Bloques narrativos — bocadillo muestra desc + desc + fit.title
  const nb = buildNarrativeBlocks(d, estado, warnings);
  document.getElementById('nb-encounter-desc').textContent = nb.encounter.desc;
  document.getElementById('nb-demand-desc').textContent    = nb.demand.desc;
  document.getElementById('nb-fit-title').textContent      = nb.fit.title;

  // Bloques técnicos
  renderTechBlocks(d, warnings);

  // Actualizar franjas con datos reales (weather icon + temp)
  renderFranjas();
}

// ── Favoritos ──
function isSpotSaved(id) {
  return getAllSpots().some(s => s.id === id);
}

function updateFavoriteBtn() {
  const btn = document.getElementById('btn-favorite');
  if (!btn || !currentSpot) return;
  const saved = isSpotSaved(currentSpot.id);
  btn.classList.toggle('saved', saved);
  btn.setAttribute('aria-label', saved ? 'Quitar de favoritos' : 'Guardar playa');
}

function toggleFavorite() {
  if (!currentSpot) return;
  if (isSpotSaved(currentSpot.id)) {
    removeUserSpot(currentSpot.id);
    updateFavoriteBtn();
  } else {
    // Si es un spot temporal, asignar id permanente antes de guardar
    if (currentSpot.id.startsWith('view-')) {
      currentSpot = { ...currentSpot, id: `user-${Date.now()}` };
    }
    addUserSpot(currentSpot);
    setActiveSpot(currentSpot.id);
    updateFavoriteBtn();
  }
  renderSpotList();
}

function shortDirLabel(degrees) {
  if (degrees >= 225 && degrees <= 315) return 'Terral';
  if (degrees >= 45  && degrees <= 135) return 'De mar';
  return 'Lateral';
}

// ── Tech blocks — datos técnicos inline ──

const INFO_SVG = `<svg class="tech-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2.4"/></svg>`;
const WARN_SVG = `<svg class="tech-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.4"/></svg>`;

function buildCompassSVG(dir) {
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180;
    const isCard = i % 3 === 0;
    const r1 = isCard ? 31 : 33, r2 = 37;
    ticks.push(`<line x1="${(40+r1*Math.sin(a)).toFixed(1)}" y1="${(40-r1*Math.cos(a)).toFixed(1)}" x2="${(40+r2*Math.sin(a)).toFixed(1)}" y2="${(40-r2*Math.cos(a)).toFixed(1)}" stroke="rgba(10,10,10,${isCard?'0.22':'0.12'})" stroke-width="${isCard?1.5:1}" stroke-linecap="round"/>`);
  }
  return `<svg class="tech-compass-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="39" fill="rgba(10,10,10,0.03)" stroke="rgba(10,10,10,0.09)" stroke-width="1"/>
    ${ticks.join('')}
    <text x="40" y="14" text-anchor="middle" dominant-baseline="middle" class="compass-lbl">N</text>
    <text x="66" y="41" text-anchor="middle" dominant-baseline="middle" class="compass-lbl">E</text>
    <text x="40" y="68" text-anchor="middle" dominant-baseline="middle" class="compass-lbl">S</text>
    <text x="14" y="41" text-anchor="middle" dominant-baseline="middle" class="compass-lbl">O</text>
    <g transform="rotate(${dir}, 40, 40)">
      <line x1="40" y1="40" x2="40" y2="57" stroke="rgba(100,110,140,0.28)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="40" y1="40" x2="40" y2="20" stroke="#314FFF" stroke-width="3" stroke-linecap="round"/>
      <polygon points="40,13 36,22 44,22" fill="#314FFF"/>
    </g>
    <circle cx="40" cy="40" r="3" fill="rgba(10,10,10,0.10)"/>
    <circle cx="40" cy="3.5" r="2.5" fill="#C84B4B" opacity="0.75"/>
  </svg>`;
}

// ── Info copy — contenido de los popups de cada métrica ──
const INFO_COPY = {
  'wind-speed': {
    title: 'Velocidad media',
    intro: 'Indica la fuerza constante del viento. Es lo que vas a notar todo el rato mientras remas. Cuanto más alto es, más te cuesta avanzar y más te empuja la tabla.',
    rows: [
      { range: '0–6 kn',   label: 'Calma / casi no se nota', desc: 'Apenas hay viento. Remas sin esfuerzo y la tabla va recta.' },
      { range: '6–10 kn',  label: 'Brisa ligera',            desc: 'Se nota un poco, pero no molesta. Puedes remar cómodo.' },
      { range: '10–15 kn', label: 'Viento moderado',         desc: 'Ya ofrece resistencia. Remar contra él cuesta y te cansas más.' },
      { range: '15–20 kn', label: 'Viento fuerte',           desc: 'Te frena claramente y te empuja. Mantener rumbo exige esfuerzo.' },
      { range: '+20 kn',   label: 'Muy fuerte',              desc: 'Remar se vuelve muy difícil. Avanzar o volver puede ser complicado.' },
    ],
    matchFn: v => v >= 20 ? 4 : v >= 15 ? 3 : v >= 10 ? 2 : v >= 6 ? 1 : 0,
  },
  'wind-gusts': {
    title: 'Rachas',
    intro: 'Son los momentos en los que el viento pega más fuerte de lo normal. No indica si cambia mucho, sino lo fuerte que golpea cuando lo hace. Una racha es un empujón puntual.',
    rows: [
      { range: '0–8 kn',   label: 'Sin rachas',         desc: 'El viento es uniforme. No hay golpes ni tirones.' },
      { range: '8–12 kn',  label: 'Rachas suaves',      desc: 'Algún empujón puntual. Se nota, pero no afecta demasiado.' },
      { range: '12–16 kn', label: 'Rachas notables',    desc: 'Empujones claros que pueden descolocarte. Tendrás que corregir equilibrio.' },
      { range: '16–22 kn', label: 'Rachas fuertes',     desc: 'Golpes de viento que afectan de verdad. Pueden frenarte o hacerte perder estabilidad.' },
      { range: '+22 kn',   label: 'Rachas muy fuertes', desc: 'Empujones bruscos y potentes. Pueden tirarte al agua o alejarte sin darte cuenta.' },
    ],
    matchFn: v => v >= 22 ? 4 : v >= 16 ? 3 : v >= 12 ? 2 : v >= 8 ? 1 : 0,
  },
  'wind-variability': {
    title: 'Variabilidad',
    intro: 'Indica cuánto cambia el viento a lo largo del rato. No es lo fuerte que sopla, sino si se mantiene igual o va cambiando continuamente.',
    rows: [
      { range: '0–3',  label: 'Viento estable', desc: 'Sopla siempre igual. Remas cómodo y sin sorpresas.' },
      { range: '3–6',  label: 'Algo variable',  desc: 'Cambia un poco. Notarás pequeñas variaciones, pero no molestan.' },
      { range: '6–10', label: 'Variable',       desc: 'El viento sube y baja constantemente. A ratos no lo notas y de repente aparece. Tendrás que estar atento.' },
      { range: '+10',  label: 'Muy variable',   desc: 'Cambios continuos. El viento va y viene todo el tiempo. Cuesta encontrar estabilidad aunque no sea fuerte.' },
    ],
    matchFn: v => v >= 10 ? 3 : v >= 6 ? 2 : v >= 3 ? 1 : 0,
  },
  'wind-direction': {
    title: 'Dirección del viento',
    intro: 'Indica desde dónde viene el viento respecto a la playa. No cambia lo fuerte que sopla, pero sí hacia dónde te empuja. Es clave porque puede acercarte a la orilla… o alejarte sin darte cuenta.',
    rows: [
      { range: 'Onshore',  label: 'De mar',    desc: 'Viene desde el mar hacia tierra. Te empuja hacia la orilla. Más seguro: si te paras, vuelves poco a poco.' },
      { range: 'Offshore', label: 'De tierra', desc: 'Viene desde tierra hacia el mar. Te empuja hacia fuera. Parece tranquilo, pero te puede alejar sin que lo notes.' },
      { range: 'Lateral',  label: 'Lateral',   desc: 'Sopla de lado. No te acerca ni te aleja directamente, pero te desplaza. Tendrás que corregir dirección constantemente.' },
    ],
    matchFn: v => windDirCategory(v, currentSpot), // 0=onshore, 1=offshore, 2=lateral
  },
  'wave-height': {
    title: 'Altura de ola',
    intro: 'Indica el tamaño de las olas. Es lo que más determina cuánto se mueve el mar bajo la tabla. Cuanto más alta es la ola, más te balancea y más difícil es mantener el equilibrio.',
    rows: [
      { range: '0–0.2 m',   label: 'Mar en calma',   desc: 'Apenas hay movimiento. Sensación de piscina.' },
      { range: '0.2–0.6 m', label: 'Olas pequeñas',  desc: 'Algo de balanceo, pero fácil de controlar.' },
      { range: '0.6–1.0 m', label: 'Movimiento real', desc: 'El mar ya te mueve. Necesitas equilibrio y atención.' },
      { range: '1.0–1.5 m', label: 'Mar movido',      desc: 'Mantenerse de pie cuesta. Cada ola te descoloca.' },
      { range: '+1.5 m',    label: 'Mar grande',      desc: 'Mucho movimiento. Difícil de manejar y potencialmente peligroso.' },
    ],
    matchFn: v => v >= 1.5 ? 4 : v >= 1.0 ? 3 : v >= 0.6 ? 2 : v >= 0.2 ? 1 : 0,
  },
  'wave-period': {
    title: 'Período medio',
    intro: 'Indica el tiempo que pasa entre una ola y la siguiente. No es el tamaño, sino el ritmo al que llegan. Cuanto más largo, más ordenado y predecible es el mar.',
    rows: [
      { range: '+7 s',  label: 'Olas largas y ordenadas', desc: 'Llegan espaciadas. Te da tiempo a estabilizarte entre una y otra. Sensación cómoda.' },
      { range: '5–7 s', label: 'Ritmo normal',            desc: 'Olas regulares. Se nota el movimiento, pero es fácil adaptarse.' },
      { range: '4–5 s', label: 'Algo irregular',          desc: 'Llegan más seguidas. Menos tiempo para recolocarte.' },
      { range: '<4 s',  label: 'Caótico',                 desc: 'Olas muy seguidas y desordenadas. El mar no da tregua y cuesta mantener el equilibrio.' },
    ],
    matchFn: v => v < 4 ? 3 : v < 5 ? 2 : v < 7 ? 1 : 0,
  },
  'wave-direction': {
    title: 'Dirección de ola',
    intro: 'Indica desde dónde llegan las olas. No cambia el tamaño, pero sí cómo te afectan al equilibrio. Según la dirección, las olas te empujan de frente, de lado o apenas las notas.',
    rows: [
      { range: 'Hacia playa', label: 'De mar',    desc: 'Las olas vienen hacia ti. Las enfrentas de frente: subes y bajas con ellas. Es lo más fácil de leer.' },
      { range: 'Lateral',     label: 'Cruzadas',  desc: 'Llegan en diagonal o lateral. Te desestabilizan más porque te mueven de lado. Cuesta mantener el equilibrio.' },
      { range: 'Hacia mar',   label: 'De tierra', desc: 'Apenas afectan en la orilla. El mar suele estar más plano o con menos impacto directo en la tabla.' },
    ],
    // 0=onshore→Hacia playa(0), 1=offshore→Hacia mar(2), 2=lateral→Cruzadas(1)
    matchFn: v => { const c = windDirCategory(v, currentSpot); return c === 0 ? 0 : c === 1 ? 2 : 1; },
  },
  'swell': {
    title: 'Mar de fondo',
    intro: 'Son olas que vienen de lejos, generadas por viento en otras zonas. Más limpias, largas y fáciles de leer. El movimiento es suave y predecible: como subir y bajar poco a poco, sin sobresaltos.',
    rows: [
      { range: '0 m',       label: 'No hay',    desc: 'El mar no tiene ese movimiento largo. Todo depende del viento local.' },
      { range: '0–0.5 m',   label: 'Débil',     desc: 'Apenas se nota. Ligero balanceo suave.' },
      { range: '0.5–1.0 m', label: 'Presente',  desc: 'Movimiento claro, pero cómodo. Ayuda a que el mar tenga ritmo.' },
      { range: '+1.0 m',    label: 'Predomina', desc: 'El mar se mueve de forma continua pero ordenada. Es más fácil anticipar las olas.' },
    ],
    matchFn: v => v >= 1.0 ? 3 : v >= 0.5 ? 2 : v > 0 ? 1 : 0,
  },
  'wind-wave': {
    title: 'Mar de viento',
    intro: 'Son olas creadas por el viento local en ese momento. Cortas, irregulares y más incómodas que el mar de fondo. Es como si el agua estuviera "picada": te mueven sin avisar.',
    rows: [
      { range: '0 m',       label: 'No hay',    desc: 'El viento no está generando olas. El mar está más limpio.' },
      { range: '0–0.3 m',   label: 'Leve',      desc: 'Ligero picado. Se nota un poco, pero no molesta demasiado.' },
      { range: '0.3–0.6 m', label: 'Presente',  desc: 'Movimiento incómodo. El mar pierde estabilidad y tendrás que corregir equilibrio.' },
      { range: '+0.6 m',    label: 'Predomina', desc: 'Mar muy desordenado. Te mueve constantemente y cuesta mantenerse estable.' },
    ],
    matchFn: v => v >= 0.6 ? 3 : v >= 0.3 ? 2 : v > 0 ? 1 : 0,
  },
  'sea-type': {
    title: 'Tipo de mar',
    intro: 'Resume cómo es el mar combinando el mar de fondo y el mar de viento. Te dice si el movimiento será limpio y predecible… o incómodo y caótico.',
    rows: [
      { range: 'Solo fondo',  label: 'Solo fondo',  desc: 'Predominan olas largas y ordenadas. El mar tiene ritmo y es fácil de leer. Más cómodo para remar.' },
      { range: 'Mixto',       label: 'Mar mixto',   desc: 'Se mezclan olas limpias con algo de mar de viento. A ratos cómodo, a ratos irregular. Puede sorprenderte.' },
      { range: 'Solo viento', label: 'Solo viento', desc: "Predomina el mar generado por el viento local. Olas cortas y desordenadas. El mar está 'picado' y cuesta mantener estabilidad." },
    ],
    matchFn: v => v === 1 ? 1 : v === 2 ? 2 : 0,
  },
  'terral': {
    title: 'Terral',
    intro: 'Es cuando el viento viene de tierra hacia el mar. No siempre parece fuerte, pero tiene un riesgo importante: te empuja hacia fuera. Puede dar sensación de calma desde la orilla, pero si te alejas, volver puede costar mucho más de lo que parece.',
    rows: [
      { range: 'Sin terral', label: 'Sin terral',       desc: 'El viento no te empuja mar adentro. Puedes moverte con normalidad.' },
      { range: 'Leve',       label: 'Terral leve',      desc: 'Empuja suavemente hacia fuera. Sin problema si te mantienes cerca de la orilla.' },
      { range: 'Relevante',  label: 'Terral relevante', desc: 'Te aleja poco a poco sin darte cuenta. Tendrás que estar pendiente de no irte demasiado lejos.' },
      { range: 'Fuerte',     label: 'Terral fuerte',    desc: 'Empuja claramente hacia mar abierto. Volver puede ser difícil. No es buen día para salir.' },
    ],
    matchFn: v => v >= 3 ? 3 : v >= 2 ? 2 : v >= 1 ? 1 : 0,
  },
};

function stateIcon(s, key) {
  const svg = s === 'red' ? WARN_SVG : INFO_SVG;
  if (!key) return svg;
  return `<button class="tech-info-btn" data-info="${key}" aria-label="Más info">${svg}</button>`;
}

function infoSvg(key) {
  return `<button class="tech-info-btn" data-info="${key}" aria-label="Más info">${INFO_SVG}</button>`;
}

function windSpeedState(kn)      { return kn > 20 ? 'red' : kn > 10 ? 'orange' : 'ok'; }
function gustSpeedState(kn)      { return kn > 22 ? 'red' : kn > 12 ? 'orange' : 'ok'; }
function varState(v)             { return v > 10  ? 'red' : v > 4   ? 'orange' : 'ok'; }
function terralCellState(level, windKn)  { return (level === 3 && windKn > 8) ? 'red' : level >= 1 ? 'orange' : 'ok'; }
function waveHState(h)           { return h > 1.0 ? 'red' : h > 0.6 ? 'orange' : 'ok'; }
function wavePeriodState(per, h) {
  if (h <= 0.2) return 'ok';
  return per < 3 ? 'red' : per < 5 ? 'orange' : 'ok';
}

function tipoMar(swellH, windWaveH) {
  const diff = swellH - windWaveH;
  if (Math.abs(diff) < 0.1) return 'Mar mixto';
  return diff > 0 ? 'Fondo' : 'Viento';
}

function renderTechBlocks(d, warnings) {
  const container = document.getElementById('tech-blocks');
  if (!container) return;

  const terralW     = warnings.find(w => w.tipo === 'terral');
  const terralLevel = terralW ? terralW.nivel : 0;
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);
  const windCard    = degreesToCardinal(d.windDir);
  const waveCard    = d.waveDir != null ? degreesToCardinal(d.waveDir) : '—';
  const waveDeg     = d.waveDir != null ? Math.round(d.waveDir) + '°' : '—';

  const sWind   = windSpeedState(d.windKn);
  const sGust   = gustSpeedState(d.gustKn);
  const sVar    = varState(variabilidad);
  const sTerral = terralCellState(terralLevel, d.windKn);
  const sWaveH  = waveHState(d.waveH);
  const sWavePer = wavePeriodState(d.wavePer, d.waveH);

  const terralLabels = ['', 'Leve', 'Relevante', 'Fuerte'];
  const terralMetaIcon = sTerral === 'red'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.4"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2.4"/></svg>`;

  container.innerHTML = `
    <div class="tech-block">
      <div class="tech-block__header">
        <span class="tech-block__header-icon">${ICONS.wind}</span>
        <span class="tech-block__title">Viento</span>
      </div>
      <div class="tech-grid-row tech-grid-row--dir">
        <div class="tech-cell" data-info="wind-direction">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Dirección</span>
            ${infoSvg('wind-direction')}
          </div>
          <div class="tech-cell__dir-body">
            <div>
              <div class="tech-cell__value--dir">${windCard}</div>
              <div class="tech-cell__degrees">${Math.round(d.windDir)}°</div>
            </div>
            ${buildCompassSVG(d.windDir)}
          </div>
        </div>
        <div class="tech-cell tech-cell--${sWind}" data-info="wind-speed">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Media</span>
            ${stateIcon(sWind, 'wind-speed')}
          </div>
          <div class="tech-cell__value tech-cell__value--wind">${d.windKn.toFixed(1)}</div>
          <div class="tech-cell__unit">nudos</div>
          <div class="tech-cell__sub">${d.windKmh} km/h</div>
        </div>
        <div class="tech-cell tech-cell--${sGust}" data-info="wind-gusts">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Rachas</span>
            ${stateIcon(sGust, 'wind-gusts')}
          </div>
          <div class="tech-cell__value tech-cell__value--wind">${d.gustKn.toFixed(1)}</div>
          <div class="tech-cell__unit">nudos</div>
          <div class="tech-cell__sub">${d.gustKmh} km/h</div>
        </div>
      </div>
      <div class="tech-grid-row tech-grid-row--dir-2">
        ${terralLevel === 0
          ? `<div class="tech-cell tech-cell--ok" data-info="terral">
              <div class="tech-cell__top">
                <span class="tech-cell__label">Terral</span>
                ${infoSvg('terral')}
              </div>
              <div class="tech-cell__value--muted">Sin terral</div>
            </div>`
          : `<div class="tech-terral-alert tech-terral-alert--${sTerral}" data-info="terral">
              <div class="tech-terral-body">
                <span class="tech-terral-icon">${ICONS.wind}</span>
                <div>
                  <div class="tech-terral-label">Terral</div>
                  <div class="tech-terral-sub">Viento de tierra</div>
                </div>
              </div>
              <div class="tech-terral-meta">
                <button class="tech-terral-warn tech-info-btn" data-info="terral" aria-label="Más info">
                  ${terralMetaIcon}
                </button>
              </div>
            </div>`}
        <div class="tech-cell tech-cell--${sVar}" data-info="wind-variability">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Variabilidad</span>
            ${stateIcon(sVar, 'wind-variability')}
          </div>
          <div class="tech-cell__value tech-cell__value--wind">${variabilidad.toFixed(1)} <em class="tech-cell__unit-inline">nudos</em></div>
          <div class="tech-cell__sub">(rachas − media)</div>
        </div>
      </div>
    </div>

    <div class="tech-block">
      <div class="tech-block__header">
        <span class="tech-block__header-icon">${ICONS.wave}</span>
        <span class="tech-block__title">Oleaje</span>
      </div>
      <div class="tech-grid-row tech-grid-row--3">
        <div class="tech-cell tech-cell--${sWaveH}" data-info="wave-height">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Altura de ola</span>
            ${stateIcon(sWaveH, 'wave-height')}
          </div>
          <div class="tech-cell__value">${d.waveH.toFixed(1)} <em>m</em></div>
        </div>
        <div class="tech-cell tech-cell--${sWavePer}" data-info="wave-period">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Período medio</span>
            ${stateIcon(sWavePer, 'wave-period')}
          </div>
          <div class="tech-cell__value">${Math.round(d.wavePer)} <em>s</em></div>
        </div>
        <div class="tech-cell" data-info="wave-direction">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Dirección de ola</span>
            ${infoSvg('wave-direction')}
          </div>
          <div class="tech-cell__value--dir">${waveCard}</div>
          <div class="tech-cell__degrees">${waveDeg}</div>
        </div>
      </div>
      <div class="tech-grid-row tech-grid-row--3">
        <div class="tech-cell" data-info="swell">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Mar de fondo</span>
            ${infoSvg('swell')}
          </div>
          <div class="tech-cell__value">${(d.swellH || 0).toFixed(1)} <em>m</em></div>
        </div>
        <div class="tech-cell" data-info="wind-wave">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Mar de viento</span>
            ${infoSvg('wind-wave')}
          </div>
          <div class="tech-cell__value">${(d.windWaveH || 0).toFixed(1)} <em>m</em></div>
        </div>
        <div class="tech-cell" data-info="sea-type">
          <div class="tech-cell__top">
            <span class="tech-cell__label">Tipo de mar</span>
            ${infoSvg('sea-type')}
          </div>
          <div class="tech-cell__tipo">
            ${ICONS.wave}
            <span class="tech-cell__tipo-text">${tipoMar(d.swellH || 0, d.windWaveH || 0)}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="tech-nota">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2.4"/></svg>
      Valores medios de la franja seleccionada.
    </p>
  `;
}

// ── Info sheet ──

// Clasifica un ángulo como 0=onshore, 1=offshore, 2=lateral según el offshore_range del spot
function windDirCategory(deg, spot) {
  if (!spot?.offshore_range) return -1;
  const [oMin, oMax] = spot.offshore_range;
  if (deg >= oMin && deg <= oMax) return 1; // offshore / De tierra
  const oCenter    = (oMin + oMax) / 2;
  const onCenter   = (oCenter + 180) % 360;
  const diff       = Math.abs(((deg - onCenter + 540) % 360) - 180);
  return diff < 70 ? 0 : 2; // 0=onshore / De mar, 2=lateral
}

function getStateForKey(key) {
  if (!currentD) return 'ok';
  const variabilidad = calcularVariabilidad(currentD.windKn, currentD.gustKn);
  const terralW      = currentWarnings.find(w => w.tipo === 'terral');
  const terralLevel  = terralW ? terralW.nivel : 0;
  switch (key) {
    case 'wind-speed':       return windSpeedState(currentD.windKn);
    case 'wind-gusts':       return gustSpeedState(currentD.gustKn);
    case 'wind-variability': return varState(variabilidad);
    case 'wave-height':      return waveHState(currentD.waveH);
    case 'wave-period':      return wavePeriodState(currentD.wavePer, currentD.waveH);
    case 'terral':           return terralCellState(terralLevel, currentD.windKn);
    default:                 return 'ok';
  }
}

function getValueForKey(key) {
  if (!currentD) return null;
  const variabilidad = calcularVariabilidad(currentD.windKn, currentD.gustKn);
  switch (key) {
    case 'wind-speed':       return currentD.windKn;
    case 'wind-gusts':       return currentD.gustKn;
    case 'wind-variability': return variabilidad;
    case 'wind-direction':   return currentD.windDir;
    case 'wave-height':      return currentD.waveH;
    case 'wave-period':      return currentD.wavePer;
    case 'wave-direction':   return currentD.waveDir;
    case 'swell':            return currentD.swellH || 0;
    case 'wind-wave':        return currentD.windWaveH || 0;
    case 'terral': {
      const w = currentWarnings.find(w => w.tipo === 'terral');
      return w ? w.nivel : 0;
    }
    case 'sea-type': {
      const diff = (currentD.swellH || 0) - (currentD.windWaveH || 0);
      if (Math.abs(diff) < 0.1) return 1; // mixto
      return diff > 0 ? 0 : 2;            // 0=fondo, 2=viento
    }
    default:                 return null;
  }
}

function openInfoSheet(key) {
  const data = INFO_COPY[key];
  if (!data) return;

  const value     = getValueForKey(key);
  const activeIdx = (data.matchFn && value !== null) ? data.matchFn(value) : -1;
  const state     = getStateForKey(key); // 'ok' | 'orange' | 'red'

  document.getElementById('info-sheet-title').textContent = data.title;
  document.getElementById('info-sheet-intro').textContent = data.intro;
  document.getElementById('info-sheet-rows').innerHTML = data.rows
    .map((r, i) => {
      const isActive  = i === activeIdx;
      const cls = isActive
        ? `info-sheet__row info-sheet__row--active${state !== 'ok' ? ` info-sheet__row--state-${state}` : ''}`
        : 'info-sheet__row';
      return `<div class="${cls}">
        <div class="info-sheet__row-top">
          <span class="info-sheet__label">${r.label}</span>
          <span class="info-sheet__range">${r.range}</span>
        </div>
        <p class="info-sheet__desc">${r.desc}</p>
      </div>`;
    })
    .join('');

  _currentState = { view: history.state?.view, sheet: 'info' };
  history.pushState(_currentState, '');
  document.getElementById('info-overlay').classList.add('active');
  document.getElementById('info-sheet').classList.add('active');
}

function closeInfoSheet() {
  if (!_historyNavigation) history.back();
  const sheet = document.getElementById('info-sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  document.getElementById('info-overlay').classList.remove('active');
  sheet.classList.remove('active');
}

function initInfoSheet() {
  const sheet = document.getElementById('info-sheet');
  let startY = 0, dragY = 0, dragging = false;
  sheet.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY; dragY = 0; dragging = true;
    sheet.style.transition = 'none';
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dragY = Math.max(0, e.touches[0].clientY - startY);
    sheet.style.transform = `translateY(${dragY}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    if (dragY > 80) closeInfoSheet(); else sheet.style.transform = '';
  });
}

// ── About sheet ──
function openAboutSheet() {
  _currentState = { view: history.state?.view, sheet: 'about' };
  history.pushState(_currentState, '');
  document.getElementById('about-overlay').classList.add('active');
  document.getElementById('about-sheet').classList.add('active');
}

function closeAboutSheet() {
  if (!_historyNavigation) history.back();
  const sheet = document.getElementById('about-sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  document.getElementById('about-overlay').classList.remove('active');
  sheet.classList.remove('active');
}

function initAboutSheet() {
  const sheet = document.getElementById('about-sheet');
  let startY = 0, dragY = 0, dragging = false;
  sheet.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY; dragY = 0; dragging = true;
    sheet.style.transition = 'none';
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dragY = Math.max(0, e.touches[0].clientY - startY);
    sheet.style.transform = `translateY(${dragY}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    if (dragY > 80) closeAboutSheet(); else sheet.style.transform = '';
  });
}

// ── Suggestions sheet ──
const SUGGESTIONS_WORKER      = 'https://coco-suggestions.manel89.workers.dev';
const ERROR_REPORT_WORKER     = 'https://coco-error-reports.manel89.workers.dev';

function openSuggestionsSheet() {
  _currentState = { view: history.state?.view, sheet: 'suggestions' };
  history.pushState(_currentState, '');
  // Reset form state on open
  document.getElementById('suggestions-form').classList.remove('hidden');
  document.getElementById('suggestions-success').classList.add('hidden');
  document.getElementById('suggestions-textarea').value = '';
  document.getElementById('suggestions-count').textContent = '0';
  document.getElementById('suggestions-send').disabled = false;
  document.getElementById('suggestions-overlay').classList.add('active');
  document.getElementById('suggestions-sheet').classList.add('active');
}

function closeSuggestionsSheet() {
  if (!_historyNavigation) history.back();
  const sheet = document.getElementById('suggestions-sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  document.getElementById('suggestions-overlay').classList.remove('active');
  sheet.classList.remove('active');
}

function initSuggestionsSheet() {
  const sheet = document.getElementById('suggestions-sheet');

  // Swipe to close
  let startY = 0, dragY = 0, dragging = false;
  sheet.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY; dragY = 0; dragging = true;
    sheet.style.transition = 'none';
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dragY = Math.max(0, e.touches[0].clientY - startY);
    sheet.style.transform = `translateY(${dragY}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    if (dragY > 80) closeSuggestionsSheet(); else sheet.style.transform = '';
  });

  // Character counter
  const textarea = document.getElementById('suggestions-textarea');
  const counter  = document.getElementById('suggestions-count');
  textarea.addEventListener('input', () => {
    counter.textContent = textarea.value.length;
  });

  // Send button
  document.getElementById('suggestions-send').addEventListener('click', async () => {
    const message = textarea.value.trim();
    if (!message) return;

    const btn = document.getElementById('suggestions-send');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      const res = await fetch(SUGGESTIONS_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        document.getElementById('suggestions-form').classList.add('hidden');
        document.getElementById('suggestions-success').classList.remove('hidden');
      } else {
        btn.disabled = false;
        btn.textContent = 'Enviar';
        alert('Algo ha fallado. Inténtalo de nuevo.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Enviar';
      alert('Sin conexión. Inténtalo de nuevo.');
    }
  });
}

// ── Error report sheet ──
function buildReportPayload() {
  const dayLabel = currentDay === 0 ? 'Hoy' : currentDay === 1 ? 'Mañana' : `Día ${currentDay}`;
  const franja   = FRANJAS[currentFranja]?.label || '—';
  const getText  = (id) => document.getElementById(id)?.textContent?.trim() || '—';

  let condiciones = `Diagnóstico: ${getText('diagnosis-title')}\nDía: ${dayLabel} · Franja: ${franja}`;
  if (currentD) {
    const wH   = currentD.waveH   != null ? currentD.waveH.toFixed(1)   + 'm'  : '—';
    const wPer = currentD.wavePer != null ? currentD.wavePer.toFixed(0)  + 's'  : '—';
    const wDir = currentD.waveDir != null ? Math.round(currentD.waveDir) + '°'  : '—';
    const wind = currentD.windKn  != null ? currentD.windKn.toFixed(0)   + 'kn' : '—';
    const gust = currentD.gustKn  != null ? currentD.gustKn.toFixed(0)   + 'kn' : '—';
    const wDeg = currentD.windDir != null ? Math.round(currentD.windDir) + '°'  : '—';
    condiciones += `\nOlas: ${wH} · Periodo: ${wPer} · Dir: ${wDir}`;
    condiciones += `\nViento: ${wind} · Ráfagas: ${gust} · Dir: ${wDeg}`;
  }

  const mensajes = [
    `${getText('nb-encounter-title')}: ${getText('nb-encounter-desc')}`,
    `${getText('nb-demand-title')}: ${getText('nb-demand-desc')}`,
    `${getText('nb-fit-title')}: ${getText('nb-fit-desc')}`,
  ].join('\n');

  return { spot: currentSpot?.name || '—', condiciones, mensajes };
}

function openErrorReportSheet() {
  _currentState = { view: history.state?.view, sheet: 'error-report' };
  history.pushState(_currentState, '');
  document.getElementById('error-report-form').classList.remove('hidden');
  document.getElementById('error-report-success').classList.add('hidden');
  document.getElementById('error-report-textarea').value = '';
  document.getElementById('error-report-count').textContent = '0';
  document.getElementById('error-report-send').disabled = false;
  document.getElementById('error-report-send').textContent = 'Enviar reporte';
  document.getElementById('error-report-overlay').classList.add('active');
  document.getElementById('error-report-sheet').classList.add('active');
}

function closeErrorReportSheet() {
  if (!_historyNavigation) history.back();
  const sheet = document.getElementById('error-report-sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  document.getElementById('error-report-overlay').classList.remove('active');
  sheet.classList.remove('active');
}

function initErrorReportSheet() {
  const sheet = document.getElementById('error-report-sheet');

  let startY = 0, dragY = 0, dragging = false;
  sheet.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY; dragY = 0; dragging = true;
    sheet.style.transition = 'none';
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dragY = Math.max(0, e.touches[0].clientY - startY);
    sheet.style.transform = `translateY(${dragY}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    if (dragY > 80) closeErrorReportSheet(); else sheet.style.transform = '';
  });

  const textarea = document.getElementById('error-report-textarea');
  const counter  = document.getElementById('error-report-count');
  textarea.addEventListener('input', () => {
    counter.textContent = textarea.value.length;
  });

  document.getElementById('error-report-send').addEventListener('click', async () => {
    const payload = buildReportPayload();
    payload.comentario = textarea.value.trim();

    const btn = document.getElementById('error-report-send');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      const res = await fetch(ERROR_REPORT_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        document.getElementById('error-report-form').classList.add('hidden');
        document.getElementById('error-report-success').classList.remove('hidden');
      } else {
        btn.disabled = false;
        btn.textContent = 'Enviar reporte';
        alert('Algo ha fallado. Inténtalo de nuevo.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Enviar reporte';
      alert('Sin conexión. Inténtalo de nuevo.');
    }
  });
}

// ── Franja label con horas ──
function franjaLabel(franjaIndex) {
  const f = FRANJAS[franjaIndex];
  const h = f.hours;
  return `${f.label} · ${h[0]}h–${h[h.length - 1]}h`;
}

// ── Search screen ──
let selectedGeoResult = null;

function openSearch(triggerEl) {
  _currentState = { view: history.state?.view, sheet: 'search' };
  history.pushState(_currentState, '');
  const screen = document.getElementById('search-screen');
  if (triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    screen.style.setProperty('--ox', (rect.left + rect.width  / 2) + 'px');
    screen.style.setProperty('--oy', (rect.top  + rect.height / 2) + 'px');
  }
  screen.classList.add('active');
  document.getElementById('search-input').focus();
}

function _closeSearchDOM() {
  document.getElementById('search-screen').classList.remove('active');
  setTimeout(() => {
    document.getElementById('search-input').value       = '';
    document.getElementById('search-results').innerHTML = '';
    selectedGeoResult = null;
  }, 350);
}

function closeSearch() {
  if (!_historyNavigation) history.back();
  _closeSearchDOM();
}

async function handleSearch(query) {
  const list = document.getElementById('search-results');
  list.innerHTML = '<li class="search-status">Buscando...</li>';
  const results = await searchSpots(query);

  list.innerHTML = '';
  if (!results.length) {
    list.innerHTML = '<li class="search-status">Sin resultados</li>';
    return;
  }

  results.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'search-result-item';
    li.style.setProperty('--idx', i);
    li.innerHTML = `
      <span class="search-result-item__name">${r.name}</span>
      <span class="search-result-item__location">${r.location}</span>
    `;
    li.addEventListener('click', () => selectGeoResult(r));
    list.appendChild(li);
  });
}

function selectGeoResult(result) {
  const tempSpot = {
    id:             `view-${Date.now()}`,
    name:           result.name,
    city:           result.city || '',
    lat:            result.latitude,
    lon:            result.longitude,
    hardcoded:      false,
    offshore_range: [225, 315]
  };
  _closeSearchDOM();
  loadSpot(tempSpot);
}

// ── Event listeners ──
document.addEventListener('DOMContentLoaded', () => {
  // Inyectar indicator deslizante en day tabs
  const dayTabsContainer = document.querySelector('.results__day-tabs');
  if (dayTabsContainer) {
    const dayIndicator = document.createElement('div');
    dayIndicator.className = 'results__day-indicator no-transition';
    dayTabsContainer.prepend(dayIndicator);
  }

  renderSpotList();
  showView('view-home');
  initInstallButton();

  // Sistema de navegación con historial del navegador
  window.addEventListener('popstate', (e) => {
    _historyNavigation = true;
    const leaving = _currentState;
    const arriving = e.state ?? { view: 'view-home' };
    if (leaving?.sheet === 'about')            closeAboutSheet();
    else if (leaving?.sheet === 'suggestions')   closeSuggestionsSheet();
    else if (leaving?.sheet === 'error-report') closeErrorReportSheet();
    else if (leaving?.sheet === 'info')          closeInfoSheet();
    else if (leaving?.sheet === 'search')      closeSearch();
    else                                       _applyView(arriving.view ?? 'view-home');
    _currentState = arriving;
    _historyNavigation = false;
  });

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Header home
  document.getElementById('btn-home-about').addEventListener('click', openAboutSheet);
  document.getElementById('btn-home-feedback').addEventListener('click', openSuggestionsSheet);
  document.getElementById('about-overlay').addEventListener('click', closeAboutSheet);
  document.getElementById('suggestions-overlay').addEventListener('click', closeSuggestionsSheet);
  document.getElementById('btn-report-error').addEventListener('click', openErrorReportSheet);
  document.getElementById('error-report-overlay').addEventListener('click', closeErrorReportSheet);
  initAboutSheet();
  initSuggestionsSheet();
  initErrorReportSheet();
  initInfoSheet();

  // Info sheet — delegación en tech-blocks (celda entera o botón)
  document.getElementById('tech-blocks').addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (target?.dataset.info) openInfoSheet(target.dataset.info);
  });
  document.getElementById('info-overlay').addEventListener('click', closeInfoSheet);

  // Back button — volver a home
  document.getElementById('btn-back').addEventListener('click', () => {
    history.back();
    renderSpotList();
  });

  // Favorito
  document.getElementById('btn-favorite').addEventListener('click', toggleFavorite);

  // Day tabs: Hoy | Mañana | 7 días
  document.querySelectorAll('.results__day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const day = parseInt(tab.dataset.day);
      if (day === 7) {
        showSevenDay = true;
        renderDayTabs(true);
        refreshWithFade(
          document.getElementById('results-franjas-pills'),
          () => renderFranjas(),
          'data-refresh-in--day',
          100
        );
        document.getElementById('results-main-content').classList.add('hidden');
        document.getElementById('results-seven-day').classList.remove('hidden');
      } else {
        showSevenDay = false;
        currentDay = day;
        renderDayTabs(true);
        refreshWithFade(
          document.getElementById('results-franjas-pills'),
          () => renderFranjas(),
          'data-refresh-in--day',
          100
        );
        document.getElementById('results-main-content').classList.remove('hidden');
        document.getElementById('results-seven-day').classList.add('hidden');
        if (currentData) refreshWithFade(
          document.getElementById('results-main-content'),
          () => renderResults(sliderIndex(currentDay, currentFranja)),
          'data-refresh-in--day',
          100
        );
      }
    });
  });

  // Search screen — cerrar
  document.getElementById('search-back').addEventListener('click', closeSearch);

  // Búsqueda con debounce
  let searchTimer;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    selectedGeoResult = null;
    if (q.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    searchTimer = setTimeout(() => handleSearch(q), 350);
  });

  // Cerrar modo borrar tocando fuera de la lista
  document.addEventListener('click', (e) => {
    if (deleteMode && !e.target.closest('.spots-row')) {
      deleteMode = null;
      renderSpotList();
    }
  });
});
