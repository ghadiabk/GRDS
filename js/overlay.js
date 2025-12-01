document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIN & PROFILE MODAL LOGIC ---

    // 1. Existing Login Modal Elements
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.querySelector('.close-modal');
    const loginForm = document.querySelector('.login-form');

    // GET LOGIN INPUTS (We need to select them to read their values)
    // Assuming the first input is username/email and second is password based on your CSS structure
    const loginEmailInput = loginForm.querySelector('input[type="text"]');
    const loginPasswordInput = loginForm.querySelector('input[type="password"]');


    // 2. New Profile Modal Elements
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.querySelector('.close-profile-modal');
    const signOutBtn = document.getElementById('signOutBtn');

    // GET PROFILE INPUTS (Where we will put the data)
    const profileEmailField = document.getElementById('profile-email');
    const profilePasswordField = document.getElementById('profile-password');


    // --- Functions to Open/Close Modals ---
    function openModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }


    // --- Event Listeners ---

    if (loginBtn && loginModal) {
        // Open Login Modal
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });

        // Close Login Modal via 'X'
        closeLoginModal.addEventListener('click', () => {
            closeModal(loginModal);
        });
    }


    // --- THE MAIN HANDLER: LOGIN FORM SUBMISSION ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop refresh

            alert("Login successful!");

            // A. CAPTURE DATA: Get values from login inputs
            // Using "Guest" as a fallback if they didn't type anything for this demo
            const capturedEmail = loginEmailInput.value || "guest@example.com";
            // We usually don't show passwords, but for this demo to show data transfer:
            const capturedPassword = loginPasswordInput.value || "********";

            // B. INJECT DATA: Populate the Profile Modal fields
            profileEmailField.value = capturedEmail;
            profilePasswordField.value = capturedPassword;

            // Note: Since the login form doesn't ask for First/Last name,
            // we are leaving the default "Dana Shaar" placeholders in the HTML.
            // In a real app, you'd fetch that from a database.

            // C. SWITCH MODALS: Hide login, Show profile
            closeModal(loginModal);
            openModal(profileModal);
        });
    }


    // --- Profile Modal Event Listeners ---

    if (profileModal) {
        // Close Profile via 'X'
        closeProfileModal.addEventListener('click', () => {
            closeModal(profileModal);
        });

        // Close Profile via 'Sign Out' button
        signOutBtn.addEventListener('click', () => {
             // Since data is temporary JS variables, closing it effectively resets it for the next login attempt
            closeModal(profileModal);
            alert("You have been signed out.");
             // Optional: Clear the login forms for next time
             loginForm.reset();
        });

        // General Window Click (closes whichever modal is open if clicked outside content)
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeModal(loginModal);
            }
            if (e.target === profileModal) {
                closeModal(profileModal);
            }
        });
    }
});