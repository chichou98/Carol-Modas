// main.js (Lógica de seletor de preço REMOVIDA)

import { initPreloader } from './assets/js/_preloader.js';
import { initCarousel } from './assets/js/_carousel.js';
import { initShoppingCart } from './assets/js/_shoppingCart.js';
import { productsData } from "./assets/js/_database.js";
import { customConfirm } from './assets/js/utils/modals.js';

// Importa os inicializadores de cada página
import { initHomePage } from './assets/js/pages/home.js';
import { initProductsPage } from './assets/js/pages/products.js';
import { initProductDetailPage } from './assets/js/pages/productDetail.js';

/**
 * Inicializa todas as funções globais que rodam em qualquer página.
 */
function initGlobalFunctions() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('.main-nav');
    const cartPanel = document.querySelector('.cart-panel');

    toggleBtn?.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    window.addEventListener('click', (event) => {
        if (nav?.classList.contains('active') && !nav.contains(event.target) && !event.target.closest('.mobile-nav-toggle')) {
            toggleBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (cartPanel?.classList.contains('active') && !cartPanel.contains(event.target) && !event.target.closest('.cart-icon')) {
            cartPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


/**
 * Ponto de entrada da aplicação.
 */
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initShoppingCart();
    initGlobalFunctions();

    // Roteamento baseado na existência de elementos na página
    if (document.getElementById('home-product-grid')) {
        initCarousel();
        initHomePage();
    }
    if (document.getElementById('product-list-grid')) {
        initProductsPage();
    }
    if (document.getElementById('product-detail-content')) {
        initProductDetailPage();
    }
});
