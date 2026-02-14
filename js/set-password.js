document.addEventListener('DOMContentLoaded', () => {
    const temp = sessionStorage.getItem('tempRegistration');
    const infoDiv = document.getElementById('accountInfo');
    const form = document.getElementById('setPasswordForm');

    if (!temp) {
        if (infoDiv) infoDiv.innerHTML = '<p style="color:#e74c3c;font-weight:600">No verified registration found. Please register first.</p>';
        return;
    }

    const tempData = JSON.parse(temp);
    const display = [];
    if (tempData.name) display.push(`<div><strong>Name:</strong> ${tempData.name}</div>`);
    if (tempData.mobile) display.push(`<div><strong>Mobile:</strong> ${tempData.mobile}</div>`);
    if (tempData.email) display.push(`<div><strong>Email:</strong> ${tempData.email}</div>`);
    infoDiv.innerHTML = display.join('');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = document.getElementById('newPassword').value;
        const cpw = document.getElementById('confirmNewPassword').value;

        if (!pw || !cpw) { showAlert('Enter both password fields', 'error'); return; }
        if (pw !== cpw) { showAlert('Passwords do not match', 'error'); return; }
        if (pw.length < 6 || !/(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/.test(pw)) {
            showAlert('Password must be 6+ chars, include uppercase, number and special char', 'error');
            return;
        }

        // Register user using registerDirect; prefer mobile if present
        const payload = {
            name: tempData.name,
            mobile: tempData.mobile || '',
            email: tempData.email || '',
            password: pw
        };

        const res = authManager.registerDirect(payload);
        if (!res.success) { showAlert(res.message, 'error'); return; }

        // Clear temp and auto-login
        sessionStorage.removeItem('tempRegistration');
        authManager.loginUser(res.user);
        showAlert('Password set and account created. Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    });
});

function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => { alertBox.classList.add('show'); }, 10);
    setTimeout(() => { alertBox.classList.remove('show'); setTimeout(() => alertBox.remove(), 300); }, 3000);
}
