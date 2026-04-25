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
let currentD      = null;
let deleteMode    = null;
let swiper        = null;   // unused — carrusel eliminado
let currentDay    = 0;
let currentFranja = 1;
let showSevenDay  = false;
let _historyNavigation = false;
let _currentState = null;

// ── Vistas ──
function _applyView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.body.dataset.view = id;
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
  _applyView(id);
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
function renderDayTabs() {
  document.querySelectorAll('.results__day-tab').forEach(tab => {
    const day = tab.dataset.day;
    const isActive = showSevenDay ? day === '7' : day === String(currentDay);
    tab.classList.toggle('results__day-tab--active', isActive);
  });
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
      <span class="results__franja-icon">${weatherIcon}</span>
      <span class="results__franja-temp">${tempStr}</span>
    `;
    pill.addEventListener('click', () => {
      if (showSevenDay) return;
      currentFranja = i;
      // Animar indicator y transición de color
      positionFranjaIndicator(i, true);
      container.querySelectorAll('.results__franja-pill').forEach((p, idx) => {
        p.classList.toggle('active', idx === i);
      });
      renderResults(sliderIndex(currentDay, currentFranja));
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
  const info = ESTADOS[estado];

  // Ciudad (actualizar por si acaso)
  document.getElementById('ctx-city').textContent = currentSpot.city || '—';

  // Título diagnóstico
  document.getElementById('diagnosis-title').textContent = info.titulo;

  // Ilustración según estado
  document.getElementById('diagnosis-illus').innerHTML =
    `<img src="${ESTADO_ILLUS[estado]}" alt="">`;

  // Bloques narrativos
  const nb = buildNarrativeBlocks(d, estado, warnings);
  document.getElementById('nb-encounter-title').textContent = nb.encounter.title;
  document.getElementById('nb-encounter-desc').textContent  = nb.encounter.desc;
  document.getElementById('nb-demand-title').textContent    = nb.demand.title;
  document.getElementById('nb-demand-desc').textContent     = nb.demand.desc;
  document.getElementById('nb-fit-title').textContent       = nb.fit.title;
  document.getElementById('nb-fit-desc').textContent        = nb.fit.desc;

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
    intro: 'La intensidad del viento constante. Marca el esfuerzo al remar y lo fácil que será moverte.',
    rows: [
      { range: '0 – 6 kn',   label: 'Calma / apenas perceptible' },
      { range: '6 – 10 kn',  label: 'Brisa ligera' },
      { range: '10 – 15 kn', label: 'Viento moderado' },
      { range: '15 – 20 kn', label: 'Viento fuerte' },
      { range: '+20 kn',     label: 'Muy fuerte / limitante' },
    ],
    matchFn: v => v >= 20 ? 4 : v >= 15 ? 3 : v >= 10 ? 2 : v >= 6 ? 1 : 0,
  },
  'wind-gusts': {
    title: 'Rachas',
    intro: 'Son los picos de viento que aparecen de golpe. Son los que te descolocan.',
    rows: [
      { range: '0 – 8 kn',   label: 'Estable' },
      { range: '8 – 12 kn',  label: 'Alguna racha' },
      { range: '12 – 16 kn', label: 'Rachas notables' },
      { range: '16 – 22 kn', label: 'Rachas fuertes' },
      { range: '+22 kn',     label: 'Rachas muy fuertes' },
    ],
    matchFn: v => v >= 22 ? 4 : v >= 16 ? 3 : v >= 12 ? 2 : v >= 8 ? 1 : 0,
  },
  'wind-variability': {
    title: 'Variabilidad',
    intro: 'Mide cuánto cambia el viento. Cuanto más alto, menos predecible.',
    rows: [
      { range: '0 – 3',  label: 'Viento estable' },
      { range: '3 – 6',  label: 'Algo variable' },
      { range: '6 – 10', label: 'Variable' },
      { range: '+10',    label: 'Muy variable' },
    ],
    matchFn: v => v >= 10 ? 3 : v >= 6 ? 2 : v >= 3 ? 1 : 0,
  },
  'wind-direction': {
    title: 'Dirección del viento',
    intro: 'Indica de dónde viene el viento respecto a la playa. Cambia completamente la seguridad.',
    rows: [
      { range: 'Offshore', label: 'Tierra → mar. Te empuja hacia fuera (peligroso)' },
      { range: 'Onshore',  label: 'Mar → tierra. Te empuja hacia la orilla (más seguro)' },
      { range: 'Lateral',  label: 'Te desplaza de lado' },
    ],
  },
  'wave-height': {
    title: 'Altura de ola',
    intro: 'El tamaño de las olas. Define cuánto se mueve el mar.',
    rows: [
      { range: '0 – 0.2 m',   label: 'Mar en calma' },
      { range: '0.2 – 0.6 m', label: 'Movimiento leve' },
      { range: '0.6 – 1.0 m', label: 'Movimiento real' },
      { range: '1.0 – 1.5 m', label: 'Mar movido' },
      { range: '+1.5 m',      label: 'Mar grande / complicado' },
    ],
    matchFn: v => v >= 1.5 ? 4 : v >= 1.0 ? 3 : v >= 0.6 ? 2 : v >= 0.2 ? 1 : 0,
  },
  'wave-period': {
    title: 'Período medio',
    intro: 'El tiempo entre olas. Define si el mar es ordenado o caótico.',
    rows: [
      { range: '+7 s',    label: 'Olas largas y ordenadas (fácil)' },
      { range: '5 – 7 s', label: 'Ritmo normal' },
      { range: '4 – 5 s', label: 'Algo irregular' },
      { range: '<4 s',    label: 'Caótico y difícil' },
    ],
    matchFn: v => v < 4 ? 3 : v < 5 ? 2 : v < 7 ? 1 : 0,
  },
  'wave-direction': {
    title: 'Dirección de ola',
    intro: 'Indica desde dónde llegan las olas. Afecta a cómo rompen y al equilibrio.',
    rows: [
      { range: 'De mar',    label: 'Entran hacia la playa' },
      { range: 'Cruzadas',  label: 'Llegan de lado' },
      { range: 'De tierra', label: 'Apenas afectan' },
    ],
  },
  'swell': {
    title: 'Mar de fondo',
    intro: 'Olas limpias que vienen de lejos. Más fáciles de leer y predecir.',
    rows: [
      { range: '0 m',         label: 'No hay' },
      { range: '0 – 0.5 m',   label: 'Débil' },
      { range: '0.5 – 1.0 m', label: 'Presente' },
      { range: '+1.0 m',      label: 'Predomina' },
    ],
    matchFn: v => v > 1.0 ? 3 : v > 0.5 ? 2 : v > 0 ? 1 : 0,
  },
  'wind-wave': {
    title: 'Mar de viento',
    intro: 'Olas generadas por el viento local. Más incómodas y desordenadas que el mar de fondo.',
    rows: [
      { range: '0 m',         label: 'No hay' },
      { range: '0 – 0.3 m',   label: 'Leve' },
      { range: '0.3 – 0.6 m', label: 'Presente' },
      { range: '+0.6 m',      label: 'Predomina' },
    ],
    matchFn: v => v > 0.6 ? 3 : v > 0.3 ? 2 : v > 0 ? 1 : 0,
  },
  'sea-type': {
    title: 'Tipo de mar',
    intro: 'Resume cómo es el mar en conjunto según el origen de las olas.',
    rows: [
      { range: 'Solo fondo',  label: 'Limpio y ordenado' },
      { range: 'Mar mixto',   label: 'Algo irregular' },
      { range: 'Solo viento', label: 'Desordenado' },
    ],
  },
  'terral': {
    title: 'Terral',
    intro: 'El viento viene de tierra y te empuja hacia el mar. El riesgo es alejarte sin poder volver fácilmente.',
    rows: [
      { range: 'Leve',      label: 'Suave. No te alejes demasiado de la orilla' },
      { range: 'Relevante', label: 'Quédate cerca de la orilla en todo momento' },
      { range: 'Fuerte',    label: 'Mejor no salir hoy' },
    ],
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
function getValueForKey(key) {
  if (!currentD) return null;
  const variabilidad = calcularVariabilidad(currentD.windKn, currentD.gustKn);
  switch (key) {
    case 'wind-speed':       return currentD.windKn;
    case 'wind-gusts':       return currentD.gustKn;
    case 'wind-variability': return variabilidad;
    case 'wave-height':      return currentD.waveH;
    case 'wave-period':      return currentD.wavePer;
    case 'swell':            return currentD.swellH || 0;
    case 'wind-wave':        return currentD.windWaveH || 0;
    default:                 return null;
  }
}

function openInfoSheet(key) {
  const data = INFO_COPY[key];
  if (!data) return;

  const value    = getValueForKey(key);
  const activeIdx = (data.matchFn && value !== null) ? data.matchFn(value) : -1;

  document.getElementById('info-sheet-title').textContent = data.title;
  document.getElementById('info-sheet-intro').textContent = data.intro;
  document.getElementById('info-sheet-rows').innerHTML = data.rows
    .map((r, i) => `<div class="info-sheet__row${i === activeIdx ? ' info-sheet__row--active' : ''}">
      <span class="info-sheet__range">${r.range}</span>
      <span class="info-sheet__label">${r.label}</span>
    </div>`)
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
        renderDayTabs();
        renderFranjas();
        document.getElementById('results-main-content').classList.add('hidden');
        document.getElementById('results-seven-day').classList.remove('hidden');
      } else {
        showSevenDay = false;
        currentDay = day;
        renderDayTabs();
        renderFranjas();
        document.getElementById('results-main-content').classList.remove('hidden');
        document.getElementById('results-seven-day').classList.add('hidden');
        if (currentData) renderResults(sliderIndex(currentDay, currentFranja));
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
