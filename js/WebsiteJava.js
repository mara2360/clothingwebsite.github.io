let currentIndex = 0;
let cart = JSON.parse(localStorage.getItem("justLifeCart") || "[]");
const carouselInner = document.querySelector(".carousel-inner");
const slides = document.querySelectorAll(".carousel-item");
const cartDropdown = document.getElementById("cart-dropdown");
const shoppingBagIcon = document.getElementById("shopping-bag");
const totalPriceElement = document.getElementById("total-price");
const cartCountElement = document.getElementById("cart-count");
const cartItemsElement = document.getElementById("cart-items");
const clearCartButton = document.getElementById("clear-cart");
function showSlide(index) {
    if (!carouselInner || slides.length === 0)
        return;
    if (index >= slides.length)
        currentIndex = 0;
    else if (index < 0)
        currentIndex = slides.length - 1;
    else
        currentIndex = index;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`
}
function nextSlide() {
    showSlide(currentIndex + 1)
}
function prevSlide() {
    showSlide(currentIndex - 1)
}
function openCart() {
    if (!cartDropdown || !shoppingBagIcon)
        return;
    cartDropdown.classList.add("open");
    shoppingBagIcon.setAttribute("aria-expanded", "true")
}
function closeCart() {
    if (!cartDropdown || !shoppingBagIcon)
        return;
    cartDropdown.classList.remove("open");
    shoppingBagIcon.setAttribute("aria-expanded", "false")
}
function saveCart() {
    localStorage.setItem("justLifeCart", JSON.stringify(cart))
}
function updateCart() {
    if (!totalPriceElement || !cartCountElement || !cartItemsElement)
        return;
    const total = cart.reduce( (sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
    cartCountElement.textContent = cart.length;
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
        return
    }
    cartItemsElement.innerHTML = cart.map( (item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><br><small>Size ${item.size} - $${item.price.toFixed(2)}</small></div><button class="remove-item" type="button" data-index="${index}" aria-label="Remove ${item.name}">Remove</button></div>`).join("")
}
function addToCart(product) {
    const selectedSize = product.querySelector(".size.selected");
    const addButton = product.querySelector(".add-to-cart");
    if (!selectedSize) {
        addButton.textContent = "Choose a Size";
        window.setTimeout( () => {
            addButton.textContent = "Add to Bag"
        }
        , 1400);
        return
    }
    cart.push({
        name: product.dataset.name,
        price: Number(product.dataset.price),
        size: selectedSize.dataset.size
    });
    saveCart();
    updateCart();
    openCart();
    addButton.textContent = "Added";
    window.setTimeout( () => {
        addButton.textContent = "Add to Bag"
    }
    , 1200)
}
document.querySelectorAll(".size").forEach(sizeButton => {
    sizeButton.addEventListener("click", () => {
        const product = sizeButton.closest(".product");
        product.querySelectorAll(".size").forEach(button => button.classList.remove("selected"));
        sizeButton.classList.add("selected")
    }
    )
}
);
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => addToCart(button.closest(".product")))
}
);
if (shoppingBagIcon) {
    shoppingBagIcon.addEventListener("click", event => {
        event.stopPropagation();
        cartDropdown.classList.contains("open") ? closeCart() : openCart()
    }
    )
}
if (cartItemsElement) {
    cartItemsElement.addEventListener("click", event => {
        const removeButton = event.target.closest(".remove-item");
        if (!removeButton)
            return;
        cart.splice(Number(removeButton.dataset.index), 1);
        saveCart();
        updateCart()
    }
    )
}
if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
        cart = [];
        saveCart();
        updateCart()
    }
    )
}
document.querySelectorAll(".signup-form").forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();
        const button = form.querySelector("button");
        button.textContent = "Subscribed";
        form.reset();
        window.setTimeout( () => {
            button.textContent = "Subscribe"
        }
        , 1600)
    }
    )
}
);
document.addEventListener("click", event => {
    if (!cartDropdown || !shoppingBagIcon)
        return;
    if (!cartDropdown.contains(event.target) && !shoppingBagIcon.contains(event.target))
        closeCart()
}
);
updateCart();
if (slides.length > 1)
    window.setInterval(nextSlide, 5000);
