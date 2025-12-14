 document.addEventListener("DOMContentLoaded", function() {
      const summaryDataString = localStorage.getItem('payment_summary');
    
    if (summaryDataString) {
        const summary = JSON.parse(summaryDataString);
        
        const itemsListEl = document.getElementById('summary-items-list');
        const deliveryChargeEl = document.getElementById('summary-delivery-charge');
        const totalEl = document.getElementById('summary-total');

        // Clear existing static items (if any)
        itemsListEl.innerHTML = ''; 

        // 2. Render the actual cart items
        summary.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            // Display item name and price
            itemEl.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.total}</span>
            `;
            itemsListEl.appendChild(itemEl);
        });

        // 3. Update the delivery charge and total
        deliveryChargeEl.textContent = `$${summary.deliveryCharge}`;
        totalEl.textContent = `$${summary.total}`;

        // Optional: Add a visual separator if items are rendered dynamically
        const separator = document.createElement('hr');
        itemsListEl.appendChild(separator);

    } else {
        // Handle case where no data is found (e.g., redirect back to cart)
        console.error('No order summary data found in localStorage.');
        // alert('Your cart session expired. Returning to cart page.');
        // window.location.href = 'cart.html'; 
    }
    // Select elements
        const cashBtn = document.getElementById('cash-btn');
        const cardBtn = document.getElementById('card-btn');
        const cardSection = document.getElementById('card-details-section');

        // Function to switch to Cash
        cashBtn.addEventListener('click', function() {
            // Hide card section
            cardSection.style.display = 'none';
            
            // Update button styles
            cashBtn.classList.add('selected-option');
            cardBtn.classList.remove('selected-option');
        });

        // Function to switch to Card
        cardBtn.addEventListener('click', function() {
            // Show card section
            cardSection.style.display = 'block';
            
            // Update button styles
            cardBtn.classList.add('selected-option');
            cashBtn.classList.remove('selected-option');
        });
        
    });
  