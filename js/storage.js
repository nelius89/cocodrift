// ─────────────────────────────────────────
// STORAGE — localStorage management
// ─────────────────────────────────────────

const HARDCODED_SPOTS = [
  {
    id: 'pont-petroli',
    name: 'Pont del Petroli',
    city: 'Badalona',
    abbrev: 'BDN',
    lat: 41.4421,
    lon: 2.2385,
    hardcoded: true,
    offshore_range: [225, 315]
  },
  {
    id: 'platja-llevant',
    name: 'Platja del Llevant',
    city: 'Barcelona',
    abbrev: 'BCN',
    lat: 41.3934,
    lon: 2.2048,
    hardcoded: true,
    offshore_range: [225, 315]
  }
];

const STORAGE_KEY = 'sup-app';

function getStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { spots: [], activeSpotId: 'pont-petroli', cache: {} };
  } catch {
    return { spots: [], activeSpotId: 'pont-petroli', cache: {} };
  }
}

function saveStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getAllSpots() {
  const { spots } = getStorage();
  return [...HARDCODED_SPOTS, ...spots];
}

function addUserSpot(spot) {
  const data = getStorage();
  if (data.spots.length >= 8) return false; // max 10 total (2 hardcoded + 8 user)
  data.spots.push(spot);
  saveStorage(data);
  return true;
}

function removeUserSpot(id) {
  const data = getStorage();
  data.spots = data.spots.filter(s => s.id !== id);
  if (data.activeSpotId === id) data.activeSpotId = 'pont-petroli';
  saveStorage(data);
}

function setActiveSpot(id) {
  const data = getStorage();
  data.activeSpotId = id;
  saveStorage(data);
}

function getActiveSpotId() {
  return getStorage().activeSpotId;
}

// Cache — guarda la respuesta de la API con timestamp
function getCachedData(spotId) {
  const { cache } = getStorage();
  const entry = cache[spotId];
  if (!entry) return null;
  const ageMinutes = (Date.now() - entry.timestamp) / 60000;
  if (ageMinutes > 60) return null; // TTL: 60 min
  return entry;
}

function setCachedData(spotId, marine, forecast) {
  const data = getStorage();
  if (!data.cache) data.cache = {};
  data.cache[spotId] = { timestamp: Date.now(), marine, forecast };
  saveStorage(data);
}
