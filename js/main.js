// Main JavaScript - Handle all page interactions

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    initializeAddToCartButtons();
    updateCartCount();
    // Remove event listeners on unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        document.removeEventListener('DOMContentLoaded', arguments.callee);
    });
});

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const featured = getFeaturedProducts();
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    featured.forEach(product => {
        const card = createProductCard(product);
        fragment.appendChild(card);
    });
    
    featuredContainer.appendChild(fragment);
    initializeAddToCartButtons();
}

// Initialize add to cart buttons
function initializeAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    
    buttons.forEach(button => {
        // avoid attaching multiple listeners if already initialized
        if (button.dataset.initialized === 'true') return;
        button.dataset.initialized = 'true';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productId = parseInt(button.getAttribute('data-id'));
            const product = getProductById(productId);
            
            cart.addItem(product);
            
            // Show feedback
            button.textContent = '✓ Added!';
            button.classList.add('added');
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.classList.remove('added');
            }, 2000);
        });
    });
}

// Update cart count
function updateCartCount() {
    cart.updateCartCount();
}

// Render cart page
function renderCartPage() {
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItemsBody = document.getElementById('cart-items-body');
    
    if (!emptyCart || !cartContent) return;

    if (cart.items.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'grid';
        
        // Clear existing items
        cartItemsBody.innerHTML = '';
        
        // Add items to table
        cart.items.forEach(item => {
            const row = document.createElement('tr');
            const priceINR = Math.round(item.price * USD_TO_INR);
            const totalINR = Math.round((item.price * item.quantity) * USD_TO_INR);
            const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <strong>${item.name}</strong>
                            <div style="font-size: 12px; color: #7f8c8d;">${item.category}</div>
                            <div style="font-size: 12px; color: var(--warning-color);">★ ${item.rating} (${item.reviews})</div>
                        </div>
                    </div>
                </td>
                <td>₹${priceINR.toLocaleString('en-IN')}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                </td>
                <td>₹${totalINR.toLocaleString('en-IN')}</td>
                <td>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </td>
            `;
            cartItemsBody.appendChild(row);
        });
        
        // Update totals
        const subtotalINR = Math.round(cart.getSubtotal() * USD_TO_INR);
        const shippingINR = Math.round(cart.getShipping() * USD_TO_INR);
        const taxINR = Math.round(cart.getTax() * USD_TO_INR);
        const totalINR = Math.round(cart.getTotal() * USD_TO_INR);
        
        document.getElementById('subtotal').textContent = '₹' + subtotalINR.toLocaleString('en-IN');
        document.getElementById('shipping').textContent = '₹' + shippingINR.toLocaleString('en-IN');
        document.getElementById('tax').textContent = '₹' + taxINR.toLocaleString('en-IN');
        document.getElementById('total').textContent = '₹' + totalINR.toLocaleString('en-IN');
        
        // Add event listeners for quantity changes and remove buttons
        attachCartEventListeners();
    }
}

// Attach event listeners for cart items
function attachCartEventListeners() {
    // Quantity input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const quantity = parseInt(e.target.value);
            cart.updateQuantity(productId, quantity);
            renderCartPage();
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            cart.removeItem(productId);
            renderCartPage();
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const totalINR = Math.round(cart.getTotal() * USD_TO_INR);
            alert('Thank you for your order!\n\nOrder Total: ₹' + totalINR.toLocaleString('en-IN') + '\n\nThis is a demo site. In a real application, you would be redirected to payment processing.');
            cart.clearCart();
            renderCartPage();
        });
    }
}

// If on cart page, render it
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', renderCartPage);
}
