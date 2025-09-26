// assets/js/pages/productDetail.js
// Lógica da página de detalhes de um produto específico.

import { productsData } from '../_database.js';
import { renderProductCards, parseProductDetails } from '../utils.js';

/**
 * Encontra e exibe 4 produtos aleatórios na seção "Você também pode gostar".
 */
function renderRelatedProducts(currentProductId) {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid) return; // Se a seção não existir, para a execução

    // Pega todos os produtos ativos que NÃO sejam o produto atual
    const activeProducts = productsData.filter(p => p.active !== false);
    const related = activeProducts.filter(p => p.id !== currentProductId).slice(0, 4);

    // Renderiza os cards dos produtos relacionados
    renderProductCards(related, relatedGrid, 1);
}

/**
 * Ativa todos os elementos interativos da página, como a galeria de
 * imagens, seleção de cor, tamanho e quantidade.
 */
function attachDetailEventListeners() {
    // Pega todos os elementos que precisam de interatividade
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
    const sizeBtns = document.querySelectorAll('.size-options .size-btn');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const qtyInput = document.getElementById('product-quantity-input');

    // Lógica para a galeria de imagens
    thumbnails.forEach((thumb, index) => {
        if (index === 0) thumb.classList.add('active'); // Ativa a primeira miniatura
        thumb.addEventListener('click', function () {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImage.src = this.src;
            colorSwatches.forEach(s => s.classList.remove('active')); // Limpa a seleção de cor
        });
    });

    // Lógica para a seleção de cores
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function () {
            colorSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            // Atualiza o nome da cor e a imagem principal
            document.getElementById('selected-color-name').textContent = this.dataset.colorName;
            if (this.dataset.mainImage) mainImage.src = this.dataset.mainImage;

            // Sincroniza a miniatura com a cor selecionada
            thumbnails.forEach(t => t.classList.toggle('active', t.src === mainImage.src));
        });
    });

    // Lógica para a seleção de tamanhos
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Lógica para os botões de quantidade
    increaseBtn?.addEventListener('click', () => qtyInput.value++);
    decreaseBtn?.addEventListener('click', () => {
        if (qtyInput.value > 1) qtyInput.value--;
    });
}

/**
 * Monta e insere todo o HTML da página de detalhes no local correto.
 */
function renderProductDetailPage(product, contentArea) {
    document.title = `${product.name} - Carol Modas`; // Atualiza o título da aba do navegador

    // Prepara as informações para serem exibidas
    const detailsHTML = parseProductDetails(product.details);
    const priceRetailFormatted = `R$ ${product.price.retail.toFixed(2).replace('.', ',')}`;
    const priceWholesaleFormatted = `R$ ${product.price.wholesale.toFixed(2).replace('.', ',')}`;

    // Insere o HTML completo do produto na página
    contentArea.innerHTML = `
        <div class="product-layout">
            <div class="product-images">
                <div class="main-image"><img src="/${product.images[0]}" alt="${product.name}" id="mainProductImage"></div>
                <div class="thumbnail-gallery">${product.images.map(img => `<img src="/${img}" alt="${product.name}" class="thumbnail">`).join('')}</div>
            </div>

            <div class="product-info">
                <span class="brand">${product.brand}</span>
                <p class="product-category">Categoria: <a href="/produtos.html?category=${product.category}">${product.category}</a></p>
                <h1>${product.name}</h1>

                <div class="price-details-container">
                    <div class="price-item">
                        <span class="price-label">Varejo</span>
                        <p class="price retail-price-detail">${priceRetailFormatted}</p>
                    </div>
                    <div class="price-item">
                        <span class="price-label">Atacado</span>
                        <p class="price wholesale-price-detail">${priceWholesaleFormatted}</p>
                    </div>
                </div>
                <p class="wholesale-info-detail">Preço de atacado válido para compras a partir de 4 peças.</p>

                <div class="selector">
                    <label>Cor: <strong id="selected-color-name">${product.options.colors[0]?.name || ''}</strong></label>
                    <div class="color-swatches">${product.options.colors.map((color, index) => `<button class="swatch ${index === 0 ? 'active' : ''}" style="background: ${color.code};" aria-label="${color.name}" data-color-name="${color.name}" data-main-image="/${product.images[index] || product.images[0]}"></button>`).join('')}</div>
                </div>
                <div class="selector">
                    <label>Tamanho:</label>
                    <div class="size-options">${product.options.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`).join('')}</div>
                </div>
                <div class="selector">
                    <label>Quantidade:</label>
                    <div class="quantity-selector">
                        <button class="quantity-btn" id="decrease-qty">-</button>
                        <input type="number" id="product-quantity-input" value="1" min="1" aria-label="Quantidade">
                        <button class="quantity-btn" id="increase-qty">+</button>
                    </div>
                </div>

                <button class="btn-primary btn-buy" id="add-to-cart-btn">Adicionar ao Carrinho</button>
                <div class="product-extra-info">
                    <p><i class="fa-solid fa-truck"></i> Somente retirada no local</p>
                    <p><i class="fa-solid fa-credit-card"></i> Parcele em até 12x com juros</p>
                    <p><i class="fa-solid fa-shield-halved"></i> Compra segura e garantida</p>
                </div>
            </div>
        </div>

        <div class="product-description-details">
            <div class="details-section">
                <h2>Sobre este item</h2>
                <div class="details-content">${detailsHTML}</div>
            </div>
        </div>`;

    // Após o HTML ser inserido, ativa os eventos e renderiza os produtos relacionados
    attachDetailEventListeners();
    renderRelatedProducts(product.id);
}

/**
 * Atualiza o link "Voltar" para que ele retorne à página
 * exata de onde o usuário veio na lista de produtos.
 */
function updateBackButton() {
    const backLink = document.querySelector('.back-to-products-link');
    if (!backLink) return;

    // Pega o número da página do parâmetro na URL (ex: ?page=2)
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get('page');

    if (pageFromUrl) {
        backLink.href = `/produtos.html?page=${pageFromUrl}`;
    }
}

/**
 * Função principal que inicia e coordena a montagem da página.
 */
export function initProductDetailPage() {
    // 1. Ajusta o botão "Voltar".
    updateBackButton();

    const contentArea = document.getElementById('product-detail-content');
    if (!contentArea) return;

    // 2. Pega o "slug" (nome do produto na URL) para encontrar o produto certo.
    const slugFromUrl = window.location.pathname.split('/').pop();
    const product = productsData.find(p => p.slug === slugFromUrl);

    // 3. Se o produto for encontrado e estiver ativo, mostra a página. Se não, exibe uma mensagem de erro.
    if (product && product.active !== false) {
        renderProductDetailPage(product, contentArea);
    } else {
        contentArea.innerHTML = `<p style="text-align: center; padding: 40px;">Produto não encontrado ou indisponível.</p>`;
    }
}
