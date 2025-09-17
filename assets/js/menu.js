export function initMenu() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!navToggle || !mainNav) return;

    const toggleMenu = () => {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique "vaze" para a janela
        toggleMenu();
    });

    // Impede que cliques DENTRO do painel do menu o fechem
    mainNav.addEventListener('click', (event) => event.stopPropagation());
}
