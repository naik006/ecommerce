// Navbar Script - Handles user profile and dropdown menu

document.addEventListener('DOMContentLoaded', () => {
    // Safety check - ensure authManager is initialized
    if (typeof authManager === 'undefined') {
        console.error('authManager not initialized. Make sure auth.js is loaded before navbar.js');
        return;
    }

    // Update navbar based on login status
    updateNavbar();

    // Setup dropdown menu
    const userProfileBtn = document.getElementById('userProfileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userProfileBtn && dropdownMenu) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Only toggle if user is logged in
            if (authManager.isLoggedIn()) {
                dropdownMenu.classList.toggle('show');
            } else {
                // Redirect to login if not logged in
                window.location.href = 'login.html';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });

        // Setup logout button in dropdown
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
});

function updateNavbar() {
    // Safety check
    if (typeof authManager === 'undefined') {
        console.error('authManager not initialized');
        return;
    }

    const userProfileBtn = document.getElementById('userProfileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const profileLink = document.getElementById('profileLink');
    const userName = document.getElementById('userName');
    const userMenu = document.querySelector('.user-menu');

    if (!authManager.isLoggedIn()) {
        // User not logged in
        if (userMenu) {
            userMenu.classList.add('not-logged-in');
        }
        if (userProfileBtn) {
            userProfileBtn.style.cursor = 'pointer';
            userProfileBtn.textContent = '🔐 Login';
            userProfileBtn.style.gap = '8px';
            userProfileBtn.style.display = 'flex';
            userProfileBtn.style.alignItems = 'center';
        }
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    } else {
        // User logged in
        const user = authManager.getCurrentUser();
        if (userMenu) {
            userMenu.classList.remove('not-logged-in');
        }
        if (userProfileBtn) {
            userProfileBtn.style.cursor = 'pointer';
            userProfileBtn.innerHTML = '<span class="user-avatar">👤</span><span id="userName">' + (user.name.split(' ')[0] || 'User') + '</span>';
        }
        
        // Hide profile link, show only logout
        if (profileLink) {
            profileLink.style.display = 'none';
        }
        
        // Show dropdown menu
        if (dropdownMenu) {
            dropdownMenu.style.display = 'block';
        }
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        
        // Update navbar immediately
        updateNavbar();
        
        // Show alert
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success';
        alertBox.textContent = 'Logged out successfully';
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.classList.add('show');
        }, 10);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}
