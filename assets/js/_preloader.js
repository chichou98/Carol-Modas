/**
 * Controla a tela de carregamento (preloader) que aparece ao abrir o site.
 */
export function initPreloader() {
    // 1. Pega o elemento principal da tela de carregamento.
    const preloaderElement = document.getElementById('preloader');

    // 2. Se o elemento não existir na página, o código para aqui.
    if (!preloaderElement) return;

    const logoElement = document.querySelector('.preloader-logo');

    // 3. Espera a página inteira carregar (incluindo imagens e outros recursos).
    window.addEventListener('load', () => {
        // 4. Após 0.5 segundos, adiciona a classe 'visible' para fazer o logo aparecer.
        setTimeout(() => {
            logoElement.classList.add('visible');
        }, 500); // 500ms = meio segundo

        // 5. Após 2 segundos, adiciona a classe 'hidden' para esconder a tela de carregamento.
        setTimeout(() => {
            preloaderElement.classList.add('hidden');
        }, 2000); // 2000ms = 2 segundos
    });
}
