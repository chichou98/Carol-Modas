// assets/js/utils.js

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} O valor formatado como string (ex: "R$ 123,45").
 */
export const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

/**
 * Aplica formatação inline simples (Markdown-like) em um texto.
 * @param {string} text - O texto a ser formatado.
 * @returns {string} O texto com as tags HTML <strong> e <em> aplicadas.
 */
export function applyInlineFormatting(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
}

/**
 * Converte um array de linhas de texto em HTML.
 * @param {string[]} details - Um array de strings representando as linhas do detalhe.
 * @returns {string} Uma string contendo o HTML gerado.
 */
export function parseProductDetails(details) {
    if (!Array.isArray(details)) return '';
    let html = '';
    let isInsideList = false;
    let hasMainTitle = false;
    for (const line of details) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        const isListItem = trimmedLine.startsWith('-') || trimmedLine.startsWith('*');
        if (isListItem) {
            if (!isInsideList) {
                html += '<ul class="details-sublist">';
                isInsideList = true;
            }
            const itemContent = applyInlineFormatting(trimmedLine.substring(1).trim());
            html += `<li>${itemContent}</li>`;
        } else {
            if (isInsideList) {
                html += '</ul>';
                isInsideList = false;
            }
            const formattedLine = applyInlineFormatting(trimmedLine);
            if (trimmedLine.endsWith(':')) {
                html += `<h4 class="details-heading">${formattedLine}</h4>`;
            } else {
                if (!hasMainTitle) {
                    html += `<h3 class="details-main-title">${formattedLine}</h3>`;
                    hasMainTitle = true;
                } else {
                    html += `<p class="details-paragraph">${formattedLine}</p>`;
                }
            }
        }
    }
    if (isInsideList) {
        html += '</ul>';
    }
    return html;
}

/**
 * Cria o elemento HTML para um único card de produto.
 * @param {object} product - O objeto do produto.
 * @param {number} currentPage - A página atual para o link de retorno.
 * @returns {HTMLElement} O elemento <div> do card de produto.
 */
function createProductCard(product, currentPage = 1) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    const productLink = `/produto/${product.slug || ''}?page=${currentPage}`;
    const productImage = product.images && product.images.length > 0 ? `/${product.images[0]}` : '/assets/images/placeholder.png';

    const priceRetailFormatted = `R$ ${product.price?.retail.toFixed(2).replace('.', ',')}`;
    const priceWholesaleFormatted = `R$ ${product.price?.wholesale.toFixed(2).replace('.', ',')}`;

    productCard.innerHTML = `
        <a href="${productLink}" class="product-image-link">
            <div class="product-image-container">
                <img src="${productImage}" alt="${product.name || 'Imagem do produto'}">
            </div>
        </a>
        <div class="product-card-info">
            <div>
                <p class="product-card-category">${product.category || 'Sem categoria'}</p>
                <h3><a href="${productLink}">${product.name || 'Produto sem nome'}</a></h3>
                <div class="price-container">
                    <p class="price retail-price">${priceRetailFormatted}</p>
                    <p class="price wholesale-price">${priceWholesaleFormatted} <span>(Atacado)</span></p>
                </div>
            </div>
            <a href="${productLink}" class="btn-secondary">Ver Detalhes</a>
        </div>`;
    return productCard;
}

/**
 * Renderiza os cards de produto em um elemento da grade na tela.
 * @param {object[]} productsToRender - Array de produtos a serem renderizados.
 * @param {HTMLElement} gridElement - O elemento do DOM onde os cards serão inseridos.
 * @param {number} currentPage - A página atual para os links de retorno.
 */
export function renderProductCards(productsToRender, gridElement, currentPage = 1) {
    if (!gridElement || !Array.isArray(productsToRender)) {
        console.error('Parâmetros inválidos para renderProductCards.');
        return;
    }
    gridElement.innerHTML = '';
    if (productsToRender.length === 0) {
        gridElement.innerHTML = `<p class="no-products-found">Nenhum produto encontrado com os filtros selecionados.</p>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    productsToRender.forEach(product => {
        const productCardElement = createProductCard(product, currentPage);
        fragment.appendChild(productCardElement);
    });
    gridElement.appendChild(fragment);
}
