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
            const thumbnailsHTML = product.images.map((img, index) => `<img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}">`).join('');
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
                        <div class="selector">
                            <label>Quantidade:</label>
                            <div class="quantity-selector">
                                <button class="quantity-btn" id="decrease-qty">-</button>
                                <span id="product-quantity">1</span>
                                <button class="quantity-btn" id="increase-qty">+</button>
                            </div>
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
            this.activateQuantitySelector();
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
        },
        activateQuantitySelector: function () {
            const decreaseBtn = document.getElementById('decrease-qty');
            const increaseBtn = document.getElementById('increase-qty');
            const quantitySpan = document.getElementById('product-quantity');
            if (!decreaseBtn || !increaseBtn || !quantitySpan) return;
            increaseBtn.addEventListener('click', () => {
                quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
            });
            decreaseBtn.addEventListener('click', () => {
                let currentQty = parseInt(quantitySpan.textContent);
                if (currentQty > 1) {
                    quantitySpan.textContent = currentQty - 1;
                }
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
            document.body.addEventListener('click', (event) => {
                if (event.target.id === 'add-to-cart-btn') { this.addItemFromDetailPage(); }
                if (event.target.matches('.cart-quantity-increase')) { const { id, color, size } = event.target.dataset; this.updateQuantity(id, color, size, 1); }
                if (event.target.matches('.cart-quantity-decrease')) { const { id, color, size } = event.target.dataset; this.updateQuantity(id, color, size, -1); }
                if (event.target.matches('.remove-item-btn')) { const { id, color, size } = event.target.dataset; this.removeItem(id, color, size); }
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
                const quantity = parseInt(document.getElementById('product-quantity')?.textContent || '1');
                const size = document.querySelector('.size-btn.active')?.textContent || product.options.sizes[0];
                const color = document.querySelector('.swatch.active')?.getAttribute('aria-label') || product.options.colors[0].name;
                this.add(product, { size, color, quantity });
                const btn = document.getElementById('add-to-cart-btn');
                btn.textContent = 'Adicionado!';
                btn.style.backgroundColor = '#B5838D';
                setTimeout(() => { btn.textContent = 'Adicionar ao Carrinho'; btn.style.backgroundColor = ''; }, 2000);
            }
        },
        add: function (product, options) {
            const existingItem = this.cart.find(item => item.id == product.id && item.size === options.size && item.color === options.color);
            if (existingItem) {
                existingItem.quantity += options.quantity;
            } else {
                this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], size: options.size, color: options.color, quantity: options.quantity });
            }
            this.saveCart();
            this.updateDisplay();
            this.togglePanel(true);
        },
        updateQuantity: function (id, color, size, change) {
            const item = this.cart.find(i => i.id == id && i.color === color && i.size === size);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    this.removeItem(id, color, size);
                } else {
                    this.saveCart();
                    this.updateDisplay();
                }
            }
        },
        removeItem: function (id, color, size) {
            this.cart = this.cart.filter(i => !(i.id == id && i.color === color && i.size === size));
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
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = `<div class="empty-cart-view"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg><h4>Op! Ainda nada por aqui...</h4><p>Adicione produtos para vê-los no carrinho.</p></div>`;
            } else {
                const cartItemsHTML = this.cart.map(item => {
                    totalItems += item.quantity;
                    totalPrice += item.price * item.quantity;
                    const itemIdentifier = `data-id="${item.id}" data-color="${item.color}" data-size="${item.size}"`;
                    return `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>Tamanho: ${item.size}, Cor: ${item.color}</p>
                                    <p class="price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                            <div class="cart-item-actions">
                                <div class="quantity-control">
                                    <button class="cart-quantity-decrease" ${itemIdentifier}>-</button>
                                    <span>${item.quantity}</span>
                                    <button class="cart-quantity-increase" ${itemIdentifier}>+</button>
                                </div>
                                <button class="remove-item-btn" ${itemIdentifier}>Remover</button>
                            </div>
                        </div>`;
                }).join('');
                cartItemsContainer.innerHTML = cartItemsHTML;
            }
            badge.textContent = totalItems;
            totalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        },
        checkout: function () {
            if (this.cart.length === 0) { alert("Seu carrinho está vazio!"); return; }
            let message = "Olá, Carol Modas! Gostaria de fazer o seguinte pedido:\n\n";
            this.cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                message += `*Produto:* ${item.name}\n`;
                message += `*Cor:* ${item.color}, *Tamanho:* ${item.size}\n`;
                message += `*Preço Unidade:* R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
                message += `*Qtd:* ${item.quantity}\n`;
                message += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
                message += `--------------------------------\n\n`;
            });
            const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            message += `*TOTAL DO PEDIDO: R$ ${totalPrice.toFixed(2).replace('.', ',')}*`;
            const phoneNumber = "5511999999999"; // <-- TROQUE PELO SEU NÚMERO
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
