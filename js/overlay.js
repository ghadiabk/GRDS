document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIN MODAL LOGIC (New Code) ---
    const loginBtn = document.querySelector('.login-btn'); // The button in header
    const modal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');

    if(loginBtn && modal) {
        // Open Modal
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop it from going to login.html
            modal.style.display = 'flex';
        });

        // Close Modal via 'X'
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close Modal via clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the page from refreshing
            alert("Login successful!");
            modal.style.display = 'none';
        });
    }
});