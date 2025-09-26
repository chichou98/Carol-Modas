// Arquivo: assets/js/pages/home.js
// Responsável por controlar a lógica específica da página inicial (index.html).

// --- IMPORTAÇÕES ---
// Puxa a lista completa de produtos do nosso "banco de dados" simulado.
import { productsData } from '../_database.js';
// Puxa a função que sabe como criar o HTML dos cards de produto.
import { renderProductCards } from '../utils.js';

/**
 * Função que inicializa os elementos da página inicial.
 */
export function initHomePage() {
    // 1. Encontra na página o local (a grade) onde os produtos em destaque devem ser inseridos.
    const homeGrid = document.getElementById('home-product-grid');

    // 2. Se o local for encontrado, o código continua. Isso evita erros caso a gente esteja em outra página.
    if (homeGrid) {
        // 3. Filtra a lista de produtos, pegando apenas aqueles que estão marcados como "ativos".
        const activeProducts = productsData.filter(product => product.active !== false);

        // 4. Da lista de produtos ativos, pega apenas os 4 primeiros para exibir na vitrine.
        const featuredProducts = activeProducts.slice(0, 4);

        // 5. Por fim, chama a função para efetivamente desenhar os cards desses 4 produtos na tela, dentro da grade.
        renderProductCards(featuredProducts, homeGrid);
    }
}
