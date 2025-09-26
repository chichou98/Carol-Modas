/**
 * Inicializa e controla o carrossel de imagens da página inicial.
 */
export function initCarousel() {
    // 1. Pega todos os elementos de slide da página.
    const slides = document.querySelectorAll('.slideshow-container .slide');

    // 2. Se não houver slides, a função para aqui para evitar erros.
    if (slides.length === 0) return;

    // 3. Define qual slide é o primeiro a ser exibido (o slide 0).
    let currentSlide = 0;
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active'); // Torna o primeiro slide visível
    }

    /**
     * Função que avança para o próximo slide.
     */
    const nextSlide = () => {
        // Remove a classe 'active' do slide atual para escondê-lo.
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active');
        }

        // Calcula o índice do próximo slide. O cálculo com '%' faz o carrossel
        // voltar ao primeiro slide (0) depois de chegar ao último, criando um loop.
        currentSlide = (currentSlide + 1) % slides.length;

        // Adiciona a classe 'active' ao novo slide para exibi-lo.
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
    };

    // 4. Configura o carrossel para chamar a função `nextSlide` a cada 6 segundos (6000ms).
    setInterval(nextSlide, 6000);
}
