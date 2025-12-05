// DOM Elements
const categoryButtons = document.querySelectorAll('.category-pill .cat');
const cardsGrid = document.querySelector('.cards-grid');
const paginationContainer = document.querySelector('.pagination');

// State
let allProducts = [];
let activeCategory = 'cakes';
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];
let currentPage = 1;
const itemsPerPage = 8;

// ---------- INIT ----------
async function init() {
  await loadProductsFromJSON();
  setupCategoryFilters();
  renderProducts();
  updateCartCount();
}

async function loadProductsFromJSON() {
  try {
    const res = await fetch("json/products.json");
    allProducts = await res.json();
  } catch (error) {
    console.error("❌ Failed to load products.json", error);
  }
}

// Category Filter Setup
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.category-pill .cat');

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.textContent.toLowerCase();
      currentPage = 1;
      renderProducts();
    });
  });
}

// Render Products
function renderProducts() {
  const filtered = allProducts.filter(p => p.category === activeCategory);

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const cardsGrid = document.querySelector('.cards-grid');
  cardsGrid.innerHTML = '';

  paginated.forEach(product => {
    const inCart = cart.some(item => item.id === product.id);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media">
        <img src="${product.image}" alt="${product.name}" >
      </div>
      <div class="card-info">
        <span class="card-title">${product.name}</span>
        <span class="price">$${product.price}</span>
      </div>
      <button class="btn add ${inCart ? 'added' : ''}" data-id="${product.id}" ${inCart ? 'disabled' : ''}>
        ${inCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    `;

    card.querySelector('.btn.add').addEventListener('click', () => addToCart(product));

    cardsGrid.appendChild(card);
  });

  renderPagination(filtered.length);
}

// Pagination Buttons
function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    if (totalPages === 1) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'btn ghost active';
      pageBtn.textContent = '1';
      paginationContainer.appendChild(pageBtn);
    }
    return;
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `btn ghost ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;

    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
      scrollToTop();
    });

    paginationContainer.appendChild(pageBtn);
  }
}

function scrollToTop() {
  document.querySelector('.products').scrollIntoView({
    behavior: 'smooth'
  });
}

// Add to Cart
function addToCart(product) {
  const exists = cart.find(item => item.id === product.id);

  if (exists) {
    exists.quantity = (exists.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  renderProducts();
}

// Update Cart Badge
function updateCartCount() {
  const count = cart.reduce((t, item) => t + item.quantity, 0);
  const cartIcon = document
    .querySelector('.main-nav a img[alt="Shopping Cart"]')
    .parentElement;

  let badge = cartIcon.querySelector('.cart-badge');

  if (!badge && count > 0) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -10px;
      background: #B282B9;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    `;
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(badge);
  }

  if (badge) badge.textContent = count;
}

function saveCart() {
  localStorage.setItem('tz_cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', init);
