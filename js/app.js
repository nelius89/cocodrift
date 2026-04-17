// ─────────────────────────────────────────
// APP — Lógica principal y navegación
// ─────────────────────────────────────────

// ── Iconos SVG (Lucide) ──
const ICONS = {
  wind:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  wave:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  zap:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  timer:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></svg>`,
  compass:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  thermometer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
};

// ── Iconos SVG para cada franja horaria ──
const FRANJA_ICONS = [
  // 0 Madrugada
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="17" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="9" r="0.7" fill="currentColor" stroke="none"/></svg>`,
  // 1 Mañana
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>`,
  // 2 Media mañana
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  // 3 Mediodía
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  // 4 Tarde
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  // 5 Atardecer
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg>`,
  // 6 Noche
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
];

// ── Estado ──
let currentSpot   = null;
let currentData   = null;
let deleteMode    = null;
let swiper        = null;   // instancia SlideSwiper
let currentDay    = 0;
let currentFranja = 1;

// ── Vistas ──
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.body.dataset.view = id;
}

// ── Abreviatura de ciudad ──
function cityAbbrev(spot) {
  if (spot.abbrev) return spot.abbrev;
  if (!spot.city) return '';
  return spot.city.slice(0, 3).toUpperCase();
}

// ── Home ──
function renderSpotList() {
  const container = document.getElementById('spots-row');
  const spots     = getAllSpots();
  container.innerHTML = '';

  spots.forEach((spot, index) => {
    const spotRow = document.createElement('div');
    spotRow.className = 'spot-row';

    // Abbrev fuera del botón, a la izquierda
    const abbrevEl = document.createElement('span');
    abbrevEl.className = 'spot-abbrev';
    abbrevEl.textContent = cityAbbrev(spot);
    spotRow.appendChild(abbrevEl);

    // Botón
    const btn = document.createElement('button');
    btn.className = 'spot-item' + (deleteMode === spot.id ? ' spot-item--delete-mode' : '');
    btn.dataset.id = spot.id;
    btn.innerHTML = `
      <span class="spot-item__name">${spot.name}</span>
      ${!spot.hardcoded ? `<span class="spot-item__delete" data-delete="${spot.id}">✕</span>` : ''}
    `;

    btn.addEventListener('click', (e) => {
      if (e.target.dataset.delete) return;
      loadSpot(spot);
    });

    if (!spot.hardcoded) {
      let pressTimer;
      btn.addEventListener('pointerdown', () => {
        pressTimer = setTimeout(() => {
          deleteMode = spot.id;
          renderSpotList();
        }, 600);
      });
      btn.addEventListener('pointerup',    () => clearTimeout(pressTimer));
      btn.addEventListener('pointerleave', () => clearTimeout(pressTimer));
    }

    spotRow.appendChild(btn);

    // Botón + solo en el último spot
    if (index === spots.length - 1) {
      const addBtn = document.createElement('button');
      addBtn.className = 'btn-add-spot';
      addBtn.id = 'btn-add-spot';
      addBtn.textContent = '+';
      addBtn.addEventListener('click', openSearch);
      spotRow.appendChild(addBtn);
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

// ── Time nav ──
function dayTabLabel(offset) {
  if (offset === 0) return 'Hoy';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
}

function renderTimeNav() {
  const daysEl = document.getElementById('time-nav-days');
  daysEl.innerHTML = '';
  for (let i = 0; i < FORECAST_DAYS; i++) {
    const btn = document.createElement('button');
    btn.className = 'time-nav__day' + (i === currentDay ? ' active' : '');
    btn.textContent = dayTabLabel(i);
    btn.addEventListener('click', () => {
      currentDay = i;
      renderTimeNav();
      renderResults(sliderIndex(currentDay, currentFranja));
    });
    daysEl.appendChild(btn);
  }
  document.getElementById('franja-slider').value = currentFranja;
  document.getElementById('time-nav-icon').innerHTML    = FRANJA_ICONS[currentFranja];
  document.getElementById('time-nav-label').textContent = FRANJAS[currentFranja].label;
}

// ── Cargar datos y mostrar resultados ──
async function loadSpot(spot) {
  currentSpot   = spot;
  currentDay    = 0;
  currentFranja = getCurrentFranjaIndex();
  setActiveSpot(spot.id);
  showView('view-results');

  document.getElementById('results-spot-name').textContent = spot.name;
  document.getElementById('diagnosis-title').textContent   = 'Cargando...';
  document.getElementById('diagnosis-desc').textContent    = '';

  try {
    currentData = await fetchSpotData(spot);
    renderTimeNav();
    renderResults(sliderIndex(currentDay, currentFranja));

    // Inicializar swiper una vez; reset al slide 1 en cada carga
    if (!swiper) {
      swiper = new SlideSwiper(
        document.getElementById('metrics-track'),
        document.getElementById('metrics-dots')
      );
    } else {
      swiper.reset();
    }
  } catch (err) {
    document.getElementById('diagnosis-title').textContent = 'Sin conexión';
    document.getElementById('diagnosis-desc').textContent  = 'No se han podido cargar los datos. Comprueba tu conexión.';
  }
}

function renderResults(sliderIndex) {
  if (!currentData) return;
  const { marine, forecast } = currentData;
  const d = getDataForSlider(sliderIndex, marine, forecast);

  // Capa 1: Score y estado
  const score  = calcularScore(d.windKn, d.waveH, d.gustKn, d.wavePer, d.cloudPct);
  const estado = getEstado(score, d.weathercode);
  const info   = ESTADOS[estado];

  document.getElementById('diagnosis-title').textContent    = info.titulo;
  document.getElementById('diagnosis-desc').textContent     = info.desc;

  // Ilustración — limpia, sin contenedor
  const ILLUS_MAP = { 'perfecto': 'Perfecto.png', 'bueno': 'Bueno.png' };
  const illusEl = document.getElementById('diagnosis-illus');
  if (ILLUS_MAP[estado]) {
    illusEl.style.display = '';
    illusEl.innerHTML = `<img src="assets/illustrations/${ILLUS_MAP[estado]}" alt="">`;
  } else {
    illusEl.style.display = 'none';
    illusEl.innerHTML = '';
  }

  // Terral inline
  const TERRAL_WARN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const TERRAL_STOP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
  const TERRAL_INFO = {
    1: {
      icon:   TERRAL_WARN,
      label:  'Terral leve',
      short:  'Deriva hacia fuera baja.',
      full:   'El viento sopla de tierra hacia el mar. Aunque el agua parezca tranquila, puede empujarte lentamente mar adentro.',
      advice: 'Puedes salir, pero sin alejarte de la orilla.',
    },
    2: {
      icon:   TERRAL_WARN,
      label:  'Terral relevante',
      short:  'Te empuja mar adentro.',
      full:   'El viento offshore es perceptible. Te llevará progresivamente alejándote de la playa, aunque no lo notes al principio.',
      advice: 'Mejor quedarte cerca de la orilla en todo momento.',
    },
    3: {
      icon:   TERRAL_STOP,
      label:  'Terral fuerte',
      short:  'El viento te aleja de la orilla.',
      full:   'Las condiciones offshore son peligrosas. El viento empuja con fuerza hacia mar abierto y recuperar la posición puede ser muy difícil.',
      advice: 'Condiciones para quedarse en tierra hoy.',
    },
  };
  const nivelTerral = calcularRiesgoTerral(d.windKn, d.gustKn, d.windDir, d.waveH, currentSpot);
  const triggerEl = document.getElementById('terral-trigger');
  if (nivelTerral === 0) {
    triggerEl.classList.add('hidden');
  } else {
    triggerEl.classList.remove('hidden');
    triggerEl.dataset.level = nivelTerral;
    const ti = TERRAL_INFO[nivelTerral];
    document.getElementById('terral-icon').innerHTML    = ti.icon;
    document.getElementById('terral-title').textContent = ti.label;
    // Populate bottom sheet
    const sheet = document.getElementById('terral-sheet');
    sheet.dataset.level = nivelTerral;
    document.getElementById('sheet-icon').innerHTML    = ti.icon;
    document.getElementById('sheet-title').textContent = ti.label;
    document.getElementById('sheet-short').textContent = ti.short;
    document.getElementById('sheet-full').textContent  = ti.full;
    document.getElementById('sheet-advice').textContent = ti.advice;
    const sheetCard = degreesToCardinal(d.windDir);
    const sheetDir  = shortDirLabel(d.windDir);
    document.getElementById('sheet-wind').innerHTML = `
      <span class="terral-sheet__wind-pill"><b>${d.windKn.toFixed(1)} kn</b> · viento</span>
      <span class="terral-sheet__wind-pill"><b>${d.gustKn.toFixed(1)} kn</b> · rachas</span>
      <span class="terral-sheet__wind-pill"><b>${sheetCard}</b> · ${sheetDir}</span>
    `;
  }

  // Capa 3: Bloques visuales
  const lv = labelViento(d.windKn);
  const lo = labelOla(d.waveH);
  const lr = labelRacha(d.gustKn);
  const lp = labelPeriodo(d.wavePer);
  const card = degreesToCardinal(d.windDir);

  function setBlock(suffix, iconSvg, value, label) {
    document.getElementById(`m-${suffix}-icon`).innerHTML  = iconSvg;
    document.getElementById(`m-${suffix}-value`).textContent = value;
    document.getElementById(`m-${suffix}-label`).textContent = label;
  }

  setBlock('temp',   ICONS.thermometer, `${Math.round(d.tempC)}°`,        labelTemp(d.tempC));
  setBlock('wind',   ICONS.wind,        `${d.windKn.toFixed(1)} kn`,      lv.label);
  setBlock('wave',   ICONS.wave,        `${d.waveH.toFixed(1)} m`,        lo.label);
  setBlock('gusts',  ICONS.zap,         `${d.gustKn.toFixed(1)} kn`,      lr.label);
  setBlock('period', ICONS.timer,       `${d.wavePer.toFixed(0)} s`,       lp.label);
  setBlock('dir',    ICONS.compass,     card,                              shortDirLabel(d.windDir));

  // Capa 4: Resumen de texto
  document.getElementById('metrics-summary').innerHTML = generateSummary(d);
}

function shortDirLabel(degrees) {
  if (degrees >= 225 && degrees <= 315) return 'Terral';
  if (degrees >= 45  && degrees <= 135) return 'De mar';
  return 'Lateral';
}

function generateSummary(d) {
  const lv   = labelViento(d.windKn);
  const lo   = labelOla(d.waveH);
  const lr   = labelRacha(d.gustKn);
  const card = degreesToCardinal(d.windDir);
  return `<b>${lv.label}</b> a <b>${d.windKn.toFixed(1)} kn</b> del <b>${card}</b>, con <b>rachas ${lr.label.toLowerCase()}</b> de ${d.gustKn.toFixed(1)} kn. Ola <b>${lo.label.toLowerCase()}</b> de <b>${d.waveH.toFixed(1)} m</b> y período de <b>${d.wavePer.toFixed(0)} s</b>.`;
}

// ── Menú hamburguesa ──
function openMenu() {
  document.getElementById('menu-overlay').classList.add('active');
  document.getElementById('menu-drawer').classList.add('active');
  document.getElementById('btn-menu').style.visibility = 'hidden';
}

function closeMenu() {
  document.getElementById('menu-overlay').classList.remove('active');
  document.getElementById('menu-drawer').classList.remove('active');
  document.getElementById('btn-menu').style.visibility = '';
}

// ── About sheet ──
function openAboutSheet() {
  closeMenu();
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
function openSuggestionsSheet() {
  closeMenu();
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
}

// ── Terral bottom sheet ──
function openTerralSheet() {
  document.getElementById('terral-overlay').classList.add('active');
  document.getElementById('terral-sheet').classList.add('active');
}

function closeTerralSheet() {
  const sheet = document.getElementById('terral-sheet');
  sheet.style.transition = '';
  sheet.style.transform = '';
  document.getElementById('terral-overlay').classList.remove('active');
  sheet.classList.remove('active');
}

function initTerralSheet() {
  const sheet = document.getElementById('terral-sheet');
  let startY = 0;
  let dragY  = 0;
  let dragging = false;

  sheet.addEventListener('touchstart', (e) => {
    startY   = e.touches[0].clientY;
    dragY    = 0;
    dragging = true;
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
    if (dragY > 80) {
      closeTerralSheet();
    } else {
      sheet.style.transform = '';
    }
  });
}

// ── Search screen: añadir spot ──
let selectedGeoResult = null;

function openSearch() {
  const addBtn = document.getElementById('btn-add-spot');
  if (!addBtn) return;
  const rect = addBtn.getBoundingClientRect();
  const screen = document.getElementById('search-screen');
  screen.style.setProperty('--ox', (rect.left + rect.width  / 2) + 'px');
  screen.style.setProperty('--oy', (rect.top  + rect.height / 2) + 'px');
  screen.classList.add('active');
  document.getElementById('search-input').focus();
}

function closeSearch() {
  document.getElementById('search-screen').classList.remove('active');
  setTimeout(() => {
    document.getElementById('search-input').value      = '';
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-confirm').classList.add('hidden');
    document.getElementById('spot-name-input').value  = '';
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
  selectedGeoResult = result;
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = result.name;
  document.getElementById('spot-name-input').value = result.name;
  document.getElementById('search-confirm').classList.remove('hidden');
}

function saveNewSpot() {
  if (!selectedGeoResult) return;
  const name = document.getElementById('spot-name-input').value.trim() || selectedGeoResult.name;
  const newSpot = {
    id: `user-${Date.now()}`,
    name,
    city: selectedGeoResult.city || '',
    lat: selectedGeoResult.latitude,
    lon: selectedGeoResult.longitude,
    hardcoded: false,
    offshore_range: [225, 315]
  };
  addUserSpot(newSpot);
  closeSearch();
  renderSpotList();
}

// ── Event listeners ──
document.addEventListener('DOMContentLoaded', () => {
  renderSpotList();
  showView('view-home');

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Menú hamburguesa
  document.getElementById('btn-menu').addEventListener('click', openMenu);
  document.getElementById('menu-close').addEventListener('click', closeMenu);
  document.getElementById('menu-overlay').addEventListener('click', closeMenu);
  document.getElementById('menu-about').addEventListener('click', openAboutSheet);
  document.getElementById('menu-feedback').addEventListener('click', openSuggestionsSheet);
  document.getElementById('about-overlay').addEventListener('click', closeAboutSheet);
  document.getElementById('suggestions-overlay').addEventListener('click', closeSuggestionsSheet);
  initAboutSheet();
  initSuggestionsSheet();

  // Terral trigger → open sheet
  document.getElementById('terral-trigger').addEventListener('click', openTerralSheet);
  document.getElementById('terral-overlay').addEventListener('click', closeTerralSheet);
  initTerralSheet();

  // Back button
  document.getElementById('btn-back').addEventListener('click', () => {
    showView('view-home');
    renderSpotList();
  });

  // Search screen — cerrar
  document.getElementById('search-back').addEventListener('click', closeSearch);

  // Búsqueda con debounce
  let searchTimer;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    document.getElementById('search-confirm').classList.add('hidden');
    selectedGeoResult = null;
    if (q.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    searchTimer = setTimeout(() => handleSearch(q), 350);
  });

  // Guardar spot nuevo
  document.getElementById('btn-save-spot').addEventListener('click', saveNewSpot);

  // Franja slider
  document.getElementById('franja-slider').addEventListener('input', (e) => {
    currentFranja = parseInt(e.target.value);
    document.getElementById('time-nav-icon').innerHTML    = FRANJA_ICONS[currentFranja];
    document.getElementById('time-nav-label').textContent = FRANJAS[currentFranja].label;
    renderResults(sliderIndex(currentDay, currentFranja));
  });

  // Cerrar modo borrar tocando fuera de la lista
  document.addEventListener('click', (e) => {
    if (deleteMode && !e.target.closest('.spots-row')) {
      deleteMode = null;
      renderSpotList();
    }
  });
});
