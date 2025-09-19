import { productsData } from './_database.js';

function renderProductCards(productsToRender, gridElement) {
    gridElement.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <a href="detalhe-produto.html?id=${product.id}" class="product-image-link">
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
            </a>
            <div class="product-card-info">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <a href="detalhe-produto.html?id=${product.id}" class="btn-secondary">Ver Detalhes</a>`;
        gridElement.appendChild(productCard);
    });
}

function renderRelatedProducts(currentProductId) {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid) return;

    // AQUI ESTÁ A CORREÇÃO: Filtra apenas os produtos ativos
    const activeProducts = productsData.filter(p => p.active !== false);

    const related = activeProducts
        .filter(p => p.id !== currentProductId)
        .slice(0, 4);

    renderProductCards(related, relatedGrid);
}


export function initHomePage() {
    const homeGrid = document.getElementById('home-product-grid');
    if (homeGrid) {
        // AQUI ESTÁ A CORREÇÃO: Filtra apenas os produtos ativos
        const activeProducts = productsData.filter(product => product.active !== false);
        const featuredProducts = activeProducts.slice(0, 4);
        renderProductCards(featuredProducts, homeGrid);
    }
}

export function initProductsPage() {
    const productGrid = document.getElementById('product-list-grid');
    if (productGrid) {
        // AQUI ESTÁ A CORREÇÃO: Filtra apenas os produtos ativos
        const activeProducts = productsData.filter(product => product.active !== false);
        renderProductCards(activeProducts, productGrid);
    }
}
const productDetailPage = {
    currentProduct: null, // Armazena o produto atual para facilitar o acesso

    init: function () {
        const contentArea = document.getElementById('product-detail-content');
        if (!contentArea) return;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = productsData.find(p => p.id === productId);

        if (product) {
            this.currentProduct = product; // Salva o produto atual
            this.render(product, contentArea);
        } else {
            contentArea.innerHTML = `<p style="text-align: center;">Produto não encontrado.</p>`;
        }
    },

    render: function (product, contentArea) {
        document.title = `${product.name} - Carol Modas`;

        // Mapeia cores para as imagens correspondentes
        const colorImageMap = {};
        product.options.colors.forEach((color, index) => {
            colorImageMap[color.name] = product.images[index] || product.images[0];
        });

        // HTML das cores, com atributo data-image para a troca
        const colorsHTML = product.options.colors.map((color, index) =>
            `<button class="swatch ${index === 0 ? 'active' : ''}"
                 style="background: ${color.code};"
                 aria-label="${color.name}"
                 data-color-name="${color.name}"
                 data-main-image="${colorImageMap[color.name]}">
        </button>`).join('');

        const sizesHTML = product.options.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`).join('');
        const thumbnailsHTML = product.images.map((img, index) => `<img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}">`).join('');
        const detailsHTML = product.details.map(d => `<li><i class="fa-solid fa-star-of-life icon-detail-item"></i> ${d}</li>`).join('');

        contentArea.innerHTML = `
        <div class="product-layout">
            <div class="product-images">
                <div class="main-image"><img src="${product.images[0]}" alt="${product.name}" id="mainProductImage"></div>
                <div class="thumbnail-gallery">${thumbnailsHTML}</div>
            </div>
            <div class="product-info">
                <span class="brand">${product.brand}</span>

                <p class="product-category">Categoria: <a href="produtos.html?category=${product.category}">${product.category}</a></p>

                <h1>${product.name}</h1>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>

                <div class="selector">
                    <label>Cor: <strong id="selected-color-name">${product.options.colors[0].name}</strong></label>
                    <div class="color-swatches">${colorsHTML}</div>
                </div>
                <div class="selector">
                    <label>Tamanho:</label>
                    <div class="size-options">${sizesHTML}</div>
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
                <ul>${detailsHTML}</ul>
            </div>
        </div>`;

        this.activateThumbnailGallery();
        this.activateOptionSelectors();
        this.activateQuantitySelector();
    },
    activateThumbnailGallery: function () {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        if (!mainImage || thumbnails.length === 0) return;
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.src;

                // Desativa a seleção de cor se uma thumbnail específica for clicada
                const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
                colorSwatches.forEach(s => s.classList.remove('active'));
            });
        });
    },

    activateOptionSelectors: function () {
        const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
        const sizeBtns = document.querySelectorAll('.size-options .size-btn');
        const selectedColorName = document.getElementById('selected-color-name');
        const mainProductImage = document.getElementById('mainProductImage'); // Pega a imagem principal

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function () {
                colorSwatches.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
                if (selectedColorName) {
                    selectedColorName.textContent = this.getAttribute('data-color-name'); // Usa o novo data-attribute
                }

                // Troca a imagem principal com base na cor selecionada
                if (mainProductImage && this.dataset.mainImage) {
                    mainProductImage.src = this.dataset.mainImage;
                }

                // Desativa a seleção de thumbnail se uma cor for clicada
                const thumbnails = document.querySelectorAll('.thumbnail');
                thumbnails.forEach(t => t.classList.remove('active'));
            });
        });

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                sizeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    },

    activateQuantitySelector: function () {
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('product-quantity-input');

        if (!decreaseBtn || !increaseBtn || !quantityInput) return;

        increaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });

        decreaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        });
    }
};

export function initProductDetailPage() {
    productDetailPage.init();
    // Garante que a seção de produtos relacionados seja renderizada
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    if (productId) {
        renderRelatedProducts(productId);
    }
}
