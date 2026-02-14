# Avail Fashions - E-Commerce Website

A modern, responsive e-commerce website for fashion retail built with HTML, CSS, and JavaScript.

## Features

✨ **Modern Design**
- Responsive layout that works on mobile, tablet, and desktop
- Clean, professional interface with smooth animations
- Gradient backgrounds and modern color scheme

🛍️ **Full E-Commerce Functionality**
- Product catalog with 15 pre-loaded fashion items
- Product filtering by category (Men's, Women's, Accessories)
- Price range filtering
- Multiple sorting options (price, popularity, newest)
- Shopping cart with persistent storage (localStorage)
- Order summary with tax and shipping calculations

📦 **Product Features**
- Product ratings and reviews
- Discount badges showing percentage off
- Add to cart functionality with visual feedback
- Quantity adjustment in cart
- Remove items from cart
- Checkout button

🎯 **Navigation**
- Home page with featured products
- Shop page with full product catalog and advanced filters
- Shopping cart page
- Category browsing
- Responsive navigation bar with cart count

## Project Structure

```
avail-fashions/
├── index.html              # Homepage
├── products.html           # Shop/Products page
├── cart.html               # Shopping cart page
├── css/
│   └── styles.css          # All styling (mobile responsive)
├── js/
│   ├── products.js         # Mock product database
│   ├── cart.js             # Shopping cart logic
│   ├── main.js             # Main page interactions
│   └── shop.js             # Shop page filtering & sorting
└── images/                 # Image folder (currently using emoji placeholders)
```

## How to Use

1. **Open the website**: Open `index.html` in a web browser
2. **Browse products**: Click "Shop" or "Browse" buttons to view all products
3. **Filter & Sort**: Use the filters sidebar to refine your search
4. **Add to Cart**: Click "Add to Cart" button on any product
5. **View Cart**: Click the cart icon in the navigation bar
6. **Checkout**: Review your order and click "Proceed to Checkout"

## Product Categories

- **Men's Fashion**: T-Shirts, Jeans, Shirts, Blazers
- **Women's Fashion**: Dresses, Leggings, Blouses, Skirts, Jackets
- **Accessories**: Watches, Sunglasses, Handbags, Scarves, Caps, Belts

## Features Detail

### Filtering System
- Filter by category
- Filter by price range
- Sort by newest, price (low-high, high-low), or popularity
- Real-time product updates

### Shopping Cart
- Add items with click
- Change quantities
- Remove items
- Automatic calculation of:
  - Subtotal
  - Shipping (Free over $100)
  - Tax (10%)
  - Total cost
- Cart persists between browser sessions (localStorage)

### Responsive Design
- Works on all devices
- Mobile-optimized layouts
- Touch-friendly interface

## Products

15 pre-loaded fashion products with:
- Product name and category
- Price and original price
- Discount percentage
- Star ratings (out of 5)
- Number of reviews

## Browser Support

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customization Tips

### Change Product Data
Edit the array in `js/products.js` to add or modify products.

### Update Colors
Change color variables in `css/styles.css`:
```css
--primary-color: #2c3e50;
--secondary-color: #e74c3c;
--accent-color: #3498db;
```

### Add Real Images
Replace emoji icons in product data with image URLs in `js/products.js`.

### Modify Tax/Shipping
Edit calculations in `js/cart.js`:
```javascript
getShipping() { return this.getSubtotal() > 100 ? 0 : 9.99; }
getTax() { return (this.getSubtotal() + this.getShipping()) * 0.1; }
```

## Future Enhancements

- User authentication & accounts
- Real product image uploads
- Payment gateway integration
- Order history & tracking
- Product reviews & ratings from users
- Wishlist functionality
- Search bar
- Admin panel for product management
- Email notifications

## License

Free to use and modify for personal or commercial projects.

---

**Enjoy your Avail Fashions e-commerce website! 🎉**
