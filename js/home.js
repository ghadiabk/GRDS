document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pages = document.querySelectorAll('.review-page');
    
    let currentPage = 0;

    // Initial Button State
    updateButtons();

    function updateButtons() {
        if (currentPage === 0) {
            // Start: Hide Left, Show Right
            prevBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
        } else if (currentPage === pages.length - 1) {
            // End: Show Left, Hide Right
            prevBtn.classList.remove('hidden');
            nextBtn.classList.add('hidden');
        } else {
            // Middle: Show Both
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        }
    }

    function switchPage(direction) {
        const currentEl = pages[currentPage];
        let nextIndex;

        // 1. Determine direction and set exit animation
        if (direction === 'next') {
            nextIndex = currentPage + 1;
            
            // Current page exits to the LEFT
            currentEl.classList.remove('active-page');
            currentEl.classList.add('exit-left');

        } else {
            nextIndex = currentPage - 1;
            
            // Current page exits to the RIGHT
            currentEl.classList.remove('active-page');
            currentEl.classList.add('exit-right');
        }

        const nextEl = pages[nextIndex];

        // 2. Wait for Exit Animation to finish (500ms matches CSS transition)
        setTimeout(() => {
            // Clean up old page
            currentEl.style.display = 'none';
            currentEl.classList.remove('exit-left', 'exit-right');

            // 3. Prepare New Page
            nextEl.style.display = 'grid';
            
            // Set start position based on direction
            if (direction === 'next') {
                nextEl.classList.add('start-right'); // Start from right
            } else {
                nextEl.classList.add('start-left'); // Start from left
            }

            // Force browser reflow (so it registers the start position before we animate to center)
            void nextEl.offsetWidth; 

            // 4. Animate In
            nextEl.classList.remove('start-right', 'start-left');
            nextEl.classList.add('active-page');
            
            // Update tracker
            currentPage = nextIndex;
            updateButtons();

        }, 500); 
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            switchPage('next');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            switchPage('prev');
        }
    });
});