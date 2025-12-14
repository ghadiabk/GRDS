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

// Function to find the SVG checkmark within a button
function getCheckmarkSVG(button) {
    if (button) {
        // Assuming your SVG has the class 'm'
        return button.querySelector('.m');
    }
    return null;
}

if (cashBtn) {
    cashBtn.addEventListener('click', function() {
        if (cardSection) {
            cardSection.style.display = 'none';
        }

        // 1. Select the new option (CASH)
        cashBtn.classList.add('selected-option');
        const cashSVG = getCheckmarkSVG(cashBtn);
        if (cashSVG) {
            cashSVG.style.display = 'inline-block'; // Show checkmark for selected option
        }

        // 2. Deselect the old option (CARD)
        if (cardBtn && cardBtn.classList.contains('selected-option')) {
            cardBtn.classList.remove('selected-option');
            const cardSVG = getCheckmarkSVG(cardBtn);
            if (cardSVG) {
                cardSVG.style.display = 'none'; // Hide checkmark for deselected option
            }
        }
    });
}

if (cardBtn) {
    cardBtn.addEventListener('click', function() {
        if (cardSection) {
            cardSection.style.display = 'block';
        }

        // 1. Select the new option (CARD)
        cardBtn.classList.add('selected-option');
        const cardSVG = getCheckmarkSVG(cardBtn);
        if (cardSVG) {
            cardSVG.style.display = 'inline-block'; // Show checkmark for selected option
        }

        // 2. Deselect the old option (CASH)
        if (cashBtn && cashBtn.classList.contains('selected-option')) {
            cashBtn.classList.remove('selected-option');
            const cashSVG = getCheckmarkSVG(cashBtn);
            if (cashSVG) {
                cashSVG.style.display = 'none'; // Hide checkmark for deselected option
            }
        }
    });
}
// 1. Get the submit button and all required input fields
    const submitBtn = document.querySelector('.submit-btn');

    // List of all required input IDs based on your HTML
    const requiredFields = [
        'first-name', 'last-name', 'phone', 'email',
        'region', 'city', 'street', 'apt', 'address'
    ];
    
    // Get the actual input elements
    const inputElements = requiredFields.map(id => document.getElementById(id));

    // 2. Add the event listener to the submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            
            // Assume the form is valid initially
            let isFormValid = true;

            // Simple function to show a basic error (you should style this better in CSS)
            function highlightError(inputElement, isValid) {
                if (isValid) {
                    inputElement.style.border = ''; // Remove error highlight
                } else {
                    inputElement.style.border = '2px solid red'; // Highlight error
                }
            }

            // 3. Loop through all required inputs and check if they are empty
            inputElements.forEach(input => {
                // Check if the input field exists and its value is empty or just whitespace
                if (input && input.value.trim() === '') {
                    isFormValid = false; // Mark form as invalid
                    highlightError(input, false); // Highlight the empty field
                } else if (input) {
                    highlightError(input, true); // Remove highlight if field is filled
                }
            });

            // 4. Handle the submission based on validation result
            if (isFormValid) {
            
                window.location.href = 'Confirmation.html';

            } else {
                // Form is NOT valid: Prevent the page from changing
                event.preventDefault(); 
                
                // Alert the user (A better UX would be to show an error message on the screen)
                alert('Please fill out all required fields marked with an asterisk (*).');
            }
        });
    }
});