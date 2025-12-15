const cartSectionEl = document.querySelector('.cart-section');

let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];

const burgerBtn = document.getElementById("burgerBtn");
  const closeBtn = document.getElementById("closeBtn");
  const mainNav = document.getElementById("mainNav");
  const navOverlay = document.getElementById("navOverlay");

  burgerBtn.addEventListener("click", () => {
    mainNav.classList.add("open");
    navOverlay.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navOverlay.style.display = "none";
  });

  navOverlay.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navOverlay.style.display = "none";
  });

function saveCart() {
    localStorage.setItem('tz_cart', JSON.stringify(cart));
}

function createConfirmationModal() {
    const modalHTML = `
        <div id="order-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9998; display: none;"></div>
        <div id="order-modal-content" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 30px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 9999; display: none; text-align: center; max-width: 400px; font-family: sans-serif;">
            <h3 style="color: #5C4B5E; margin-bottom: 10px;">Order Confirmed! 🎉</h3>
            <button id="modal-close-btn" style="padding: 10px 20px; border: none; border-radius: 5px; background: #5C4B5E; color: #fff; cursor: pointer;">Continue</button>
        </div>
    `;

    if (!document.getElementById('order-modal-backdrop')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

function showModal(callback) {
    const backdrop = document.getElementById('order-modal-backdrop');
    const content = document.getElementById('order-modal-content');
    const closeBtn = document.getElementById('modal-close-btn');

    if (backdrop && content) {
        backdrop.style.display = 'block';
        content.style.display = 'block';

        const handleClose = () => {
            backdrop.style.display = 'none';
            content.style.display = 'none';
            closeBtn.removeEventListener('click', handleClose); 
            
            if (typeof callback === 'function') {
                callback();
            }
        };

        closeBtn.addEventListener('click', handleClose);
    }
}

function renderOrderSummary() {
    const totalAmountEl = document.querySelector('.total-row.grand-total .amount');
    if (!totalAmountEl) {
        console.warn('Grand total element (.total-row.grand-total .amount) not found in the DOM.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = `$${subtotal.toFixed(2)}`;
    
    totalAmountEl.textContent = formattedTotal;
}

function handleContinueShopping() {
    window.location.href = 'product.html';
}

function handlePlaceOrder() {
    cart = [];
    saveCart();

    renderCart();

    showModal(() => {
        window.location.href = 'index.html'; 
    });
}

function setupActionButtons() {
    const continueBtn = document.querySelector('.continue-shopping-btn');
    const placeOrderBtn = document.querySelector('.place-order-btn');

    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinueShopping);
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

function init() {
    createConfirmationModal();
    renderCart();
    renderOrderSummary(); 
    setupActionButtons();
    
    document.querySelectorAll('.size-dropdown').forEach(dropdown => {
        if (!dropdown.dataset.listenerAttached) {
            dropdown.addEventListener('change', handleSizeChange);
            dropdown.dataset.listenerAttached = 'true';
        }
    });
}

function renderCart() {
    let headersEl = document.querySelector('.cart-headers');
    if (!headersEl) {
        headersEl = document.createElement('div');
        headersEl.className = 'cart-headers';
        headersEl.innerHTML = `
            <span></span>
            <span class="header-image"></span>
            <span class="header-product">Product</span>
            <span class="header-price">Price</span>
            <span class="header-quantity">Quantity</span>
            <span class="header-total">Total</span>
        `;
        cartSectionEl.appendChild(headersEl);
    }

    document.querySelectorAll('.cart-item').forEach(item => item.remove());

    if (cart.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'cart-empty-message';
        emptyMessage.style.cssText = 'text-align:center; padding: 60px 20px;';
        emptyMessage.innerHTML = `
            <p style="font-size: 18px; color: #5C4B5E; margin-bottom: 20px;">Your cart is empty.</p>
            <a href="product.html" style="display:inline-block; text-decoration:none; padding:12px 24px; border-radius:10px; background:#B282B9; color:#fff; font-weight:600;">
                Start Shopping
            </a>
        `;
        cartSectionEl.appendChild(emptyMessage);
        if (headersEl) headersEl.style.display = 'none';
        
        renderOrderSummary(); 
        return;
    }
    
    if (headersEl) headersEl.style.display = 'grid';
    document.querySelector('.cart-empty-message')?.remove();


    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.dataset.itemId = item.id;
        
        const itemTotal = (item.price * item.quantity).toFixed(2);

        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23E8DEF8%22/></svg>'">
            
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                ${item.note ? `<div class="item-note-display">Note: ${item.note}</div>` : ''}
                </div>
            
            <div class="item-price">$${item.price.toFixed(2)}</div>
            
            <div class="item-quantity">
                <span>${item.quantity}</span>
            </div>
            
            <div class="item-total">$${itemTotal}</div>
            `;

        if (item.category === 'cakes') {
            const sizeDropdown = itemEl.querySelector('.size-dropdown');
            if (sizeDropdown) {
                sizeDropdown.addEventListener('change', handleSizeChange);
            }
        }
        
        cartSectionEl.appendChild(itemEl);
    });
    
    renderOrderSummary(); 
}

function handleSizeChange(e) {
    const id = e.target.dataset.id;
    const newSize = e.target.value;
    const sizePriceMap = { '9cm': 0, '15cm': 5, '30cm': 12 };
    
    const item = cart.find(i => Number(i.id) === Number(id));
    if (!item) return;

    const basePrice = item.originalPrice || item.basePrice || item.price;
    
    const priceIncrease = sizePriceMap[newSize];
    updateItemSize(Number(id), newSize, priceIncrease, basePrice);
}

window.updateItemSize = function (id, newSize, priceIncrease, basePrice) {
    id = Number(id);
    const item = cart.find(i => Number(i.id) === id);
    
    if (item) {
        item.size = newSize;
        item.basePrice = item.basePrice || basePrice; 
        item.price = item.basePrice + priceIncrease; 
        
        const cartItemEl = document.querySelector(`.cart-item[data-item-id="${id}"]`);

        if (cartItemEl) {
            cartItemEl.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;
            const itemTotal = (item.price * item.quantity).toFixed(2);
            cartItemEl.querySelector('.item-total').textContent = `$${itemTotal}`;
        }
        
        saveCart();
        renderOrderSummary(); 
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
 