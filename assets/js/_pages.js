// assets/js/_pages.js (Versão com Filtro, Ordenação, Paginação e Descrição Formatada)

import { productsData } from './_database.js';

// --- Variáveis de Estado da Página de Produtos ---
let state = {
    allProducts: [],
    filteredProducts: [],
    sortBy: 'default',
    activeCategoryFilters: [],
    currentPage: 1,
    productsPerPage: 8,
};

// --- Funções de Formatação de Texto ---
function applyInlineFormatting(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function parseProductDetails(details) {
    let html = '';
    let isInsideList = false;
    let isFirstParagraph = true;

    details.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            if (!isInsideList) {
                html += '<ul class="details-sublist">';
                isInsideList = true;
            }
            const formattedLine = applyInlineFormatting(trimmedLine.substring(1).trim());
            html += `<li>${formattedLine}</li>`;
        } else {
            if (isInsideList) {
                html += '</ul>';
                isInsideList = false;
            }
            const formattedLine = applyInlineFormatting(trimmedLine);
            if (trimmedLine.endsWith(':')) {
                html += `<h4 class="details-heading">${formattedLine}</h4>`;
                isFirstParagraph = false;
            } else {
                if (isFirstParagraph) {
                    html += `<h3 class="details-main-title">${formattedLine}</h3>`;
                    isFirstParagraph = false;
                } else {
                    html += `<p class="details-paragraph">${formattedLine}</p>`;
                }
            }
        }
    });

    if (isInsideList) {
        html += '</ul>';
    }
    return html;
}


// --- Funções de Renderização ---

function renderProductCards(productsToRender, gridElement) {
    gridElement.innerHTML = '';
    if (productsToRender.length === 0) {
        gridElement.innerHTML = `<p class="no-products-found">Nenhum produto encontrado com os filtros selecionados.</p>`;
        return;
    }
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        const productLink = `/produto/${product.slug}`;
        productCard.innerHTML = `
            <a href="${productLink}" class="product-image-link">
                <div class="product-image-container">
                    <img src="/${product.images[0]}" alt="${product.name}">
                </div>
            </a>
            <div class="product-card-info">
                <p class="product-card-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <a href="${productLink}" class="btn-secondary">Ver Detalhes</a>`;
        gridElement.appendChild(productCard);
    });
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.dataset.page = i;
        if (i === state.currentPage) {
            pageLink.classList.add('current');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            state.currentPage = i;
            updateProductView();
        });
        paginationContainer.appendChild(pageLink);
    }
}

function renderFilterOptions() {
    const filterContainer = document.getElementById('filter-options');
    if (!filterContainer) return;

    const categories = [...new Set(state.allProducts.map(p => p.category))].sort();
    filterContainer.innerHTML = categories.map(category => `
        <div class="filter-option">
            <input type="checkbox" id="cat-${category.toLowerCase().replace(/\s+/g, '-')}" name="category" value="${category}">
            <label for="cat-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</label>
        </div>
    `).join('');
}

// --- Função Principal de Atualização da Tela de Produtos ---

function updateProductView() {
    const productGrid = document.getElementById('product-list-grid');
    if (!productGrid) return;

    // 1. Filtrar
    if (state.activeCategoryFilters.length > 0) {
        state.filteredProducts = state.allProducts.filter(p => state.activeCategoryFilters.includes(p.category));
    } else {
        state.filteredProducts = [...state.allProducts];
    }

    // 2. Ordenar
    const productsToSort = [...state.filteredProducts];
    switch (state.sortBy) {
        case 'price-asc':
            productsToSort.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            productsToSort.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            productsToSort.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    state.filteredProducts = productsToSort;

    // 3. Paginar
    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const productsToShow = state.filteredProducts.slice(startIndex, endIndex);

    // 4. Renderizar
    renderProductCards(productsToShow, productGrid);
    renderPagination();

    // 5. Atualizar contagem
    const countElement = document.getElementById('product-count');
    if (countElement) {
        const start = state.filteredProducts.length > 0 ? startIndex + 1 : 0;
        const end = Math.min(endIndex, state.filteredProducts.length);
        countElement.textContent = `Mostrando ${start}–${end} de ${state.filteredProducts.length} resultados`;
    }
}


// --- Funções de Inicialização de cada Página ---

export function initHomePage() {
    const homeGrid = document.getElementById('home-product-grid');
    if (homeGrid) {
        const activeProducts = productsData.filter(product => product.active !== false);
        const featuredProducts = activeProducts.slice(0, 4);
        renderProductCards(featuredProducts, homeGrid);
    }
}

export function initProductsPage() {
    state.allProducts = productsData.filter(product => product.active !== false);
    state.currentPage = 1;

    renderFilterOptions();
    updateProductView();

    const filterBtn = document.getElementById('filter-btn');
    const modal = document.getElementById('filter-modal');
    const overlay = document.getElementById('filter-overlay');
    const closeModalBtn = document.getElementById('close-filter-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const sortSelect = document.getElementById('orderby');

    const toggleModal = (show) => {
        modal.classList.toggle('active', show);
        overlay.classList.toggle('active', show);
    };

    filterBtn?.addEventListener('click', () => toggleModal(true));
    closeModalBtn?.addEventListener('click', () => toggleModal(false));
    overlay?.addEventListener('click', () => toggleModal(false));

    applyFiltersBtn?.addEventListener('click', () => {
        const checkedBoxes = document.querySelectorAll('#filter-options input:checked');
        state.activeCategoryFilters = Array.from(checkedBoxes).map(box => box.value);
        state.currentPage = 1;
        updateProductView();
        toggleModal(false);
    });

    clearFiltersBtn?.addEventListener('click', () => {
        document.querySelectorAll('#filter-options input:checked').forEach(box => box.checked = false);
        state.activeCategoryFilters = [];
        state.currentPage = 1;
        updateProductView();
        toggleModal(false);
    });

    sortSelect?.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        state.currentPage = 1;
        updateProductView();
    });
}

export function initProductDetailPage() {
    const contentArea = document.getElementById('product-detail-content');
    if (!contentArea) return;
    const slugFromUrl = window.location.pathname.split('/').pop();
    const product = productsData.find(p => p.slug === slugFromUrl);
    if (product && product.active !== false) {
        renderProductDetailPage(product, contentArea);
    } else {
        contentArea.innerHTML = `<p style="text-align: center; padding: 40px;">Produto não encontrado ou indisponível.</p>`;
    }
}

function renderProductDetailPage(product, contentArea) {
    document.title = `${product.name} - Carol Modas`;
    const colorImageMap = {};
    product.options.colors.forEach((color, index) => {
        colorImageMap[color.name] = product.images[index] || product.images[0];
    });
    const colorsHTML = product.options.colors.map((color, index) =>
        `<button class="swatch ${index === 0 ? 'active' : ''}" style="background: ${color.code};" aria-label="${color.name}" data-color-name="${color.name}" data-main-image="/${colorImageMap[color.name]}"></button>`
    ).join('');
    const sizesHTML = product.options.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`).join('');
    const thumbnailsHTML = product.images.map((img) => `<img src="/${img}" alt="${product.name}" class="thumbnail">`).join('');
    const detailsHTML = parseProductDetails(product.details);

    contentArea.innerHTML = `
        <div class="product-layout">
            <div class="product-images">
                <div class="main-image"><img src="/${product.images[0]}" alt="${product.name}" id="mainProductImage"></div>
                <div class="thumbnail-gallery">${thumbnailsHTML}</div>
            </div>
            <div class="product-info">
                <span class="brand">${product.brand}</span>
                <p class="product-category">Categoria: <a href="/produtos.html?category=${product.category}">${product.category}</a></p>
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
                <div class="details-content">${detailsHTML}</div>
            </div>
        </div>`;

    // Anexar event listeners após o conteúdo ser inserido no DOM
    attachDetailEventListeners();
    renderRelatedProducts(product.id);
}

function attachDetailEventListeners() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
    const sizeBtns = document.querySelectorAll('.size-options .size-btn');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    thumbnails.forEach((thumb, index) => {
        if (index === 0) thumb.classList.add('active');
        thumb.addEventListener('click', function () {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImage.src = this.src;
            document.querySelectorAll('.color-swatches .swatch').forEach(s => s.classList.remove('active'));
        });
    });

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function () {
            const selectedColorName = document.getElementById('selected-color-name');
            colorSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            if (selectedColorName) selectedColorName.textContent = this.getAttribute('data-color-name');
            if (mainImage && this.dataset.mainImage) mainImage.src = this.dataset.mainImage;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        });
    });

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            sizeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    increaseBtn?.addEventListener('click', () => {
        const qtyInput = document.getElementById('product-quantity-input');
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    decreaseBtn?.addEventListener('click', () => {
        const qtyInput = document.getElementById('product-quantity-input');
        let currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) qtyInput.value = currentQty - 1;
    });
}
