// ─────────────────────────────────────────
// APP — Lógica principal y navegación
// ─────────────────────────────────────────

// ── Iconos SVG (Lucide) ──
const ICONS = {
  wind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  wave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  zap:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  timer:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></svg>`,
  compass:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
};

// ── Datos del drum (mutables — renderResults los actualiza) ──
const METRICS = [
  { id: 'wind',   icon: ICONS.wind,    name: 'Viento',    value: '—', label: '', phrase: '' },
  { id: 'wave',   icon: ICONS.wave,    name: 'Ola',       value: '—', label: '', phrase: '' },
  { id: 'gusts',  icon: ICONS.zap,     name: 'Rachas',    value: '—', label: '', phrase: '' },
  { id: 'period', icon: ICONS.timer,   name: 'Período',   value: '—', label: '', phrase: '' },
  { id: 'dir',    icon: ICONS.compass, name: 'Dirección', value: '—', label: '', phrase: '' },
];

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
let radial        = null;   // instancia RadialMetrics
let currentDay    = 0;
let currentFranja = 1;

// ── Vistas ──
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
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

    // Inicializar o redimensionar el carrusel radial una vez el DOM es visible
    requestAnimationFrame(() => {
      if (!radial) {
        radial = new RadialMetrics(document.getElementById('metrics-arc'), METRICS);
      } else {
        radial.resize();
        radial.refresh();
      }
    });
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

  const illustMap = { 'perfecto': 'Perfecto.png', 'bueno': 'Bueno.png' };
  const illusEl   = document.getElementById('diagnosis-illus');
  illusEl.dataset.estado = estado;
  if (illustMap[estado]) {
    illusEl.innerHTML = `<img src="assets/illustrations/${illustMap[estado]}" alt="" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    illusEl.innerHTML = '';
  }

  // Capa 2: Terral graduado
  const TERRAL_SVG_WARN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const TERRAL_SVG_STOP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
  const TERRAL_INFO = {
    1: { icon: TERRAL_SVG_WARN, title: 'Terral leve',      desc: 'Deriva hacia fuera baja. Puedes salir, pero sin alejarte.' },
    2: { icon: TERRAL_SVG_WARN, title: 'Terral relevante', desc: 'Te empuja mar adentro. Mejor quedarte cerca de la orilla.' },
    3: { icon: TERRAL_SVG_STOP, title: 'Terral fuerte',    desc: 'El viento te aleja de la orilla. Condiciones para quedarse en tierra.' },
  };
  const nivelTerral = calcularRiesgoTerral(d.windKn, d.gustKn, d.windDir, d.waveH, currentSpot);
  const alertEl = document.getElementById('offshore-alert');
  if (nivelTerral === 0) {
    alertEl.classList.add('hidden');
  } else {
    alertEl.classList.remove('hidden');
    alertEl.dataset.level = nivelTerral;
    const ti = TERRAL_INFO[nivelTerral];
    document.getElementById('terral-icon').innerHTML    = ti.icon;
    document.getElementById('terral-title').textContent = ti.title;
    document.getElementById('terral-desc').textContent  = ti.desc;
  }

  // Capa 3: Actualizar METRICS y refrescar wheel
  const lv = labelViento(d.windKn);
  METRICS[0].value  = `${d.windKn.toFixed(1)} kn`;
  METRICS[0].label  = lv.label;
  METRICS[0].phrase = lv.phrase;

  const lo = labelOla(d.waveH);
  METRICS[1].value  = `${d.waveH.toFixed(1)} m`;
  METRICS[1].label  = lo.label;
  METRICS[1].phrase = lo.phrase;

  const lr = labelRacha(d.gustKn);
  METRICS[2].value  = `${d.gustKn.toFixed(1)} kn`;
  METRICS[2].label  = lr.label;
  METRICS[2].phrase = lr.phrase;

  const lp = labelPeriodo(d.wavePer);
  METRICS[3].value  = `${d.wavePer.toFixed(0)} s`;
  METRICS[3].label  = lp.label;
  METRICS[3].phrase = lp.phrase;

  const ld = labelDireccion(d.windDir);
  METRICS[4].value  = degreesToCardinal(d.windDir);
  METRICS[4].label  = ld.label;
  METRICS[4].phrase = ld.phrase;

  if (radial) radial.refresh();
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
