// Mock Product Database
const USD_TO_INR = 83; // Conversion rate

const productsData = [
    // Men's Fashion
    {
        id: 1,
        name: "Classic T-Shirt",
        category: "mens",
        price: 2.49,
        originalPrice: 3.49,
        rating: 4.5,
        reviews: 120,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%234A90E2' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EClassic T-Shirt%3C/text%3E%3C/svg%3E",
        color: "#667eea"
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        category: "mens",
        price: 4.99,
        originalPrice: 6.49,
        rating: 4.8,
        reviews: 245,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%232C3E50' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ESlim Fit Jeans%3C/text%3E%3C/svg%3E",
        color: "#764ba2"
    },
    {
        id: 3,
        name: "Casual Shirt",
        category: "mens",
        price: 3.49,
        originalPrice: 4.99,
        rating: 4.3,
        reviews: 87,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%233498DB' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ECasual Shirt%3C/text%3E%3C/svg%3E",
        color: "#f093fb"
    },
    {
        id: 4,
        name: "Formal Blazer",
        category: "mens",
        price: 5.99,
        originalPrice: 8.49,
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1552062407-c551eeda4bbb?w=400&h=500&fit=crop",
        color: "#4facfe"
    },

    // Women's Fashion
    {
        id: 5,
        name: "Summer Dress",
        category: "womens",
        price: 3.99,
        originalPrice: 5.49,
        rating: 4.6,
        reviews: 189,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23E74C3C' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ESummer Dress%3C/text%3E%3C/svg%3E",
        color: "#fa709a"
    },
    {
        id: 6,
        name: "Athletic Leggings",
        category: "womens",
        price: 4.49,
        originalPrice: 6.49,
        rating: 4.9,
        reviews: 312,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%239B59B6' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EAthletic Leggings%3C/text%3E%3C/svg%3E",
        color: "#30cfd0"
    },
    {
        id: 7,
        name: "Elegant Blouse",
        category: "womens",
        price: 3.99,
        originalPrice: 5.49,
        rating: 4.4,
        reviews: 134,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%231ABC9C' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EElegant Blouse%3C/text%3E%3C/svg%3E",
        color: "#a8edea"
    },
    {
        id: 8,
        name: "Casual Skirt",
        category: "womens",
        price: 3.49,
        originalPrice: 4.99,
        rating: 4.5,
        reviews: 98,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23F39C12' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ECasual Skirt%3C/text%3E%3C/svg%3E",
        color: "#fed6e3"
    },
    {
        id: 9,
        name: "Fashion Jacket",
        category: "womens",
        price: 5.49,
        originalPrice: 7.99,
        rating: 4.7,
        reviews: 201,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%2334495E' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFashion Jacket%3C/text%3E%3C/svg%3E",
        color: "#ff9a56"
    },

    // Accessories
    {
        id: 10,
        name: "Luxury Watch",
        category: "accessories",
        price: 5.99,
        originalPrice: 8.99,
        rating: 4.8,
        reviews: 267,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23C0504D' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ELuxury Watch%3C/text%3E%3C/svg%3E",
        color: "#667eea"
    },
    {
        id: 11,
        name: "Designer Sunglasses",
        category: "accessories",
        price: 4.99,
        originalPrice: 7.49,
        rating: 4.6,
        reviews: 145,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%2316A085' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EDesigner Sunglasses%3C/text%3E%3C/svg%3E",
        color: "#764ba2"
    },
    {
        id: 12,
        name: "Leather Handbag",
        category: "accessories",
        price: 5.49,
        originalPrice: 8.49,
        rating: 4.7,
        reviews: 223,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%238B4513' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ELeather Handbag%3C/text%3E%3C/svg%3E",
        color: "#f093fb"
    },
    {
        id: 13,
        name: "Fashion Scarf",
        category: "accessories",
        price: 2.49,
        originalPrice: 3.99,
        rating: 4.3,
        reviews: 76,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23D35400' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFashion Scarf%3C/text%3E%3C/svg%3E",
        color: "#4facfe"
    },
    {
        id: 14,
        name: "Baseball Cap",
        category: "accessories",
        price: 1.99,
        originalPrice: 3.49,
        rating: 4.4,
        reviews: 112,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23BDC3C7' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EBaseball Cap%3C/text%3E%3C/svg%3E",
        color: "#fa709a"
    },
    {
        id: 15,
        name: "Leather Belt",
        category: "accessories",
        price: 3.49,
        originalPrice: 5.49,
        rating: 4.5,
        reviews: 189,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23654321' width='400' height='500'/%3E%3Ctext x='200' y='250' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ELeather Belt%3C/text%3E%3C/svg%3E",
        color: "#30cfd0"
    }
];

// Get featured products (first 6)
function getFeaturedProducts() {
    return productsData.slice(0, 6);
}

// Get all products
function getAllProducts() {
    return productsData;
}

// Get product by ID
function getProductById(id) {
    return productsData.find(product => product.id === id);
}

// Filter products by category
function getProductsByCategory(category) {
    if (!category) return productsData;
    return productsData.filter(product => product.category === category);
}

// Sort products
function sortProducts(products, sortBy) {
    let sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            sorted.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
        default:
            // Keep original order
            break;
    }
    
    return sorted;
}

// Create product card HTML
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const priceINR = Math.round(product.price * USD_TO_INR);
    const originalPriceINR = Math.round(product.originalPrice * USD_TO_INR);
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">
                ★ ${product.rating} (${product.reviews} reviews)
            </div>
            <div class="product-price">
                ₹${priceINR.toLocaleString('en-IN')}
                <span style="font-size: 12px; text-decoration: line-through; color: #7f8c8d; margin-left: 10px;">₹${originalPriceINR.toLocaleString('en-IN')}</span>
                ${discount > 0 ? `<span style="background-color: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-left: 10px;">-${discount}%</span>` : ''}
            </div>
            <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}
