// assets/js/pages/home.js

import { productsData } from '../_database.js';
import { renderProductCards } from '../utils.js';

export function initHomePage() {
    const homeGrid = document.getElementById('home-product-grid');
    if (homeGrid) {
        const activeProducts = productsData.filter(product => product.active !== false);
        const featuredProducts = activeProducts.slice(0, 4);
        renderProductCards(featuredProducts, homeGrid);
    }
}
