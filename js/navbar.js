// Navbar Script - Handles user profile and dropdown menu

document.addEventListener('DOMContentLoaded', () => {
    // Update navbar based on login status
    updateNavbar();

    // Setup dropdown menu
    const userProfileBtn = document.getElementById('userProfileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userProfileBtn && dropdownMenu) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
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
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userName = document.getElementById('userName');
    const navLinks = document.querySelector('.nav-links');

    if (!authManager.isLoggedIn()) {
        // User not logged in - show Login button
        if (userProfileBtn) {
            userProfileBtn.innerHTML = '<a href="login.html" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 8px;">🔐 <span>Login</span></a>';
        }
    } else {
        // User logged in - show user name and dropdown
        const user = authManager.getCurrentUser();
        if (userName) {
            userName.textContent = user.name.split(' ')[0]; // Show first name
        }
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        
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
