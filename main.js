// main.js (localizado na pasta raiz do projeto - VERSÃO FINAL ORGANIZADA)

// Importa funções de arquivos existentes e dos novos módulos
import { initPreloader } from './assets/js/_preloader.js';
import { initCarousel } from './assets/js/_carousel.js';
import { initShoppingCart } from './assets/js/_shoppingCart.js';
import { productsData } from "./assets/js/_database.js"

// Importa os inicializadores de cada página dos novos arquivos organizados
import { initHomePage } from './assets/js/pages/home.js';
import { initProductsPage } from './assets/js/pages/products.js';
import { initProductDetailPage } from './assets/js/pages/productDetail.js';
;

/**
 * Inicializa todas as funções globais que rodam em qualquer página.
 * Inclui o menu mobile e os listeners para fechar painéis ao clicar fora.
 */
function initGlobalFunctions() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('.main-nav');
    const cartPanel = document.querySelector('.cart-panel');

    // Ativa o botão do menu mobile
    toggleBtn?.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Listener global para fechar painéis abertos ao clicar fora (preservado do seu código)
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
 * Ponto de entrada da aplicação: Roda quando o HTML estiver pronto.
 * Chama as funções globais e depois as funções específicas da página atual.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Funções Globais (rodam em TODAS as páginas)
    initPreloader();
    initShoppingCart();
    initGlobalFunctions();

    // Roteador baseado em elementos: Roda a função específica da página atual
    if (document.getElementById('home-product-grid')) {
        initCarousel();
        initHomePage();
    }

    if (document.getElementById('product-list-grid')) {
        // Agora, apenas esta função é necessária. Ela já cuida de tudo.
        initProductsPage();
    }

    if (document.getElementById('product-detail-content')) {
        initProductDetailPage();
    }
});
