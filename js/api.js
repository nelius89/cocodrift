// ─────────────────────────────────────────
// API — Open-Meteo
// ─────────────────────────────────────────

const FORECAST_DAYS = 7;

async function fetchSpotData(spot) {
  const cached = getCachedData(spot.id);
  if (cached) return cached;

  const params = `latitude=${spot.lat}&longitude=${spot.lon}&timezone=Europe/Madrid&forecast_days=${FORECAST_DAYS}`;

  const [marineRes, forecastRes] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?${params}&hourly=wave_height,wave_direction,wave_period,swell_wave_height,wind_wave_height,wind_wave_period`),
    fetch(`https://api.open-meteo.com/v1/forecast?${params}&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,weathercode,cloudcover,temperature_2m`)
  ]);

  if (!marineRes.ok || !forecastRes.ok) throw new Error('Error al obtener datos del mar');

  const marine   = await marineRes.json();
  const forecast = await forecastRes.json();

  setCachedData(spot.id, marine, forecast);
  return { marine, forecast };
}

// ── Geocoding — Nominatim (OpenStreetMap) ──
// Devuelve playas, bahías y cualquier lugar geográfico, no solo ciudades
async function searchSpots(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&accept-language=es`,
      { headers: { 'User-Agent': 'SUP App (sup-app.pages.dev)' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(r => {
      const addr = r.address || {};
      const name = addr.beach || addr.bay || r.display_name.split(',')[0].trim();
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
      const country = addr.country || '';
      return {
        name,
        location: [city, country].filter(Boolean).join(', '),
        city,
        latitude:  parseFloat(r.lat),
        longitude: parseFloat(r.lon),
      };
    });
  } catch {
    return [];
  }
}

// ── Franjas horarias ──
const FRANJAS = [
  { id: 'madrugada',     label: 'Madrugada',     hours: [0, 1, 2, 3, 4, 5] },
  { id: 'manana',        label: 'Mañana',         hours: [6, 7, 8] },
  { id: 'media-manana',  label: 'Media mañana',   hours: [9, 10, 11] },
  { id: 'mediodia',      label: 'Mediodía',       hours: [12, 13, 14] },
  { id: 'tarde',         label: 'Tarde',          hours: [15, 16, 17] },
  { id: 'atardecer',     label: 'Atardecer',      hours: [18, 19, 20] },
  { id: 'noche',         label: 'Noche',          hours: [21, 22, 23] }
];

// Devuelve el índice del slider (0..48) dado día (0-6) y franja (0-6)
function sliderIndex(day, franja) {
  return day * FRANJAS.length + franja;
}

// Franja activa según hora actual
function getCurrentFranjaIndex() {
  const h = new Date().getHours();
  for (let i = 0; i < FRANJAS.length; i++) {
    if (FRANJAS[i].hours.includes(h)) return i;
  }
  return 1; // fallback: Mañana
}

// Etiqueta legible del slider
function sliderLabel(index) {
  const day    = Math.floor(index / FRANJAS.length);
  const franja = index % FRANJAS.length;
  const dayLabel = dayLabelFromOffset(day);
  return `${dayLabel} · ${FRANJAS[franja].label}`;
}

function dayLabelFromOffset(offset) {
  if (offset === 0) return 'Hoy';
  if (offset === 1) return 'Mañana';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Extrae los datos promediados de una franja
function getDataForSlider(index, marine, forecast) {
  const day    = Math.floor(index / FRANJAS.length);
  const franja = FRANJAS[index % FRANJAS.length];

  // Los arrays de Open-Meteo tienen 24 entradas por día
  const hourIndices = franja.hours.map(h => day * 24 + h);

  function avg(arr) {
    const vals = hourIndices.map(i => arr[i]).filter(v => v != null);
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  const h = forecast.hourly;
  const m = marine.hourly;

  const windKmh  = avg(h.wind_speed_10m);
  const gustKmh  = avg(h.wind_gusts_10m);
  const windDir  = avg(h.wind_direction_10m);
  const waveH    = avg(m.wave_height);
  const wavePer  = avg(m.wave_period);
  const cloudPct = avg(h.cloudcover);
  // weathercode: usar el máximo del periodo (más pesimista)
  const weathercode = Math.max(...hourIndices.map(i => h.weathercode[i] || 0));

  return {
    windKn:      kmhToKnots(windKmh),
    gustKn:      kmhToKnots(gustKmh),
    windDir,
    waveH,
    wavePer,
    cloudPct,
    weathercode,
    tempC:       h.temperature_2m ? avg(h.temperature_2m) : 0,
  };
}
