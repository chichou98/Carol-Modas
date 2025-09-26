// assets/js/pages/products.js

import { productsData } from '../_database.js';
import { renderProductCards } from '../utils.js';

// Estado sem as variáveis de paginação
let state = {
    allProducts: [],
    filteredProducts: [],
    sortBy: 'default',
    activeCategoryFilters: [],
};

// A função renderPagination() foi removida daqui.

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

function updateProductView() {
    const productGrid = document.getElementById('product-list-grid');
    if (!productGrid) return;

    state.filteredProducts = state.activeCategoryFilters.length > 0
        ? state.allProducts.filter(p => state.activeCategoryFilters.includes(p.category))
        : [...state.allProducts];

    const productsToSort = [...state.filteredProducts];
    switch (state.sortBy) {
        case 'price-asc': productsToSort.sort((a, b) => a.price.retail - b.price.retail); break;
        case 'price-desc': productsToSort.sort((a, b) => b.price.retail - a.price.retail); break;
        case 'popularity': productsToSort.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    state.filteredProducts = productsToSort;

    // Agora, 'productsToShow' conterá TODOS os produtos filtrados.
    const productsToShow = state.filteredProducts;

    renderProductCards(productsToShow, productGrid);

    // A chamada para renderPagination() foi removida.

    const countElement = document.getElementById('product-count');
    if (countElement) {
        // A mensagem agora mostra o total de resultados.
        countElement.textContent = `Mostrando ${state.filteredProducts.length} resultados`;
    }
}

export function initProductsPage() {
    state.allProducts = productsData.filter(product => product.active !== false);

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
        updateProductView();
        toggleModal(false);
    });

    clearFiltersBtn?.addEventListener('click', () => {
        document.querySelectorAll('#filter-options input:checked').forEach(box => box.checked = false);
        state.activeCategoryFilters = [];
        updateProductView();
        toggleModal(false);
    });

    sortSelect?.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        updateProductView();
    });
}
