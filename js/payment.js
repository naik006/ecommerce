// Payment Page Functionality
class PaymentHandler {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Initialize payment page
    init() {
        this.validateCartNotEmpty();
        this.setupEventListeners();
        this.populateOrderSummary();
        this.loadUserData();
        this.formatCardInputs();
    }

    // Validate cart is not empty
    validateCartNotEmpty() {
        if (this.cart.length === 0) {
            window.location.href = 'cart.html';
        }
    }

    // Setup form event listeners
    setupEventListeners() {
        const form = document.getElementById('paymentForm');
        const differentBillingCheckbox = document.getElementById('differentBilling');
        const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const giftWrapCheckbox = document.getElementById('giftWrap');
        const expressShippingCheckbox = document.getElementById('expressShipping');
        const giftWrapRow = document.getElementById('giftWrapRow');
        const expressShippingRow = document.getElementById('expressShippingRow');
        const applyPromoBtn = document.getElementById('applyPromo');

        // Toggle billing section
        differentBillingCheckbox.addEventListener('change', (e) => {
            const billingSection = document.getElementById('billingSection');
            billingSection.style.display = e.target.checked ? 'block' : 'none';
        });

        // Toggle payment method details
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentMethodDetails(e.target.value);
            });
        });

        // Toggle gift wrap and express shipping
        giftWrapCheckbox.addEventListener('change', (e) => {
            giftWrapRow.style.display = e.target.checked ? 'flex' : 'none';
            this.updateOrderTotal();
        });

        expressShippingCheckbox.addEventListener('change', (e) => {
            expressShippingRow.style.display = e.target.checked ? 'flex' : 'none';
            this.updateOrderTotal();
        });

        // Promo code application
        applyPromoBtn.addEventListener('click', () => this.applyPromoCode());

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Card input formatting
        document.getElementById('cardNumber').addEventListener('input', (e) => this.formatCardNumber(e));
        document.getElementById('cardExpiry').addEventListener('input', (e) => this.formatCardExpiry(e));
        document.getElementById('cardCvv').addEventListener('input', (e) => this.formatCardCvv(e));
        document.getElementById('phone').addEventListener('input', (e) => this.formatPhoneNumber(e));
    }

    // Toggle payment method details visibility
    togglePaymentMethodDetails(method) {
        const cardDetailsSection = document.getElementById('cardDetailsSection');
        const upiDetailsSection = document.getElementById('upiDetailsSection');

        // Hide all
        cardDetailsSection.style.display = 'none';
        upiDetailsSection.style.display = 'none';

        // Show relevant section
        if (['creditCard', 'debitCard'].includes(method)) {
            cardDetailsSection.style.display = 'block';
        } else if (method === 'upi') {
            upiDetailsSection.style.display = 'block';
        }
    }

    // Format card number with spaces
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;

        // Update card type icon
        const cardTypeIcon = document.getElementById('cardTypeIcon');
        if (value.startsWith('4')) {
            cardTypeIcon.textContent = '💳'; // Visa
        } else if (value.startsWith('5')) {
            cardTypeIcon.textContent = '🏦'; // Mastercard
        } else if (value.startsWith('3')) {
            cardTypeIcon.textContent = '💳'; // Amex
        } else {
            cardTypeIcon.textContent = '💳';
        }
    }

    // Format card expiry date MM/YY
    formatCardExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    }

    // Format CVV (numbers only)
    formatCardCvv(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }

    // Format phone number
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    }

    // Populate order summary
    populateOrderSummary() {
        const summaryItemsContainer = document.getElementById('summaryItemsContainer');
        summaryItemsContainer.innerHTML = '';

        this.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="summary-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-price">₹${item.price}</div>
                    <div class="summary-item-qty">Qty: ${item.quantity}</div>
                </div>
            `;
            summaryItemsContainer.appendChild(itemElement);
        });

        this.updateOrderTotal();
    }

    // Update order total with all calculations
    updateOrderTotal() {
        const subtotal = this.calculateSubtotal();
        const shippingCost = 50; // Free shipping on subtotal > ₹500
        const shipping = subtotal > 500 ? 0 : shippingCost;
        
        // Additional charges
        const giftWrapCharge = document.getElementById('giftWrap').checked ? 100 : 0;
        const expressShippingCharge = document.getElementById('expressShipping').checked ? 200 : 0;
        
        // Tax calculation
        const taxableAmount = subtotal + giftWrapCharge + expressShippingCharge;
        const tax = Math.round(taxableAmount * 0.1); // 10% tax

        // Apply discount
        const discountAmount = this.promoDiscount || 0;

        // Total
        let total = subtotal + shipping + giftWrapCharge + expressShippingCharge + tax - discountAmount;
        total = Math.max(0, total); // Ensure no negative total

        // Update summary display
        document.getElementById('summarySubtotal').textContent = `₹${subtotal}`;
        document.getElementById('summaryShipping').textContent = `₹${shipping}`;
        document.getElementById('summaryTax').textContent = `₹${tax}`;
        document.getElementById('summaryTotal').textContent = `₹${total}`;

        // Show/hide discount row if applicable
        const discountRow = document.getElementById('discountRow');
        if (discountAmount > 0) {
            document.getElementById('discountAmount').textContent = `-₹${discountAmount}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }

        // Store total for later use
        this.totalAmount = total;
    }

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Apply promo code
    applyPromoCode() {
        const promoCode = document.getElementById('promoCode').value.toUpperCase();
        const validCodes = {
            'SAVE10': 0.10,
            'SAVE20': 0.20,
            'SUMMER50': 50,
            'WELCOME': 100
        };

        if (!promoCode) {
            alert('Please enter a promo code');
            return;
        }

        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            
            // Calculate discount
            if (discount < 1) {
                // Percentage discount
                this.promoDiscount = Math.round(this.calculateSubtotal() * discount);
            } else {
                // Fixed discount
                this.promoDiscount = discount;
            }

            this.updateOrderTotal();
            alert(`Promo code "${promoCode}" applied successfully! Discount: ₹${this.promoDiscount}`);
            document.getElementById('promoCode').disabled = true;
            document.getElementById('applyPromo').disabled = true;
        } else {
            alert('Invalid promo code. Please try again.');
        }
    }

    // Format card inputs
    formatCardInputs() {
        // Initial setup
        this.togglePaymentMethodDetails('creditCard');
    }

    // Load user data from localStorage/profile
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.name) {
            const [firstName, ...lastNameParts] = userData.name.split(' ');
            document.getElementById('firstName').value = firstName || '';
            document.getElementById('lastName').value = lastNameParts.join(' ') || '';
        }
        if (userData.email) {
            document.getElementById('email').value = userData.email;
        }
        if (userData.phone) {
            document.getElementById('phone').value = userData.phone;
        }
    }

    // Validate payment form
    validateForm() {
        const form = document.getElementById('paymentForm');
        let isValid = true;

        // Clear all error messages
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });

        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                const errorId = field.id + 'Error';
                const errorEl = document.getElementById(errorId);
                if (errorEl) {
                    errorEl.textContent = 'This field is required';
                }
            }
        });

        // Email validation
        const email = document.getElementById('email').value;
        if (email && !this.isValidEmail(email)) {
            isValid = false;
            document.getElementById('emailError').textContent = 'Please enter a valid email';
        }

        // Phone validation
        const phone = document.getElementById('phone').value;
        if (phone && phone.length < 10) {
            isValid = false;
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        }

        // Card validation
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (['creditCard', 'debitCard'].includes(paymentMethod)) {
            // Card number validation
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            if (cardNumber.length !== 16) {
                isValid = false;
                document.getElementById('cardNumberError').textContent = 'Card number must be 16 digits';
            }

            // Expiry validation
            const cardExpiry = document.getElementById('cardExpiry').value;
            if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
                isValid = false;
                document.getElementById('cardExpiryError').textContent = 'Expiry date format must be MM/YY';
            }

            // CVV validation
            const cardCvv = document.getElementById('cardCvv').value;
            if (cardCvv.length < 3 || cardCvv.length > 4) {
                isValid = false;
                document.getElementById('cardCvvError').textContent = 'CVV must be 3-4 digits';
            }
        }

        // UPI validation
        if (paymentMethod === 'upi') {
            const upiId = document.getElementById('upiId').value;
            if (!upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)) {
                isValid = false;
                document.getElementById('upiIdError').textContent = 'Please enter a valid UPI ID';
            }
        }

        // Terms agreement validation
        if (!document.getElementById('termsAgreed').checked) {
            isValid = false;
            document.getElementById('termsError').textContent = 'Please agree to terms and conditions';
        }

        return isValid;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            alert('Please fix the errors in the form');
            return;
        }

        // Simulate payment processing
        this.processPayment();
    }

    // Process payment
    processPayment() {
        const submitBtn = document.querySelector('.btn-place-order');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Simulate API call to process payment
        setTimeout(() => {
            this.completePayment(submitBtn, originalText);
        }, 2000);
    }

    // Complete payment and show success modal
    completePayment(submitBtn, originalText) {
        // Get form data
        const firstName = document.getElementById('firstName').value;
        const email = document.getElementById('email').value;

        // Generate order number
        const orderNumber = 'ORD' + Date.now();

        // Save order to localStorage
        const order = {
            orderNumber: orderNumber,
            date: new Date().toISOString(),
            items: this.cart,
            totalAmount: this.totalAmount,
            shippingAddress: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: email,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipcode: document.getElementById('zipcode').value,
                country: document.getElementById('country').value
            }
        };

        // Save to orders in localStorage
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');

        // Show success modal
        const modal = document.getElementById('successModal');
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('confirmationEmail').textContent = email;
        modal.style.display = 'flex';

        // Create confetti effect
        this.createConfetti();

        // Reset form
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    }

    // Create confetti animation
    createConfetti() {
        const confetti = [];
        const confettiPieces = 50;

        for (let i = 0; i < confettiPieces; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'fixed';
            piece.style.width = '10px';
            piece.style.height = '10px';
            piece.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'][Math.floor(Math.random() * 5)];
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.top = '-10px';
            piece.style.borderRadius = '50%';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = '999';

            document.body.appendChild(piece);

            const duration = Math.random() * 2 + 2;
            const horizontalMovement = (Math.random() - 0.5) * 100;

            const animation = piece.animate(
                [
                    { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(100vh) translateX(${horizontalMovement}px) rotate(360deg)`, opacity: 0 }
                ],
                {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }
            );

            animation.onfinish = () => piece.remove();
        }
    }
}

// Initialize payment handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PaymentHandler();
});
