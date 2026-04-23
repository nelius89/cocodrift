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

// ── Iconos SVG para cada franja horaria (v2: 5 franjas) ──
const FRANJA_ICONS = [
  // 0 Madrugada
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="17" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="9" r="0.7" fill="currentColor" stroke="none"/></svg>`,
  // 1 Amanecer
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>`,
  // 2 Mediodía
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  // 3 Tarde
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  // 4 Noche
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
];

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

    // Botón búsqueda circular solo en el último spot
    if (index === spots.length - 1) {
      const searchCircle = document.createElement('button');
      searchCircle.className = 'btn-search-circle';
      searchCircle.id = 'btn-search-circle';
      searchCircle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      searchCircle.addEventListener('click', () => openSearch(searchCircle));
      spotRow.appendChild(searchCircle);
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
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function dayShortDate(offset) {
  if (offset === 0) return '';
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
      ${i > 0 ? `<span class="results__date-option__date">${dayShortDate(i)}</span>` : ''}
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

// Franjas — pastillas
function renderFranjas() {
  const container = document.getElementById('results-franjas-pills');
  container.innerHTML = '';
  FRANJAS.forEach((f, i) => {
    const pill = document.createElement('button');
    pill.className = 'results__franja-pill' + (i === currentFranja ? ' active' : '');
    pill.textContent = f.label;
    pill.addEventListener('click', () => {
      currentFranja = i;
      renderFranjas();
      renderResults(sliderIndex(currentDay, currentFranja));
    });
    container.appendChild(pill);
  });
  updateFranjaIndicator();
}

function updateFranjaIndicator() {
  const indicator = document.getElementById('results-franja-indicator');
  const hoursEl   = document.getElementById('results-franja-hours');
  if (!indicator || !hoursEl) return;
  // Each pill = 20% of container (5 equal pills, gaps approximated)
  const left = currentFranja * 20 + 10;
  indicator.style.left = `${left}%`;
  const f = FRANJAS[currentFranja];
  hoursEl.textContent = `${f.hours[0]}h – ${f.hours[f.hours.length - 1]}h`;
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
  document.getElementById('ctx-city').textContent  = spot.city || '—';
  document.getElementById('ctx-wind').textContent  = '—';
  document.getElementById('ctx-temp').textContent  = '—';
  document.getElementById('ctx-weather-icon').innerHTML = '';
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

  // Línea de contexto
  document.getElementById('ctx-city').textContent            = currentSpot.city || '—';
  document.getElementById('ctx-wind').textContent            = `${d.windKmh} km/h`;
  document.getElementById('ctx-weather-icon').innerHTML      = getWeatherIcon(d.weathercode);
  document.getElementById('ctx-temp').textContent            = `${Math.round(d.tempC)}°`;

  // Título diagnóstico
  document.getElementById('diagnosis-title').textContent = info.titulo;

  // Ilustración — temporal: misma para todos los estados
  document.getElementById('diagnosis-illus').innerHTML =
    `<img src="assets/illustrations/Bueno.svg" alt="">`;

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

  // CTA info detallada — pendiente step 4
  document.getElementById('btn-detail').addEventListener('click', () => {
    // TODO step 4: showView('view-info');
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
