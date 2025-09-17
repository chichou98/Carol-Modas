import { productsData } from './_database.js';

const shoppingCart = {
    cart: [],

    init: function () {
        this.loadCart();
        this.attachEvents();
        this.updateDisplay();
    },

    attachEvents: function () {
        const cartPanel = document.getElementById('cart-panel');
        const cartIcon = document.getElementById('cart-icon');

        // Abrir o painel
        cartIcon?.addEventListener('click', (event) => {
            event.stopPropagation();
            this.togglePanel(true);
        });

        // Fechar o painel
        document.getElementById('close-cart-btn')?.addEventListener('click', (event) => {
            event.stopPropagation();
            this.togglePanel(false);
        });

        // Ações dentro do painel
        cartPanel?.addEventListener('click', (event) => {
            event.stopPropagation();
            const target = event.target;
            const d = target.dataset;

            if (target.matches('.cart-quantity-increase')) this.updateQuantity(d.id, d.color, d.size, 1);
            else if (target.matches('.cart-quantity-decrease')) this.updateQuantity(d.id, d.color, d.size, -1);
            else if (target.matches('.remove-item-btn')) this.removeItem(d.id, d.color, d.size);
            else if (target.matches('#btn-clear-cart')) this.clear();
            else if (target.matches('#btn-checkout')) this.checkout();
        });

        // Botão "Adicionar" na página de detalhes
        document.body.addEventListener('click', (event) => {
            if (event.target.id === 'add-to-cart-btn') {
                this.addItemFromDetailPage();
            }
        });
    },

    flyToCartAnimation: function (targetImage) {
        if (!targetImage) return;

        const cartIcon = document.getElementById('cart-icon');
        const imgRect = targetImage.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const clone = targetImage.cloneNode(true);
        clone.classList.add('flying-product-clone');

        clone.style.position = 'fixed';
        clone.style.left = `${imgRect.left}px`;
        clone.style.top = `${imgRect.top}px`;
        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;

        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.left = `${cartRect.left + cartRect.width / 2}px`;
            clone.style.top = `${cartRect.top + cartRect.height / 2}px`;
            clone.style.width = '30px';
            clone.style.height = '30px';
            clone.style.opacity = '0.5';
        });

        setTimeout(() => {
            clone.remove();
        }, 700);
    },

    togglePanel: function (open) {
        const cartPanel = document.getElementById('cart-panel');
        const mainNav = document.querySelector('.main-nav');
        if (open && mainNav?.classList.contains('active')) return;
        if (cartPanel) {
            cartPanel.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        }
    },

    addItemFromDetailPage: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = productsData.find(p => p.id === productId);

        if (product) {
            const productImage = document.querySelector('.product-images .main-image img');
            this.flyToCartAnimation(productImage);

            const quantity = parseInt(document.getElementById('product-quantity')?.textContent || '1');
            const size = document.querySelector('.size-btn.active')?.textContent || product.options.sizes[0];
            const color = document.querySelector('.swatch.active')?.getAttribute('aria-label') || product.options.colors[0].name;
            this.add(product, { size, color, quantity });

            const btn = document.getElementById('add-to-cart-btn');
            if (btn) {
                btn.textContent = 'Adicionado!';
                btn.style.backgroundColor = '#B5838D';
                setTimeout(() => {
                    btn.textContent = 'Adicionar ao Carrinho';
                    btn.style.backgroundColor = '';
                }, 2000);
            }
        }
    },

    add: function (product, options) {
        const existingItem = this.cart.find(item => item.id === product.id && item.size === options.size && item.color === options.color);
        if (existingItem) {
            existingItem.quantity += options.quantity;
        } else {
            this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], size: options.size, color: options.color, quantity: options.quantity });
        }

        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => cartIcon.classList.remove('shake'), 400);
        }

        this.saveCart();
        this.updateDisplay();
        this.togglePanel(true);
    },

    updateQuantity: function (id, color, size, change) {
        const productId = parseInt(id);
        const item = this.cart.find(i => i.id === productId && i.color === color && i.size === size);
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
        const productId = parseInt(id);
        this.cart = this.cart.filter(i => !(i.id === productId && i.color === color && i.size === size));
        this.saveCart();
        this.updateDisplay();
    },

    updateDisplay: function () {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        const cartItemsContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        if (cartItemsContainer && totalElement) {
            let totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = `<div class="empty-cart-view"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg><h4>Ops! Ainda nada por aqui...</h4><p>Adicione produtos para vê-los no carrinho.</p></div>`;
            } else {
                const cartItemsHTML = this.cart.map(item => {
                    const itemIdentifier = `data-id="${item.id}" data-color="${item.color}" data-size="${item.size}"`;
                    return `<div class="cart-item"><div class="cart-item-info"><img src="${item.image}" alt="${item.name}"><div class="cart-item-details"><h4>${item.name}</h4><p>Tamanho: ${item.size}, Cor: ${item.color}</p><p class="price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p></div></div><div class="cart-item-actions"><div class="quantity-control"><button class="cart-quantity-decrease" ${itemIdentifier}>-</button><span>${item.quantity}</span><button class="cart-quantity-increase" ${itemIdentifier}>+</button></div><button class="remove-item-btn" ${itemIdentifier}>Remover</button></div></div>`;
                }).join('');
                cartItemsContainer.innerHTML = cartItemsHTML;
            }
            totalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        }
    },

    checkout: function () {
        if (this.cart.length === 0) { alert("Seu carrinho está vazio!"); return; }
        let message = "Olá, Carol Modas! Gostaria de fazer o seguinte pedido:\n\n";
        this.cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `*Produto:* ${item.name}\n*Cor:* ${item.color}, *Tamanho:* ${item.size}\n*Preço Unidade:* R$ ${item.price.toFixed(2).replace('.', ',')}\n*Qtd:* ${item.quantity}\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n--------------------------------\n\n`;
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
};

export function initShoppingCart() {
    shoppingCart.init();
}
