// assets/js/_shoppingCart.js (Versão Final com Alertas e Confirmações Customizadas)

import { productsData } from './_database.js';
// 1. IMPORTAMOS AS DUAS FUNÇÕES DE MODAL
import { customConfirm, customAlert } from './utils/modals.js';

const shoppingCart = {
    cart: [],
    updateTimeout: null,

    init: function () {
        this.loadCart();
        this.attachEvents();
        this.updateDisplay();
    },

    attachEvents: function () {
        const cartPanel = document.getElementById('cart-panel');
        const cartIcon = document.getElementById('cart-icon');

        cartIcon?.addEventListener('click', (event) => {
            event.stopPropagation();
            this.togglePanel(true);
        });

        document.getElementById('close-cart-btn')?.addEventListener('click', (event) => {
            event.stopPropagation();
            this.togglePanel(false);
        });

        cartPanel?.addEventListener('click', (event) => {
            event.stopPropagation();
            const target = event.target;

            if (target.matches('#btn-checkout')) { this.checkout(); return; }
            if (target.matches('#btn-clear-cart')) { this.clear(); return; }

            const itemElement = target.closest('.cart-item');
            if (!itemElement) return;

            const d = itemElement.dataset;
            const button = target.closest('button');
            if (!button) return;

            if (button.matches('.cart-quantity-increase')) {
                const input = itemElement.querySelector('.cart-quantity-input');
                input.value = parseInt(input.value) + 1;
                this.updateItemQuantity(d.id, d.color, d.size, input.value);
            } else if (button.matches('.cart-quantity-decrease')) {
                const input = itemElement.querySelector('.cart-quantity-input');
                const newValue = parseInt(input.value) - 1;
                if (newValue > 0) {
                    input.value = newValue;
                    this.updateItemQuantity(d.id, d.color, d.size, newValue);
                }
            } else if (button.matches('.remove-item-btn')) {
                this.removeItem(d.id, d.color, d.size);
            }
        });

        cartPanel?.addEventListener('input', (event) => {
            const target = event.target;
            if (target.matches('.cart-quantity-input')) {
                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => {
                    const itemElement = target.closest('.cart-item');
                    const d = itemElement.dataset;
                    this.updateItemQuantity(d.id, d.color, d.size, target.value);
                }, 350);
            }
        });

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
        Object.assign(clone.style, { position: 'fixed', left: `${imgRect.left}px`, top: `${imgRect.top}px`, width: `${imgRect.width}px`, height: `${imgRect.height}px`, zIndex: 1100 });
        document.body.appendChild(clone);
        requestAnimationFrame(() => {
            Object.assign(clone.style, { left: `${cartRect.left + cartRect.width / 2}px`, top: `${cartRect.top + cartRect.height / 2}px`, width: '30px', height: '30px', opacity: '0.5' });
        });
        setTimeout(() => clone.remove(), 700);
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

    // 2. FUNÇÃO ATUALIZADA
    addItemFromDetailPage: async function () { // Função agora é async
        const slugFromUrl = window.location.pathname.split('/').pop();
        const product = productsData.find(p => p.slug === slugFromUrl);
        if (product) {
            const productImage = document.querySelector('.product-images .main-image img');
            this.flyToCartAnimation(productImage);
            const quantity = parseInt(document.getElementById('product-quantity-input')?.value || '1');

            if (isNaN(quantity) || quantity < 1) {
                await customAlert('Por favor, insira uma quantidade válida.');
                return;
            }

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

    updateItemQuantity: function (id, color, size, newQuantity) {
        const productId = parseInt(id);
        let quantity = parseInt(newQuantity);
        const item = this.cart.find(i => i.id == productId && i.color === color && i.size === size);
        if (!item) return;
        if (isNaN(quantity) || quantity < 1) quantity = 1;
        item.quantity = quantity;
        this.saveCart();
        this.updateDisplay();
    },

    removeItem: function (id, color, size) {
        const productId = parseInt(id);
        this.cart = this.cart.filter(i => !(i.id == productId && i.color === color && i.size === size));
        this.saveCart();
        this.updateDisplay();
    },

    updateDisplay: function () {
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartItemsContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        if (cartItemsContainer && totalElement) {
            let totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = `<div class="empty-cart-view"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg><h4>Ops! Ainda nada por aqui...</h4><p>Adicione produtos para vê-los no carrinho.</p></div>`;
            } else {
                cartItemsContainer.innerHTML = this.cart.map(item => `<div class="cart-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}"><div class="cart-item-info"><img src="/${item.image}" alt="${item.name}"><div class="cart-item-details"><h4>${item.name}</h4><p>Tamanho: ${item.size}, Cor: ${item.color}</p><p class="price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p></div></div><div class="cart-item-actions"><div class="quantity-control"><button class="cart-quantity-decrease" aria-label="Diminuir">-</button><input type="number" class="cart-quantity-input" value="${item.quantity}" min="1"><button class="cart-quantity-increase" aria-label="Aumentar">+</button></div><button class="remove-item-btn">Remover</button></div></div>`).join('');
            }
            totalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        }
    },

    // 3. FUNÇÃO ATUALIZADA
    checkout: async function () { // Função agora é async
        if (this.cart.length === 0) {
            await customAlert("Seu carrinho está vazio!");
            return;
        }
        let message = "Olá, Carol Modas! Gostaria de fazer o seguinte pedido:\n\n";
        this.cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `*Produto:* ${item.name}\n*Cor:* ${item.color}, *Tamanho:* ${item.size}\n*Preço Unidade:* R$ ${item.price.toFixed(2).replace('.', ',')}\n*Qtd:* ${item.quantity}\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n--------------------------------\n\n`;
        });
        const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        message += `*TOTAL DO PEDIDO: R$ ${totalPrice.toFixed(2).replace('.', ',')}*`;
        const phoneNumber = "5511969228664";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    },

    clear: async function () {
        const confirmed = await customConfirm("Tem certeza que deseja limpar o carrinho?");
        if (confirmed) {
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
