// assets/js/pages/products.js
// Controla a lógica da página de listagem de produtos (produtos.html).

import { productsData } from '../_database.js';
import { renderProductCards } from '../utils.js';

// Guarda o "estado" atual da página, como filtros e ordenação aplicados.
let state = {
    allProducts: [],            // Guarda todos os produtos ativos.
    filteredProducts: [],       // Guarda os produtos após aplicar um filtro.
    sortBy: 'default',          // Guarda a opção de ordenação atual.
    activeCategoryFilters: [],  // Lista de categorias selecionadas no filtro.
};

/**
 * Cria dinamicamente os checkboxes de categoria dentro do modal de filtro.
 */
function renderFilterOptions() {
    const filterContainer = document.getElementById('filter-options');
    if (!filterContainer) return;

    // Pega todas as categorias únicas da lista de produtos e as ordena.
    const categories = [...new Set(state.allProducts.map(p => p.category))].sort();

    // Cria o HTML para cada checkbox de categoria.
    filterContainer.innerHTML = categories.map(category => `
        <div class="filter-option">
            <input type="checkbox" id="cat-${category.toLowerCase().replace(/\s+/g, '-')}" name="category" value="${category}">
            <label for="cat-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</label>
        </div>
    `).join('');
}

/**
 * Atualiza a lista de produtos na tela com base nos filtros e ordenação.
 */
function updateProductView() {
    const productGrid = document.getElementById('product-list-grid');
    if (!productGrid) return;

    // 1. Filtra os produtos: se houver categorias selecionadas, usa-as. Senão, mostra todos.
    state.filteredProducts = state.activeCategoryFilters.length > 0
        ? state.allProducts.filter(p => state.activeCategoryFilters.includes(p.category))
        : [...state.allProducts];

    // 2. Ordena a lista filtrada com base na opção selecionada.
    const productsToSort = [...state.filteredProducts];
    switch (state.sortBy) {
        case 'price-asc': productsToSort.sort((a, b) => a.price.retail - b.price.retail); break;
        case 'price-desc': productsToSort.sort((a, b) => b.price.retail - a.price.retail); break;
        case 'popularity': productsToSort.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    state.filteredProducts = productsToSort;

    // 3. Renderiza TODOS os produtos filtrados e ordenados (sem paginação).
    renderProductCards(state.filteredProducts, productGrid);

    // 4. Atualiza o texto que informa o número de resultados encontrados.
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = `Mostrando ${state.filteredProducts.length} resultados`;
    }
}

/**
 * Função principal que inicializa a página e configura os eventos de clique.
 */
export function initProductsPage() {
    // Carrega a lista inicial de produtos ativos.
    state.allProducts = productsData.filter(product => product.active !== false);

    // Renderiza as opções de filtro e a visualização inicial dos produtos.
    renderFilterOptions();
    updateProductView();

    // --- Configuração dos Eventos (Cliques e Interações) ---
    const filterBtn = document.getElementById('filter-btn');
    const modal = document.getElementById('filter-modal');
    const overlay = document.getElementById('filter-overlay');
    const closeModalBtn = document.getElementById('close-filter-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const sortSelect = document.getElementById('orderby');

    // Função para abrir/fechar o modal de filtro.
    const toggleModal = (show) => {
        modal.classList.toggle('active', show);
        overlay.classList.toggle('active', show);
    };

    // Adiciona os eventos de clique para cada botão.
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
