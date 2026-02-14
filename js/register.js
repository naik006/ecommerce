// Registration page script — mobile/email OTP flow, then redirect to set-password page
document.addEventListener('DOMContentLoaded', () => {
	const sendRegOtpBtn = document.getElementById('sendRegOtpBtn');
	const regMobile = document.getElementById('regMobile');
	const regEmail = document.getElementById('regEmail');
	const regName = document.getElementById('regName');
	const regOtpSection = document.getElementById('regOtpSection');
	const regOtpInput = document.getElementById('regOtpInput');
	const verifyRegOtpBtn = document.getElementById('verifyRegOtpBtn');
	const resendRegOtpBtn = document.getElementById('resendRegOtpBtn');
	const regOtpTimer = document.getElementById('regOtpTimer');
	const regSentMsg = document.getElementById('regSentMsg');

	let regOtpInterval = null;
	let regOtpTimeLeft = 0;
	let lastIdentifier = '';
	const regOtpError = document.getElementById('regOtpError');

	function startRegOtpTimer(seconds = 300) {
		clearInterval(regOtpInterval);
		regOtpTimeLeft = seconds;
		regOtpTimer.textContent = `OTP expires in: ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
		regOtpInterval = setInterval(() => {
			regOtpTimeLeft--;
			const m = Math.floor(regOtpTimeLeft / 60);
			const s = regOtpTimeLeft % 60;
			regOtpTimer.textContent = `OTP expires in: ${m}:${String(s).padStart(2,'0')}`;
			if (regOtpTimeLeft <= 0) {
				clearInterval(regOtpInterval);
				regOtpTimer.textContent = 'OTP expired';
				resendRegOtpBtn.classList.add('hidden');
			}
		}, 1000);
	}

	const regMobileError = document.getElementById('regMobileError');
	if (regMobile) regMobile.addEventListener('input', () => {
		regMobile.value = regMobile.value.replace(/\D/g, '').slice(0,10);
		if (regMobileError) { regMobileError.textContent = ''; regMobileError.classList.add('hidden'); }
	});

	if (sendRegOtpBtn) {
		sendRegOtpBtn.addEventListener('click', () => {
			const mobile = regMobile.value.trim();
			const name = regName.value.trim();

			if (!mobile) {
				if (regMobileError) { regMobileError.textContent = 'Please fill the mobile number'; regMobileError.classList.remove('hidden'); }
				return;
			}
			if (mobile.length !== 10) {
				if (regMobileError) { regMobileError.textContent = 'Enter a valid 10-digit mobile number'; regMobileError.classList.remove('hidden'); }
				return;
			}

			const resp = authManager.sendRegistrationOTP(mobile);
			if (!resp.success) { showAlert(resp.message, 'error'); return; }

			if (regMobileError) { regMobileError.textContent = ''; regMobileError.classList.add('hidden'); }
			showAlert('OTP sent to mobile (demo OTP: 123456)', 'success');
			regSentMsg.textContent = `OTP sent to ${mobile}`;
			regOtpSection.classList.remove('hidden');
			resendRegOtpBtn.classList.remove('hidden');
			lastIdentifier = mobile;
			startRegOtpTimer(300);
		});
	}

	if (resendRegOtpBtn) {
		resendRegOtpBtn.addEventListener('click', () => {
			if (!lastIdentifier) return;
			const resp = authManager.sendRegistrationOTP(lastIdentifier);
			if (!resp.success) { showAlert(resp.message, 'error'); return; }
			showAlert('OTP resent (demo OTP: 123456)', 'success');
			startRegOtpTimer(300);
		});
	}

	if (verifyRegOtpBtn) {
		verifyRegOtpBtn.addEventListener('click', () => {
			const otp = regOtpInput.value.trim();
			if (!lastIdentifier) { showAlert('No OTP request in progress', 'error'); return; }
			if (!otp || otp.length !== 6) { showAlert('Enter valid 6-digit OTP', 'error'); return; }
			const resp = authManager.verifyRegistrationOTP(lastIdentifier, otp, { name: regName.value.trim() });
			if (!resp.success) {
				// If the failure is due to an invalid OTP, show 'Invalid OTP' below the OTP box
				if ((resp.message || '').toLowerCase().includes('invalid')) {
					if (regOtpError) { regOtpError.textContent = 'Invalid OTP'; regOtpError.classList.remove('hidden'); }
				} else {
					showAlert(resp.message, 'error');
				}
				return;
			}

			// clear any otp error
			if (regOtpError) { regOtpError.textContent = ''; regOtpError.classList.add('hidden'); }

			// store temp registration in sessionStorage and redirect to set-password page
			sessionStorage.setItem('tempRegistration', JSON.stringify(resp.tempUser));
			showAlert('OTP verified', 'success');
			setTimeout(() => { window.location.href = 'set-password.html'; }, 800);
		});
	}

	// Clear OTP error while user types
	if (regOtpInput) {
		regOtpInput.addEventListener('input', () => {
			if (regOtpError) { regOtpError.textContent = ''; regOtpError.classList.add('hidden'); }
		});
	}
});

function showAlert(message, type = 'info') {
	const alertBox = document.createElement('div');
	alertBox.className = `alert alert-${type}`;
	alertBox.textContent = message;
	document.body.appendChild(alertBox);
	setTimeout(() => { alertBox.classList.add('show'); }, 10);
	setTimeout(() => { alertBox.classList.remove('show'); setTimeout(() => alertBox.remove(), 300); }, 3000);
}
