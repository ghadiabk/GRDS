document.addEventListener("DOMContentLoaded", function() {
    
    const summaryDataString = localStorage.getItem('payment_summary');
    
    if (summaryDataString) {
        const summary = JSON.parse(summaryDataString);
        
        // Target elements in the HTML sidebar
        const itemsListEl = document.getElementById('summary-items-list');
        const deliveryChargeEl = document.getElementById('summary-delivery-charge');
        const totalEl = document.getElementById('summary-total');
        
        // Find the parent container of the Total element (usually the <aside> itself)
        const totalParent = totalEl ? totalEl.parentElement.parentElement : null;


        // Clear any placeholder/static items (if they exist)
        itemsListEl.innerHTML = ''; 

        // 2. Render the actual cart items
        summary.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            itemEl.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            itemsListEl.appendChild(itemEl);
        });
        if (deliveryChargeEl) {
            deliveryChargeEl.textContent = `$${summary.deliveryCharge}`;
        }
        if (totalEl) {
            totalEl.textContent = `$${summary.total}`;
        }
        
    
        const deliveryChargeRow = deliveryChargeEl ? deliveryChargeEl.parentElement : null;
        
        if (deliveryChargeRow && totalParent) {
             const finalSeparator = document.createElement('hr');
             deliveryChargeRow.insertAdjacentElement('afterend', finalSeparator);
        } else {
             console.warn("Could not find required elements to place final separator correctly.");
        }
        
    } else {
        console.error('No order summary data found in localStorage.');
    }
    
    // ======================================
    // PAYMENT METHOD TOGGLE
    // ======================================
    
    const cashBtn = document.getElementById('cash-btn');
    const cardBtn = document.getElementById('card-btn');
    const cardSection = document.getElementById('card-details-section');
if (cashBtn) {
        cashBtn.addEventListener('click', function() {
            if (cardSection) {
                cardSection.style.display = 'none';
            }
            
            cashBtn.classList.add('selected-option');
            if (cardBtn) {
                cardBtn.classList.remove('selected-option');
            }
        });
    }

    if (cardBtn) {
        cardBtn.addEventListener('click', function() {
            if (cardSection) {
                cardSection.style.display = 'block';
            }
            
            cardBtn.classList.add('selected-option');
            if (cashBtn) {
                cashBtn.classList.remove('selected-option');
            }
        });
    }
});