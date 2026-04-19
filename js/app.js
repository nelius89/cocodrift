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
  const f = FRANJAS[currentFranja];
  document.getElementById('time-nav-icon').innerHTML     = FRANJA_ICONS[currentFranja];
  document.getElementById('time-nav-name').textContent   = f.label;
  document.getElementById('time-nav-hours').textContent  = `${f.hours[0]}h–${f.hours[f.hours.length - 1]}h`;
}

// ── Cargar datos y mostrar resultados ──
async function loadSpot(spot) {
  currentSpot   = spot;
  currentDay    = 0;
  currentFranja = getCurrentFranjaIndex();
  setActiveSpot(spot.id);
  showView('view-results');

  document.getElementById('results-spot-name').textContent = spot.name;
  document.getElementById('diagnosis-title').textContent    = 'Cargando...';
  document.getElementById('diagnosis-subtitle').textContent = '';
  document.getElementById('terral-pill').classList.add('hidden');
  document.getElementById('tech-section').classList.remove('open');
  document.getElementById('tech-toggle').classList.remove('open');

  try {
    currentData = await fetchSpotData(spot);
    renderTimeNav();
    renderResults(sliderIndex(currentDay, currentFranja));

  } catch (err) {
    document.getElementById('diagnosis-title').textContent    = 'Sin conexión';
    document.getElementById('diagnosis-subtitle').textContent = 'No se han podido cargar los datos. Comprueba tu conexión.';
  }
}

const TERRAL_INFO = {
  1: { label: 'Terral leve',      pillLabel: 'TERRAL LEVE',      title: 'AVISO VIENTO TERRAL', desc: 'El viento sopla de tierra hacia el mar. Aunque el agua parezca tranquila, puede empujarte lentamente fuera.', advice: 'Puedes salir, pero no te alejes de la orilla.' },
  2: { label: 'Terral relevante', pillLabel: 'TERRAL RELEVANTE', title: 'AVISO VIENTO TERRAL', desc: 'El viento te llevará progresivamente alejándote de la playa, aunque al principio no lo notes.', advice: 'Quédate cerca de la orilla en todo momento.' },
  3: { label: 'Terral fuerte',    pillLabel: 'TERRAL FUERTE',    title: 'VIENTO TERRAL FUERTE', desc: 'Las condiciones offshore son peligrosas. El viento empuja con fuerza hacia mar abierto y recuperar la posición puede ser muy difícil.', advice: 'Hoy es mejor quedarse en tierra.' },
};

function renderResults(sliderIdx) {
  if (!currentData) return;
  const { marine, forecast } = currentData;
  const d = getDataForSlider(sliderIdx, marine, forecast);

  // Score y estado
  const score  = calcularScore(d.windKn, d.waveH, d.gustKn, d.wavePer, d.cloudPct);
  const estado = getEstado(score, d.weathercode);
  const info   = ESTADOS[estado];

  // Header: icono tiempo + temperatura
  document.getElementById('results-weather-icon').innerHTML   = getWeatherIcon(d.weathercode);
  document.getElementById('results-weather-temp').textContent = `${Math.round(d.tempC)}°`;

  // Bloque 2 — decisión principal
  document.getElementById('diagnosis-title').textContent    = info.titulo;
  document.getElementById('diagnosis-subtitle').textContent = info.subtitulo;

  // Ilustración
  const ILLUS_MAP = { 'perfecto': 'Perfecto.png', 'bueno': 'Bueno.png' };
  const illusEl = document.getElementById('diagnosis-illus');
  if (ILLUS_MAP[estado]) {
    illusEl.style.display = '';
    illusEl.innerHTML = `<img src="assets/illustrations/${ILLUS_MAP[estado]}" alt="">`;
  } else {
    illusEl.style.display = 'none';
    illusEl.innerHTML = '';
  }

  // Bloques viento + mar en pantalla principal (título bold + desc gris)
  const blocks = buildBlocks(d, estado);
  document.getElementById('diagnosis-wind-icon').innerHTML    = ICONS.wind;
  document.getElementById('diagnosis-wind-title').textContent = blocks.windTitle;
  document.getElementById('diagnosis-wind-desc').textContent  = blocks.windDesc;
  document.getElementById('diagnosis-sea-icon').innerHTML     = ICONS.wave;
  document.getElementById('diagnosis-sea-title').textContent  = blocks.seaTitle;
  document.getElementById('diagnosis-sea-desc').textContent   = blocks.seaDesc;

  // Terral pill en pantalla principal
  const nivelTerral = calcularRiesgoTerral(d.windKn, d.gustKn, d.windDir, d.waveH, currentSpot);
  const pillEl = document.getElementById('terral-pill');
  if (nivelTerral === 0) {
    pillEl.classList.add('hidden');
  } else {
    const ti = TERRAL_INFO[nivelTerral];
    pillEl.classList.remove('hidden');
    document.getElementById('terral-pill-label').textContent = ti.pillLabel;
    // Rellenar modal
    document.getElementById('terral-modal-title').textContent  = ti.title;
    document.getElementById('terral-modal-desc').textContent   = ti.desc;
    document.getElementById('terral-modal-advice').textContent = ti.advice;
  }

  // Bloque 3 — info técnica (tech rows)
  const tech = buildTechBlocks(d, estado);

  function setTechRow(prefix, iconSvg, value, sub, block) {
    document.getElementById(`tr-${prefix}-icon`).innerHTML    = iconSvg;
    document.getElementById(`tr-${prefix}-value`).textContent = value;
    document.getElementById(`tr-${prefix}-sub`).textContent   = sub;
    document.getElementById(`tr-${prefix}-p1`).textContent    = block.p1;
    document.getElementById(`tr-${prefix}-p2`).textContent    = block.p2;
    document.getElementById(`tr-${prefix}-p3`).textContent    = block.p3;
  }

  setTechRow('wind',   ICONS.wind,  `${d.windKn.toFixed(1)} kn`, labelViento(d.windKn).label, tech.wind);
  setTechRow('gusts',  ICONS.zap,   `${d.gustKn.toFixed(1)} kn`, labelRacha(d.gustKn).label,  tech.gusts);
  setTechRow('wave',   ICONS.wave,  `${d.waveH.toFixed(1)} m`,   labelOla(d.waveH).label,     tech.sea);
  setTechRow('period', ICONS.timer, `${d.wavePer.toFixed(0)} s`, labelPeriodo(d.wavePer).label, tech.period);

  document.getElementById('tech-closing').textContent = tech.closing;
}

function shortDirLabel(degrees) {
  if (degrees >= 225 && degrees <= 315) return 'Terral';
  if (degrees >= 45  && degrees <= 135) return 'De mar';
  return 'Lateral';
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
const SUGGESTIONS_WORKER = 'https://coco-suggestions.manel89.workers.dev';

function openSuggestionsSheet() {
  closeMenu();
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

// ── Tech toggle (acordeón técnico) ──
function initTechToggle() {
  const toggle  = document.getElementById('tech-toggle');
  const section = document.getElementById('tech-section');
  toggle.addEventListener('click', () => {
    const opening = !section.classList.contains('open');
    section.classList.toggle('open');
    toggle.classList.toggle('open');
    if (opening) {
      // Scroll suave para que el botón quede visible con el contenido justo debajo
      setTimeout(() => toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  });
}

// ── Terral popup ──
function openTerralPopup() {
  document.getElementById('terral-overlay').classList.remove('hidden');
  document.getElementById('terral-modal').classList.remove('hidden');
}

function closeTerralPopup() {
  document.getElementById('terral-overlay').classList.add('hidden');
  document.getElementById('terral-modal').classList.add('hidden');
}

// ── Franja label con horas ──
function franjaLabel(franjaIndex) {
  const f = FRANJAS[franjaIndex];
  const h = f.hours;
  return `${f.label} · ${h[0]}h–${h[h.length - 1]}h`;
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

  // Terral pill → popup
  document.getElementById('terral-pill').addEventListener('click', openTerralPopup);
  document.getElementById('terral-overlay').addEventListener('click', closeTerralPopup);
  document.getElementById('terral-modal-close').addEventListener('click', closeTerralPopup);
  initTechToggle();

  // Back button — volver a home
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
    const f = FRANJAS[currentFranja];
    document.getElementById('time-nav-icon').innerHTML    = FRANJA_ICONS[currentFranja];
    document.getElementById('time-nav-name').textContent  = f.label;
    document.getElementById('time-nav-hours').textContent = `${f.hours[0]}h–${f.hours[f.hours.length - 1]}h`;
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
