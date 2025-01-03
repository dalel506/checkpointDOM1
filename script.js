// Product class
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// ShoppingCartItem class
class ShoppingCartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

// ShoppingCart class
class ShoppingCart {
    constructor() {
        this.items = [];
        this.totalCost = 0;
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new ShoppingCartItem(product, quantity));
        }
        this.updateTotalCost();
    }

    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.product.id === productId);
        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
        }
        this.updateTotalCost();
    }

    updateTotalCost() {
        this.totalCost = this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    displayCart() {
        this.items.forEach(item => {
            console.log(`${item.product.name}: ${item.quantity} x $${item.product.price} = $${item.getTotalPrice()}`);
        });
        console.log(`Total: $${this.totalCost}`);
    }

    toggleFavorite(element) {
        element.classList.toggle("fa-heart");
        element.classList.toggle("fa-heart-o");
    }
}

// DOM Manipulation
class ShopUI {
    constructor(cart, containerId, totalId) {
        this.cart = cart;
        this.container = document.getElementById(containerId);
        this.totalPriceElement = document.getElementById(totalId);
        this.init();
    }

    init() {
        const boxes = this.container.getElementsByClassName("box");
        for (const box of boxes) {
            const id = parseInt(box.dataset.id);
            const name = box.querySelector("h2").innerText;
            const price = parseInt(box.querySelector(".price").innerText.substring(1));

            const product = new Product(id, name, price);

            const plusBtn = box.querySelector(".plus");
            const minusBtn = box.querySelector(".minus");
            const deleteBtn = box.querySelector(".delete-btn");
            const quantityInput = box.querySelector("input.quantity");
            const heartIcon = box.querySelector(".heart");

            plusBtn.addEventListener("click", () => {
                this.cart.addItem(product);
                quantityInput.value = parseInt(quantityInput.value) + 1;
                this.updateTotal();
            });

            minusBtn.addEventListener("click", () => {
                if (parseInt(quantityInput.value) > 1) {
                    this.cart.addItem(product, -1);
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    this.updateTotal();
                }
            });

            deleteBtn.addEventListener("click", () => {
                this.cart.removeItem(id);
                box.remove();
                this.updateTotal();
            });

            heartIcon.addEventListener("click", () => {
                this.cart.toggleFavorite(heartIcon);
            });
        }
    }

    updateTotal() {
        this.cart.updateTotalCost();
        this.totalPriceElement.innerText = `Total Price: $${this.cart.totalCost}`;
    }
}

// Initialize
const cart = new ShoppingCart();
const shopUI = new ShopUI(cart, "container", "total");