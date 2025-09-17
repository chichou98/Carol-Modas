export function initCarousel() {
    const slides = document.querySelectorAll('.slideshow-container .slide');
    if (slides.length === 0) return;
    let currentSlide = 0;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');

    const nextSlide = () => {
        if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    };
    setInterval(nextSlide, 6000);
}
