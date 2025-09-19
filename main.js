// main.js (localizado na pasta raiz do projeto)

// Caminhos corretos partindo da raiz para dentro de /assets/js/
import { initPreloader } from './assets/js/_preloader.js';
import { initCarousel } from './assets/js/_carousel.js';
import { initMenu } from './assets/js/menu.js';
// IMPORTAMOS A FUNÇÃO QUE FALTAVA: initProductsPage
import { initHomePage, initProductsPage, initProductDetailPage } from './assets/js/_pages.js';
import { initShoppingCart } from './assets/js/_shoppingCart.js';
import { initFilter } from './assets/js/_filter.js';

// Listener global para fechar painéis abertos
function initGlobalListeners() {
    window.addEventListener('click', (event) => {
        // Fecha o menu mobile se clicar FORA dele
        const mainNav = document.querySelector('.main-nav.active');
        if (mainNav && !mainNav.contains(event.target) && !event.target.closest('.mobile-nav-toggle')) {
            mainNav.classList.remove('active');
            document.querySelector('.mobile-nav-toggle')?.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fecha o painel do carrinho se clicar FORA dele
        const cartPanel = document.querySelector('.cart-panel.active');
        if (cartPanel && !cartPanel.contains(event.target) && !event.target.closest('.cart-icon')) {
            cartPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Dispara a inicialização de tudo
document.addEventListener('DOMContentLoaded', () => {
    // Funções Globais (rodam em TODAS as páginas)
    initPreloader();
    initMenu();
    initShoppingCart();
    initGlobalListeners();

    // Funções Específicas de cada página
    if (document.getElementById('home-product-grid')) {
        initCarousel();
        initHomePage();
    }

    if (document.getElementById('product-list-grid')) {
        // AGORA CHAMAMOS AS DUAS FUNÇÕES NECESSÁRIAS
        initProductsPage(); // 1. Renderiza os produtos inicialmente
        initFilter();       // 2. Ativa a lógica de filtragem
    }

    if (document.getElementById('product-detail-content')) {
        initProductDetailPage();
    }
});
