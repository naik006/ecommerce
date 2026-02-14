// DOM Elements (password login + google)
const passwordForm = document.getElementById('passwordForm');
const passwordMobileInput = document.getElementById('passwordMobile');
const passwordInput = document.getElementById('passwordInput');
const togglePasswordLogin = document.getElementById('togglePasswordLogin');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const signupLink = document.getElementById('signupLink');

// Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        googleLoginBtn.disabled = true;
        googleLoginBtn.textContent = 'Redirecting to Google...';

        setTimeout(() => {
            const mockGoogleProfile = {
                name: 'Ananya Google User',
                email: 'user.google@gmail.com',
                phone: '9876543210'
            };

            const result = authManager.loginWithGoogle(mockGoogleProfile);
            if (result.success) {
                showAlert(result.message, 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            }
        }, 800);
    });
}

// Signup Link -> go to register page
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'register.html';
    });
}

// OTP Timer
function startOTPTimer() {
    otpTimeLeft = 300;
    
    if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
    }

    otpTimerInterval = setInterval(() => {
        otpTimeLeft--;
        
        const minutes = Math.floor(otpTimeLeft / 60);
        const seconds = otpTimeLeft % 60;

        otpTimer.textContent = `OTP expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (otpTimeLeft <= 0) {
            clearInterval(otpTimerInterval);
            otpTimer.textContent = 'OTP expired. Please request a new one.';
            otpTimer.style.color = '#e74c3c';
            otpInput.disabled = true;
            otpForm.querySelector('button[type="submit"]').disabled = true;
        } else if (otpTimeLeft <= 60) {
            otpTimer.style.color = '#e74c3c';
        }
    }, 1000);

    updateResendButtonState();
}

// Update Resend Button State
function updateResendButtonState() {
    if (otpTimeLeft > 0 && otpTimeLeft % 2 === 0) {
        resendOtpBtn.disabled = otpTimeLeft > 30; // Enable after 4:30
    }
}

// Alert Notification
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

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (authManager.isLoggedIn()) {
        showAlert('You are already logged in!', 'info');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        return;
    }

    // Normalize mobile input
    if (passwordMobileInput) {
        passwordMobileInput.addEventListener('input', () => {
            // keep digits only and limit to 10 characters
            passwordMobileInput.value = passwordMobileInput.value.replace(/\D/g, '').slice(0, 10);
            // clear inline mobile error when user types
            const mobErr = document.getElementById('mobileError');
            if (mobErr) { mobErr.textContent = ''; mobErr.classList.add('hidden'); }
        });
    }

    // Toggle password visibility
    if (togglePasswordLogin && passwordInput) {
        togglePasswordLogin.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePasswordLogin.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    // Password login form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordLogin);
    }
});

function handlePasswordLogin(e) {
    e.preventDefault();

    const mobile = document.getElementById('passwordMobile').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (!mobile || mobile.length !== 10) {
        showAlert('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    if (!password) {
        showAlert('Please enter your password', 'error');
        return;
    }

    const result = authManager.loginWithPassword(mobile, password);

    if (result.success) {
        showAlert(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        const registered = authManager.isMobileRegistered(mobile);
        if (!registered) {
            // show inline error above mobile input
            const mobErr = document.getElementById('mobileError');
            if (mobErr) {
                mobErr.textContent = 'Invalid credentials';
                mobErr.classList.remove('hidden');
            } else {
                showAlert('Invalid credentials', 'error');
            }
            const mobInput = document.getElementById('passwordMobile');
            if (mobInput) mobInput.focus();
        } else {
            showAlert(result.message, 'error');
        }
    }
}
