const CarolModas = {

    // "Banco de dados" de produtos com todos os detalhes necessários
    productsData: [
        {
            id: 1, name: "Calça Vege", price: 289.90, brand: "Carol Modas",
            images: ["assets/images/products/calca-vege.png"],
            description: "Calça com tecido leve e caimento perfeito, ideal para um look casual e elegante.",
            details: ["Tecido leve e confortável", "Cintura com elástico e cordão", "Bolsos laterais funcionais"],
            options: {
                colors: [{ name: "Bege", code: "#D2B48C" }],
                sizes: ["P", "M", "G"]
            }
        },
        {
            id: 2, name: "Blusa Canelada Manga Fina - Preta", price: 89.90, brand: "Carol Modas",
            images: ["assets/images/products/canelado-manga-fina-preto.jpg", "assets/images/products/canelado-manga-fina-vermelho.jpg"],
            description: "Blusa canelada de manga curta, uma peça versátil e indispensável. Tecido com elasticidade que se ajusta ao corpo.",
            details: ["Tecido canelado com elasticidade", "Gola redonda clássica", "Ideal para compor looks diversos"],
            options: {
                colors: [{ name: "Preto", code: "#212121" }, { name: "Vermelho", code: "#B22222" }],
                sizes: ["P", "M", "G", "GG"]
            }
        },
        { id: 3, name: "Blusa Canelada Manga Fina - Vermelha", price: 89.90, brand: "Carol Modas", images: ["assets/images/products/canelado-manga-fina-vermelho.jpg", "assets/images/products/canelado-manga-fina-preto.jpg"], options: { colors: [{ name: "Vermelho", code: "#B22222" }, { name: "Preto", code: "#212121" }], sizes: ["P", "M", "G", "GG"] }, details: ["Detalhe para Blusa Vermelha."] },
        { id: 4, name: "Blusa Canelada", price: 99.90, brand: "Carol Modas", images: ["assets/images/products/canelado.png"], options: { colors: [{ name: "Rosa", code: "#FFC0CB" }], sizes: ["P", "M", "G"] }, details: ["Detalhe para Blusa Canelada."] },
        { id: 5, name: "Calça Ciganinha", price: 159.90, brand: "Carol Modas", images: ["assets/images/products/ciganinha.png"], options: { colors: [{ name: "Estampado", code: "#000000" }], sizes: ["Único"] }, details: ["Detalhe para Calça Ciganinha."] },
        { id: 6, name: "Blusa Listrada - Vermelha", price: 119.90, brand: "Carol Modas", images: ["assets/images/products/listrado-cor-vermelha.png"], options: { colors: [{ name: "Listrado", code: "#ff4500" }], sizes: ["P", "M", "G"] }, details: ["Detalhe para Blusa Listrada."] },
        { id: 7, name: "Blusa Xadrez - Verde", price: 129.90, brand: "Carol Modas", images: ["assets/images/products/xadrez-verde.png"], options: { colors: [{ name: "Xadrez Verde", code: "#008000" }], sizes: ["M", "G"] }, details: ["Detalhe para Blusa Xadrez."] },
    ],

    // Módulo para controlar o Preloader
    preloader: {
        init: function () {
            const preloaderElement = document.getElementById('preloader');
            const logoElement = document.querySelector('.preloader-logo');
            if (!preloaderElement || !logoElement) return;
            window.addEventListener('load', () => {
                setTimeout(() => { logoElement.classList.add('visible'); }, 500);
                setTimeout(() => { preloaderElement.classList.add('hidden'); }, 2000);
            });
        }
    },

    // Módulo para controlar o Carrossel do Banner
    headerCarousel: {
        init: function () {
            const slides = document.querySelectorAll('.slideshow-container .slide');
            if (slides.length === 0) return;
            let currentSlide = 0;
            slides[0].classList.add('active');
            const nextSlide = () => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            };
            setInterval(nextSlide, 6000);
        }
    },

    // Módulo para controlar o Menu Responsivo
    responsiveMenu: {
        init: function () {
            const navToggle = document.querySelector('.mobile-nav-toggle');
            const mainNav = document.querySelector('.main-nav');
            if (!navToggle || !mainNav) return;
            const toggleMenu = () => {
                mainNav.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
            };
            navToggle.addEventListener('click', toggleMenu);
            mainNav.addEventListener('click', (event) => {
                if (event.target === mainNav) { toggleMenu(); }
            });
        }
    },

    // Módulo para controlar a Página de Listagem de Produtos
    productsPage: {
        init: function () {
            const productGrid = document.getElementById('product-list-grid');
            if (!productGrid) return;
            this.render(CarolModas.productsData, productGrid);
        },
        render: function (productsToRender, gridElement) {
            gridElement.innerHTML = '';
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <a href="detalhe-produto.html?id=${product.id}" class="product-image-link">
                        <div class="product-image-container">
                            <img src="${product.images[0]}" alt="${product.name}">
                        </div>
                    </a>
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <a href="detalhe-produto.html?id=${product.id}" class="btn-secondary">Ver Detalhes</a>
                `;
                gridElement.appendChild(productCard);
            });
        }
    },

    // Módulo para controlar a Página de Detalhes do Produto
    productDetailPage: {
        init: function () {
            const contentArea = document.getElementById('product-detail-content');
            if (!contentArea) return;

            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const product = CarolModas.productsData.find(p => p.id === productId);

            if (product) {
                this.render(product, contentArea);
            } else {
                contentArea.innerHTML = `<p style="text-align: center;">Produto não encontrado.</p>`;
            }
        },
        render: function (product, contentArea) {
            document.title = `${product.name} - Carol Modas`;
            const colorsHTML = product.options.colors.map((color, index) => `<button class="swatch ${index === 0 ? 'active' : ''}" style="background-color: ${color.code};" aria-label="${color.name}"></button>`).join('');
            const sizesHTML = product.options.sizes.map((size, index) => `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`).join('');
            const thumbnailsHTML = product.images.map((img, index) => `<img src="${img}" alt="${product.name} - imagem ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}">`).join('');
            const detailsHTML = product.details.map(d => `<li>✨ ${d}</li>`).join('');

            contentArea.innerHTML = `
                <div class="product-layout">
                    <div class="product-images">
                        <div class="main-image"><img src="${product.images[0]}" alt="${product.name}" id="mainProductImage"></div>
                        <div class="thumbnail-gallery">${thumbnailsHTML}</div>
                    </div>
                    <div class="product-info">
                        <span class="brand">${product.brand}</span>
                        <h1>${product.name}</h1>
                        <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                        <div class="selector">
                            <label>Cor: <strong id="selected-color-name">${product.options.colors[0].name}</strong></label>
                            <div class="color-swatches">${colorsHTML}</div>
                        </div>
                        <div class="selector">
                            <label>Tamanho:</label>
                            <div class="size-options">${sizesHTML}</div>
                        </div>
                        <button class="btn-primary btn-buy" id="add-to-cart-btn">Adicionar ao Carrinho</button>
                    </div>
                </div>
                <div class="product-description-details">
                    <div class="details-section">
                        <h2>Sobre este item</h2>
                        <ul>${detailsHTML}</ul>
                    </div>
                </div>`;

            this.activateThumbnailGallery();
            this.activateOptionSelectors();
        },
        activateThumbnailGallery: function () {
            const mainImage = document.getElementById('mainProductImage');
            const thumbnails = document.querySelectorAll('.thumbnail');
            if (!mainImage || thumbnails.length === 0) return;
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function () {
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    mainImage.src = this.src;
                });
            });
        },
        activateOptionSelectors: function () {
            const colorSwatches = document.querySelectorAll('.color-swatches .swatch');
            const sizeBtns = document.querySelectorAll('.size-options .size-btn');
            const selectedColorName = document.getElementById('selected-color-name');
            colorSwatches.forEach(swatch => {
                swatch.addEventListener('click', function () {
                    colorSwatches.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    if (selectedColorName) {
                        selectedColorName.textContent = this.getAttribute('aria-label');
                    }
                });
            });
            sizeBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    sizeBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
    },

    // Módulo para controlar o Carrinho de Compras
    shoppingCart: {
        cart: [],
        init: function () {
            this.loadCart();
            this.attachEvents();
            this.updateDisplay();
        },
        attachEvents: function () {
            document.getElementById('cart-icon')?.addEventListener('click', () => this.togglePanel(true));
            document.getElementById('close-cart-btn')?.addEventListener('click', () => this.togglePanel(false));
            // O event listener para 'add-to-cart-btn' é adicionado dinamicamente na página de produto
            // para garantir que ele só seja ativado depois que o botão existir.
            document.body.addEventListener('click', (event) => {
                if (event.target.id === 'add-to-cart-btn') {
                    this.addItemFromDetailPage();
                }
            });
            document.getElementById('btn-clear-cart')?.addEventListener('click', () => this.clear());
            document.getElementById('btn-checkout')?.addEventListener('click', () => this.checkout());
        },
        togglePanel: (open = true) => document.getElementById('cart-panel')?.classList.toggle('active', open),
        addItemFromDetailPage: function () {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const product = CarolModas.productsData.find(p => p.id === productId);
            if (product) {
                const size = document.querySelector('.size-btn.active')?.textContent || product.options.sizes[0];
                const color = document.querySelector('.swatch.active')?.getAttribute('aria-label') || product.options.colors[0].name;
                this.add(product, { size, color });
                const btn = document.getElementById('add-to-cart-btn');
                btn.textContent = 'Adicionado!';
                btn.style.backgroundColor = '#B5838D';
                setTimeout(() => { btn.textContent = 'Adicionar ao Carrinho'; btn.style.backgroundColor = ''; }, 2000);
            }
        },
        add: function (product, options) {
            const existingItem = this.cart.find(item => item.id === product.id && item.size === options.size && item.color === options.color);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], size: options.size, color: options.color, quantity: 1 });
            }
            this.saveCart();
            this.updateDisplay();
        },
        updateDisplay: function () {
            const badge = document.getElementById('cart-badge');
            const cartItemsContainer = document.getElementById('cart-items');
            const totalElement = document.getElementById('cart-total');
            if (!badge || !cartItemsContainer || !totalElement) return;
            let totalItems = 0;
            let totalPrice = 0;
            cartItemsContainer.innerHTML = this.cart.length === 0 ? '<p class="empty-cart-message">Seu carrinho está vazio.</p>' : '';
            this.cart.forEach(item => {
                totalItems += item.quantity;
                totalPrice += item.price * item.quantity;
                const itemHTML = `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Tamanho: ${item.size}, Cor: ${item.color}</p>
                            <p class="price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="quantity-control"><span>Qtd: ${item.quantity}</span></div>
                    </div>`;
                cartItemsContainer.innerHTML += itemHTML;
            });
            badge.textContent = totalItems;
            totalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        },
        checkout: function () {
            if (this.cart.length === 0) { alert("Seu carrinho está vazio!"); return; }
            let message = "Olá, Carol Modas! Gostaria de fazer o seguinte pedido:\n\n";
            this.cart.forEach(item => {
                message += `*Produto:* ${item.name}\n*Cor:* ${item.color}, *Tamanho:* ${item.size}\n*Qtd:* ${item.quantity}\n\n`;
            });
            const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            message += `*TOTAL DO PEDIDO: R$ ${totalPrice.toFixed(2).replace('.', ',')}*`;
            const phoneNumber = "5511969228664"; // <-- NÚMERO
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },
        clear: function () {
            if (confirm("Tem certeza que deseja limpar o carrinho?")) {
                this.cart = [];
                this.saveCart();
                this.updateDisplay();
            }
        },
        saveCart: function () { localStorage.setItem('carolModasCart', JSON.stringify(this.cart)); },
        loadCart: function () { this.cart = JSON.parse(localStorage.getItem('carolModasCart')) || []; }
    },

    // Função principal que inicializa todas as funcionalidades do site
    init: function () {
        this.preloader.init();
        this.headerCarousel.init();
        this.responsiveMenu.init();
        this.productsPage.init();
        this.productDetailPage.init();
        this.shoppingCart.init();
    }
};

// Dispara a inicialização do site assim que o HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    CarolModas.init();
});
