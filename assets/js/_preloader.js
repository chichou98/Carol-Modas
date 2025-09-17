export function initPreloader() {
    const preloaderElement = document.getElementById('preloader');
    if (!preloaderElement) return;

    const logoElement = document.querySelector('.preloader-logo');
    window.addEventListener('load', () => {
        setTimeout(() => { logoElement.classList.add('visible'); }, 500);
        setTimeout(() => { preloaderElement.classList.add('hidden'); }, 2000);
    });
}
