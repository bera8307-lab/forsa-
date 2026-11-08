const queriesEl = document.getElementById("queries");
const languageEl = document.getElementById("language");
const regionEl = document.getElementById("region");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const resultsBody = document.getElementById("results-body");
const exportCsvBtn = document.getElementById("export-csv");
const exportXlsxBtn = document.getElementById("export-xlsx");
const statCount = document.getElementById("stat-count");
const statCategories = document.getElementById("stat-categories");
const statSites = document.getElementById("stat-sites");
const statEmails = document.getElementById("stat-emails");
const emailOnlyEl = document.getElementById("email-only");
const statAvgRating = document.getElementById("stat-avg-rating");
const companySearchEl = document.getElementById("company-search");
const clearSearchBtn = document.getElementById("clear-search");

const viewTabs = document.querySelectorAll(".view-tab");
const viewTable = document.getElementById("view-table");
const viewMap = document.getElementById("view-map");
const mapEmptyEl = document.getElementById("map-empty");
const recentSearchesEl = document.getElementById("recent-searches");
const recentChipsEl = document.getElementById("recent-chips");
const sortButtons = document.querySelectorAll(".th-sort");

const avatarInitials = document.getElementById("avatar-initials");
const menuFavoritesBtn = document.querySelector('.side-item[data-page="favorites"]');
const favCountEl = document.getElementById("fav-count");
const sidebarEl = document.getElementById("sidebar");
const sideBackdrop = document.getElementById("side-backdrop");
const navBurger = document.getElementById("nav-burger");
const navSearchEl = document.getElementById("nav-search");
const profileChip = document.getElementById("profile-chip");
const topbarUserName = document.getElementById("topbar-user-name");
const topbarUserEmail = document.getElementById("topbar-user-email");
const settingsModal = document.getElementById("settings-modal");
const pageEls = {
  home: document.getElementById("page-home"),
  dashboard: document.getElementById("page-dashboard"),
  chatbot: document.getElementById("page-chatbot"),
};
const applicationsCountEl = document.getElementById("applications-count");
const langToggle = document.getElementById("lang-toggle");
const themeChoices = document.querySelectorAll("[data-theme-choice]");

const chartsGrid = document.getElementById("charts-grid");
const chartsEmpty = document.getElementById("charts-empty");

const profileModal = document.getElementById("profile-modal");
const profileFullNameDisplay = document.getElementById("profile-fullname-display");
const profileFirstNameDisplay = document.getElementById("profile-firstname-display");
const profileLastNameDisplay = document.getElementById("profile-lastname-display");
const profileEmailDisplay = document.getElementById("profile-email-display");
const profilePhoneDisplay = document.getElementById("profile-phone-display");
const profileBirthDisplay = document.getElementById("profile-birth-display");
const profileAvatarPreview = document.getElementById("profile-avatar-preview");
const profileLogoutBtn = document.getElementById("profile-logout");
const menuLogoutBtn = document.getElementById("menu-logout-btn");

/* CV & applications */
const cvNavBtn = document.getElementById("cv-nav-btn");
const cvStatusDot = document.getElementById("cv-status-dot");
const cvModal = document.getElementById("cv-modal");
const cvCurrentStatus = document.getElementById("cv-current-status");
const cvFileInput = document.getElementById("cv-file-input");
const cvUploadBtn = document.getElementById("cv-upload-btn");
const cvFileActions = document.getElementById("cv-file-actions");
const cvDownloadLink = document.getElementById("cv-download-link");
const cvDeleteBtn = document.getElementById("cv-delete-btn");
const cvProfileForm = document.getElementById("cv-profile-form");
const cvGenerateBtn = document.getElementById("cv-generate-btn");
const cvFullName = document.getElementById("cv-full-name");
const cvTargetRole = document.getElementById("cv-target-role");
const cvPhone = document.getElementById("cv-phone");
const cvAddress = document.getElementById("cv-address");
const cvEducation = document.getElementById("cv-education");
const cvExperience = document.getElementById("cv-experience");
const cvSkills = document.getElementById("cv-skills");
const cvLanguages = document.getElementById("cv-languages");
const cvGeneratedWrap = document.getElementById("cv-generated-wrap");
const cvGeneratedTextarea = document.getElementById("cv-generated-textarea");
const cvSaveGeneratedBtn = document.getElementById("cv-save-generated-btn");
const cvDownloadGeneratedBtn = document.getElementById("cv-download-generated-btn");
const cvStatusEl = document.getElementById("cv-status");

const applicationModal = document.getElementById("application-modal");
const applicationCompany = document.getElementById("application-company");
const applicationNoProfile = document.getElementById("application-no-profile");
const applicationOpenCvBtn = document.getElementById("application-open-cv-btn");
const applicationNoCv = document.getElementById("application-no-cv");
const applicationOpenCvFromCvBtn = document.getElementById("application-open-cv-from-cv-btn");
const applicationDownloadCvBtn = document.getElementById("application-download-cv-btn");
const applicationEmail = document.getElementById("application-email");
const applicationEmailHint = document.getElementById("application-email-hint");
const applicationSendBtn = document.getElementById("application-send-btn");
const applicationJobTitle = document.getElementById("application-job-title");
const applicationNotes = document.getElementById("application-notes");
const applicationGenerateBtn = document.getElementById("application-generate-btn");
const applicationLetter = document.getElementById("application-letter");
const applicationStatusEl = document.getElementById("application-status");
const applicationDownloadBtn = document.getElementById("application-download-btn");
const applicationSaveBtn = document.getElementById("application-save-btn");

const applicationsModal = document.getElementById("applications-modal");
const applicationsListEl = document.getElementById("applications-list");
const applicationsEmptyEl = document.getElementById("applications-empty");

let candidateProfile = { has_cv: false, cv_source: "none" };
let applicationsByPlace = new Map();
let applicationsTab = "envoye";
const applicationsCountSentEl = document.getElementById("applications-count-sent");
const applicationsCountSavedEl = document.getElementById("applications-count-saved");
let currentApplicationPlace = null;

const COLUMNS = [
  "nom", "categorie", "adresse", "telephone", "email", "site_web",
  "note", "nombre_avis", "latitude", "longitude", "google_maps", "query",
];

const STAR_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z"/></svg>`;
const GLOBE_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z"/></svg>`;
const PIN_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>`;

let allResults = [];
let currentResults = [];
let favoritesOnly = false;
let hasSearched = false;
let sortKey = null;
let sortDir = "asc";
let currentView = "table";

// Les favoris sont stockés avec les données complètes de l'établissement : la page « Favoris »
// doit pouvoir les afficher même après un rafraîchissement ou une autre recherche.
const FAVORITES_KEY = "places_finder_favorites";            // ancien format : identifiants seuls
const FAVORITES_DATA_KEY = "places_finder_favorites_data";  // nouveau format : [[clé, établissement], ...]

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_DATA_KEY) || "null");
    if (Array.isArray(stored)) {
      return new Map(stored.filter((entry) => Array.isArray(entry) && entry[1] && typeof entry[1] === "object"));
    }
  } catch {
    /* données illisibles : on repart de zéro */
  }
  return new Map();
}

let favorites = loadFavorites();

// Favoris enregistrés avec l'ancien format (sans données) : on les complète dès que
// l'établissement réapparaît dans les résultats d'une recherche.
let legacyFavoriteKeys = new Set();
try {
  legacyFavoriteKeys = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
} catch {
  legacyFavoriteKeys = new Set();
}

function placeKey(place) {
  return place.place_id || `${place.nom}|${place.adresse}`;
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_DATA_KEY, JSON.stringify([...favorites]));
  favCountEl.textContent = favorites.size;
}

function upgradeLegacyFavorites(results) {
  if (!legacyFavoriteKeys.size) return;
  let changed = false;
  results.forEach((place) => {
    const key = placeKey(place);
    if (legacyFavoriteKeys.has(key)) {
      favorites.set(key, place);
      legacyFavoriteKeys.delete(key);
      changed = true;
    }
  });
  if (changed) {
    saveFavorites();
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...legacyFavoriteKeys]));
  }
}

function toggleFavorite(key) {
  if (favorites.has(key)) {
    favorites.delete(key);
  } else {
    const place = findPlaceByKey(key);
    if (place) favorites.set(key, place);
  }
  saveFavorites();
  applySearchFilter();
}

function normalize(value) {
  return (value ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterResults(results, query) {
  const q = normalize(query).trim();
  if (!q) return results;
  return results.filter((place) =>
    [place.nom, place.categorie, place.adresse, place.query]
      .some((field) => normalize(field).includes(q))
  );
}

function sortResults(results) {
  if (!sortKey) return results;
  const factor = sortDir === "asc" ? 1 : -1;
  return [...results].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * factor;
    return String(va).localeCompare(String(vb)) * factor;
  });
}

function computeAndRender() {
  const query = companySearchEl.value;
  clearSearchBtn.hidden = !query;

  // Page « Favoris » : on lit les favoris enregistrés, pas les résultats de la dernière recherche.
  let filtered = filterResults(favoritesOnly ? [...favorites.values()] : allResults, query);
  if (emailOnlyEl.checked) {
    filtered = filtered.filter((place) => place.email);
  }
  currentResults = sortResults(filtered);

  renderTable(currentResults);
  updateStats(currentResults);
  renderCharts(currentResults);
  renderMap(currentResults);
  exportCsvBtn.disabled = currentResults.length === 0;
  exportXlsxBtn.disabled = currentResults.length === 0;
}

function applySearchFilter() {
  computeAndRender();
  const query = companySearchEl.value;

  if (favoritesOnly) {
    setStatus(t("status_favorites_count", { count: currentResults.length }), currentResults.length ? "success" : "error");
    updateFavHead();
  } else if (query && allResults.length) {
    setStatus(t("status_filter_results", { count: currentResults.length, query }), currentResults.length ? "success" : "error");
  } else if (allResults.length) {
    setStatus(t("status_results_found", { count: allResults.length }), "success");
  }
}

sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    if (sortKey === key) {
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortDir = key === "note" ? "desc" : "asc";
    }
    sortButtons.forEach((b) => b.classList.remove("sort-asc", "sort-desc"));
    btn.classList.add(sortDir === "asc" ? "sort-asc" : "sort-desc");
    computeAndRender();
  });
});

/* ---------------- view toggle (table / map) ---------------- */

viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentView = tab.dataset.view;
    viewTabs.forEach((t2) => {
      t2.classList.toggle("active", t2 === tab);
      t2.setAttribute("aria-selected", t2 === tab ? "true" : "false");
    });
    viewTable.hidden = currentView !== "table";
    viewMap.hidden = currentView !== "map";
    if (currentView === "map") {
      ensureMap();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (map) map.invalidateSize();
        renderMap(currentResults);
      }));
    }
  });
});

/* ---------------- graphiques ---------------- */

let chartCategories = null;
let chartWebsite = null;
let chartQueries = null;
let chartRating = null;

function hexToRgba(hex, alpha) {
  const clean = (hex || "").trim().replace("#", "");
  if (clean.length !== 6) return `rgba(150, 150, 150, ${alpha})`;
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* Palette dérivée des couleurs du thème (cyan/violet/vert/rouge), avec un
   dégradé d'opacité pour couvrir un nombre variable de catégories, comme
   vu en cours pour les graphiques en barres et en secteurs. */
function chartPalette(n) {
  const style = getComputedStyle(document.body);
  const base = [
    style.getPropertyValue("--cyan"),
    style.getPropertyValue("--violet"),
    style.getPropertyValue("--good"),
    style.getPropertyValue("--bad"),
  ];
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hex = base[i % base.length];
    const fade = Math.max(1 - Math.floor(i / base.length) * 0.25, 0.35);
    colors.push(hexToRgba(hex, fade));
  }
  return colors;
}

/* Regroupement par catégorie, trié par fréquence décroissante : équivalent
   d'un value_counts() suivi d'un bar plot. */
function topCategoryData(results, limit = 8) {
  const counts = new Map();
  results.forEach((r) => {
    const cat = r.categorie || t("chart_uncategorized");
    counts.set(cat, (counts.get(cat) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

/* Proportion avec/sans site web : équivalent d'un pie chart à deux parts. */
function websiteData(results) {
  const withSite = results.filter((r) => r.site_web).length;
  return [withSite, results.length - withSite];
}

/* Répartition des notes arrondies à l'entier le plus proche (1 à 5 étoiles). */
function ratingDistributionData(results) {
  const buckets = [1, 2, 3, 4, 5].map(() => 0);
  results.forEach((r) => {
    if (typeof r.note !== "number") return;
    const bucket = Math.min(5, Math.max(1, Math.round(r.note)));
    buckets[bucket - 1] += 1;
  });
  return buckets;
}

/* Nombre de résultats par mot-clé de recherche saisi par l'utilisateur. */
function queryData(results) {
  const counts = new Map();
  results.forEach((r) => {
    const q = r.query || "—";
    counts.set(q, (counts.get(q) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function destroyCharts() {
  [chartCategories, chartWebsite, chartQueries, chartRating].forEach((c) => c && c.destroy());
  chartCategories = null;
  chartWebsite = null;
  chartQueries = null;
  chartRating = null;
}

function renderCharts(results) {
  if (typeof Chart === "undefined") return;

  const hasData = Boolean(results && results.length);
  chartsGrid.hidden = !hasData;
  chartsEmpty.hidden = hasData;

  if (!hasData) {
    destroyCharts();
    return;
  }

  /* La grille de graphiques vient de passer de display:none à visible.
     Si on dessine les graphiques tout de suite, Chart.js peut mesurer les
     canvases avant que le navigateur ait fini de calculer leur taille
     réelle, et les dessine alors en 0x0 (cartes vides, aucune erreur).
     On attend deux "frames" d'affichage pour être sûr que la mise en page
     est bien terminée avant de créer les graphiques. */
  requestAnimationFrame(() => requestAnimationFrame(() => buildCharts(results)));
}

function buildCharts(results) {
  destroyCharts();

  const style = getComputedStyle(document.body);
  const textColor = style.getPropertyValue("--text-soft").trim();
  const gridColor = style.getPropertyValue("--border-soft").trim();
  const panelColor = style.getPropertyValue("--bg-panel-solid").trim();
  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.color = textColor;

  const catEntries = topCategoryData(results);
  chartCategories = new Chart(document.getElementById("chart-categories"), {
    type: "bar",
    data: {
      labels: catEntries.map((e) => e[0]),
      datasets: [{
        label: t("chart_categories_axis"),
        data: catEntries.map((e) => e[1]),
        backgroundColor: chartPalette(catEntries.length),
        borderRadius: 6,
        maxBarThickness: 34,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor, maxRotation: 30 }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
      },
    },
  });

  const [withSite, withoutSite] = websiteData(results);
  chartWebsite = new Chart(document.getElementById("chart-website"), {
    type: "pie",
    data: {
      labels: [t("chart_with_website"), t("chart_without_website")],
      datasets: [{
        data: [withSite, withoutSite],
        backgroundColor: chartPalette(2),
        borderColor: panelColor,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { color: textColor, boxWidth: 12, padding: 14 } } },
    },
  });

  const ratingBuckets = ratingDistributionData(results);
  chartRating = new Chart(document.getElementById("chart-rating"), {
    type: "bar",
    data: {
      labels: ["1★", "2★", "3★", "4★", "5★"],
      datasets: [{
        label: t("chart_rating_axis"),
        data: ratingBuckets,
        backgroundColor: chartPalette(5),
        borderRadius: 6,
        maxBarThickness: 34,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
      },
    },
  });

  const queryEntries = queryData(results);
  chartQueries = new Chart(document.getElementById("chart-queries"), {
    type: "bar",
    data: {
      labels: queryEntries.map((e) => e[0]),
      datasets: [{
        label: t("chart_queries_axis"),
        data: queryEntries.map((e) => e[1]),
        backgroundColor: chartPalette(queryEntries.length),
        borderRadius: 6,
        maxBarThickness: 34,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { display: false } },
      },
    },
  });
}

/* ---------------- map ---------------- */

let map = null;
let tileLayer = null;
let clusterGroup = null;

// Tuiles OpenStreetMap : gratuites et sans clé API (les tuiles CARTO exigent maintenant une clé).
// Le thème sombre est obtenu avec un filtre CSS sur .leaflet-tile-pane (voir style.css).
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_OPTIONS = {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

function tileUrlForTheme() {
  return TILE_URL;
}

function ensureMap() {
  if (map || typeof L === "undefined") return;
  map = L.map("map", { zoomControl: true, attributionControl: true }).setView([31.63, -7.99], 12);
  tileLayer = L.tileLayer(tileUrlForTheme(), TILE_OPTIONS).addTo(map);
  clusterGroup = L.markerClusterGroup({
    iconCreateFunction: (cluster) => L.divIcon({
      html: `<div class="map-pin-cluster" style="width:${34 + Math.min(cluster.getChildCount(), 20)}px;height:${34 + Math.min(cluster.getChildCount(), 20)}px;">${cluster.getChildCount()}</div>`,
      className: "",
      iconSize: null,
    }),
  });
  map.addLayer(clusterGroup);
}

function refreshMapTiles() {
  if (!map || !tileLayer) return;
  map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(tileUrlForTheme(), TILE_OPTIONS).addTo(map);
  tileLayer.bringToBack();
}

function renderMap(results) {
  if (typeof L === "undefined") return;
  const geoResults = results.filter((r) => typeof r.latitude === "number" && typeof r.longitude === "number");

  if (currentView !== "map") return;
  ensureMap();
  if (!map) return;

  clusterGroup.clearLayers();
  mapEmptyEl.hidden = geoResults.length > 0;
  if (!geoResults.length) return;

  const pinIcon = L.divIcon({
    html: `<div class="map-pin">${PIN_ICON.replace('width="15" height="15"', 'width="13" height="13"')}</div>`,
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });

  const markers = geoResults.map((place) => {
    const marker = L.marker([place.latitude, place.longitude], { icon: pinIcon });
    const links = [
      place.site_web ? `<a href="${escapeHtml(place.site_web)}" target="_blank" rel="noopener">${t("popup_website")}</a>` : "",
      place.google_maps ? `<a href="${escapeHtml(place.google_maps)}" target="_blank" rel="noopener">${t("popup_maps")}</a>` : "",
    ].filter(Boolean).join(" · ");
    marker.bindPopup(`
      <p class="popup-name">${escapeHtml(place.nom)}</p>
      ${place.categorie ? `<div class="popup-badge"><span class="badge">${escapeHtml(place.categorie)}</span></div>` : ""}
      <p class="popup-addr">${escapeHtml(place.adresse) || ""}</p>
      <div class="popup-links">${links}</div>
    `);
    return marker;
  });

  clusterGroup.addLayers(markers);
  map.fitBounds(clusterGroup.getBounds().pad(0.2), { maxZoom: 15 });
}

/* ---------------- recent searches ---------------- */

const RECENT_KEY = "places_finder_recent_searches";
const MAX_RECENT = 5;

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(queries, language, region) {
  const entry = { queries, language, region };
  let recent = loadRecentSearches().filter((r) => r.queries.join("|") !== queries.join("|"));
  recent.unshift(entry);
  recent = recent.slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  renderRecentSearches();
}

function renderRecentSearches() {
  const recent = loadRecentSearches();
  recentSearchesEl.hidden = recent.length === 0;
  recentChipsEl.innerHTML = "";
  recent.forEach((entry) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "recent-chip";
    const label = entry.queries.length > 1
      ? `${entry.queries[0]} +${entry.queries.length - 1}`
      : entry.queries[0];
    chip.textContent = label;
    chip.title = entry.queries.join(", ");
    chip.addEventListener("click", () => {
      queriesEl.value = entry.queries.join("\n");
      languageEl.value = entry.language || "fr";
      regionEl.value = entry.region || "";
      launchSearch();
    });
    recentChipsEl.appendChild(chip);
  });
}

function setStatus(message, kind) {
  statusEl.hidden = !message;
  statusEl.textContent = message;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function showSkeleton(rows = 6) {
  resultsBody.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    const card = document.createElement("article");
    card.className = "rc rc-skeleton";
    card.setAttribute("aria-hidden", "true");
    card.innerHTML = `
      <div class="skeleton-bar" style="width:${55 + Math.random() * 30}%;height:16px"></div>
      <div class="skeleton-bar" style="width:38%;height:12px"></div>
      <div class="skeleton-bar" style="width:${70 + Math.random() * 20}%;height:12px"></div>
      <div class="skeleton-bar" style="width:100%;height:38px;margin-top:8px"></div>`;
    resultsBody.appendChild(card);
  }
}

function updateStats(results) {
  statCount.textContent = results.length;
  statCategories.textContent = new Set(results.map((r) => r.categorie).filter(Boolean)).size;
  statSites.textContent = results.filter((r) => r.site_web).length;
  statEmails.textContent = results.filter((r) => r.email).length;

  const rated = results.filter((r) => typeof r.note === "number");
  statAvgRating.textContent = rated.length
    ? (rated.reduce((sum, r) => sum + r.note, 0) / rated.length).toFixed(1)
    : "—";
}

const expandedCards = new Set();
let cardUid = 0;

const PHONE_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>';
const MAIL_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
const TAG_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8Z"/><circle cx="7.5" cy="8.5" r="1.2"/></svg>';
const CHEVRON_ICON = '<svg class="rc-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

// On n'accepte que http(s) pour les liens issus des données.
function safeHref(url) {
  return /^https?:\/\//i.test(url || "") ? escapeHtml(url) : "";
}

function prettyHost(url) {
  return String(url || "").replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

function buildDetailRows(place) {
  const rows = [];
  if (place.telephone) {
    const tel = escapeHtml(place.telephone);
    rows.push([PHONE_ICON, t("rc_phone"), `<a href="tel:${escapeHtml(place.telephone.replace(/[^\d+]/g, ""))}">${tel}</a>`]);
  }
  if (place.email) {
    rows.push([MAIL_ICON, t("rc_email"), `<a href="mailto:${escapeHtml(place.email)}">${escapeHtml(place.email)}</a>`]);
  }
  const site = safeHref(place.site_web);
  if (site) {
    rows.push([GLOBE_ICON, t("rc_website"), `<a href="${site}" target="_blank" rel="noopener noreferrer">${escapeHtml(prettyHost(place.site_web))}</a>`]);
  }
  const maps = safeHref(place.google_maps);
  if (maps) {
    rows.push([PIN_ICON, t("rc_maps"), `<a href="${maps}" target="_blank" rel="noopener noreferrer">${t("rc_open_maps")}</a>`]);
  }
  if (place.query) {
    rows.push([TAG_ICON, t("rc_keyword"), escapeHtml(place.query)]);
  }
  return rows;
}

function buildRow(place, index) {
  const key = placeKey(place);
  const isFav = favorites.has(key);
  const hasApplied = applicationsByPlace.has(key);
  const open = expandedCards.has(key);
  const detailRows = buildDetailRows(place);
  const moreId = `rc-more-${++cardUid}`;

  const card = document.createElement("article");
  card.className = "rc rc-in" + (isFav ? " is-favorite" : "") + (open ? " is-open" : "");
  card.setAttribute("role", "listitem");
  card.dataset.key = key;
  card.style.animationDelay = `${Math.min(index, 20) * 25}ms`;

  const ratingHtml = place.note
    ? `<span class="rating">${STAR_ICON}${place.note} <span class="mono">(${place.nombre_avis ?? 0})</span></span>`
    : `<span class="no-rating">—</span>`;

  const emailHtml = place.email
    ? `<a class="email-badge has" href="mailto:${escapeHtml(place.email)}" title="${escapeHtml(place.email)}">✉ ${escapeHtml(place.email)}</a>`
    : `<span class="email-badge none">${t("email_none")}</span>`;

  const detailsHtml = detailRows.length
    ? `<div class="rc-more" id="${moreId}"><div class="rc-more-inner"><dl class="rc-details">${detailRows
        .map(([icon, label, value]) => `<div class="rc-detail"><dt>${icon}<span>${label}</span></dt><dd>${value}</dd></div>`)
        .join("")}</dl></div></div>`
    : "";

  const moreBtn = detailRows.length
    ? `<button type="button" class="rc-toggle" aria-expanded="${open}" aria-controls="${moreId}"><span class="rc-toggle-label">${open ? t("rc_less") : t("rc_more")}</span>${CHEVRON_ICON}</button>`
    : "";

  card.innerHTML = `
    <header class="rc-head">
      <h3 class="rc-name">${escapeHtml(place.nom)}</h3>
      <button type="button" class="fav-star${isFav ? " active" : ""}" data-key="${escapeHtml(key)}" title="Favori" aria-pressed="${isFav}">${isFav ? "★" : "☆"}</button>
    </header>
    <div class="rc-meta">
      ${place.categorie ? `<span class="badge">${escapeHtml(place.categorie)}</span>` : ""}
      ${ratingHtml}
    </div>
    ${place.adresse ? `<p class="rc-addr">${PIN_ICON}<span>${escapeHtml(place.adresse)}</span></p>` : ""}
    <div class="rc-email">${emailHtml}</div>
    ${detailsHtml}
    <footer class="rc-actions">
      <button type="button" class="apply-btn${hasApplied ? " applied" : ""}" data-key="${escapeHtml(key)}" title="${place.email ? escapeHtml(place.email) : ""}">${hasApplied ? "✓ " : ""}${hasApplied ? t("apply_btn_done") : t("apply_btn")}</button>
      ${moreBtn}
    </footer>
  `;
  return card;
}

function renderTable(results) {
  resultsBody.innerHTML = "";

  if (!results.length) {
    const emptyKey = favoritesOnly ? "empty_no_favorites" : "empty_no_results";
    resultsBody.innerHTML = `
      <div class="empty-state cards-empty">
        <span class="empty-icon"></span>
        <p>${t(emptyKey)}</p>
      </div>`;
    return;
  }

  results.forEach((place, index) => resultsBody.appendChild(buildRow(place, index)));
}

resultsBody.addEventListener("click", (event) => {
  const favBtn = event.target.closest(".fav-star");
  if (favBtn) {
    toggleFavorite(favBtn.dataset.key);
    return;
  }
  const applyBtn = event.target.closest(".apply-btn");
  if (applyBtn) {
    openApplicationModal(applyBtn.dataset.key);
    return;
  }
  const moreBtn = event.target.closest(".rc-toggle");
  if (moreBtn) {
    const card = moreBtn.closest(".rc");
    const open = !card.classList.contains("is-open");
    card.classList.toggle("is-open", open);
    moreBtn.setAttribute("aria-expanded", String(open));
    moreBtn.querySelector(".rc-toggle-label").textContent = open ? t("rc_less") : t("rc_more");
    if (open) expandedCards.add(card.dataset.key);
    else expandedCards.delete(card.dataset.key);
  }
});

function toCsv(results) {
  const header = COLUMNS.join(",");
  const rows = results.map((row) =>
    COLUMNS.map((col) => {
      const value = row[col] ?? "";
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPdf(filename, text) {
  const jsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!jsPDF) {
    // Fallback si la librairie PDF n'a pas pu être chargée
    download(filename.replace(/\.pdf$/i, ".txt"), text, "text/plain;charset=utf-8;");
    return;
  }
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 50;
  const lineHeight = 15;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = margin;
  String(text || "").replace(/\r\n/g, "\n").split("\n").forEach((rawLine) => {
    // Retire le Markdown (**gras**, *titre*) et met les titres en gras
    const isBold = /^\s*[-•]?\s*\*+.*\*+\s*$/.test(rawLine);
    let cleaned = rawLine.replace(/\*+/g, "");
    if (/^\s*-{2,}\s*$/.test(cleaned)) cleaned = "";
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = cleaned.trim() === "" ? [""] : doc.splitTextToSize(cleaned, maxWidth);
    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  });
  doc.save(filename);
}

let activeSearchStream = null;

function getSearchProgressBar() {
  let bar = document.getElementById("search-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "search-progress";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.style.cssText = "height:4px;border-radius:2px;background:var(--border-soft,rgba(255,255,255,.1));overflow:hidden;margin-top:8px;";
    bar.innerHTML = '<i style="display:block;height:100%;width:0;background:var(--gradient);transition:width .25s ease"></i>';
    statusEl.insertAdjacentElement("afterend", bar);
  }
  return bar;
}

function setSearchProgress(percent) {
  const bar = getSearchProgressBar();
  bar.hidden = percent == null;
  if (percent == null) return;
  bar.setAttribute("aria-valuenow", String(percent));
  bar.firstElementChild.style.width = `${percent}%`;
}

async function launchSearch() {
  const queries = queriesEl.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!queries.length) {
    setStatus(t("status_min_one_query"), "error");
    return;
  }

  if (activeSearchStream) {
    activeSearchStream.close();
    activeSearchStream = null;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner"></span><span class="btn-label">${t("submit_loading")}</span>`;
  setStatus(t("status_searching", { count: queries.length }));
  setSearchProgress(0);
  exportCsvBtn.disabled = true;
  exportXlsxBtn.disabled = true;
  showSkeleton(6);

  const finish = () => {
    if (activeSearchStream) {
      activeSearchStream.close();
      activeSearchStream = null;
    }
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span class="btn-label">${t("submit_label")}</span>`;
  };

  const fail = (message) => {
    finish();
    setSearchProgress(null);
    if (!allResults.length || !hasSearched) renderTable([]);
    setStatus(t("status_search_failed", { message }), "error");
  };

  let streamedResults = [];
  let completed = false;

  try {
    // 1) ticket à usage unique (EventSource ne peut pas envoyer l'en-tête Authorization)
    const ticketResponse = await pfAuthFetch("/api/search/stream-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries,
        language_code: languageEl.value,
        region_code: regionEl.value.trim().toUpperCase() || null,
      }),
    });
    const ticketData = await ticketResponse.json();
    if (!ticketResponse.ok) throw new Error(ticketData.detail || t("status_error_generic"));

    // 2) flux SSE
    const source = new EventSource(`/api/search/stream?ticket=${encodeURIComponent(ticketData.ticket)}`);
    activeSearchStream = source;

    source.addEventListener("progress", (e) => {
      setSearchProgress(JSON.parse(e.data).percent);
    });

    source.addEventListener("total", (e) => {
      const { total } = JSON.parse(e.data);
      if (total === 0) return;
      // Premiers résultats : on remplace le squelette par un tableau qui se remplit en direct
      resultsBody.innerHTML = "";
      streamedResults = [];
      allResults = streamedResults;
      hasSearched = true;
      setStatus(t("status_streaming", { done: 0, total, percent: 10 }));
    });

    source.addEventListener("place", (e) => {
      const { place, done, total, percent } = JSON.parse(e.data);
      streamedResults.push(place);
      resultsBody.appendChild(buildRow(place, streamedResults.length - 1));
      updateStats(streamedResults);
      setSearchProgress(percent);
      setStatus(t("status_streaming", { done, total, percent }));
    });

    source.addEventListener("done", (e) => {
      completed = true;
      const data = JSON.parse(e.data);
      finish();
      setSearchProgress(100);
      setTimeout(() => setSearchProgress(null), 800);

      allResults = streamedResults;
      upgradeLegacyFavorites(allResults);
      hasSearched = true;
      companySearchEl.value = "";
      clearSearchBtn.hidden = true;
      favoritesOnly = false;
      if (currentPage === "favorites") {
        currentPage = "home";
        document.body.classList.remove("view-favorites");
        setActiveSideItem("home");
      }
      sortKey = null;
      sortButtons.forEach((b) => b.classList.remove("sort-asc", "sort-desc"));
      computeAndRender(); // tableau final trié/filtré + graphiques + carte
      saveRecentSearch(queries, languageEl.value, regionEl.value.trim().toUpperCase());

      if (data.errors && data.errors.length) {
        setStatus(t("status_results_errors", { count: currentResults.length, errors: data.errors.length }), "error");
        console.warn("Requêtes en échec :", data.errors);
      } else {
        setStatus(t("status_results_found", { count: currentResults.length }), "success");
      }
      exportCsvBtn.disabled = currentResults.length === 0;
      exportXlsxBtn.disabled = currentResults.length === 0;
    });

    // Erreur réseau / serveur : EventSource tenterait de se reconnecter (et relancerait la recherche) -> on coupe
    source.onerror = () => {
      if (completed) return;
      completed = true;
      if (streamedResults.length) {
        // On garde ce qui a déjà été reçu
        finish();
        setSearchProgress(null);
        computeAndRender();
        setStatus(t("status_search_failed", { message: t("status_stream_interrupted") }), "error");
      } else {
        fail(t("status_error_generic"));
      }
    };
  } catch (err) {
    fail(err.message);
  }
}

submitBtn.addEventListener("click", launchSearch);

queriesEl.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    launchSearch();
  }
});

exportCsvBtn.addEventListener("click", () => {
  if (!currentResults.length) return;
  download("places_finder_resultats.csv", toCsv(currentResults), "text/csv;charset=utf-8;");
});

companySearchEl.addEventListener("input", applySearchFilter);
emailOnlyEl.addEventListener("change", applySearchFilter);

clearSearchBtn.addEventListener("click", () => {
  companySearchEl.value = "";
  companySearchEl.focus();
  applySearchFilter();
});

exportXlsxBtn.addEventListener("click", () => {
  if (!currentResults.length) return;
  const worksheet = XLSX.utils.json_to_sheet(currentResults, { header: COLUMNS });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats");
  XLSX.writeFile(workbook, "places_finder_resultats.xlsx");
});

/* ---------------- i18n ---------------- */

const TRANSLATIONS = {
  fr: {
    search_placeholder: "Rechercher une entreprise dans les résultats…",
    api_status: "API connectée",
    menu_profile: "Profil",
    menu_favorites: "Favoris",
    menu_applications: "Candidatures",
    brand_tag: "Find your job",
    side_menu: "Menu",
    side_general: "Général",
    nav_home: "Accueil",
    nav_dashboard: "Tableau de bord",
    nav_favorites: "Favoris",
    nav_history: "Historique",
    nav_settings: "Paramètres",
    nav_chatbot: "Chatbot",
    nav_tutorial: "Tutoriel",
    settings_title: "Paramètres",
    dashboard_title: "Tableau de bord",
    dashboard_desc: "Un aperçu de ta recherche d'entreprises et de tes candidatures.",
    kpi_sent: "Candidatures envoyées",
    kpi_saved: "Candidatures enregistrées",
    kpi_favorites: "Favoris",
    kpi_results: "Entreprises trouvées",
    chat_title: "Assistant Forsa",
    chat_desc: "Pose tes questions sur ton CV, tes lettres de motivation, tes entretiens ou ta stratégie de recherche.",
    chat_placeholder: "Écris ton message…",
    chat_clear: "Effacer la conversation",
    chat_empty: "Bonjour ! Je peux t'aider à améliorer ton CV, ta lettre de motivation ou à préparer un entretien.",
    chat_typing: "L'assistant écrit…",
    chat_error: "Impossible d'obtenir une réponse.",
    chat_sugg_1: "Améliore ma lettre de motivation",
    chat_sugg_2: "Prépare-moi à un entretien",
    chat_sugg_3: "Rédige un email de relance",
    menu_language: "Langue de l'interface",
    menu_theme: "Thème",
    menu_logout: "Se déconnecter",
    profile_title: "Profil",
    profile_name_label: "Nom",
    profile_firstname_label: "Prénom",
    profile_lastname_label: "Nom",
    profile_email_label: "Email",
    profile_phone_label: "Téléphone",
    profile_birth_label: "Date de naissance",
    hero_title: "Repère les entreprises, rue par rue.",
    hero_desc: "Colle une liste de mots-clés — on interroge Google Places pour chacun, fusionne les résultats et retire les doublons automatiquement.",
    pf_edit: "Modifier le profil",
    pf_cancel: "Annuler",
    pf_save: "Enregistrer",
    pf_saving: "Enregistrement…",
    pf_saved: "Profil enregistré",
    pf_saved_partial: "Profil enregistré, mais photo, statut et liens n'ont pas pu être sauvegardés sur cet appareil.",
    pf_save_error: "Impossible d'enregistrer le profil.",
    pf_target_label: "Poste visé",
    pf_target_ph: "Ex. Développeur Full-Stack",
    pf_status_label: "Statut de recherche",
    pf_status_listening: "À l'écoute d'opportunités",
    pf_status_available: "Disponible immédiatement",
    pf_status_closed: "Pas en recherche active",
    pf_personal_title: "Informations personnelles",
    pf_personal_sub: "Ces informations aident les recruteurs à te contacter.",
    pf_city_label: "Ville / Localisation",
    pf_city_ph: "Marrakech, Maroc",
    pf_account_hint: "Prénom, nom et date de naissance viennent de ton compte et ne se modifient pas ici.",
    pf_skills_title: "Compétences & mots-clés",
    pf_skills_sub: "Réutilisées pour générer ton CV et tes lettres de motivation.",
    pf_skills_sub_edit: "Appuie sur Entrée pour ajouter une compétence.",
    pf_skills_empty: "Aucune compétence pour l'instant.",
    pf_skill_add_ph: "Ajouter une compétence…",
    pf_skill_add: "Ajouter",
    pf_skill_remove: ({ skill }) => `Retirer ${skill}`,
    pf_suggestions: "Suggestions :",
    pf_cv_title: "Mon CV",
    pf_cv_none: "Aucun CV pour l'instant",
    pf_cv_none_hint: "Ajoute ton CV pour postuler en un clic.",
    pf_cv_generated: "CV généré avec l'IA",
    pf_cv_updated: ({ date }) => `Mis à jour le ${date}`,
    pf_cv_download: "Télécharger",
    pf_cv_update: "Mettre à jour",
    pf_cv_manage: "Générer ou gérer mon CV avec l'IA",
    pf_cv_uploading: "Envoi du CV…",
    pf_cv_updated_ok: "CV mis à jour",
    pf_cv_too_big: "Fichier trop volumineux (8 Mo max).",
    pf_links_title: "Liens professionnels",
    pf_links_note: "Enregistrés sur cet appareil.",
    pf_link_linkedin: "LinkedIn",
    pf_link_portfolio: "GitHub / Portfolio",
    pf_link_contact: "Contact direct",
    pf_link_contact_ph: "Email ou lien de contact",
    pf_avatar_change: "Changer la photo",
    pf_avatar_saved: "Photo mise à jour",
    pf_avatar_invalid: "Image non valide (PNG, JPG ou WebP, 5 Mo max).",
    pf_logout_title: "Session",
    pf_logout_text: "Tu seras déconnecté de Forsa sur cet appareil.",
    rc_more: "Voir plus",
    rc_less: "Voir moins",
    rc_phone: "Téléphone",
    rc_email: "Email",
    rc_website: "Site web",
    rc_maps: "Google Maps",
    rc_open_maps: "Ouvrir dans Google Maps",
    rc_keyword: "Trouvé avec le mot-clé",
    sort_by: "Trier par",
    hero_cta_start: "Commencer",
    hero_cta_results: "Voir les résultats",
    hero_card_title: "Trouve ton prochain poste",
    hero_card_text: "Ajoute ton CV, puis candidate directement depuis les résultats.",
    feature_dedupe: "Résultats dédupliqués",
    feature_map: "Carte interactive",
    feature_export: "Export CSV & Excel",
    results_label: "Résultats",
    step1_label: "Mots-clés",
    queries_placeholder: "agence intelligence artificielle Marrakech\nconsultant IA Marrakech\nstartups Marrakech",
    step1_hint: "Une ligne = une requête. Les doublons (même établissement) sont retirés à la fin.",
    step2_label: "Langue & pays",
    lang_fr: "Français",
    lang_en: "Anglais",
    lang_ar: "Arabe",
    region_placeholder: "MA, FR…",
    submit_label: "Lancer la recherche",
    submit_loading: "Recherche en cours…",
    stat_results: "résultats",
    stat_categories: "catégories",
    stat_sites: "avec site web",
    stat_emails: "avec email",
    th_email: "Email",
    email_none: "Pas d'email",
    filter_email_only: "Avec email uniquement",
    stat_avg_rating: "note moyenne",
    view_table: "Blocs",
    view_map: "Carte",
    map_empty: "Aucun résultat géolocalisé à afficher pour l'instant.",
    recent_label: "Récentes",
    popup_website: "Site web",
    popup_maps: "Google Maps",
    export_csv: "Exporter CSV",
    export_xlsx: "Exporter Excel",
    th_name: "Établissement",
    th_category: "Catégorie",
    th_address: "Adresse",
    th_contact: "Contact",
    th_rating: "Note",
    th_links: "Liens",
    empty_initial: "Aucune recherche pour l'instant.<br>Renseigne tes mots-clés ci-dessus et lance la recherche.",
    empty_no_results: "Aucun résultat pour ces mots-clés.<br>Essaie d'élargir ou de reformuler ta recherche.",
    empty_no_favorites: "Aucun favori pour l'instant.<br>Clique sur l'étoile d'un établissement pour l'ajouter.",
    status_min_one_query: "Ajoute au moins un mot-clé.",
    status_searching: (p) => `Recherche de ${p.count} mot(s)-clé(s)…`,
    status_streaming: (p) => `Recherche des emails… ${p.done}/${p.total} (${p.percent} %)`,
    status_stream_interrupted: "connexion interrompue, résultats partiels affichés.",
    status_error_generic: "Erreur inconnue côté serveur.",
    status_search_failed: (p) => `Échec de la recherche : ${p.message}`,
    status_results_found: (p) => `${p.count} résultat(s) unique(s) trouvé(s).`,
    status_results_errors: (p) => `${p.count} résultat(s) unique(s). ${p.errors} requête(s) ont échoué (voir console).`,
    status_filter_results: (p) => `${p.count} résultat(s) pour "${p.query}".`,
    status_favorites_count: (p) => `${p.count} favori(s) affiché(s).`,
    charts_title: "Graphiques",
    charts_hint: "Basés sur les résultats affichés dans le tableau ci-dessus.",
    charts_empty: "Lance une recherche pour voir apparaître les graphiques.",
    chart_categories_title: "Résultats par catégorie",
    chart_categories_axis: "Nombre d'établissements",
    chart_uncategorized: "Non catégorisé",
    chart_website_title: "Présence d'un site web",
    chart_with_website: "Avec site web",
    chart_without_website: "Sans site web",
    chart_queries_title: "Résultats par mot-clé recherché",
    chart_queries_axis: "Nombre de résultats",
    chart_rating_title: "Répartition des notes",
    chart_rating_axis: "Nombre d'établissements",
    th_action: "Candidature",
    nav_cv: "Mon CV",
    apply_btn: "Postuler",
    apply_btn_done: "Postulé",
    cv_title: "Mon CV",
    cv_status_none: "Tu n'as pas encore de CV.",
    cv_status_upload: (p) => `Fichier téléversé : ${p.filename}`,
    cv_status_generated: "CV généré par l'IA (modifiable ci-dessous).",
    cv_upload_title: "Téléverser un fichier existant",
    cv_upload_hint: "PDF, Word (.doc/.docx) ou .txt, 8 Mo maximum.",
    cv_upload_btn: "Téléverser",
    cv_upload_missing: "Choisis d'abord un fichier.",
    cv_uploading: "Envoi du fichier…",
    cv_upload_success: "CV téléversé avec succès.",
    cv_upload_error: (p) => `Échec de l'envoi : ${p.message}`,
    cv_download: "Télécharger mon CV",
    cv_delete: "Supprimer mon CV",
    cv_delete_success: "CV supprimé.",
    cv_or: "ou",
    cv_generate_title: "Générer mon CV avec l'IA",
    cv_generate_hint: "Renseigne tes informations, l'IA rédige un CV structuré à partir de ce que tu donnes (rien n'est inventé).",
    cv_field_name: "Nom complet",
    cv_field_role: "Poste recherché",
    cv_field_phone: "Téléphone",
    cv_field_address: "Adresse",
    cv_field_education: "Formation",
    cv_field_education_ph: "Diplômes, écoles, années…",
    cv_field_experience: "Expérience professionnelle",
    cv_field_experience_ph: "Postes occupés, entreprises, missions, dates…",
    cv_field_skills: "Compétences",
    cv_field_skills_ph: "Compétences techniques et humaines…",
    cv_field_languages: "Langues",
    cv_field_languages_ph: "Français (natif), Anglais (courant)…",
    cv_generate_btn: "Générer mon CV avec l'IA",
    cv_generating: "Génération en cours…",
    cv_generate_missing_name: "Indique au moins ton nom complet.",
    cv_generate_success: "CV généré avec succès.",
    cv_generate_error: (p) => `Échec de la génération : ${p.message}`,
    cv_generated_label: "CV généré (modifiable)",
    cv_save_edits: "Enregistrer les modifications",
    cv_save_success: "Modifications enregistrées.",
    cv_download_txt: "Télécharger (.pdf)",
    app_title: "Postuler",
    app_no_profile: "Complète d'abord ton profil (nom, expérience ou compétences) dans « Mon CV » pour générer une lettre personnalisée.",
    app_open_cv: "Ouvrir Mon CV",
    app_no_cv: "Tu n'as pas encore de CV enregistré. Ajoute-en un dans « Mon CV » pour pouvoir l'envoyer avec ta candidature.",
    app_job_title: "Poste visé (optionnel)",
    app_job_title_ph: "Ex : Développeur web, stage marketing…",
    app_notes: "Précisions pour l'IA (optionnel)",
    app_notes_ph: "Ex : disponible dès juin, motivé par le secteur…",
    app_generate_btn: "Générer la lettre avec l'IA",
    app_generating: "Génération en cours…",
    app_generate_success: "Lettre générée, tu peux la modifier avant d'enregistrer.",
    app_generate_error: (p) => `Échec de la génération : ${p.message}`,
    app_letter_label: "Lettre de motivation (modifiable)",
    app_letter_ph: "Clique sur « Générer la lettre avec l'IA » ou écris-la toi-même…",
    app_letter_missing: "Écris ou génère d'abord une lettre.",
    app_download: "Télécharger (.txt)",
    app_download_cv: "Télécharger mon CV",
    app_save: "Enregistrer la candidature",
    app_save_success: "Candidature enregistrée.",
    app_save_error: (p) => `Échec de l'enregistrement : ${p.message}`,
    app_status_applied: "Postulé",
    app_status_sent: "Envoyé ✓",
    app_email_label: "Email de l'entreprise",
    app_email_ph: "recrutement@entreprise.com",
    app_email_found: "Email trouvé automatiquement sur le site de l'entreprise. Vérifie-le avant d'envoyer.",
    app_email_missing: "Aucun email trouvé automatiquement : saisis-le manuellement.",
    app_email_invalid: "Adresse email de l'entreprise invalide.",
    app_no_cv_send: "Ajoute d'abord un CV dans « Mon CV » pour l'envoyer.",
    app_send: "Envoyer par email",
    app_sending: "Envoi en cours…",
    app_send_confirm: (p) => `Envoyer ta candidature et ton CV à ${p.email} ?`,
    app_send_success: (p) => `Candidature envoyée à ${p.email}.`,
    app_send_error: (p) => `Échec de l'envoi : ${p.message}`,
    app_subject_prefix: "Candidature",
    app_subject_spontaneous: "Candidature spontanée",
    applications_title: "Historique",
    applications_subtitle: "Les candidatures que tu as envoyées ou enregistrées.",
    applications_empty_hint: "Elles apparaîtront ici dès que tu postules à une entreprise.",
    applications_saved_on: "Enregistrée le",
    history_status_sent: "Envoyée",
    history_status_saved: "Enregistrée",
    settings_theme_desc: "Choisis l'affichage qui te convient le mieux.",
    settings_language_desc: "Pour les menus, les boutons et les messages.",
    theme_light: "Clair",
    theme_dark: "Sombre",
    profile_empty: "Non renseigné",
    profile_age: ({ n }) => `${n} ${n > 1 ? "ans" : "an"}`,
    applications_empty: "Tu n'as encore postulé à aucune entreprise.",
    applications_empty_sent: "Aucune candidature envoyée avec succès pour le moment.",
    applications_empty_saved: "Aucune candidature enregistrée.",
    applications_tab_sent: "Envoyées",
    applications_tab_saved: "Enregistrées",
    applications_sent_on: "Envoyée le",
    applications_sent_to: "à",
    response_status_label: "Statut de la candidature",
    response_status_sent: "Envoyée",
    response_status_replied: "Réponse reçue",
    response_status_interview: "Entretien",
    response_status_rejected: "Refusée",
    response_status_error: "Impossible de mettre à jour le statut.",
    applications_view: "Voir la lettre",
    applications_delete: "Supprimer",
    applications_delete_confirm: "Supprimer cette candidature ?",
    applications_delete_error: "Échec de la suppression.",
  },
  en: {
    search_placeholder: "Search for a company in the results…",
    api_status: "API connected",
    menu_profile: "Profile",
    menu_favorites: "Favorites",
    menu_applications: "Applications",
    brand_tag: "Find your job",
    side_menu: "Menu",
    side_general: "General",
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_favorites: "Favorites",
    nav_history: "History",
    nav_settings: "Settings",
    nav_chatbot: "Chatbot",
    nav_tutorial: "Tutorial",
    settings_title: "Settings",
    dashboard_title: "Dashboard",
    dashboard_desc: "An overview of your company search and your applications.",
    kpi_sent: "Applications sent",
    kpi_saved: "Applications saved",
    kpi_favorites: "Favorites",
    kpi_results: "Companies found",
    chat_title: "Forsa assistant",
    chat_desc: "Ask about your CV, cover letters, interviews or your job search strategy.",
    chat_placeholder: "Type your message…",
    chat_clear: "Clear conversation",
    chat_empty: "Hi! I can help you improve your CV, your cover letter or prepare for an interview.",
    chat_typing: "The assistant is typing…",
    chat_error: "Couldn't get a reply.",
    chat_sugg_1: "Improve my cover letter",
    chat_sugg_2: "Help me prepare for an interview",
    chat_sugg_3: "Write a follow-up email",
    menu_language: "Interface language",
    menu_theme: "Theme",
    menu_logout: "Log out",
    profile_title: "Profile",
    profile_name_label: "Name",
    profile_firstname_label: "First name",
    profile_lastname_label: "Last name",
    profile_email_label: "Email",
    profile_phone_label: "Phone",
    profile_birth_label: "Date of birth",
    hero_title: "Track down businesses, street by street.",
    hero_desc: "Paste a list of keywords — we query Google Places for each one, merge the results and remove duplicates automatically.",
    pf_edit: "Edit profile",
    pf_cancel: "Cancel",
    pf_save: "Save",
    pf_saving: "Saving…",
    pf_saved: "Profile saved",
    pf_saved_partial: "Profile saved, but photo, status and links couldn't be stored on this device.",
    pf_save_error: "Couldn't save your profile.",
    pf_target_label: "Target role",
    pf_target_ph: "E.g. Full-Stack Developer",
    pf_status_label: "Search status",
    pf_status_listening: "Open to opportunities",
    pf_status_available: "Available immediately",
    pf_status_closed: "Not actively looking",
    pf_personal_title: "Personal information",
    pf_personal_sub: "This helps recruiters get in touch with you.",
    pf_city_label: "City / Location",
    pf_city_ph: "Marrakech, Morocco",
    pf_account_hint: "First name, last name and birth date come from your account and can't be changed here.",
    pf_skills_title: "Skills & keywords",
    pf_skills_sub: "Reused to generate your CV and cover letters.",
    pf_skills_sub_edit: "Press Enter to add a skill.",
    pf_skills_empty: "No skills yet.",
    pf_skill_add_ph: "Add a skill…",
    pf_skill_add: "Add",
    pf_skill_remove: ({ skill }) => `Remove ${skill}`,
    pf_suggestions: "Suggestions:",
    pf_cv_title: "My CV",
    pf_cv_none: "No CV yet",
    pf_cv_none_hint: "Add your CV to apply in one click.",
    pf_cv_generated: "AI-generated CV",
    pf_cv_updated: ({ date }) => `Updated on ${date}`,
    pf_cv_download: "Download",
    pf_cv_update: "Update",
    pf_cv_manage: "Generate or manage my CV with AI",
    pf_cv_uploading: "Uploading CV…",
    pf_cv_updated_ok: "CV updated",
    pf_cv_too_big: "File too large (8 MB max).",
    pf_links_title: "Professional links",
    pf_links_note: "Saved on this device.",
    pf_link_linkedin: "LinkedIn",
    pf_link_portfolio: "GitHub / Portfolio",
    pf_link_contact: "Direct contact",
    pf_link_contact_ph: "Email or contact link",
    pf_avatar_change: "Change photo",
    pf_avatar_saved: "Photo updated",
    pf_avatar_invalid: "Invalid image (PNG, JPG or WebP, 5 MB max).",
    pf_logout_title: "Session",
    pf_logout_text: "You'll be signed out of Forsa on this device.",
    rc_more: "Show more",
    rc_less: "Show less",
    rc_phone: "Phone",
    rc_email: "Email",
    rc_website: "Website",
    rc_maps: "Google Maps",
    rc_open_maps: "Open in Google Maps",
    rc_keyword: "Found with keyword",
    sort_by: "Sort by",
    hero_cta_start: "Get started",
    hero_cta_results: "See results",
    hero_card_title: "Find your next role",
    hero_card_text: "Add your CV, then apply straight from the results.",
    feature_dedupe: "Deduplicated results",
    feature_map: "Interactive map",
    feature_export: "CSV & Excel export",
    results_label: "Results",
    step1_label: "Keywords",
    queries_placeholder: "artificial intelligence agency Marrakech\nAI consultant Marrakech\nstartups Marrakech",
    step1_hint: "One line = one query. Duplicates (same business) are removed at the end.",
    step2_label: "Language & country",
    lang_fr: "French",
    lang_en: "English",
    lang_ar: "Arabic",
    region_placeholder: "MA, FR…",
    submit_label: "Run search",
    submit_loading: "Searching…",
    stat_results: "results",
    stat_categories: "categories",
    stat_sites: "with a website",
    stat_emails: "with email",
    th_email: "Email",
    email_none: "No email",
    filter_email_only: "With email only",
    stat_avg_rating: "avg rating",
    view_table: "Cards",
    view_map: "Map",
    map_empty: "No geolocated results to show yet.",
    recent_label: "Recent",
    popup_website: "Website",
    popup_maps: "Google Maps",
    export_csv: "Export CSV",
    export_xlsx: "Export Excel",
    th_name: "Business",
    th_category: "Category",
    th_address: "Address",
    th_contact: "Contact",
    th_rating: "Rating",
    th_links: "Links",
    empty_initial: "No search yet.<br>Fill in your keywords above and run the search.",
    empty_no_results: "No results for these keywords.<br>Try broadening or rephrasing your search.",
    empty_no_favorites: "No favorites yet.<br>Click a business's star to add it.",
    status_min_one_query: "Add at least one keyword.",
    status_searching: (p) => `Searching ${p.count} keyword(s)…`,
    status_streaming: (p) => `Finding emails… ${p.done}/${p.total} (${p.percent}%)`,
    status_stream_interrupted: "connection interrupted, partial results shown.",
    status_error_generic: "Unknown server error.",
    status_search_failed: (p) => `Search failed: ${p.message}`,
    status_results_found: (p) => `${p.count} unique result(s) found.`,
    status_results_errors: (p) => `${p.count} unique result(s). ${p.errors} quer(y/ies) failed (see console).`,
    status_filter_results: (p) => `${p.count} result(s) for "${p.query}".`,
    status_favorites_count: (p) => `${p.count} favorite(s) shown.`,
    charts_title: "Charts",
    charts_hint: "Based on the results shown in the table above.",
    charts_empty: "Run a search to see the charts appear.",
    chart_categories_title: "Results by category",
    chart_categories_axis: "Number of businesses",
    chart_uncategorized: "Uncategorized",
    chart_website_title: "Website presence",
    chart_with_website: "Has a website",
    chart_without_website: "No website",
    chart_queries_title: "Results by search keyword",
    chart_queries_axis: "Number of results",
    chart_rating_title: "Rating distribution",
    chart_rating_axis: "Number of businesses",
    th_action: "Application",
    nav_cv: "My resume",
    apply_btn: "Apply",
    apply_btn_done: "Applied",
    cv_title: "My resume",
    cv_status_none: "You don't have a resume yet.",
    cv_status_upload: (p) => `Uploaded file: ${p.filename}`,
    cv_status_generated: "Resume generated by AI (editable below).",
    cv_upload_title: "Upload an existing file",
    cv_upload_hint: "PDF, Word (.doc/.docx) or .txt, 8 MB max.",
    cv_upload_btn: "Upload",
    cv_upload_missing: "Choose a file first.",
    cv_uploading: "Uploading file…",
    cv_upload_success: "Resume uploaded successfully.",
    cv_upload_error: (p) => `Upload failed: ${p.message}`,
    cv_download: "Download my resume",
    cv_delete: "Delete my resume",
    cv_delete_success: "Resume deleted.",
    cv_or: "or",
    cv_generate_title: "Generate my resume with AI",
    cv_generate_hint: "Fill in your information, the AI writes a structured resume from what you give it (nothing is invented).",
    cv_field_name: "Full name",
    cv_field_role: "Target role",
    cv_field_phone: "Phone",
    cv_field_address: "Address",
    cv_field_education: "Education",
    cv_field_education_ph: "Degrees, schools, years…",
    cv_field_experience: "Work experience",
    cv_field_experience_ph: "Roles held, companies, tasks, dates…",
    cv_field_skills: "Skills",
    cv_field_skills_ph: "Technical and soft skills…",
    cv_field_languages: "Languages",
    cv_field_languages_ph: "English (native), French (fluent)…",
    cv_generate_btn: "Generate my resume with AI",
    cv_generating: "Generating…",
    cv_generate_missing_name: "Enter at least your full name.",
    cv_generate_success: "Resume generated successfully.",
    cv_generate_error: (p) => `Generation failed: ${p.message}`,
    cv_generated_label: "Generated resume (editable)",
    cv_save_edits: "Save changes",
    cv_save_success: "Changes saved.",
    cv_download_txt: "Download (.pdf)",
    app_title: "Apply",
    app_no_profile: "First complete your profile (name, experience or skills) in \"My resume\" to generate a tailored letter.",
    app_open_cv: "Open My resume",
    app_no_cv: "You don't have a resume saved yet. Add one in \"My resume\" so you can send it with your application.",
    app_job_title: "Target role (optional)",
    app_job_title_ph: "E.g.: Web developer, marketing internship…",
    app_notes: "Notes for the AI (optional)",
    app_notes_ph: "E.g.: available from June, motivated by the industry…",
    app_generate_btn: "Generate the letter with AI",
    app_generating: "Generating…",
    app_generate_success: "Letter generated, you can edit it before saving.",
    app_generate_error: (p) => `Generation failed: ${p.message}`,
    app_letter_label: "Cover letter (editable)",
    app_letter_ph: "Click \"Generate the letter with AI\" or write it yourself…",
    app_letter_missing: "Write or generate a letter first.",
    app_download: "Download (.txt)",
    app_download_cv: "Download my resume",
    app_save: "Save application",
    app_save_success: "Application saved.",
    app_save_error: (p) => `Save failed: ${p.message}`,
    app_status_applied: "Applied",
    app_status_sent: "Sent ✓",
    app_email_label: "Company email",
    app_email_ph: "recruitment@company.com",
    app_email_found: "Email found automatically on the company's website. Check it before sending.",
    app_email_missing: "No email found automatically: enter it manually.",
    app_email_invalid: "Invalid company email address.",
    app_no_cv_send: "First add a resume in \"My resume\" to send it.",
    app_send: "Send by email",
    app_sending: "Sending…",
    app_send_confirm: (p) => `Send your application and resume to ${p.email}?`,
    app_send_success: (p) => `Application sent to ${p.email}.`,
    app_send_error: (p) => `Sending failed: ${p.message}`,
    app_subject_prefix: "Application",
    app_subject_spontaneous: "Spontaneous application",
    applications_title: "History",
    applications_subtitle: "The applications you have sent or saved.",
    applications_empty_hint: "They will show up here as soon as you apply to a company.",
    applications_saved_on: "Saved on",
    history_status_sent: "Sent",
    history_status_saved: "Saved",
    settings_theme_desc: "Pick the look that suits you best.",
    settings_language_desc: "Used for menus, buttons and messages.",
    theme_light: "Light",
    theme_dark: "Dark",
    profile_empty: "Not provided",
    profile_age: ({ n }) => `${n} ${n === 1 ? "year old" : "years old"}`,
    applications_empty: "You haven't applied to any company yet.",
    applications_empty_sent: "No application sent successfully yet.",
    applications_empty_saved: "No saved application.",
    applications_tab_sent: "Sent",
    applications_tab_saved: "Saved",
    applications_sent_on: "Sent on",
    applications_sent_to: "to",
    response_status_label: "Application status",
    response_status_sent: "Sent",
    response_status_replied: "Replied",
    response_status_interview: "Interview",
    response_status_rejected: "Rejected",
    response_status_error: "Could not update the status.",
    applications_view: "View letter",
    applications_delete: "Delete",
    applications_delete_confirm: "Delete this application?",
    applications_delete_error: "Failed to delete.",
  },
};

const UI_LANG_KEY = "places_finder_ui_lang";
let uiLang = localStorage.getItem(UI_LANG_KEY) || "fr";

function t(key, params) {
  const dict = TRANSLATIONS[uiLang] || TRANSLATIONS.fr;
  const entry = dict[key] ?? TRANSLATIONS.fr[key] ?? key;
  return typeof entry === "function" ? entry(params || {}) : entry;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.documentElement.lang = uiLang;
  if (typeof renderProfilePage === "function") renderProfilePage();
  if (typeof updateFavHead === "function") updateFavHead();
  if (typeof updateSideTitles === "function") updateSideTitles();
  langToggle.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === uiLang);
  });
  if (hasSearched) {
    renderTable(currentResults);
    renderCharts(currentResults);
  }
  if (typeof renderChat === "function" && !pageEls.chatbot.hidden) renderChat();
}

function setUiLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  uiLang = lang;
  localStorage.setItem(UI_LANG_KEY, lang);
  applyTranslations();
}

langToggle.addEventListener("click", (event) => {
  const btn = event.target.closest(".lang-btn");
  if (!btn) return;
  setUiLang(btn.dataset.lang);
});

/* ---------------- theme ---------------- */

const THEME_KEY = "places_finder_theme";

function applyTheme(theme) {
  document.body.classList.toggle("theme-light", theme === "light");
  themeChoices.forEach((btn) => {
    const isActive = btn.dataset.themeChoice === (theme === "light" ? "light" : "dark");
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", String(isActive));
  });
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

themeChoices.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTheme(btn.dataset.themeChoice);
    if (hasSearched) {
      renderCharts(currentResults);
    }
    refreshMapTiles();
  });
});

/* ---------------- profile (real account) ---------------- */

function getInitials(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0].toUpperCase()).join("");
}

function refreshAvatar() {
  const user = pfGetUser();
  const initials = getInitials(user && user.name);
  avatarInitials.textContent = initials;
  profileAvatarPreview.textContent = initials;
  topbarUserName.textContent = (user && user.name) || "—";
  topbarUserEmail.textContent = (user && user.email) || "";
  if (typeof pfApplyAvatar === "function") pfApplyAvatar();
}

/* ---------------- full-page views (ex-modals) ----------------
   Settings, History, Profile, CV and Application are now full-width views
   rendered in the main content area. openModal / closeModal keep their old
   names so every caller (and the tutorial) keeps working. */

const viewEls = Array.from(document.querySelectorAll(".view-page"));
let activeView = null;
let returnPage = "home";

function replayEnter(el) {
  el.style.animation = "none";
  void el.offsetWidth; // reflow so the entrance animation restarts
  el.style.animation = "";
}

function openModal(view) {
  closeMenu();
  if (!activeView) returnPage = currentPage;
  Object.values(pageEls).forEach((el) => { el.hidden = true; });
  viewEls.forEach((el) => { el.hidden = el !== view; });
  if (activeView && activeView !== view) replayEnter(view);
  activeView = view;
  navSearchEl.classList.add("is-hidden");
  setActiveSideItem(view === settingsModal ? "settings" : view === applicationsModal ? "history" : null);
  window.scrollTo({ top: 0 });
}

function closeModal(view) {
  if (view.hidden) return;
  view.hidden = true;
  activeView = null;
  showPage(returnPage);
}

viewEls.forEach((view) => {
  view.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) closeModal(view);
  });
});

function formatBirthDate(iso) {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(uiLang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ageFromIso(iso) {
  const born = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

// Écrit une valeur dans un champ du profil ; affiche « Non renseigné » en grisé si elle est vide.
function setProfileField(el, value) {
  el.textContent = value || t("profile_empty");
  el.classList.toggle("is-empty", !value);
}

function renderProfileInfo(user) {
  user = user || {};
  // Comptes créés avant l'ajout des champs prénom / nom : on déduit à partir du nom complet.
  let firstName = user.first_name;
  let lastName = user.last_name;
  if (!firstName && !lastName && user.name) {
    const [first, ...rest] = user.name.trim().split(/\s+/);
    firstName = first;
    lastName = rest.join(" ");
  }
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || user.name || "";

  profileFullNameDisplay.textContent = fullName || "—";
  profileEmailDisplay.textContent = user.email || "—";
  setProfileField(profileFirstNameDisplay, firstName);
  setProfileField(profileLastNameDisplay, lastName);
  setProfileField(profilePhoneDisplay, user.phone);

  setProfileField(profileBirthDisplay, user.birth_date ? formatBirthDate(user.birth_date) : "");
  const age = user.birth_date ? ageFromIso(user.birth_date) : null;
  if (age !== null) {
    const ageEl = document.createElement("span");
    ageEl.className = "profile-age";
    ageEl.textContent = t("profile_age", { n: age });
    profileBirthDisplay.appendChild(ageEl);
  }
  if (typeof renderProfilePage === "function") renderProfilePage(user);
}

profileChip.addEventListener("click", async () => {
  renderProfileInfo(pfGetUser());
  openModal(profileModal);

  // Les sessions ouvertes avant l'ajout des nouveaux champs n'ont pas téléphone / date de naissance
  // en cache : on recharge le profil depuis le serveur.
  try {
    const response = await pfAuthFetch("/api/auth/me");
    if (!response.ok) return;
    const freshUser = await response.json();
    pfSaveSession(pfGetToken(), freshUser);
    renderProfileInfo(freshUser);
    refreshAvatar();
  } catch {
    /* on garde les infos en cache */
  }
});

profileLogoutBtn.addEventListener("click", () => {
  pfLogout();
});

menuLogoutBtn.addEventListener("click", () => {
  pfLogout();
});

/* ---------------- Profil enrichi (page Profil) ---------------- */
/*
  Données réelles (serveur) : poste visé, ville, téléphone, compétences → PUT /api/candidate ; CV → /api/candidate/cv/*.
  Données locales (cet appareil) : photo, statut de recherche, liens → localStorage, par compte.
*/

const PF_EXTRA_PREFIX = "forsa_profile_extra:";
const PF_STATUSES = ["listening", "available", "closed"];
const PF_SKILL_SUGGESTIONS = ["Python", "JavaScript", "SQL", "Communication", "Gestion de projet", "Anglais courant"];

const pfRoot = document.getElementById("pf-root");
const pfEl = (id) => document.getElementById(id);
const pfToast = pfEl("pf-toast");

let pfEditing = false;
let pfSkills = [];
let pfToastTimer = null;

function pfExtraKey() {
  const user = pfGetUser();
  return PF_EXTRA_PREFIX + ((user && user.email) || "anon");
}

function pfLoadExtra() {
  try {
    return JSON.parse(localStorage.getItem(pfExtraKey()) || "{}") || {};
  } catch {
    return {};
  }
}

function pfSaveExtra(patch) {
  try {
    localStorage.setItem(pfExtraKey(), JSON.stringify({ ...pfLoadExtra(), ...patch }));
    return true;
  } catch {
    return false;
  }
}

function pfParseSkills(text) {
  return (text || "").split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
}

function pfShowToast(message, kind) {
  pfToast.textContent = message;
  pfToast.className = "pf-toast is-visible" + (kind === "error" ? " is-error" : "");
  clearTimeout(pfToastTimer);
  pfToastTimer = setTimeout(() => { pfToast.className = "pf-toast"; }, 3200);
}

/* URL sûre : http(s) uniquement ; on ajoute https:// si l'utilisateur l'a omis. */
function pfSafeUrl(value) {
  const v = (value || "").trim();
  if (!v) return null;
  const candidate = /^https?:\/\//i.test(v) ? v : /^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v) ? `https://${v}` : null;
  if (!candidate) return null;
  try {
    const u = new URL(candidate);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

function pfPrettyUrl(value) {
  return value.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

function pfFillLink(container, value, kind) {
  container.textContent = "";
  const v = (value || "").trim();
  if (!v) {
    container.textContent = t("profile_empty");
    container.classList.add("is-empty");
    return;
  }
  container.classList.remove("is-empty");
  let href = null;
  if (kind === "contact" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) href = `mailto:${v}`;
  else href = pfSafeUrl(v);
  if (!href) {
    container.textContent = v;
    return;
  }
  const a = document.createElement("a");
  a.href = href;
  a.textContent = href.startsWith("mailto:") ? v : pfPrettyUrl(v);
  if (!href.startsWith("mailto:")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  container.appendChild(a);
}

function pfSetValue(el, value) {
  el.textContent = value || t("profile_empty");
  el.classList.toggle("is-empty", !value);
}

/* ---- Photo de profil (redimensionnée en 256 px, stockée localement) ---- */
function pfApplyAvatar() {
  const photo = pfLoadExtra().avatar;
  [avatarInitials, profileAvatarPreview].forEach((el) => {
    if (!el) return;
    if (photo) {
      el.style.backgroundImage = `url("${photo}")`;
      el.classList.add("has-photo");
      el.textContent = "";
    } else {
      el.style.backgroundImage = "";
      el.classList.remove("has-photo");
    }
  });
}

function pfResizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
    img.src = url;
  });
}

/* ---- Rendu ---- */
function pfRenderStatus(statusKey) {
  const key = PF_STATUSES.includes(statusKey) ? statusKey : "listening";
  pfEl("pf-status-text").textContent = t(`pf_status_${key}`);
  pfEl("pf-status-badge").classList.toggle("is-off", key === "closed");
}

function pfRenderSkills() {
  const list = pfEl("pf-skills-list");
  list.textContent = "";
  pfSkills.forEach((skill) => {
    const li = document.createElement("li");
    li.className = "pf-tag";
    li.append(document.createTextNode(skill));
    if (pfEditing) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pf-tag-x";
      btn.dataset.skill = skill;
      btn.setAttribute("aria-label", t("pf_skill_remove", { skill }));
      btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
  pfEl("pf-skills-empty").hidden = pfSkills.length > 0 || pfEditing;

  const suggest = pfEl("pf-suggest");
  suggest.textContent = "";
  const free = PF_SKILL_SUGGESTIONS.filter((s) => !pfSkills.some((x) => x.toLowerCase() === s.toLowerCase()));
  if (pfEditing && free.length) {
    const label = document.createElement("span");
    label.textContent = t("pf_suggestions");
    suggest.appendChild(label);
    free.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pf-chip";
      b.dataset.suggest = s;
      b.textContent = `+ ${s}`;
      suggest.appendChild(b);
    });
  }
}

function pfRenderCv() {
  const cand = candidateProfile || {};
  const name = pfEl("pf-cv-name");
  const meta = pfEl("pf-cv-meta");
  const dl = pfEl("pf-cv-download");
  if (cand.cv_source === "upload") {
    name.textContent = cand.cv_filename || "CV";
  } else if (cand.cv_source === "generated") {
    name.textContent = t("pf_cv_generated");
  } else {
    name.textContent = t("pf_cv_none");
  }
  name.title = name.textContent;
  meta.textContent = cand.has_cv && cand.updated_at ? t("pf_cv_updated", { date: formatBirthDate(String(cand.updated_at).slice(0, 10)) }) : t("pf_cv_none_hint");
  dl.disabled = !cand.has_cv;
}

function pfPopulateStatusOptions(selected) {
  const select = pfEl("pf-status-select");
  select.textContent = "";
  PF_STATUSES.forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = t(`pf_status_${key}`);
    select.appendChild(opt);
  });
  select.value = PF_STATUSES.includes(selected) ? selected : "listening";
}

function renderProfilePage(user) {
  user = user || pfGetUser() || {};
  const cand = candidateProfile || {};
  const extra = pfLoadExtra();

  pfSetValue(pfEl("pf-role-display"), cand.target_role);
  pfSetValue(pfEl("pf-city-display"), cand.address);
  pfSetValue(profilePhoneDisplay, cand.phone || user.phone);
  pfRenderStatus(extra.status);
  pfFillLink(pfEl("pf-linkedin-view"), extra.linkedin, "url");
  pfFillLink(pfEl("pf-portfolio-view"), extra.portfolio, "url");
  pfFillLink(pfEl("pf-contact-view"), extra.contact, "contact");
  pfRenderCv();
  pfApplyAvatar();

  if (!pfEditing) {
    pfSkills = pfParseSkills(cand.skills);
    pfPopulateStatusOptions(extra.status);
  }
  pfRenderSkills();
}

/* ---- Mode édition ---- */
function pfSetEditing(on) {
  pfEditing = on;
  pfRoot.classList.toggle("is-editing", on);
  pfEl("pf-edit-btn").hidden = on;
  pfEl("pf-cancel-btn").hidden = !on;
  pfEl("pf-save-btn").hidden = !on;

  if (on) {
    const user = pfGetUser() || {};
    const cand = candidateProfile || {};
    const extra = pfLoadExtra();
    pfEl("pf-role-input").value = cand.target_role || "";
    pfEl("pf-phone-input").value = cand.phone || user.phone || "";
    pfEl("pf-city-input").value = cand.address || "";
    pfEl("pf-linkedin-input").value = extra.linkedin || "";
    pfEl("pf-portfolio-input").value = extra.portfolio || "";
    pfEl("pf-contact-input").value = extra.contact || "";
    pfPopulateStatusOptions(extra.status);
    pfSkills = pfParseSkills(cand.skills);
    pfEl("pf-skill-input").value = "";
  } else {
    pfSkills = pfParseSkills((candidateProfile || {}).skills);
  }
  pfRenderSkills();
  if (on) pfEl("pf-role-input").focus();
}

function pfAddSkill(raw) {
  const value = (raw || "").trim().replace(/[,;]+/g, " ");
  if (!value) return;
  if (pfSkills.length >= 20 || pfSkills.some((s) => s.toLowerCase() === value.toLowerCase())) return;
  pfSkills.push(value);
  pfEl("pf-skill-input").value = "";
  pfRenderSkills();
}

async function pfSave() {
  const saveBtn = pfEl("pf-save-btn");
  const user = pfGetUser() || {};
  const cand = candidateProfile || {};

  // Valeur en attente dans le champ « compétence » : on l'ajoute avant d'enregistrer.
  pfAddSkill(pfEl("pf-skill-input").value);

  const fallbackName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "Candidat";
  const clean = (v) => (v.trim() ? v.trim() : null);
  const payload = {
    full_name: cand.full_name || fallbackName,
    phone: clean(pfEl("pf-phone-input").value),
    address: clean(pfEl("pf-city-input").value),
    target_role: clean(pfEl("pf-role-input").value),
    education: cand.education || null,
    experience: cand.experience || null,
    skills: pfSkills.join(", ") || null,
    languages: cand.languages || null,
  };

  saveBtn.disabled = true;
  saveBtn.textContent = t("pf_saving");
  try {
    const response = await pfAuthFetch("/api/candidate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : t("pf_save_error"));
    candidateProfile = data;
    updateCvNavIndicator();

    const localOk = pfSaveExtra({
      status: pfEl("pf-status-select").value,
      linkedin: pfEl("pf-linkedin-input").value.trim(),
      portfolio: pfEl("pf-portfolio-input").value.trim(),
      contact: pfEl("pf-contact-input").value.trim(),
    });

    pfSetEditing(false);
    renderProfilePage();
    pfShowToast(localOk ? t("pf_saved") : t("pf_saved_partial"), localOk ? "" : "error");
  } catch (err) {
    pfShowToast(err.message || t("pf_save_error"), "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = t("pf_save");
  }
}

/* ---- Événements ---- */
pfEl("pf-edit-btn").addEventListener("click", () => pfSetEditing(true));
pfEl("pf-cancel-btn").addEventListener("click", () => { pfSetEditing(false); renderProfilePage(); });
pfEl("pf-save-btn").addEventListener("click", pfSave);

pfEl("pf-skill-add-btn").addEventListener("click", () => pfAddSkill(pfEl("pf-skill-input").value));
pfEl("pf-skill-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    pfAddSkill(event.target.value);
  }
});
pfEl("pf-skills-list").addEventListener("click", (event) => {
  const btn = event.target.closest(".pf-tag-x");
  if (!btn) return;
  pfSkills = pfSkills.filter((s) => s !== btn.dataset.skill);
  pfRenderSkills();
});
pfEl("pf-suggest").addEventListener("click", (event) => {
  const chip = event.target.closest(".pf-chip");
  if (chip) pfAddSkill(chip.dataset.suggest);
});

// Photo
pfEl("pf-avatar-btn").addEventListener("click", () => pfEl("pf-avatar-input").click());
pfEl("pf-avatar-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
    pfShowToast(t("pf_avatar_invalid"), "error");
    return;
  }
  try {
    const dataUrl = await pfResizeImage(file);
    if (!pfSaveExtra({ avatar: dataUrl })) throw new Error("storage");
    pfApplyAvatar();
    pfShowToast(t("pf_avatar_saved"));
  } catch {
    pfShowToast(t("pf_avatar_invalid"), "error");
  }
});

// CV
pfEl("pf-cv-update").addEventListener("click", () => pfEl("pf-cv-input").click());
pfEl("pf-cv-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    pfShowToast(t("pf_cv_too_big"), "error");
    return;
  }
  const btn = pfEl("pf-cv-update");
  btn.disabled = true;
  pfShowToast(t("pf_cv_uploading"));
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await pfAuthFetch("/api/candidate/cv/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : t("status_error_generic"));
    candidateProfile = data;
    updateCvNavIndicator();
    refreshCvModalView();
    pfRenderCv();
    pfShowToast(t("pf_cv_updated_ok"));
  } catch (err) {
    pfShowToast(err.message || t("status_error_generic"), "error");
  } finally {
    btn.disabled = false;
  }
});

pfEl("pf-cv-download").addEventListener("click", async () => {
  const cand = candidateProfile || {};
  if (cand.cv_source !== "upload") {
    // CV généré par l'IA : il se télécharge depuis l'éditeur de CV.
    document.getElementById("cv-nav-btn").click();
    return;
  }
  const btn = pfEl("pf-cv-download");
  btn.disabled = true;
  try {
    const response = await pfAuthFetch("/api/candidate/cv/download");
    if (!response.ok) throw new Error(t("status_error_generic"));
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cand.cv_filename || "cv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    pfShowToast(err.message || t("status_error_generic"), "error");
  } finally {
    btn.disabled = !(candidateProfile || {}).has_cv;
  }
});

pfEl("pf-cv-manage").addEventListener("click", () => document.getElementById("cv-nav-btn").click());

// À l'ouverture : on repart en lecture seule et on recharge le profil candidat.
profileChip.addEventListener("click", async () => {
  pfSetEditing(false);
  renderProfilePage();
  await loadCandidateProfile();
  if (!pfEditing) renderProfilePage();
});

// Fermer la page de profil annule une édition en cours.
profileModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close]") && pfEditing) pfSetEditing(false);
});

/* ---------------- sidebar : replier / déplier ---------------- */

const SIDE_COLLAPSED_KEY = "forsa_side_collapsed";
const sideToggleBtn = document.getElementById("side-toggle");

function updateSideTitles() {
  const collapsed = document.body.classList.contains("side-collapsed");
  document.querySelectorAll(".side-item").forEach((item) => {
    const label = item.querySelector("span:not(.side-badge)");
    if (collapsed && label) item.setAttribute("title", label.textContent.trim());
    else item.removeAttribute("title");
  });
  if (sideToggleBtn) {
    const txt = uiLang === "en"
      ? (collapsed ? "Expand menu" : "Collapse menu")
      : (collapsed ? "Déplier le menu" : "Réduire le menu");
    sideToggleBtn.setAttribute("aria-expanded", String(!collapsed));
    sideToggleBtn.setAttribute("aria-label", txt);
    sideToggleBtn.setAttribute("title", txt);
  }
}

function setSideCollapsed(collapsed) {
  document.body.classList.toggle("side-collapsed", collapsed);
  try { localStorage.setItem(SIDE_COLLAPSED_KEY, collapsed ? "1" : "0"); } catch (e) {}
  updateSideTitles();
  if (typeof map !== "undefined" && map && map.invalidateSize) setTimeout(() => map.invalidateSize(), 260);
}

sideToggleBtn?.addEventListener("click", () => {
  setSideCollapsed(!document.body.classList.contains("side-collapsed"));
});

/* ---------------- navigation (sidebar) ---------------- */

let currentPage = "home";

function closeMenu() {
  sidebarEl.classList.remove("open");
  sideBackdrop.hidden = true;
}

function openSidebar() {
  sidebarEl.classList.add("open");
  sideBackdrop.hidden = false;
}

navBurger.addEventListener("click", openSidebar);
sideBackdrop.addEventListener("click", closeMenu);

function updateFavHead() {
  const el = document.getElementById("fav-head-count");
  if (!el) return;
  el.textContent = favoritesOnly ? t("status_favorites_count", { count: currentResults.length }) : "";
}

function setActiveSideItem(page) {
  document.querySelectorAll(".side-item[data-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });
}

function showPage(page) {
  const changed = page !== currentPage || activeView !== null;
  currentPage = page;
  activeView = null;
  viewEls.forEach((el) => { el.hidden = true; });
  Object.entries(pageEls).forEach(([name, el]) => {
    const show = name === (page === "favorites" ? "home" : page);
    const wasHidden = el.hidden;
    el.hidden = !show;
    if (show && !wasHidden && changed) replayEnter(el);
  });
  navSearchEl.classList.toggle("is-hidden", !(page === "home" || page === "favorites"));
  document.body.classList.toggle("view-favorites", page === "favorites");
  setActiveSideItem(page);
  window.scrollTo({ top: 0 });
}

function openHistory() {
  applicationsTab = "envoye";
  renderApplicationsList();
  openModal(applicationsModal);
}

sidebarEl.addEventListener("click", (event) => {
  const item = event.target.closest(".side-item[data-page]");
  if (!item) return;
  const page = item.dataset.page;

  if (page === "history") {
    closeMenu();
    openHistory();
    return;
  }
  if (page === "settings") {
    closeMenu();
    openModal(settingsModal);
    return;
  }

  if (page === "favorites") {
    showPage("favorites");
    favoritesOnly = true;
    companySearchEl.value = "";
    clearSearchBtn.hidden = true;
    applySearchFilter();
  } else {
    showPage(page);
    if (page === "home" && favoritesOnly) {
      favoritesOnly = false;
      applySearchFilter();
    }
    if (page === "dashboard") {
      updateDashboardKpis();
      if (hasSearched) renderCharts(currentResults);
    }
    if (page === "chatbot") {
      renderChat();
      setTimeout(() => chatInput.focus(), 50);
    }
  }
  closeMenu();
});

function updateDashboardKpis() {
  const all = Array.from(applicationsByPlace.values());
  const sent = all.filter((a) => a.status === "envoye").length;
  document.getElementById("kpi-sent").textContent = sent;
  document.getElementById("kpi-saved").textContent = all.length - sent;
  document.getElementById("kpi-favorites").textContent = favorites.size;
  document.getElementById("kpi-results").textContent = allResults.length;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeModal(settingsModal);
    closeModal(profileModal);
    closeModal(cvModal);
    closeModal(applicationModal);
    closeModal(applicationsModal);
  }
});

/* ================= CV & candidature (postuler) ================= */

function setCvStatus(message, kind) {
  cvStatusEl.hidden = !message;
  cvStatusEl.textContent = message;
  cvStatusEl.className = "status" + (kind ? " " + kind : "");
}

function setApplicationStatus(message, kind) {
  applicationStatusEl.hidden = !message;
  applicationStatusEl.textContent = message;
  applicationStatusEl.className = "status" + (kind ? " " + kind : "");
}

function updateCvNavIndicator() {
  cvStatusDot.hidden = !candidateProfile.has_cv;
}

function fillCvFormFromProfile() {
  cvFullName.value = candidateProfile.full_name || "";
  cvTargetRole.value = candidateProfile.target_role || "";
  cvPhone.value = candidateProfile.phone || "";
  cvAddress.value = candidateProfile.address || "";
  cvEducation.value = candidateProfile.education || "";
  cvExperience.value = candidateProfile.experience || "";
  cvSkills.value = candidateProfile.skills || "";
  cvLanguages.value = candidateProfile.languages || "";
}

function refreshCvModalView() {
  fillCvFormFromProfile();

  if (candidateProfile.cv_source === "upload") {
    cvCurrentStatus.classList.add("has-cv");
    cvCurrentStatus.textContent = t("cv_status_upload", { filename: candidateProfile.cv_filename || "" });
    cvFileActions.hidden = false;
    cvGeneratedWrap.hidden = true;
  } else if (candidateProfile.cv_source === "generated") {
    cvCurrentStatus.classList.add("has-cv");
    cvCurrentStatus.textContent = t("cv_status_generated");
    cvFileActions.hidden = true;
    cvGeneratedWrap.hidden = false;
    cvGeneratedTextarea.value = candidateProfile.cv_generated_text || "";
  } else {
    cvCurrentStatus.classList.remove("has-cv");
    cvCurrentStatus.textContent = t("cv_status_none");
    cvFileActions.hidden = true;
    cvGeneratedWrap.hidden = true;
  }
}

async function loadCandidateProfile() {
  try {
    const response = await pfAuthFetch("/api/candidate");
    candidateProfile = await response.json();
  } catch (err) {
    console.warn("Impossible de charger le profil candidat :", err);
  }
  updateCvNavIndicator();
}

function updateApplicationsBadge() {
  const all = Array.from(applicationsByPlace.values());
  const sent = all.filter((a) => a.status === "envoye").length;
  applicationsCountEl.textContent = sent;
  if (applicationsCountSentEl) applicationsCountSentEl.textContent = sent;
  if (applicationsCountSavedEl) applicationsCountSavedEl.textContent = all.length - sent;
  if (typeof updateDashboardKpis === "function" && currentPage === "dashboard") updateDashboardKpis();
}

async function loadApplications() {
  try {
    const response = await pfAuthFetch("/api/applications");
    const data = await response.json();
    applicationsByPlace = new Map((data.applications || []).map((a) => [a.place_id, a]));
  } catch (err) {
    console.warn("Impossible de charger les candidatures :", err);
  }
  updateApplicationsBadge();
  if (hasSearched) renderTable(currentResults);
}

function formatApplicationDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(uiLang === "en" ? "en-US" : "fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return "";
  }
}

const RESPONSE_STATUSES = ["Sent", "Replied", "Interview", "Rejected"];

function responseStatusSelect(application) {
  const current = RESPONSE_STATUSES.includes(application.response_status) ? application.response_status : "Sent";
  const options = RESPONSE_STATUSES
    .map((value) => `<option value="${value}"${value === current ? " selected" : ""}>${t("response_status_" + value.toLowerCase())}</option>`)
    .join("");
  return `<select class="app-response-status" data-status="${current}" aria-label="${t("response_status_label")}">${options}</select>`;
}

function renderApplicationsList() {
  document.querySelectorAll(".applications-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === applicationsTab);
  });
  updateApplicationsBadge();

  const isSentTab = applicationsTab === "envoye";
  const applications = Array.from(applicationsByPlace.values())
    .filter((a) => (isSentTab ? a.status === "envoye" : a.status !== "envoye"))
    .sort((a, b) => new Date(b.sent_at || b.updated_at) - new Date(a.sent_at || a.updated_at));

  document.getElementById("applications-empty-text").textContent = t(
    isSentTab ? "applications_empty_sent" : "applications_empty_saved"
  );
  applicationsEmptyEl.hidden = applications.length > 0;
  applicationsListEl.innerHTML = applications
    .map((application) => {
      const isSent = application.status === "envoye";
      const name = application.company_name || "";
      const metaItems = [application.job_title, application.company_category]
        .filter(Boolean)
        .map((text) => `<span>${escapeHtml(text)}</span>`)
        .join("");

      let dateLine;
      if (isSent) {
        const when = formatApplicationDate(application.sent_at || application.updated_at);
        const to = application.company_email ? ` ${t("applications_sent_to")} ${escapeHtml(application.company_email)}` : "";
        dateLine = `${t("applications_sent_on")} ${when}${to}`;
      } else {
        dateLine = `${t("applications_saved_on")} ${formatApplicationDate(application.created_at)}`;
      }

      return `
        <article class="application-item" data-id="${application.id}" data-place-id="${escapeHtml(application.place_id)}">
          <span class="application-monogram" aria-hidden="true">${escapeHtml((name.trim()[0] || "?").toUpperCase())}</span>
          <div class="application-item-main">
            <div class="application-item-top">
              <h3 class="application-item-name">${escapeHtml(name)}</h3>
              ${isSent
                ? responseStatusSelect(application)
                : `<span class="application-item-status is-saved">${t("history_status_saved")}</span>`}
            </div>
            ${metaItems ? `<div class="application-item-meta">${metaItems}</div>` : ""}
            <div class="application-item-date">${dateLine}</div>
            <div class="application-item-actions">
              <button type="button" class="app-view-btn">${t("applications_view")}</button>
              <button type="button" class="app-delete-btn danger">${t("applications_delete")}</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

applicationsListEl.addEventListener("change", async (event) => {
  const select = event.target.closest(".app-response-status");
  if (!select) return;
  const item = select.closest(".application-item");
  const application = item && applicationsByPlace.get(item.dataset.placeId);
  if (!application) return;

  const previous = application.response_status || "Sent";
  const next = select.value;
  select.dataset.status = next;
  select.disabled = true;
  try {
    const response = await pfAuthFetch(`/api/applications/${item.dataset.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!response.ok) throw new Error();
    applicationsByPlace.set(item.dataset.placeId, { ...application, ...(await response.json()) });
  } catch (err) {
    select.value = previous; // échec : on revient à l'ancien statut
    select.dataset.status = previous;
    window.alert(t("response_status_error"));
  } finally {
    select.disabled = false;
  }
});

document.querySelectorAll(".applications-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    applicationsTab = tab.dataset.tab;
    renderApplicationsList();
  });
});

applicationsListEl.addEventListener("click", async (event) => {
  const item = event.target.closest(".application-item");
  if (!item) return;
  const id = item.dataset.id;
  const placeId = item.dataset.placeId;
  const application = applicationsByPlace.get(placeId);
  if (!application) return;

  if (event.target.closest(".app-view-btn")) {
    currentApplicationPlace = {
      nom: application.company_name,
      adresse: application.company_address,
      categorie: application.company_category,
      place_id: application.place_id,
    };
    applicationCompany.innerHTML = `${escapeHtml(application.company_name || "")}<span>${escapeHtml(application.company_address || "")}</span>`;
    applicationEmail.value = application.company_email || "";
    applicationEmailHint.textContent = "";
    applicationJobTitle.value = application.job_title || "";
    applicationNotes.value = "";
    applicationLetter.value = application.cover_letter || "";
    applicationNoProfile.hidden = true;
    applicationNoCv.hidden = !!candidateProfile.has_cv;
    setApplicationStatus("");
    closeModal(applicationsModal);
    openModal(applicationModal);
    return;
  }

  if (event.target.closest(".app-delete-btn")) {
    if (!window.confirm(t("applications_delete_confirm"))) return;
    try {
      const response = await pfAuthFetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      applicationsByPlace.delete(placeId);
      updateApplicationsBadge();
      renderApplicationsList();
      if (hasSearched) renderTable(currentResults);
    } catch (err) {
      window.alert(t("applications_delete_error"));
    }
  }
});


cvNavBtn.addEventListener("click", () => {
  setCvStatus("");
  refreshCvModalView();
  openModal(cvModal);
});

cvUploadBtn.addEventListener("click", async () => {
  const file = cvFileInput.files[0];
  if (!file) {
    setCvStatus(t("cv_upload_missing"), "error");
    return;
  }
  cvUploadBtn.disabled = true;
  setCvStatus(t("cv_uploading"));
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await pfAuthFetch("/api/candidate/cv/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || t("status_error_generic"));
    candidateProfile = data;
    updateCvNavIndicator();
    refreshCvModalView();
    cvFileInput.value = "";
    setCvStatus(t("cv_upload_success"), "success");
  } catch (err) {
    setCvStatus(t("cv_upload_error", { message: err.message }), "error");
  } finally {
    cvUploadBtn.disabled = false;
  }
});

cvDownloadLink.addEventListener("click", async () => {
  cvDownloadLink.disabled = true;
  try {
    const response = await pfAuthFetch("/api/candidate/cv/download");
    if (!response.ok) throw new Error(t("status_error_generic"));
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = candidateProfile.cv_filename || "cv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    setCvStatus(t("status_error_generic"), "error");
  } finally {
    cvDownloadLink.disabled = false;
  }
});

cvDeleteBtn.addEventListener("click", async () => {
  cvDeleteBtn.disabled = true;
  try {
    await pfAuthFetch("/api/candidate/cv", { method: "DELETE" });
    candidateProfile = { ...candidateProfile, has_cv: false, cv_source: "none", cv_filename: null, cv_generated_text: null };
    updateCvNavIndicator();
    refreshCvModalView();
    setCvStatus(t("cv_delete_success"), "success");
  } catch (err) {
    setCvStatus(t("status_error_generic"), "error");
  } finally {
    cvDeleteBtn.disabled = false;
  }
});

cvProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cvFullName.value.trim()) {
    setCvStatus(t("cv_generate_missing_name"), "error");
    return;
  }
  cvGenerateBtn.disabled = true;
  const originalLabel = cvGenerateBtn.textContent;
  cvGenerateBtn.textContent = t("cv_generating");
  setCvStatus(t("cv_generating"));
  try {
    const payload = {
      full_name: cvFullName.value.trim(),
      target_role: cvTargetRole.value.trim() || null,
      phone: cvPhone.value.trim() || null,
      address: cvAddress.value.trim() || null,
      education: cvEducation.value.trim() || null,
      experience: cvExperience.value.trim() || null,
      skills: cvSkills.value.trim() || null,
      languages: cvLanguages.value.trim() || null,
      language: uiLang,
    };
    const response = await pfAuthFetch("/api/candidate/cv/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || t("status_error_generic"));
    candidateProfile = data;
    updateCvNavIndicator();
    refreshCvModalView();
    setCvStatus(t("cv_generate_success"), "success");
  } catch (err) {
    setCvStatus(t("cv_generate_error", { message: err.message }), "error");
  } finally {
    cvGenerateBtn.disabled = false;
    cvGenerateBtn.textContent = originalLabel;
  }
});

cvSaveGeneratedBtn.addEventListener("click", async () => {
  cvSaveGeneratedBtn.disabled = true;
  try {
    const response = await pfAuthFetch("/api/candidate/cv/generated", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv_text: cvGeneratedTextarea.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || t("status_error_generic"));
    candidateProfile = data;
    setCvStatus(t("cv_save_success"), "success");
  } catch (err) {
    setCvStatus(t("status_error_generic"), "error");
  } finally {
    cvSaveGeneratedBtn.disabled = false;
  }
});

cvDownloadGeneratedBtn.addEventListener("click", () => {
  downloadPdf(`CV_${(candidateProfile.full_name || "cv").replace(/\s+/g, "_")}.pdf`, cvGeneratedTextarea.value);
});

/* -------- postuler (application) -------- */

function findPlaceByKey(key) {
  return (currentResults.length ? currentResults : allResults).find((p) => placeKey(p) === key);
}

function openApplicationModal(key) {
  const place = findPlaceByKey(key);
  if (!place) return;

  currentApplicationPlace = place;
  const existing = applicationsByPlace.get(key);

  applicationCompany.innerHTML = `${escapeHtml(place.nom)}<span>${escapeHtml(place.adresse || "")}</span>`;
  applicationEmail.value = place.email || (existing && existing.company_email) || "";
  applicationEmailHint.textContent = place.email ? t("app_email_found") : t("app_email_missing");
  applicationJobTitle.value = (existing && existing.job_title) || "";
  applicationNotes.value = "";
  applicationLetter.value = (existing && existing.cover_letter) || "";
  applicationNoProfile.hidden = true;
  applicationNoCv.hidden = !!candidateProfile.has_cv;
  setApplicationStatus("");

  openModal(applicationModal);
}

applicationOpenCvBtn.addEventListener("click", () => {
  closeModal(applicationModal);
  refreshCvModalView();
  openModal(cvModal);
});

applicationOpenCvFromCvBtn.addEventListener("click", () => {
  closeModal(applicationModal);
  refreshCvModalView();
  openModal(cvModal);
});

applicationDownloadCvBtn.addEventListener("click", async () => {
  if (candidateProfile.cv_source === "upload") {
    applicationDownloadCvBtn.disabled = true;
    try {
      const response = await pfAuthFetch("/api/candidate/cv/download");
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = candidateProfile.cv_filename || "cv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setApplicationStatus(t("status_error_generic"), "error");
    } finally {
      applicationDownloadCvBtn.disabled = false;
    }
  } else if (candidateProfile.cv_source === "generated") {
    const name = (currentApplicationPlace && currentApplicationPlace.nom) || "cv";
    downloadPdf(`CV_${name.replace(/\s+/g, "_")}.pdf`, candidateProfile.cv_generated_text || "");
  } else {
    applicationNoCv.hidden = false;
  }
});

applicationGenerateBtn.addEventListener("click", async () => {
  if (!currentApplicationPlace) return;
  applicationNoProfile.hidden = true;
  applicationGenerateBtn.disabled = true;
  const originalLabel = applicationGenerateBtn.textContent;
  applicationGenerateBtn.textContent = t("app_generating");
  setApplicationStatus(t("app_generating"));
  try {
    const payload = {
      place_id: placeKey(currentApplicationPlace),
      company_name: currentApplicationPlace.nom,
      company_address: currentApplicationPlace.adresse || null,
      company_category: currentApplicationPlace.categorie || null,
      job_title: applicationJobTitle.value.trim() || null,
      notes: applicationNotes.value.trim() || null,
      language: uiLang,
    };
    const response = await pfAuthFetch("/api/candidate/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 400) {
        applicationNoProfile.hidden = false;
        setApplicationStatus("");
        return;
      }
      throw new Error(data.detail || t("status_error_generic"));
    }
    applicationLetter.value = data.cover_letter;
    setApplicationStatus(t("app_generate_success"), "success");
  } catch (err) {
    setApplicationStatus(t("app_generate_error", { message: err.message }), "error");
  } finally {
    applicationGenerateBtn.disabled = false;
    applicationGenerateBtn.textContent = originalLabel;
  }
});

applicationDownloadBtn.addEventListener("click", () => {
  if (!currentApplicationPlace) return;
  if (!applicationLetter.value.trim()) {
    setApplicationStatus(t("app_letter_missing"), "error");
    return;
  }
  download(
    `Lettre_${(currentApplicationPlace.nom || "motivation").replace(/\s+/g, "_")}.txt`,
    applicationLetter.value,
    "text/plain;charset=utf-8;"
  );
});

applicationSaveBtn.addEventListener("click", async () => {
  if (!currentApplicationPlace) return;
  if (!applicationLetter.value.trim()) {
    setApplicationStatus(t("app_letter_missing"), "error");
    return;
  }
  applicationSaveBtn.disabled = true;
  try {
    const payload = {
      place_id: placeKey(currentApplicationPlace),
      company_name: currentApplicationPlace.nom,
      company_address: currentApplicationPlace.adresse || null,
      company_category: currentApplicationPlace.categorie || null,
      job_title: applicationJobTitle.value.trim() || null,
      cover_letter: applicationLetter.value,
    };
    const response = await pfAuthFetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || t("status_error_generic"));
    applicationsByPlace.set(data.place_id, data);
    updateApplicationsBadge();
    renderTable(currentResults);
    setApplicationStatus(t("app_save_success"), "success");
  } catch (err) {
    setApplicationStatus(t("app_save_error", { message: err.message }), "error");
  } finally {
    applicationSaveBtn.disabled = false;
  }
});

applicationSendBtn.addEventListener("click", async () => {
  if (!currentApplicationPlace) return;
  const email = applicationEmail.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    setApplicationStatus(t("app_email_invalid"), "error");
    return;
  }
  if (!applicationLetter.value.trim()) {
    setApplicationStatus(t("app_letter_missing"), "error");
    return;
  }
  if (!candidateProfile.has_cv) {
    applicationNoCv.hidden = false;
    setApplicationStatus(t("app_no_cv_send"), "error");
    return;
  }
  if (!confirm(t("app_send_confirm", { email }))) return;

  applicationSendBtn.disabled = true;
  const originalLabel = applicationSendBtn.textContent;
  applicationSendBtn.textContent = t("app_sending");
  setApplicationStatus(t("app_sending"));
  try {
    const job = applicationJobTitle.value.trim();
    const payload = {
      place_id: placeKey(currentApplicationPlace),
      company_name: currentApplicationPlace.nom,
      company_address: currentApplicationPlace.adresse || null,
      company_category: currentApplicationPlace.categorie || null,
      company_email: email,
      job_title: job || null,
      subject: job ? `${t("app_subject_prefix")} - ${job}` : `${t("app_subject_spontaneous")} - ${currentApplicationPlace.nom}`,
      message: applicationLetter.value,
    };
    const response = await pfAuthFetch("/api/applications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || t("status_error_generic"));
    applicationsByPlace.set(data.place_id, data);
    updateApplicationsBadge();
    renderTable(currentResults);
    setApplicationStatus(t("app_send_success", { email }), "success");
  } catch (err) {
    setApplicationStatus(t("app_send_error", { message: err.message }), "error");
  } finally {
    applicationSendBtn.disabled = false;
    applicationSendBtn.textContent = originalLabel;
  }
});

/* ---------------- init ---------------- */


/* ================= Chatbot ================= */

const chatMessagesEl = document.getElementById("chat-messages");
const chatSuggestionsEl = document.getElementById("chat-suggestions");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send");
const chatClearBtn = document.getElementById("chat-clear");

function chatStorageKey() {
  const user = pfGetUser();
  return "forsa_chat_" + ((user && (user.email || user.id)) || "anon");
}

let chatHistory = [];
try {
  chatHistory = JSON.parse(localStorage.getItem(chatStorageKey()) || "[]").filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
} catch {
  chatHistory = [];
}
let chatBusy = false;

function saveChat() {
  try {
    localStorage.setItem(chatStorageKey(), JSON.stringify(chatHistory.slice(-40)));
  } catch { /* quota : on ignore */ }
}

function chatFormat(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function renderChat(extra) {
  const parts = chatHistory.map(
    (m) => `<div class="chat-msg ${m.role}">${chatFormat(m.content)}</div>`
  );
  if (!chatHistory.length) {
    parts.push(`<div class="chat-empty">${escapeHtml(t("chat_empty"))}</div>`);
  }
  if (extra) parts.push(extra);
  chatMessagesEl.innerHTML = parts.join("");
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

  chatSuggestionsEl.innerHTML = chatHistory.length
    ? ""
    : ["chat_sugg_1", "chat_sugg_2", "chat_sugg_3"]
        .map((k) => `<button type="button" class="chat-chip">${escapeHtml(t(k))}</button>`)
        .join("");
}

async function sendChatMessage(text) {
  const content = (text || "").trim();
  if (!content || chatBusy) return;
  chatBusy = true;
  chatSendBtn.disabled = true;
  chatHistory.push({ role: "user", content });
  saveChat();
  renderChat(`<div class="chat-msg assistant typing">${escapeHtml(t("chat_typing"))}</div>`);

  try {
    const response = await pfAuthFetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory.slice(-12), language: uiLang }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || t("chat_error"));
    chatHistory.push({ role: "assistant", content: data.reply });
    saveChat();
    renderChat();
  } catch (err) {
    renderChat(`<div class="chat-msg error">${escapeHtml(err.message || t("chat_error"))}</div>`);
  } finally {
    chatBusy = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value;
  chatInput.value = "";
  chatInput.style.height = "auto";
  sendChatMessage(text);
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + "px";
});

chatSuggestionsEl.addEventListener("click", (event) => {
  const chip = event.target.closest(".chat-chip");
  if (chip) sendChatMessage(chip.textContent);
});

chatClearBtn.addEventListener("click", () => {
  chatHistory = [];
  saveChat();
  renderChat();
});

/* ---------------- home hero shortcuts ---------------- */
(function heroShortcuts() {
  const smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  document.getElementById("hero-start")?.addEventListener("click", () => {
    const box = document.getElementById("queries");
    if (!box) return;
    box.scrollIntoView({ behavior: smooth, block: "center" });
    setTimeout(() => box.focus({ preventScroll: true }), smooth === "auto" ? 0 : 350);
  });
  document.getElementById("hero-results")?.addEventListener("click", () => {
    document.querySelector("section.results")?.scrollIntoView({ behavior: smooth, block: "start" });
  });
  document.getElementById("hero-cv")?.addEventListener("click", () => {
    document.getElementById("cv-nav-btn")?.click();
  });
})();

(function init() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (localStorage.getItem(SIDE_COLLAPSED_KEY) === "1") document.body.classList.add("side-collapsed");

  refreshAvatar();
  favCountEl.textContent = favorites.size;
  renderRecentSearches();

  applyTranslations();
  loadCandidateProfile();
  loadApplications();
})();
