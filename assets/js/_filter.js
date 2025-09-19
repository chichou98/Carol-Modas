// assets/js/_filter.js (Versão Final com Links de Slug)

import { productsData } from './_database.js';

const activeProductsData = productsData.filter(product => product.active !== false);

function renderProductCards(productsToRender, gridElement) {
    gridElement.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // ATUALIZAÇÃO: O link agora usa a URL amigável
        const productLink = `/produto/${product.slug}`;

        productCard.innerHTML = `
            <a href="${productLink}" class="product-image-link">
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
            </a>
            <div class="product-card-info">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <a href="${productLink}" class="btn-secondary">Ver Detalhes</a>`;
        gridElement.appendChild(productCard);
    });
}

export function initFilter() {
    const filterContainer = document.querySelector('.filter-options');
    const productGrid = document.getElementById('product-list-grid');
    const productCountElement = document.querySelector('.product-count');

    if (!filterContainer || !productGrid) return;

    const categories = [...new Set(activeProductsData.map(p => p.category))];
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">Todos</button>
        ${categories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('')}
    `;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');

    const filterProducts = (category) => {
        let filteredProducts = activeProductsData;
        if (category !== 'all') {
            filteredProducts = activeProductsData.filter(p => p.category === category);
        }
        renderProductCards(filteredProducts, productGrid);
        if (productCountElement) {
            productCountElement.textContent = `Mostrando ${filteredProducts.length} de ${activeProductsData.length} resultados`;
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.category);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('category');
    if (categoryFromURL) {
        filterProducts(categoryFromURL);
        filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.category === categoryFromURL) {
                button.classList.add('active');
            }
        });
    }
}
