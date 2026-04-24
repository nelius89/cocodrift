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
let deleteMode    = null;
let swiper        = null;   // unused — carrusel eliminado
let currentDay    = 0;
let currentFranja = 1;

// ── Vistas ──
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.body.dataset.view = id;
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

function dayFullLabel(offset) {
  if (offset === 0) return 'Hoy';
  if (offset === 1) return 'Mañana';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const weekday = d.toLocaleDateString('es-ES', { weekday: 'long' });
  const day     = d.getDate();
  const month   = d.toLocaleDateString('es-ES', { month: 'long' });
  const wCap    = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const mCap    = month.charAt(0).toUpperCase() + month.slice(1);
  return `${wCap} ${day}, ${mCap}`;
}

function dayShortDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Selector de fecha — botón
function renderDateBtn() {
  const label = document.getElementById('results-date-label');
  if (label) label.textContent = dayFullLabel(currentDay);
}

// Selector de fecha — dropdown (7 días)
function renderDateDropdown() {
  const dropdown = document.getElementById('results-date-dropdown');
  dropdown.innerHTML = '';
  for (let i = 0; i < FORECAST_DAYS; i++) {
    const btn = document.createElement('button');
    btn.className = 'results__date-option' + (i === currentDay ? ' selected' : '');
    btn.innerHTML = `
      <span class="results__date-option__day">${dayFullLabel(i)}</span>
      <span class="results__date-option__date">${dayShortDate(i)}</span>
    `;
    btn.addEventListener('click', () => {
      currentDay = i;
      closeDateDropdown();
      renderDateBtn();
      renderResults(sliderIndex(currentDay, currentFranja));
    });
    dropdown.appendChild(btn);
  }
}

function openDateDropdown() {
  const dropdown = document.getElementById('results-date-dropdown');
  const btn      = document.getElementById('results-date-btn');
  renderDateDropdown();
  dropdown.classList.remove('hidden');
  btn.classList.add('open');
}

function closeDateDropdown() {
  const dropdown = document.getElementById('results-date-dropdown');
  const btn      = document.getElementById('results-date-btn');
  dropdown.classList.add('hidden');
  btn.classList.remove('open');
}

// Franjas — nueva vista: columnas con icono + nombre + horas
function renderFranjas() {
  const container = document.getElementById('results-franjas-pills');
  container.innerHTML = '';
  FRANJAS.forEach((f, i) => {
    const pill = document.createElement('button');
    pill.className = 'results__franja-pill' + (i === currentFranja ? ' active' : '');
    pill.innerHTML = `
      <span class="results__franja-icon">${FRANJA_ICONS[i]}</span>
      <span class="results__franja-name">${f.label}</span>
      <span class="results__franja-hours">${f.range}</span>
    `;
    pill.addEventListener('click', () => {
      currentFranja = i;
      renderFranjas();
      renderResults(sliderIndex(currentDay, currentFranja));
    });
    container.appendChild(pill);
  });
}

// ── Cargar datos y mostrar resultados ──
async function loadSpot(spot) {
  currentSpot   = spot;
  currentDay    = 0;
  currentFranja = getCurrentFranjaIndex();
  setActiveSpot(spot.id);
  showView('view-results');
  closeDateDropdown();

  document.getElementById('results-spot-name').textContent = spot.name;
  document.getElementById('ctx-city').textContent         = spot.city || '—';
  document.getElementById('ctx-temp').textContent         = '—';
  document.getElementById('ctx-rain').textContent         = '—';
  document.getElementById('ctx-weather-icon').innerHTML   = '';
  document.getElementById('diagnosis-title').textContent = 'Cargando...';
  document.getElementById('diagnosis-illus').innerHTML   = '';
  document.getElementById('nb-encounter-title').textContent = '—';
  document.getElementById('nb-encounter-desc').textContent  = '—';
  document.getElementById('nb-demand-title').textContent    = '—';
  document.getElementById('nb-demand-desc').textContent     = '—';
  document.getElementById('nb-fit-title').textContent       = '—';
  document.getElementById('nb-fit-desc').textContent        = '—';

  renderDateBtn();
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
  const { estado, warnings } = diagnosticar(d, currentSpot, d.weathercode);
  const info = ESTADOS[estado];

  // Clima
  document.getElementById('ctx-city').textContent       = currentSpot.city || '—';
  document.getElementById('ctx-weather-icon').innerHTML = getWeatherIcon(d.weathercode);
  document.getElementById('ctx-temp').textContent       = `${Math.round(d.tempC)}°`;
  document.getElementById('ctx-rain').textContent       = `${d.precipPct}%`;

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

// ── Info técnica v2.0 ──

const TERRAL_COPY = {
  1: {
    body: 'El viento viene de tierra. Hoy es suave, pero te empuja hacia el mar.',
    rec:  'No te alejes demasiado de la orilla.',
  },
  2: {
    body: 'El viento de tierra empuja hacia mar abierto. Quédate cerca de la orilla en todo momento.',
    rec:  'Si tienes dudas, mejor no salir hoy.',
  },
  3: {
    body: 'El viento de tierra empuja fuerte hacia mar abierto. El agua puede parecer tranquila desde la orilla — no lo es.',
    rec:  'Hoy es mejor quedarse en tierra.',
  },
};

const CHEVRON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

function renderInfoTech() {
  if (!currentData) return;
  const { marine, forecast } = currentData;
  const d = getDataForSlider(sliderIndex(currentDay, currentFranja), marine, forecast);
  const { estado, warnings, alertaConsolidada } = diagnosticar(d, currentSpot, d.weathercode);
  const tech = buildTechBlocks(d, estado);

  document.getElementById('info-spot-name').textContent = currentSpot.name;

  const body = document.getElementById('info-body');
  body.innerHTML = '';

  // 1. Aviso terral
  const terralW = warnings.find(w => w.tipo === 'terral');
  if (terralW) {
    const t    = TERRAL_COPY[terralW.nivel] || TERRAL_COPY[2];
    const block = document.createElement('div');
    block.className = 'info-block info-block--terral';
    block.innerHTML = `
      <div class="info-block__head">
        <div class="info-alert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.4"/></svg>
        </div>
        <span class="info-block__title info-block__title--red">Aviso viento terral</span>
      </div>
      <p class="info-block__body">${t.body}</p>
      <p class="info-block__rec">${t.rec}</p>
    `;
    body.appendChild(block);
  }

  // 2. A tener en cuenta
  const infoWarnings = warnings.filter(w => w.tipo !== 'terral' && w.categoria !== 'narrativa');
  if (infoWarnings.length > 0) {
    const block = document.createElement('div');
    block.className = 'info-block info-block--info';
    const items = infoWarnings.map(w => {
      const icon = (w.tipo === 'variabilidad' || w.tipo === 'rachas') ? ICONS.wind : ICONS.wave;
      return `<div class="info-block__item">
        <span class="info-block__item-icon">${icon}</span>
        <div class="info-block__item-body">
          <strong class="info-block__item-label">${w.label}</strong>
          <p class="info-block__item-copy">${w.copy}</p>
        </div>
      </div>`;
    }).join('');
    block.innerHTML = `
      <div class="info-block__head">
        <span class="info-block__title info-block__title--blue">A tener en cuenta</span>
        <div class="info-info-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2.4"/></svg>
        </div>
      </div>
      <div class="info-block__items">${items}</div>
    `;
    body.appendChild(block);
  }

  // 3. Viento
  body.appendChild(buildInfoVientoSection(d, tech));

  // 4. Ola
  body.appendChild(buildInfoOlaSection(d, tech));

  // 5. Nota inferior
  const nota = document.createElement('p');
  nota.className = 'info__nota';
  nota.textContent = 'Los valores son medias de la franja seleccionada. Toca cada bloque para entender mejor cómo leerlos.';
  body.appendChild(nota);
}

function buildInfoVientoSection(d, tech) {
  const cardinal = degreesToCardinal(d.windDir);
  const dirType  = shortDirLabel(d.windDir);
  const windLab  = labelViento(d.windKn).label;
  const gustLab  = labelRacha(d.gustKn).label;

  const sec = document.createElement('div');
  sec.className = 'info-section';
  sec.innerHTML = `
    <div class="info-section__top">
      <span class="info-section__tag">Viento</span>
    </div>
    <div class="info-section__summary">
      <div class="compass" style="--dir:${d.windDir}deg">
        <div class="compass__needle"></div>
      </div>
      <div class="info-section__dir-block">
        <div class="info-section__dir-row">
          <span class="info-section__cardinal">${cardinal}</span>
          <span class="info-section__dir-type">${dirType}</span>
        </div>
        <div class="info-section__values-row">
          <span class="info-section__val">${d.windKn.toFixed(1)} <em>kn</em></span>
          <span class="info-section__val-sep">·</span>
          <span class="info-section__val">${d.gustKn.toFixed(1)} <em>kn rachas</em></span>
        </div>
        <div class="info-section__labels-row">
          <span class="info-section__lab">${windLab}</span>
          <span class="info-section__lab-sep">·</span>
          <span class="info-section__lab">${gustLab}</span>
        </div>
      </div>
    </div>
    <button class="info-section__cta" type="button">
      <span>Entender el viento</span>
      <span class="info-section__cta-arrow">${CHEVRON_SVG}</span>
    </button>
    <div class="info-section__detail hidden">
      <div class="info-section__sub">
        <span class="info-section__sub-label">¿Qué significa?</span>
        <p>${tech.wind.p1}</p>
      </div>
      <div class="info-section__sub">
        <span class="info-section__sub-label">¿Qué implica hoy?</span>
        <p>${tech.wind.p2}</p>
        <p>${tech.gusts.p2}</p>
      </div>
      <div class="info-section__sub info-section__sub--key">
        <span class="info-section__sub-label">Clave</span>
        <p>${tech.wind.p3}</p>
      </div>
    </div>
  `;
  _initInfoSectionToggle(sec);
  return sec;
}

function buildInfoOlaSection(d, tech) {
  const olaLab = labelOla(d.waveH).label;
  const perLab = labelPeriodo(d.wavePer).label;

  const sec = document.createElement('div');
  sec.className = 'info-section';
  sec.innerHTML = `
    <div class="info-section__top">
      <span class="info-section__tag">Ola</span>
    </div>
    <div class="info-section__summary">
      <div class="info-section__wave-icon">${ICONS.wave}</div>
      <div class="info-section__dir-block">
        <div class="info-section__values-row">
          <span class="info-section__val">${d.waveH.toFixed(1)} <em>m</em></span>
          <span class="info-section__val-sep">·</span>
          <span class="info-section__val">${d.wavePer.toFixed(0)} <em>s</em></span>
        </div>
        <div class="info-section__labels-row">
          <span class="info-section__lab">${olaLab}</span>
          <span class="info-section__lab-sep">·</span>
          <span class="info-section__lab">${perLab}</span>
        </div>
      </div>
    </div>
    <button class="info-section__cta" type="button">
      <span>Entender la ola</span>
      <span class="info-section__cta-arrow">${CHEVRON_SVG}</span>
    </button>
    <div class="info-section__detail hidden">
      <div class="info-section__sub">
        <span class="info-section__sub-label">¿Qué significa?</span>
        <p>${tech.sea.p1}</p>
      </div>
      <div class="info-section__sub">
        <span class="info-section__sub-label">¿Qué implica hoy?</span>
        <p>${tech.sea.p2}</p>
        <p>${tech.period.p2}</p>
      </div>
      <div class="info-section__sub info-section__sub--key">
        <span class="info-section__sub-label">Clave</span>
        <p>${tech.sea.p3}</p>
      </div>
    </div>
  `;
  _initInfoSectionToggle(sec);
  return sec;
}

function _initInfoSectionToggle(sec) {
  const cta    = sec.querySelector('.info-section__cta');
  const detail = sec.querySelector('.info-section__detail');
  const arrow  = sec.querySelector('.info-section__cta-arrow svg');
  cta.addEventListener('click', () => {
    const isHidden = detail.classList.toggle('hidden');
    if (arrow) arrow.style.transform = isHidden ? '' : 'rotate(180deg)';
  });
}


// ── About sheet ──
function openAboutSheet() {
  document.getElementById('about-overlay').classList.add('active');
  document.getElementById('about-sheet').classList.add('active');
}

function closeAboutSheet() {
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
const SUGGESTIONS_WORKER = 'https://coco-suggestions.manel89.workers.dev';

function openSuggestionsSheet() {
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

// ── Franja label con horas ──
function franjaLabel(franjaIndex) {
  const f = FRANJAS[franjaIndex];
  const h = f.hours;
  return `${f.label} · ${h[0]}h–${h[h.length - 1]}h`;
}

// ── Search screen ──
let selectedGeoResult = null;

function openSearch(triggerEl) {
  const screen = document.getElementById('search-screen');
  if (triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    screen.style.setProperty('--ox', (rect.left + rect.width  / 2) + 'px');
    screen.style.setProperty('--oy', (rect.top  + rect.height / 2) + 'px');
  }
  screen.classList.add('active');
  document.getElementById('search-input').focus();
}

function closeSearch() {
  document.getElementById('search-screen').classList.remove('active');
  setTimeout(() => {
    document.getElementById('search-input').value       = '';
    document.getElementById('search-results').innerHTML = '';
    selectedGeoResult = null;
  }, 350);
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
  closeSearch();
  loadSpot(tempSpot);
}

// ── Event listeners ──
document.addEventListener('DOMContentLoaded', () => {
  renderSpotList();
  showView('view-home');
  initInstallButton();

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Header home
  document.getElementById('btn-home-about').addEventListener('click', openAboutSheet);
  document.getElementById('btn-home-feedback').addEventListener('click', openSuggestionsSheet);
  document.getElementById('about-overlay').addEventListener('click', closeAboutSheet);
  document.getElementById('suggestions-overlay').addEventListener('click', closeSuggestionsSheet);
  initAboutSheet();
  initSuggestionsSheet();

  // Back button — volver a home
  document.getElementById('btn-back').addEventListener('click', () => {
    closeDateDropdown();
    showView('view-home');
    renderSpotList();
  });

  // Favorito
  document.getElementById('btn-favorite').addEventListener('click', toggleFavorite);

  // Selector de fecha
  document.getElementById('results-date-btn').addEventListener('click', () => {
    const dropdown = document.getElementById('results-date-dropdown');
    if (dropdown.classList.contains('hidden')) {
      openDateDropdown();
    } else {
      closeDateDropdown();
    }
  });

  // Cerrar dropdown de fecha al tocar fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.results__date-wrap')) {
      closeDateDropdown();
    }
  });

  // CTA info detallada — crossfade con scale sutil
  document.getElementById('btn-detail').addEventListener('click', () => {
    const viewResults = document.getElementById('view-results');
    const viewInfo    = document.getElementById('view-info');

    // Preparar view-info invisible antes de mostrarla
    viewInfo.classList.add('entering');
    renderInfoTech();
    showView('view-info');

    // Results sale con leve scale-down
    viewResults.classList.add('leaving');

    // Activar entrada de view-info en el siguiente frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        viewInfo.classList.remove('entering');
        viewInfo.classList.add('entering-active');
        setTimeout(() => {
          viewInfo.classList.remove('entering-active');
          viewResults.classList.remove('leaving');
        }, 320);
      });
    });
  });

  // Back desde info técnica → volver a results
  document.getElementById('btn-back-info').addEventListener('click', () => {
    showView('view-results');
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
