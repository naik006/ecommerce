// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                originalPrice: product.originalPrice,
                rating: product.rating,
                reviews: product.reviews,
                image: product.image,
                color: product.color,
                quantity: 1
            });
        }
        
        this.saveCart();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get total items in cart
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calculate shipping (free over $100)
    getShipping() {
        // If a shipping distance (in km) is set in localStorage, apply distance-based rules
        // If distance <= 10 km, charge ₹20 per item (converted to USD for internal calculations)
        const distStr = localStorage.getItem('shippingDistanceKm');
        const distanceKm = distStr ? parseFloat(distStr) : null;

        // number of items (sum of quantities)
        const itemCount = this.getItemCount();

        // conversion rate (fallback to 83 if USD_TO_INR not available)
        const rate = (typeof USD_TO_INR !== 'undefined') ? USD_TO_INR : (window.USD_TO_INR || 83);

        if (distanceKm !== null && !isNaN(distanceKm)) {
            if (distanceKm <= 10) {
                const perItemRupees = 20;
                const perItemUSD = perItemRupees / rate;
                return perItemUSD * itemCount;
            }
            // future: add more distance tiers here
        }

        // default fallback: free over $100, otherwise flat ₹25 (converted to USD)
        const flatShippingRupees = 25;
        const flatShippingUSD = flatShippingRupees / rate;
        return this.getSubtotal() > 100 ? 0 : flatShippingUSD;
    }

    // Calculate tax (10%)
    // Calculate tax (2%)
    getTax() {
        return (this.getSubtotal() + this.getShipping()) * 0.02;
    }

    // Get total
    getTotal() {
        return this.getSubtotal() + this.getShipping() + this.getTax();
    }

    // Update cart count display
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => {
            el.textContent = this.getItemCount();
        });
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
    }
}

// Global cart instance
let cart = new ShoppingCart();

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
