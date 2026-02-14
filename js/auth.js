// Mock User Database
const mockUsers = [
    {
        id: 1,
        name: 'Gowtham Kumar',
        mobile: '9391852823',
        email: 'gowthamkumarnaikb143@gmail.com',
        password: '',
        isRegistered: false,
        createdAt: '2025-01-15'
    },
    {
        id: 2,
        name: 'Ananya Singh',
        mobile: '9876543210',
        email: 'ananya.singh@example.com',
        password: 'Password@123',
        isRegistered: true,
        createdAt: '2025-01-20'
    },
    {
        id: 3,
        name: 'Rajesh Patel',
        mobile: '9123456789',
        email: 'rajesh.patel@example.com',
        password: 'Password@123',
        isRegistered: true,
        createdAt: '2025-02-01'
    }
];

// OTP Storage (in real app, this would come from backend)
const otpStorage = {};

class AuthManager {
    constructor() {
        this.currentUser = this.loadUser();
    }

    // Generate mock OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP to mobile (mock implementation)
    sendOTP(mobileNumber) {
        const otp = this.generateOTP();
        otpStorage[mobileNumber] = {
            otp: otp,
            timestamp: Date.now(),
            attempts: 0
        };

        console.log(`[Mock] OTP sent to ${mobileNumber}: ${otp}`);
        
        // For demo: preset OTP
        if (mobileNumber === '9391852823') {
            otpStorage[mobileNumber].otp = '123456';
        }

        return true;
    }

    // Verify OTP
    verifyOTP(mobileNumber, otp) {
        const storedOTP = otpStorage[mobileNumber];

        if (!storedOTP) {
            return { success: false, message: 'OTP not found. Please request a new OTP.' };
        }

        // Check if OTP expired (5 minutes)
        const timeDiff = (Date.now() - storedOTP.timestamp) / 1000 / 60;
        if (timeDiff > 5) {
            return { success: false, message: 'OTP expired. Please request a new one.' };
        }

        // Check attempts (max 3)
        if (storedOTP.attempts >= 3) {
            return { success: false, message: 'Too many attempts. Please request a new OTP.' };
        }

        if (storedOTP.otp !== otp) {
            storedOTP.attempts++;
            return { success: false, message: 'Invalid OTP. Please try again.' };
        }

        // OTP verified - check if user exists
        const existingUser = mockUsers.find(u => u.mobile === mobileNumber);
        
        if (existingUser && existingUser.isRegistered) {
            // Existing registered user - login directly
            return this.loginUser(existingUser);
        }

        // New user - return temp user info for client-side flow (no localStorage persistence)
        const tempUser = {
            mobile: mobileNumber,
            name: 'User ' + mobileNumber.slice(-4),
            email: `user${mobileNumber}@avalfashions.com`
        };

        return {
            success: true,
            isNewUser: true,
            message: 'OTP verified! Please set up your password.',
            tempUser: tempUser
        };
    }

    // Register user with password (after OTP verification)
    registerWithPassword(mobile, password) {
        // Check if mobile already registered
        const existingUser = mockUsers.find(u => u.mobile === mobile);
        
        if (existingUser && existingUser.isRegistered) {
            return { success: false, message: 'This mobile number is already registered. Please login instead.' };
        }

        // Password validation
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/.test(password)) {
            return { success: false, message: 'Password must contain at least one uppercase letter, one number, and one special character.' };
        }

        // Create new registered user (no tempRegistration dependency)
        const newUser = {
            id: mockUsers.length + 1,
            name: 'User ' + mobile.slice(-4),
            mobile: mobile,
            email: `user${mobile}@avalfashions.com`,
            password: password,
            isRegistered: true,
            loginMethod: 'password',
            createdAt: new Date().toISOString().split('T')[0]
        };

        mockUsers.push(newUser);

        return {
            success: true,
            message: 'Registration successful!',
            user: newUser
        };
    }

    // Direct registration (no OTP) - receives object {name,mobile,email,password}
    registerDirect({ name, mobile, email, password }) {
        // Check if mobile already registered
        const existingUser = mockUsers.find(u => u.mobile === mobile && u.isRegistered);
        if (existingUser) {
            return { success: false, message: 'This mobile number is already registered. Please login.' };
        }

        // Basic password validation
        if (!password || password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }
        if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/.test(password)) {
            return { success: false, message: 'Password must contain at least one uppercase letter, one number, and one special character.' };
        }

        const newUser = {
            id: mockUsers.length + 1,
            name: name || ('User ' + mobile.slice(-4)),
            mobile: mobile,
            email: email || `user${mobile}@avalfashions.com`,
            password: password,
            isRegistered: true,
            loginMethod: 'password',
            createdAt: new Date().toISOString().split('T')[0]
        };

        mockUsers.push(newUser);
        return { success: true, message: 'Registration successful', user: newUser };
    }

    // Send OTP for registration only
    sendRegistrationOTP(mobile) {
        const m = (mobile || '').trim();
        if (!m || m.length !== 10) return { success: false, message: 'Provide a valid 10-digit mobile number.' };

        if (this.isMobileRegistered(m)) return { success: false, message: 'Mobile already registered. Please login.' };

        this.sendOTP(m);
        return { success: true, message: 'OTP sent for registration.' };
    }

    // Verify registration OTP and return temporary registration data
    verifyRegistrationOTP(mobile, otp, extraData = {}) {
        const m = (mobile || '').trim();
        if (!m || m.length !== 10) return { success: false, message: 'Invalid mobile identifier.' };

        const storedOTP = otpStorage[m];
        if (!storedOTP) return { success: false, message: 'OTP not found. Request a new OTP.' };

        // Check expiry (5 minutes)
        const timeDiff = (Date.now() - storedOTP.timestamp) / 1000 / 60;
        if (timeDiff > 5) return { success: false, message: 'OTP expired. Request a new OTP.' };

        if (storedOTP.attempts >= 3) return { success: false, message: 'Too many attempts. Request a new OTP.' };

        if (storedOTP.otp !== otp) {
            storedOTP.attempts++;
            return { success: false, message: 'Invalid OTP.' };
        }

        // OTP valid — create temporary registration object (not persisted here)
        const tempUser = {
            mobile: m,
            email: extraData.email || '',
            name: extraData.name || ('User ' + m.slice(-4)),
            verifiedAt: new Date().toISOString()
        };

        // Remove used OTP to enforce one-time usage
        delete otpStorage[m];

        return { success: true, message: 'OTP verified. Continue with password setup.', tempUser };
    }

    // Login with mobile and password
    loginWithPassword(mobile, password) {
        const user = mockUsers.find(u => u.mobile === mobile);

        if (!user) {
            return { success: false, message: 'Mobile number not found. Please register first.' };
        }

        if (!user.isRegistered) {
            return { success: false, message: 'Please complete registration by setting a password.' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }

        return this.loginUser(user);
    }

    // Check if mobile number is registered
    isMobileRegistered(mobile) {
        const user = mockUsers.find(u => u.mobile === mobile);
        return user && user.isRegistered;
    }

    // Check if mobile already exists (for registration validation)
    mobileAlreadyExists(mobile) {
        return mockUsers.some(u => u.mobile === mobile && u.isRegistered);
    }

    // Google Login (mock)
    loginWithGoogle(profile) {
        let user = mockUsers.find(u => u.email === profile.email);

        if (!user) {
            user = {
                id: mockUsers.length + 1,
                name: profile.name,
                mobile: profile.phone || 'Not provided',
                email: profile.email,
                createdAt: new Date().toISOString().split('T')[0],
                loginMethod: 'google',
                isRegistered: true
            };
            mockUsers.push(user);
        }

        return this.loginUser(user);
    }

    // Login user
    loginUser(user) {
        this.currentUser = {
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            loginTime: new Date().toLocaleString(),
            loginMethod: user.loginMethod || 'mobile-otp'
        };

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('userLoginTime', new Date().getTime().toString());

        return {
            success: true,
            message: `Welcome ${user.name}!`,
            user: this.currentUser
        };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userLoginTime');
        return { success: true, message: 'Logged out successfully' };
    }

    // Load user from localStorage
    loadUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check mobile number exists
    mobileExists(mobile) {
        return mockUsers.some(u => u.mobile === mobile);
    }

    // Get session duration
    getSessionDuration() {
        const loginTime = localStorage.getItem('userLoginTime');
        if (!loginTime) return null;

        const duration = Math.floor((Date.now() - parseInt(loginTime)) / 1000);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);

        return `${hours}h ${minutes}m`;
    }
}

// Create global auth instance
const authManager = new AuthManager();
