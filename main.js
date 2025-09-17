// O caminho agora aponta para dentro da pasta 'assets/js/'
import { initPreloader } from './assets/js/_preloader.js';
import { initCarousel } from './assets/js/_carousel.js';
import { initMenu } from './assets/js/menu.js'; // Ajustado para seu novo nome de arquivo
import { initHomePage, initProductsPage, initProductDetailPage } from './assets/js/_pages.js';
import { initShoppingCart } from './assets/js/_shoppingCart.js';

// Listener global para fechar painéis abertos ao clicar fora
function initGlobalListeners() {
    window.addEventListener('click', () => {
        // Fecha o menu mobile se estiver aberto
        const mainNav = document.querySelector('.main-nav.active');
        if (mainNav) {
            mainNav.classList.remove('active');
            document.querySelector('.mobile-nav-toggle')?.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fecha o painel do carrinho se estiver aberto
        const cartPanel = document.querySelector('.cart-panel.active');
        if (cartPanel) {
            cartPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Dispara a inicialização de tudo assim que o HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCarousel();
    initMenu();
    initHomePage();
    initProductsPage();
    initProductDetailPage();
    initShoppingCart();
    initGlobalListeners();
});
