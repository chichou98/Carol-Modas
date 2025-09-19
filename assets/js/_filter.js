// assets/js/_filter.js (Versão Corrigida com Filtro de Ativos)

import { productsData } from './_database.js';

// AQUI ESTÁ A CORREÇÃO: Criamos uma nova lista que contém apenas os produtos ativos.
const activeProductsData = productsData.filter(product => product.active !== false);

// Função auxiliar para desenhar os cards (pode ser importada do _pages.js para não repetir)
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

export function initFilter() {
    const filterContainer = document.querySelector('.filter-options');
    const productGrid = document.getElementById('product-list-grid');
    const productCountElement = document.querySelector('.product-count');

    if (!filterContainer || !productGrid) return;

    // AQUI ESTÁ A CORREÇÃO: Usa a lista de produtos ativos para gerar as categorias
    const categories = [...new Set(activeProductsData.map(p => p.category))];
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">Todos</button>
        ${categories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('')}
    `;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');

    const filterProducts = (category) => {
        // AQUI ESTÁ A CORREÇÃO: Filtra a partir da lista de produtos ativos
        let filteredProducts = activeProductsData;
        if (category !== 'all') {
            filteredProducts = activeProductsData.filter(p => p.category === category);
        }
        renderProductCards(filteredProducts, productGrid);

        if (productCountElement) {
            // AQUI ESTÁ A CORREÇÃO: A contagem agora reflete apenas os produtos ativos
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
    // A renderização inicial já é feita pelo _pages.js, então não precisamos chamar filterProducts() aqui.
}
