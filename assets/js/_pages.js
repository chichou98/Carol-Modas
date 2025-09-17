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

export function initHomePage() {
    const homeGrid = document.getElementById('home-product-grid');
    if (homeGrid) {
        const featuredProducts = productsData.slice(0, 4);
        renderProductCards(featuredProducts, homeGrid);
    }
}

export function initProductsPage() {
    const productGrid = document.getElementById('product-list-grid');
    if (productGrid) {
        renderProductCards(productsData, productGrid);
    }
}

const productDetailPage = {
    init: function () {
        const contentArea = document.getElementById('product-detail-content');
        if (!contentArea) return;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = productsData.find(p => p.id === productId);
        if (product) {
            this.render(product, contentArea);
        } else {
            contentArea.innerHTML = `<p style="text-align: center;">Produto não encontrado.</p>`;
        }
    },
    render: function (product, contentArea) {
        document.title = `${product.name} - Carol Modas`;
        const colorsHTML = product.options.colors.map((color, index) => `<button class="swatch ${index === 0 ? 'active' : ''}" style="background-color: ${color.code};" aria-label="${color.name}"></button>`).join('');
        const sizesHTML = product.options.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`).join('');
        const thumbnailsHTML = product.images.map((img, index) => `<img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}">`).join('');
        const detailsHTML = product.details.map(d => `<li>✨ ${d}</li>`).join('');
        contentArea.innerHTML = `
            <div class="product-layout">
                <div class="product-images">
                    <div class="main-image"><img src="${product.images[0]}" alt="${product.name}" id="mainProductImage"></div>
                    <div class="thumbnail-gallery">${thumbnailsHTML}</div>
                </div>
                <div class="product-info">
                    <span class="brand">${product.brand}</span>
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
                            <span id="product-quantity">1</span>
                            <button class="quantity-btn" id="increase-qty">+</button>
                        </div>
                    </div>
                    <button class="btn-primary btn-buy" id="add-to-cart-btn">Adicionar ao Carrinho</button>
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
            });
        });
    },

    activateOptionSelectors: function () {
        const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
        const sizeBtns = document.querySelectorAll('.size-options .size-btn');
        const selectedColorName = document.getElementById('selected-color-name');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function () {
                colorSwatches.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
                if (selectedColorName) {
                    selectedColorName.textContent = this.getAttribute('aria-label');
                }
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
        const quantitySpan = document.getElementById('product-quantity');
        if (!decreaseBtn || !increaseBtn || !quantitySpan) return;
        increaseBtn.addEventListener('click', () => {
            quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
        });
        decreaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(quantitySpan.textContent);
            if (currentQty > 1) {
                quantitySpan.textContent = currentQty - 1;
            }
        });
    }
};

export function initProductDetailPage() {
    productDetailPage.init();
}
