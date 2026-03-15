/**
 * பருவ உணவு கண்டுபிடிப்பான் - Frontend Application
 * Seasonal Food Finder - Tamil Nadu
 */

// ─── Config ───────────────────────────────────────────────────
const API = window.location.hostname === "localhost"
  ? "http://localhost:8000/api"
  : "https://seasonal-food-finder.onrender.com/api";

// ─── State ────────────────────────────────────────────────────
let allFoods = [];
let allCategories = [];
let allSeasons = [];
let activeCategoryFilter = null;
let currentMonth = new Date().getMonth() + 1;  // 1-12

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadCategories(), loadSeasons()]);
  loadFeaturedFoods(currentMonth);
  buildMonthSelectorHome();
  buildMonthGrid();
});

// ─── Navigation ───────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll(".section").forEach(s => {
    s.classList.add("hidden");
    s.classList.remove("active");
  });
  const target = document.getElementById(`section-${name}`);
  target.classList.remove("hidden");
  target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.section === name);
  });

  if (name === "browse" && allFoods.length === 0) {
    loadAllFoods();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── API Helpers ──────────────────────────────────────────────
async function apiFetch(path) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
}

// ─── Load Categories ──────────────────────────────────────────
async function loadCategories() {
  allCategories = await apiFetch("/categories") || [];
  renderCategoryCards();
  buildFilterCats();
}

function renderCategoryCards() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;
  grid.innerHTML = allCategories.map(cat => `
    <div class="category-card"
         style="--cat-color: ${cat.color}"
         onclick="filterAndBrowse(${cat.id})">
      <span class="category-icon">${cat.icon}</span>
      <div class="category-name">${cat.name_tamil}</div>
      <div class="category-eng">${cat.name_english}</div>
    </div>
  `).join("") || "<p>வகைகள் இல்லை</p>";
}

function filterAndBrowse(catId) {
  showSection("browse");
  loadAllFoods();
  // highlight filter button after foods load
  setTimeout(() => {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(b => {
      if (b.dataset.catId == catId) {
        b.click();
      }
    });
  }, 300);
}

// ─── Load Seasons ─────────────────────────────────────────────
async function loadSeasons() {
  allSeasons = await apiFetch("/seasons") || [];
}

function buildMonthSelectorHome() {
  const sel = document.getElementById("monthSelector");
  if (!sel || !allSeasons.length) return;
  sel.innerHTML = allSeasons.map(s => `
    <button
      class="month-btn ${s.month_number === currentMonth ? 'active current' : ''}"
      onclick="selectMonthHome(${s.month_number}, this)">
      ${s.month_tamil}
    </button>
  `).join("");
}

function selectMonthHome(month, btn) {
  currentMonth = month;
  document.querySelectorAll(".month-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  loadFeaturedFoods(month);
}

// ─── Load Foods by Month ──────────────────────────────────────
async function loadFeaturedFoods(month) {
  const container = document.getElementById("featuredFoods");
  container.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>உணவுகள் ஏற்றப்படுகின்றன...</p>
    </div>`;

  const foods = await apiFetch(`/foods/month/${month}`);
  if (!foods || foods.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌾</div>
        <div class="empty-state-text">இந்த மாதத்தில் சிறப்பு உணவுகள் இல்லை</div>
      </div>`;
    return;
  }
  container.innerHTML = foods.map(f => foodCardHTML(f)).join("");
}

// ─── Load All Foods ───────────────────────────────────────────
async function loadAllFoods() {
  const grid = document.getElementById("browseGrid");
  grid.innerHTML = `
    <div class="loading-spinner"><div class="spinner"></div><p>உணவுகள் ஏற்றப்படுகின்றன...</p></div>`;

  allFoods = await apiFetch("/foods?limit=300") || [];
  renderBrowseGrid(allFoods);
}

function renderBrowseGrid(foods) {
  const grid = document.getElementById("browseGrid");
  if (!foods.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">தேடிய உணவு கண்டுபிடிக்கப்படவில்லை</div>
      </div>`;
    return;
  }
  grid.innerHTML = foods.map(f => foodCardHTML(f)).join("");
}

// ─── Filter ───────────────────────────────────────────────────
function buildFilterCats() {
  const container = document.getElementById("filterCats");
  if (!container) return;
  const catButtons = allCategories.map(cat => `
    <button
      class="filter-btn"
      data-cat-id="${cat.id}"
      onclick="filterByCategory(${cat.id}, this)">
      ${cat.icon} ${cat.name_tamil}
    </button>
  `).join("");
  container.innerHTML = `
    <button class="filter-btn active" onclick="filterByCategory(null, this)">அனைத்தும்</button>
    ${catButtons}`;
}

function filterByCategory(catId, btn) {
  activeCategoryFilter = catId;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function filterFoods() {
  applyFilters();
}

function applyFilters() {
  const query = (document.getElementById("browseSearch")?.value || "").toLowerCase();
  let filtered = allFoods;
  if (activeCategoryFilter) {
    filtered = filtered.filter(f => f.category?.id === activeCategoryFilter);
  }
  if (query) {
    filtered = filtered.filter(f =>
      f.name_tamil.includes(query) ||
      f.name_english.toLowerCase().includes(query)
    );
  }
  renderBrowseGrid(filtered);
}

// ─── Month Section ────────────────────────────────────────────
function buildMonthGrid() {
  const grid = document.getElementById("monthGrid");
  if (!grid) return;
  const monthNames = [
    "ஜனவரி","பிப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜூன்",
    "ஜூலை","ஆகஸ்ட்","செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்"
  ];
  const engNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  grid.innerHTML = Array.from({ length: 12 }, (_, i) => `
    <div class="month-card ${i + 1 === currentMonth ? 'active' : ''}"
         onclick="loadMonthFoods(${i + 1}, this)">
      <div class="month-num">${i + 1}</div>
      <div class="month-tamil">${monthNames[i]}</div>
      <div class="month-eng">${engNames[i]}</div>
    </div>
  `).join("");

  // Load current month by default
  loadMonthFoods(currentMonth);
}

async function loadMonthFoods(month, card) {
  if (card) {
    document.querySelectorAll(".month-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
  }

  const container = document.getElementById("monthFoodsResult");
  container.innerHTML = `
    <div class="loading-spinner"><div class="spinner"></div><p>உணவுகள் ஏற்றப்படுகின்றன...</p></div>`;

  const foods = await apiFetch(`/foods/month/${month}`);
  if (!foods || !foods.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌿</div>
        <div class="empty-state-text">இந்த மாதத்தில் சிறப்பு உணவுகள் இல்லை</div>
      </div>`;
    return;
  }

  const monthNames = ["","ஜனவரி","பிப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜூன்","ஜூலை","ஆகஸ்ட்","செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்"];
  container.innerHTML = `
    <h3 style="grid-column:1/-1; font-family:'Noto Serif Tamil',serif; color:var(--saffron); margin-bottom:0.5rem;">
      🌿 ${monthNames[month]} மாதத்தில் ${foods.length} உணவுகள் கிடைக்கின்றன
    </h3>
    ${foods.map(f => foodCardHTML(f)).join("")}`;
}

// ─── Food Card HTML ───────────────────────────────────────────
function foodCardHTML(food) {
  const cat = food.category;
  const catColor = cat?.color || "#FF6B2B";
  const seasons = (food.seasons || []).slice(0, 4).map(s => `
    <span class="season-tag">${s.month_tamil}</span>`).join("");
  const img = food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

  return `
    <div class="food-card" onclick="openFoodDetail(${food.id})">
      <div class="food-card-img-wrap">
        <img src="${img}" alt="${food.name_tamil}" class="food-card-img"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'" />
      </div>
      <div class="food-card-body">
        ${cat ? `<span class="food-card-category" style="color:${catColor}">${cat.icon || ''} ${cat.name_tamil}</span>` : ''}
        <div class="food-card-name">${food.name_tamil}</div>
        <div class="food-card-eng">${food.name_english}</div>
        <div class="food-card-desc">${food.description_tamil || ''}</div>
        <div class="food-card-seasons">${seasons}</div>
      </div>
    </div>`;
}

// ─── Food Detail Modal ────────────────────────────────────────
async function openFoodDetail(foodId) {
  const modal = document.getElementById("foodModal");
  const content = document.getElementById("modalContent");

  // Show loading
  modal.classList.remove("hidden");
  content.innerHTML = `
    <div style="padding:3rem; text-align:center">
      <div class="spinner" style="margin:auto"></div>
      <p style="margin-top:1rem; color:var(--text-light)">தகவல்கள் ஏற்றப்படுகின்றன...</p>
    </div>`;

  const food = await apiFetch(`/foods/${foodId}`);
  if (!food) {
    content.innerHTML = `<div style="padding:2rem; text-align:center">உணவு கண்டுபிடிக்கப்படவில்லை</div>`;
    return;
  }

  const img = food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
  const cat = food.category;
  const seasons = (food.seasons || []).map(s =>
    `<span class="detail-season-tag">🌿 ${s.month_tamil}</span>`).join("");

  // Nutrition
  let nutHTML = "";
  const n = food.nutrition;
  if (n) {
    const vits = (n.vitamins || "").split(",").map(v => v.trim()).filter(Boolean)
      .map(v => `<span class="vit-pill">${v}</span>`).join("");
    const mins = (n.minerals || "").split(",").map(m => m.trim()).filter(Boolean)
      .map(m => `<span class="min-pill">${m}</span>`).join("");

    nutHTML = `
      <div class="nutrition-card">
        <div class="nutrition-title">🧪 ஊட்டச்சத்து தகவல் (100g க்கு)</div>
        <div class="nutrition-grid">
          <div class="nut-item">
            <div class="nut-value">${n.calories || 0}</div>
            <div class="nut-unit">kcal</div>
            <div class="nut-label">கலோரி</div>
          </div>
          <div class="nut-item">
            <div class="nut-value">${n.protein || 0}</div>
            <div class="nut-unit">g</div>
            <div class="nut-label">புரதம்</div>
          </div>
          <div class="nut-item">
            <div class="nut-value">${n.carbohydrates || 0}</div>
            <div class="nut-unit">g</div>
            <div class="nut-label">கார்போஹைட்ரேட்</div>
          </div>
          <div class="nut-item">
            <div class="nut-value">${n.fat || 0}</div>
            <div class="nut-unit">g</div>
            <div class="nut-label">கொழுப்பு</div>
          </div>
          <div class="nut-item">
            <div class="nut-value">${n.fiber || 0}</div>
            <div class="nut-unit">g</div>
            <div class="nut-label">நார்ச்சத்து</div>
          </div>
        </div>
        ${vits || mins ? `<div class="vit-min-row">${vits}${mins}</div>` : ""}
      </div>`;
  }

  // Benefits
  const benefits = food.benefits || [];
  let benefitsHTML = "";
  if (benefits.length) {
    benefitsHTML = `
      <div class="benefits-section">
        <div class="benefits-title">💚 உடல்நல நன்மைகள்</div>
        ${benefits.map(b => `<div class="benefit-item">${b.benefit_tamil}</div>`).join("")}
      </div>`;
  }

  // Recipes
  const recipes = food.recipes || [];
  let recipesHTML = "";
  if (recipes.length) {
    const tabs = recipes.map((r, i) => `
      <button class="recipe-tab ${i === 0 ? 'active' : ''}"
              onclick="switchRecipeTab(${i}, this)">
        ${i + 1}. ${r.title_tamil}
      </button>`).join("");

    const panels = recipes.map((r, i) => `
      <div class="recipe-panel ${i === 0 ? 'active' : ''}" id="recipe-panel-${i}">
        <h4>${r.title_tamil}</h4>
        <div class="recipe-meta">
          <div class="recipe-meta-item">⏱ தயாரிப்பு: ${r.prep_time}</div>
          <div class="recipe-meta-item">🍳 சமையல்: ${r.cook_time}</div>
        </div>
        <div class="recipe-section-label">🧂 பொருட்கள் (Ingredients)</div>
        <div class="recipe-ing">${r.ingredients_tamil}</div>
        <div class="recipe-section-label">📋 செய்முறை (Steps)</div>
        <div class="recipe-steps">${r.instructions_tamil}</div>
      </div>`).join("");

    recipesHTML = `
      <div class="recipes-section">
        <div class="recipes-title">🍳 சமையல் குறிப்புகள்</div>
        <div class="recipe-tabs">${tabs}</div>
        ${panels}
      </div>`;
  }

  content.innerHTML = `
    <img src="${img}" alt="${food.name_tamil}" class="food-detail-img"
         onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'" />
    <div class="food-detail-body">
      ${cat ? `<span class="food-card-category" style="color:${cat.color || 'var(--saffron)'}">${cat.icon || ''} ${cat.name_tamil}</span>` : ''}
      <h2 class="food-detail-title">${food.name_tamil}</h2>
      <p class="food-detail-eng">${food.name_english}</p>
      <p class="food-detail-desc">${food.description_tamil || ''}</p>
      ${seasons ? `<div class="detail-seasons"><strong style="font-size:0.85rem">🗓 கிடைக்கும் மாதங்கள்:</strong>${seasons}</div>` : ""}
      ${nutHTML}
      ${benefitsHTML}
      ${recipesHTML}
    </div>`;
}

function switchRecipeTab(idx, btn) {
  document.querySelectorAll(".recipe-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".recipe-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`recipe-panel-${idx}`).classList.add("active");
}

function closeModal() {
  document.getElementById("foodModal").classList.add("hidden");
}
function closeRecipeModal() {
  document.getElementById("recipeModal").classList.add("hidden");
}

// Close modal on Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal(); closeRecipeModal(); }
});

// ─── Search ───────────────────────────────────────────────────
let searchTimeout = null;

async function liveSearch(query) {
  clearTimeout(searchTimeout);
  const dropdown = document.getElementById("searchResults");

  if (!query.trim()) {
    dropdown.classList.add("hidden");
    return;
  }

  searchTimeout = setTimeout(async () => {
    const results = await apiFetch(`/search?name=${encodeURIComponent(query)}`);
    renderSearchDropdown(results || []);
  }, 300);
}

function renderSearchDropdown(foods) {
  const dropdown = document.getElementById("searchResults");
  if (!foods.length) {
    dropdown.innerHTML = `<div class="search-no-result">🔍 "${document.getElementById('heroSearch').value}" கண்டுபிடிக்கப்படவில்லை</div>`;
    dropdown.classList.remove("hidden");
    return;
  }

  dropdown.innerHTML = foods.slice(0, 8).map(f => `
    <div class="search-result-item" onclick="openFoodDetail(${f.id}); closeSearchDropdown()">
      <img src="${f.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}"
           class="search-result-img"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'" />
      <div class="search-result-info">
        <div class="search-result-name">${f.name_tamil}</div>
        <div class="search-result-eng">${f.name_english}</div>
      </div>
      ${f.category ? `<span class="search-result-cat">${f.category.icon || ''} ${f.category.name_tamil}</span>` : ''}
    </div>`).join("");
  dropdown.classList.remove("hidden");
}

function performSearch() {
  const query = document.getElementById("heroSearch").value;
  if (!query.trim()) return;
  showSection("browse");
  loadAllFoods().then(() => {
    document.getElementById("browseSearch").value = query;
    applyFilters();
  });
  closeSearchDropdown();
}

function closeSearchDropdown() {
  document.getElementById("searchResults").classList.add("hidden");
}

// Close dropdown when clicking outside
document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrapper")) {
    closeSearchDropdown();
  }
});

// Enter key on search
document.getElementById("heroSearch").addEventListener("keydown", e => {
  if (e.key === "Enter") performSearch();
});

// ─── Toast ────────────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), duration);
}
