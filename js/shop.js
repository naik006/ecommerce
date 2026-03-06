// Shop Page Functionality

let filteredProducts = [];
let filterTimeout; // Debounce timer

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
    filteredProducts = getAllProducts();
    renderProducts();
    initializeFilters();
});

// Render products in grid
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
        return;
    }

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        fragment.appendChild(card);
    });
    
    productsGrid.appendChild(fragment);
    initializeAddToCartButtons();
}

// Initialize filter functionality with debouncing
function initializeFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', debounceFilters);
    });

    // Price range filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        // Ensure slider operates in INR by using USD_TO_INR conversion
        const rate = (typeof USD_TO_INR !== 'undefined') ? USD_TO_INR : (window.USD_TO_INR || 83);
        const usdMax = 500;
        priceRange.max = usdMax * rate;
        priceRange.value = priceRange.max;
        document.getElementById('price-display').textContent = `₹0 - ₹${parseInt(priceRange.value).toLocaleString('en-IN')}`;

        priceRange.addEventListener('input', (e) => {
            document.getElementById('price-display').textContent = `₹0 - ₹${parseInt(e.target.value).toLocaleString('en-IN')}`;
            debounceFilters();
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Reset filters button
    const resetBtn = document.querySelector('.reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// Debounce filter application
function debounceFilters() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(applyFilters, 300); // Wait 300ms before applying filters
}

// Apply all filters
function applyFilters() {
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(filter => filter.value);

    // Get price range
    // Treat the slider value as INR; convert product USD price to INR for comparison
    const priceRange = document.getElementById('price-range') ? 
        parseFloat(document.getElementById('price-range').value) : (500 * ((typeof USD_TO_INR !== 'undefined') ? USD_TO_INR : (window.USD_TO_INR || 83)));

    // Get sort option
    const sortBy = document.getElementById('sort-select') ? 
        document.getElementById('sort-select').value : 'newest';

    // Filter products
    let filtered = getAllProducts();

    // Apply category filter
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    // Apply price filter (convert product price from USD to INR using global USD_TO_INR)
    filtered = filtered.filter(product => (product.price * (typeof USD_TO_INR !== 'undefined' ? USD_TO_INR : 1)) <= priceRange);

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    filteredProducts = filtered;
    renderProducts();
}

// Reset all filters
function resetFilters() {
    // Uncheck all category filters
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.checked = false;
    });

    // Reset price range
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        const rate = (typeof USD_TO_INR !== 'undefined') ? USD_TO_INR : (window.USD_TO_INR || 83);
        priceRange.value = 500 * rate;
        document.getElementById('price-display').textContent = `₹0 - ₹${parseInt(priceRange.value).toLocaleString('en-IN')}`;
    }

    // Reset sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'newest';
    }

    // Reapply filters
    applyFilters();
}
