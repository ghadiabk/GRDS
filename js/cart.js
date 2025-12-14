// Get elements from the page
const cartSectionEl = document.querySelector('.cart-section');
const orderSummaryEl = document.querySelector('.order-summary');

// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];

// Start the page
function init() {
    renderCart();
    renderOrderSummary();
    // Add event listener for size dropdowns (in case init runs after DOM load)
    document.querySelectorAll('.size-dropdown').forEach(dropdown => {
        if (!dropdown.dataset.listenerAttached) { // Prevent attaching multiple times
            dropdown.addEventListener('change', handleSizeChange);
            dropdown.dataset.listenerAttached = 'true';
        }
    });
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

    // Remove all existing cart items (and their note fields)
    document.querySelectorAll('.cart-item').forEach(item => item.remove());

    // If no items in cart, show message
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
        // Hide headers if cart is empty
        if (headersEl) headersEl.style.display = 'none';
        return;
    }
    
    // Show headers if cart is not empty
    if (headersEl) headersEl.style.display = 'grid';
    // Remove empty message if it exists
    document.querySelector('.cart-empty-message')?.remove();


    // Loop through each item and add it to the page
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        // Add a data attribute for easier identification
        itemEl.dataset.itemId = item.id;
        
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
            <input type="text" class="add-note" data-id="${item.id}" placeholder="Add A Note" value="${item.note || ''}">
        `;

        // Attach static event listeners for quantity and remove
        itemEl.querySelector('.remove-btn').addEventListener('click', () => removeItem(item.id));
        itemEl.querySelector('.qty-minus').addEventListener('click', () => updateQuantity(item.id, -1));
        itemEl.querySelector('.qty-plus').addEventListener('click', () => updateQuantity(item.id, 1));
        
        // Only attach size dropdown listener for cake items
        if (item.category === 'cakes') {
            const sizeDropdown = itemEl.querySelector('.size-dropdown');
            if (sizeDropdown) {
                // Use the globally defined function for event handling
                sizeDropdown.addEventListener('change', handleSizeChange);
            }
        }
        
        // Add listener for saving the note
        itemEl.querySelector('.add-note').addEventListener('change', (e) => updateItemNote(item.id, e.target.value));


        cartSectionEl.appendChild(itemEl);
    });
}

// Global handler for size change (to prevent re-rendering when adding listeners)
function handleSizeChange(e) {
    const id = e.target.dataset.id;
    const newSize = e.target.value;
    const sizePriceMap = { '9cm': 0, '15cm': 5, '30cm': 12 };
    
    // Find the base price from the cart item object
    const item = cart.find(i => Number(i.id) === Number(id));
    if (!item) return;

    // Use originalPrice if it exists, otherwise use the current price (assuming it's the base)
    // This logic ensures that once a size is changed, we always refer back to a fixed base price.
    const basePrice = item.originalPrice || item.basePrice || item.price;
    
    const priceIncrease = sizePriceMap[newSize];
    updateItemSize(Number(id), newSize, priceIncrease, basePrice);
}

// Render order summary
function renderOrderSummary() {
    const summaryContainer = document.querySelector('.order-summary');
    
    // Remove existing items (keep header)
    const existingSummaryItems = summaryContainer.querySelectorAll('.summary-item, .summary-total, .payment-btn, .summary-items-wrapper, .cart-empty-message');
    existingSummaryItems.forEach(item => item.remove());

    if (cart.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'cart-empty-message';
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
            <span>${item.name}${item.size ? ` (${item.size})` : ''} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        itemsWrapper.appendChild(summaryItem);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const deliveryCharge = 3.00;
    const total = subtotal + tax + deliveryCharge;
    
    // --- NEW: Object to store summary data for payment page ---
    const summaryData = {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: (item.price * item.quantity).toFixed(2),
            size: item.size || null,
            note: item.note || null
        }))
    };
    // --- END NEW ---
    
    // Add tax
    const taxItem = document.createElement('div');
    taxItem.className = 'summary-item';
    taxItem.innerHTML = `
        <span>Tax (${(taxRate * 100).toFixed(0)}%)</span>
        <span>$${tax.toFixed(2)}</span>
    `;
    itemsWrapper.appendChild(taxItem);


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

    // Add payment button
    const paymentBtn = document.createElement('button');
    paymentBtn.className = 'payment-btn';
    paymentBtn.textContent = 'Proceed to Payment';
    paymentBtn.addEventListener('click', () => {
        // --- MODIFIED: Save data before redirecting ---
        localStorage.setItem('payment_summary', JSON.stringify(summaryData));
        window.location.href = 'payment.html';
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
            removeItem(id); // removeItem will handle save/render
            return;
        } else {
            item.quantity = 1;
        }
    }

    // --- FIX: Update quantity in place to prevent scroll jump ---

    // 1. Find the specific cart item element
    // Query the element by its data-item-id
    const cartItemEl = document.querySelector(`.cart-item[data-item-id="${id}"]`);
    
    if (cartItemEl) {
        // 2. Update the quantity display
        cartItemEl.querySelector('.item-quantity span').textContent = item.quantity;

        // 3. Update the item price (if base price wasn't set previously)
        cartItemEl.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;

        // 4. Update the item total display
        const itemTotal = (item.price * item.quantity).toFixed(2);
        cartItemEl.querySelector('.item-total').textContent = `$${itemTotal}`;
    }
    
    // 5. Save the cart and render the summary
    saveCart();
    renderOrderSummary();
};

// Remove an item from the cart
window.removeItem = function (id) {
    // Convert to number to ensure proper matching
    id = Number(id);
    
    // Find and visually remove the item from the DOM
    const itemEl = document.querySelector(`.cart-item[data-item-id="${id}"]`);
    if (itemEl) {
        itemEl.remove();
    }
    
    cart = cart.filter(i => Number(i.id) !== id);
    saveCart();
    renderCart(); // This call will re-render if the cart is now empty
    renderOrderSummary();
};

// Update Item Size
window.updateItemSize = function (id, newSize, priceIncrease, basePrice) {
  id = Number(id);
  const item = cart.find(i => Number(i.id) === id);
  
  if (item) {
    item.size = newSize;
    // Set basePrice property if it doesn't exist, for future reference
    item.basePrice = item.basePrice || basePrice; 
    item.price = item.basePrice + priceIncrease; // Calculate new price
    
    // --- FIX: Update size and price in place to prevent scroll jump ---

    const cartItemEl = document.querySelector(`.cart-item[data-item-id="${id}"]`);

    if (cartItemEl) {
        // Update price column
        cartItemEl.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;
        
        // Update item total column
        const itemTotal = (item.price * item.quantity).toFixed(2);
        cartItemEl.querySelector('.item-total').textContent = `$${itemTotal}`;
    }
    
    saveCart();
    renderOrderSummary();
  }
};

// Update Item Note
window.updateItemNote = function(id, note) {
    id = Number(id);
    const item = cart.find(i => Number(i.id) === id);
    if (item) {
        item.note = note.trim();
        saveCart();
    }
};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tz_cart', JSON.stringify(cart));
}

// Run script when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}