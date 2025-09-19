// assets/js/utils.js

/**
 * Aplica formatação inline como negrito.
 * Procura por **texto** e substitui por <strong>texto</strong>.
 */
export function applyInlineFormatting(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Interpreta a formatação dos detalhes do produto.
 */
export function parseProductDetails(details) {
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

/**
 * Desenha os cards de produto na tela.
 */
export function renderProductCards(productsToRender, gridElement) {
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
