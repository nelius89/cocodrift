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

// ── Estado ──
let currentSpot = null;
let currentData = null;
let deleteMode  = null;
let wheel       = null;   // instancia WheelPicker

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
  const row   = document.getElementById('spots-row');
  const spots = getAllSpots();
  row.innerHTML = '';

  spots.forEach(spot => {
    const btn = document.createElement('button');
    btn.className = 'spot-item' + (deleteMode === spot.id ? ' spot-item--delete-mode' : '');
    btn.dataset.id = spot.id;
    const abbrev = cityAbbrev(spot);
    btn.innerHTML = `
      <span class="spot-item__name">${spot.name}</span>${abbrev ? `<span class="spot-item__abbrev">${abbrev}</span>` : ''}
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

    row.appendChild(btn);
  });

  // Botón añadir — siempre al final del grid
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-spot';
  addBtn.id = 'btn-add-spot';
  addBtn.textContent = '+';
  addBtn.addEventListener('click', openOverlay);
  row.appendChild(addBtn);

  // Botones borrar
  row.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeUserSpot(btn.dataset.delete);
      deleteMode = null;
      renderSpotList();
    });
  });
}

// ── Cargar datos y mostrar resultados ──
async function loadSpot(spot) {
  currentSpot = spot;
  setActiveSpot(spot.id);
  showView('view-results');

  document.getElementById('results-spot-name').textContent = spot.name;
  document.getElementById('diagnosis-title').textContent   = 'Cargando...';
  document.getElementById('diagnosis-desc').textContent    = '';

  try {
    currentData = await fetchSpotData(spot);
    const sliderEl  = document.getElementById('time-slider');
    const initIndex = getCurrentFranjaIndex();
    sliderEl.max   = (FRANJAS.length * FORECAST_DAYS) - 1;
    sliderEl.value = initIndex;
    renderResults(initIndex);

    // Inicializar o redimensionar el wheel una vez el DOM es visible
    requestAnimationFrame(() => {
      if (!wheel) {
        wheel = new WheelPicker(document.getElementById('metrics-drum'), METRICS);
      } else {
        wheel.resize();
        wheel.refresh();
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
  document.getElementById('diagnosis-illus').dataset.estado = estado;

  // Capa 2: Offshore
  const offshore = esOffshore(d.windDir, currentSpot);
  document.getElementById('offshore-alert').classList.toggle('hidden', !offshore);

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

  if (wheel) wheel.refresh();

  // Barra temporal: etiqueta
  document.getElementById('time-bar-label').textContent = sliderLabel(sliderIndex);
}

// ── Overlay: añadir spot ──
let selectedGeoResult = null;

function openOverlay() {
  document.getElementById('overlay-add-spot').classList.remove('hidden');
  document.getElementById('search-input').focus();
}

function closeOverlay() {
  document.getElementById('overlay-add-spot').classList.add('hidden');
  document.getElementById('search-input').value   = '';
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('add-spot-confirm').classList.add('hidden');
  document.getElementById('spot-name-input').value = '';
  selectedGeoResult = null;
}

async function handleSearch(query) {
  const list = document.getElementById('search-results');
  list.innerHTML = '<li style="padding:14px 16px;opacity:0.4;font-size:13px">Buscando...</li>';
  const results = await searchSpots(query);

  list.innerHTML = '';
  if (!results.length) {
    list.innerHTML = '<li style="padding:14px 16px;opacity:0.4;font-size:13px">Sin resultados</li>';
    return;
  }

  results.forEach(r => {
    const li = document.createElement('li');
    li.className = 'search-result-item';
    li.innerHTML = `${r.name}<span class="search-result-item__country">${r.country || ''}</span>`;
    li.addEventListener('click', () => selectGeoResult(r));
    list.appendChild(li);
  });
}

function selectGeoResult(result) {
  selectedGeoResult = result;
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('spot-name-input').value = result.name;
  document.getElementById('add-spot-confirm').classList.remove('hidden');
}

function saveNewSpot() {
  if (!selectedGeoResult) return;
  const name = document.getElementById('spot-name-input').value.trim() || selectedGeoResult.name;
  const newSpot = {
    id: `user-${Date.now()}`,
    name,
    city: selectedGeoResult.admin1 || selectedGeoResult.country || '',
    lat: selectedGeoResult.latitude,
    lon: selectedGeoResult.longitude,
    hardcoded: false,
    offshore_range: [225, 315] // default — misma costa
  };
  addUserSpot(newSpot);
  closeOverlay();
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

  // Abrir overlay
  document.getElementById('btn-close-overlay').addEventListener('click', closeOverlay);

  // Cerrar overlay tocando fuera
  document.getElementById('overlay-add-spot').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeOverlay();
  });

  // Búsqueda con debounce
  let searchTimer;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    if (q.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    searchTimer = setTimeout(() => handleSearch(q), 350);
  });

  // Guardar spot nuevo
  document.getElementById('btn-save-spot').addEventListener('click', saveNewSpot);

  // Slider temporal
  document.getElementById('time-slider').addEventListener('input', (e) => {
    renderResults(parseInt(e.target.value));
  });

  // Cerrar modo borrar tocando fuera de la lista
  document.addEventListener('click', (e) => {
    if (deleteMode && !e.target.closest('.spot-list')) {
      deleteMode = null;
      renderSpotList();
    }
  });
});
