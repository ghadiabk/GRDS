document.addEventListener('DOMContentLoaded', () => {
    
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('closeBtn');
     const overlay = document.getElementById('navOverlay');

     function toggleMenu() {
        mainNav.classList.toggle('active');     // <--- Toggles .main-nav.active
        overlay.classList.toggle('active');     // <--- Toggles .nav-overlay.active
        burgerBtn.classList.toggle('hidden');   // <--- Toggles .burger-menu.hidden
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
     }

 if(burgerBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
 }

 if(closeBtn) {
 closeBtn.addEventListener('click', toggleMenu);
 }

 if(overlay) {
 overlay.addEventListener('click', toggleMenu);
 }
});