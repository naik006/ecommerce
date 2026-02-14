// Profile Page Script
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!authManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authManager.getCurrentUser();

    // Display user information
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('memberSince').textContent = user.createdAt || new Date().toISOString().split('T')[0];
    
    document.getElementById('infoName').textContent = user.name;
    document.getElementById('infoMobile').textContent = user.mobile || 'Not provided';
    document.getElementById('infoEmail').textContent = user.email || 'Not provided';
    document.getElementById('infoLoginMethod').textContent = formatLoginMethod(user.loginMethod);
    document.getElementById('infoLoginTime').textContent = user.loginTime || new Date().toLocaleString();
    
    // Update session duration every second
    updateSessionDuration();
    setInterval(updateSessionDuration, 1000);

    // Event listeners
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        showAlert('Profile editing coming soon!', 'info');
    });

    document.getElementById('logoutProfileBtn').addEventListener('click', logout);

    // Load mock orders
    loadMockOrders();
});

function updateSessionDuration() {
    const duration = authManager.getSessionDuration();
    if (duration) {
        document.getElementById('infoSessionDuration').textContent = duration;
    }
}

function formatLoginMethod(method) {
    const methods = {
        'mobile-otp': 'Mobile OTP',
        'google': 'Google Login',
        'email': 'Email/Password'
    };
    return methods[method] || 'Mobile OTP';
}

function loadMockOrders() {
    const ordersList = document.getElementById('ordersList');
    const cartItems = localStorage.getItem('cart');

    if (!cartItems || JSON.parse(cartItems).length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No orders yet. <a href="products.html" style="color: #667eea; text-decoration: none;">Start shopping!</a></p>';
        return;
    }

    // Show mock orders based on cart items
    const items = JSON.parse(cartItems);
    let ordersHTML = '';

    items.slice(0, 3).forEach((item, index) => {
        const orderId = `ORD-${Date.now() - (index * 86400000)}-${index}`;
        const orderDate = new Date(Date.now() - (index * 86400000)).toLocaleDateString();
        const orderAmount = (item.price * item.quantity).toLocaleString('en-IN', { 
            style: 'currency', 
            currency: 'INR',
            minimumFractionDigits: 0 
        });

        ordersHTML += `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-id">${orderId}</div>
                    <div class="order-date">${orderDate}</div>
                </div>
                <div class="order-amount">${orderAmount}</div>
                <div class="order-status ${index === 0 ? 'completed' : 'pending'}">
                    ${index === 0 ? 'Delivered' : 'Processing'}
                </div>
            </div>
        `;
    });

    if (ordersHTML) {
        ordersList.innerHTML = ordersHTML;
    }
}

function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);

    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => alertBox.remove(), 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        showAlert('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}
