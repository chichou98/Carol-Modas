// assets/js/pages/products.js

import { productsData } from '../_database.js';
import { renderProductCards } from '../utils.js';

let state = {
    allProducts: [],
    filteredProducts: [],
    sortBy: 'default',
    activeCategoryFilters: [],
    currentPage: 1,
    productsPerPage: 8,
};

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
        if (i === state.currentPage) pageLink.classList.add('current');
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

function updateProductView() {
    const productGrid = document.getElementById('product-list-grid');
    if (!productGrid) return;

    state.filteredProducts = state.activeCategoryFilters.length > 0
        ? state.allProducts.filter(p => state.activeCategoryFilters.includes(p.category))
        : [...state.allProducts];

    const productsToSort = [...state.filteredProducts];
    switch (state.sortBy) {
        case 'price-asc': productsToSort.sort((a, b) => a.price - b.price); break;
        case 'price-desc': productsToSort.sort((a, b) => b.price - a.price); break;
        case 'popularity': productsToSort.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    state.filteredProducts = productsToSort;

    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const productsToShow = state.filteredProducts.slice(startIndex, endIndex);

    renderProductCards(productsToShow, productGrid);
    renderPagination();

    const countElement = document.getElementById('product-count');
    if (countElement) {
        const start = state.filteredProducts.length > 0 ? startIndex + 1 : 0;
        const end = Math.min(endIndex, state.filteredProducts.length);
        countElement.textContent = `Mostrando ${start}–${end} de ${state.filteredProducts.length} resultados`;
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
