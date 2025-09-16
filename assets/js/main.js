// Espera a página inteira (incluindo imagens) carregar
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    const logo = document.querySelector('.preloader-logo');

    // 1. Depois de um tempinho (500ms), o logo aparece
    setTimeout(function () {
        logo.classList.add('visible');
    }, 500); // Meio segundo de espera

    // 2. Depois de mais um tempo (2 segundos no total), a tela inteira some
    setTimeout(function () {
        preloader.classList.add('hidden');
    }, 2000); // 2 segundos no total
});

const carouselSlides = document.querySelectorAll('.slideshow-container .slide');
let currentCarouselSlide = 0;

function nextCarouselSlide() {
    // Pega o slide que está visível no momento
    const previousSlide = carouselSlides[currentCarouselSlide];

    // Calcula o índice do próximo slide
    currentCarouselSlide = (currentCarouselSlide + 1) % carouselSlides.length;
    const nextSlide = carouselSlides[currentCarouselSlide];

    // Prepara o próximo slide, colocando-o à direita, pronto para entrar
    nextSlide.classList.remove('previous');

    // Move o slide atual para a esquerda (sai da tela)
    previousSlide.classList.remove('active');
    previousSlide.classList.add('previous');

    // Move o próximo slide para o centro (entra na tela)
    nextSlide.classList.add('active');
}

// Inicia o carrossel
if (carouselSlides.length > 0) {
    carouselSlides[0].classList.add('active'); // Mostra o primeiro slide

    // Troca de imagem a cada 6 segundos
    setInterval(nextCarouselSlide, 6000);
}
