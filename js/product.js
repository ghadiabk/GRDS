// DOM Elements
const categoryButtons = document.querySelectorAll('.category-pill .cat');
const cardsGrid = document.querySelector('.cards-grid');
const paginationContainer = document.querySelector('.pagination');
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-modal');

// State
let allProducts = [];
let activeCategory = 'all';
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];
let currentPage = 1;
const itemsPerPage = 8;

// Product Data (simulated - replace with API call if needed)
const productsData = [
  { id: 1, name: 'Chocolate Cake', price: 25, category: 'cakes', image: 'assets/img/cake-2-1.png', description: 'Rich and decadent chocolate cake' },
  { id: 2, name: 'Strawberry Cake', price: 30, category: 'cakes', image: 'assets/cake2.jpg', description: 'Fresh strawberry layered cake' },
  { id: 3, name: 'Chocolate Chip Cookie', price: 5, category: 'cookies', image: 'assets/cookie1.jpg', description: 'Crispy chocolate chip cookies' },
  { id: 4, name: 'Vanilla Macarons', price: 12, category: 'macarons', image: 'assets/macarons1.jpg', description: 'Delicate vanilla macarons' },
  { id: 5, name: 'Lemon Cake', price: 28, category: 'cakes', image: 'assets/cake3.jpg', description: 'Zesty lemon pound cake' },
  { id: 6, name: 'Oatmeal Cookie', price: 6, category: 'cookies', image: 'assets/cookie2.jpg', description: 'Wholesome oatmeal cookies' },
  { id: 7, name: 'Raspberry Macarons', price: 15, category: 'macarons', image: 'assets/macarons2.jpg', description: 'Sweet raspberry macarons' },
  { id: 8, name: 'Coffee Cake', price: 27, category: 'cakes', image: 'assets/cake4.jpg', description: 'Aromatic coffee-flavored cake' },
];

// Initialize
function init() {
  allProducts = productsData;
  setupCategoryFilters();
  renderProducts();
  setupLoginModal();
  updateCartCount();
}

// Category Filter Setup
function setupCategoryFilters() {
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.textContent.toLowerCase() === 'all' ? 'all' : btn.textContent.toLowerCase();
      currentPage = 1;
      renderProducts();
    });
  });
}

// Render Products with Pagination
function renderProducts() {
  // Filter products by category
  const filtered = activeCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  // Paginate
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // Clear grid
  cardsGrid.innerHTML = '';

  // Render cards
  paginated.forEach(product => {
    const inCart = cart.some(item => item.id === product.id);
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/img/cake-2-1.png'">
      </div>
      <div class="card-info">
        <span class="card-title">${product.name}</span>
        <span class="price">$${product.price}</span>
      </div>
      <button class="btn add" data-id="${product.id}" ${inCart ? 'style="background: #E2D2E8; color: #B282B9; cursor: default;"' : ''}>
        ${inCart ? 'In Cart' : 'Add to Cart'}
      </button>
    `;

    card.querySelector('.btn.add').addEventListener('click', () => {
      addToCart(product);
    });

    cardsGrid.appendChild(card);
  });

  // Render pagination
  renderPagination(filtered.length);
}

// Pagination
function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn ghost';
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `btn ghost ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.style.fontWeight = i === currentPage ? 'bold' : 'normal';
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
      scrollToTop();
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn ghost';
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(nextBtn);
}

function scrollToTop() {
  document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
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
  renderProducts(); // Re-render to update button state
}

// Update Cart Count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartIcon = document.querySelector('.main-nav a img[alt="Shopping Cart"]').parentElement;
  let badge = cartIcon.querySelector('.cart-badge');
  
  if (!badge && count > 0) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.style.cssText = 'position: absolute; top: -5px; right: -10px; background: #B282B9; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;';
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(badge);
  }
  
  if (badge) badge.textContent = count;
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('tz_cart', JSON.stringify(cart));
}

// Login Modal
function setupLoginModal() {
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'flex';
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);