// Get elements from the page
const cartSectionEl = document.querySelector('.cart-section');
const orderSummaryEl = document.querySelector('.order-summary');

// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];

// Start the page
function init() {
    renderCart();
    renderOrderSummary();
}

// Show all cart items on the page
function renderCart() {
    // Find or create cart headers
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

    // Remove all existing cart items
    document.querySelectorAll('.cart-item').forEach(item => item.remove());
    document.querySelectorAll('.add-note').forEach(btn => btn.remove());

    // If no items in cart, show message
    if (cart.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = 'text-align:center; padding: 60px 20px;';
        emptyMessage.innerHTML = `
            <p style="font-size: 18px; color: #5C4B5E; margin-bottom: 20px;">Your cart is empty.</p>
            <a href="product.html" style="display:inline-block; text-decoration:none; padding:12px 24px; border-radius:10px; background:#B282B9; color:#fff; font-weight:600;">
                Start Shopping
            </a>
        `;
        cartSectionEl.appendChild(emptyMessage);
        return;
    }

    // Loop through each item and add it to the page
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        
        const itemTotal = (item.price * item.quantity).toFixed(2);

        itemEl.innerHTML = `
            <button class="remove-btn" type="button" data-id="${item.id}">×</button>
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23E8DEF8%22/></svg>'">
            
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                ${item.category === 'cakes' ? `
                <div class="item-size">
                    <select class="size-dropdown" data-id="${item.id}" style="background: transparent; border: none; color: #5C4B5E; font-weight: 600; padding: 4px 0; cursor: pointer;">
                        <option value="9cm" ${(item.size || '9cm') === '9cm' ? 'selected' : ''}>Size 9cm</option>
                        <option value="15cm" ${(item.size || '9cm') === '15cm' ? 'selected' : ''}>Size 15cm</option>
                        <option value="30cm" ${(item.size || '9cm') === '30cm' ? 'selected' : ''}>Size 30cm</option>
                    </select>
                </div>
                ` : ''}
            </div>
            
            <div class="item-price">$${item.price.toFixed(2)}</div>
            
            <div class="item-quantity">
                <button class="qty-minus" type="button" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-plus" type="button" data-id="${item.id}">+</button>
            </div>
            
            <div class="item-total">$${itemTotal}</div>
        `;

        // Attach event listeners
        itemEl.querySelector('.remove-btn').addEventListener('click', () => removeItem(item.id));
        itemEl.querySelector('.qty-minus').addEventListener('click', () => updateQuantity(item.id, -1));
        itemEl.querySelector('.qty-plus').addEventListener('click', () => updateQuantity(item.id, 1));
        
        // Only attach size dropdown listener for cake items
        if (item.category === 'cakes') {
            const sizeDropdown = itemEl.querySelector('.size-dropdown');
            if (sizeDropdown) {
                sizeDropdown.addEventListener('change', (e) => {
                    const newSize = e.target.value;
                    const sizePriceMap = { '9cm': 0, '15cm': 5, '30cm': 12 };
                    const basePrice = item.originalPrice || item.price;
                    const priceIncrease = sizePriceMap[newSize];
                    updateItemSize(item.id, newSize, priceIncrease, basePrice);
                });
            }
        }

        cartSectionEl.appendChild(itemEl);

        // Add note input field inside cart item (at the right)
        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.className = 'add-note';
        noteInput.placeholder = 'Add A Note';
        itemEl.appendChild(noteInput);
    });
}

// Render order summary
function renderOrderSummary() {
    const summaryContainer = document.querySelector('.order-summary');
    
    // Remove existing items (keep header)
    const existingSummaryItems = summaryContainer.querySelectorAll('.summary-item, .summary-total, .payment-btn, .summary-items-wrapper');
    existingSummaryItems.forEach(item => item.remove());

    if (cart.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'padding: 20px; color: #5C4B5E; text-align: center;';
        emptyMsg.textContent = 'Your cart is empty';
        summaryContainer.appendChild(emptyMsg);
        return;
    }

    // Create wrapper for items (inside white background)
    const itemsWrapper = document.createElement('div');
    itemsWrapper.className = 'summary-items-wrapper';

    // Add each item to the summary
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        itemsWrapper.appendChild(summaryItem);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const deliveryCharge = 3.00;
    const total = subtotal + tax + deliveryCharge;

    // Add delivery charge
    const deliveryItem = document.createElement('div');
    deliveryItem.className = 'summary-item';
    deliveryItem.innerHTML = `
        <span>Delivery Charge</span>
        <span>$${deliveryCharge.toFixed(2)}</span>
    `;
    itemsWrapper.appendChild(deliveryItem);

    // Add total
    const summaryTotal = document.createElement('div');
    summaryTotal.className = 'summary-total';
    summaryTotal.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
    `;
    itemsWrapper.appendChild(summaryTotal);

    // Append items wrapper to summary
    summaryContainer.appendChild(itemsWrapper);

    // Add payment button (outside the items wrapper, outside white background)
    const paymentBtn = document.createElement('button');
    paymentBtn.className = 'payment-btn';
    paymentBtn.textContent = 'Proceed to Payment';
    paymentBtn.addEventListener('click', () => {
        alert('Redirecting to payment page...');
        // window.location.href = 'payment.html';
    });
    summaryContainer.appendChild(paymentBtn);
}

// Change quantity (+1 or -1)
window.updateQuantity = function (id, change) {
    id = Number(id); // Ensure ID is a number
    const item = cart.find(i => Number(i.id) === id);
    if (!item) return;

    item.quantity += change;

    // If quantity becomes 0 or less, ask if user wants to delete item
    if (item.quantity < 1) {
        if (confirm("Remove this item from cart?")) {
            removeItem(id);
            return;
        } else {
            item.quantity = 1;
        }
    }

    saveCart();
    renderCart();
    renderOrderSummary();
};

// Remove an item from the cart
window.removeItem = function (id) {
    // Convert to number to ensure proper matching
    id = Number(id);
    cart = cart.filter(i => Number(i.id) !== id);
    saveCart();
    renderCart();
    renderOrderSummary();
};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tz_cart', JSON.stringify(cart));
}

// Update Item Size
window.updateItemSize = function (id, newSize, priceIncrease, basePrice) {
  id = Number(id);
  const item = cart.find(i => Number(i.id) === id);
  
  if (item) {
    item.size = newSize;
    item.price = basePrice + priceIncrease;
    item.originalPrice = basePrice;
    item.priceIncrease = priceIncrease;
    
    saveCart();
    renderCart();
    renderOrderSummary();
  }
};

// Run script when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
