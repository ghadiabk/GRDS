document.addEventListener('DOMContentLoaded', () => {
 
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('navOverlay');

    function toggleMenu() {
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
        burgerBtn.classList.toggle('hidden');
        
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    }

    // Open Menu
    if(burgerBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
    }

    // Close Menu (X button)
    if(closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Close Menu (Clicking outside on the overlay)
    if(overlay) {
        overlay.addEventListener('click', toggleMenu);
    }
});