(() => {
  "use strict";
  const CART_KEY = "justLifeCartV2";
  const legacyCart = JSON.parse(localStorage.getItem("justLifeCart") || "[]");
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "null") || legacyCart.map(item => ({ ...item, quantity: 1 }));
  let lastFocusedElement = null;
  const cartPanel = document.getElementById("cart-dropdown");
  const cartToggle = document.getElementById("shopping-bag");
  const cartCount = document.getElementById("cart-count");
  const totalPrice = document.getElementById("total-price");
  const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const subtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); localStorage.removeItem("justLifeCart"); }
  function buildCart() {
    if (!cartPanel) return;
    cartPanel.setAttribute("role", "dialog"); cartPanel.setAttribute("aria-modal", "true"); cartPanel.setAttribute("aria-labelledby", "cart-title");
    cartPanel.innerHTML = `<div class="cart-header"><div><p class="cart-kicker">Your selection</p><strong id="cart-title">Shopping bag</strong></div><button class="cart-close" type="button" aria-label="Close shopping bag">&times;</button></div><div class="shipping-message" id="shipping-message"></div><div id="cart-items" class="cart-items" aria-live="polite"></div><div class="cart-footer"><div class="cart-subtotal"><span>Subtotal</span><strong id="cart-subtotal">$0.00</strong></div><p>Taxes and shipping are calculated at checkout.</p><button class="checkout-button" type="button">Checkout securely</button><button id="clear-cart" class="clear-cart" type="button">Clear bag</button></div>`;
    document.body.appendChild(cartPanel);
    const overlay = document.createElement("div"); overlay.className = "cart-overlay"; overlay.hidden = true; document.body.appendChild(overlay);
    overlay.addEventListener("click", closeCart); cartPanel.querySelector(".cart-close").addEventListener("click", closeCart);
    cartPanel.querySelector("#clear-cart").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
    cartPanel.querySelector(".checkout-button").addEventListener("click", event => { if (!cart.length) return; event.currentTarget.textContent = "Checkout coming soon"; setTimeout(() => { event.currentTarget.textContent = "Checkout securely"; }, 1800); });
  }
  function renderCart() {
    const itemsNode = document.getElementById("cart-items");
    if (!itemsNode || !cartCount || !totalPrice) return;
    const total = subtotal();
    cartCount.textContent = itemCount();
    totalPrice.textContent = money(total);
    document.getElementById("cart-subtotal").textContent = money(total);
    const left = Math.max(0, 75 - total);
    document.getElementById("shipping-message").innerHTML = left ? `<span>Add <strong>${money(left)}</strong> for free shipping</span><div class="shipping-track"><i style="width:${Math.min(100, total / 75 * 100)}%"></i></div>` : `<span><strong>You unlocked free shipping!</strong></span><div class="shipping-track"><i style="width:100%"></i></div>`;
    itemsNode.innerHTML = cart.length ? cart.map((item, index) => `
      <article class="cart-line">
        ${item.image ? `<img src="${escapeHtml(item.image)}" alt="">` : ""}
        <div class="cart-line-info">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${money(item.price)}</span>
          <label class="cart-size">Size <select data-cart-size data-index="${index}" aria-label="Size for ${escapeHtml(item.name)}">${["XS", "S", "M", "L"].map(size => `<option value="${size}"${size === item.size ? " selected" : ""}>${size}</option>`).join("")}</select></label>
          <div class="quantity-control" aria-label="Quantity for ${escapeHtml(item.name)}"><button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button></div>
        </div>
        <button class="remove-item" type="button" data-action="remove" data-index="${index}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
      </article>`).join("") : `<div class="cart-empty"><span aria-hidden="true">♡</span><strong>Your bag is waiting</strong><p>Explore the collection and add something you love.</p><a href="WomenWebsite.html">Shop women</a><a href="MenWebsite.html">Shop men</a></div>`;
    cartPanel.querySelector(".checkout-button").disabled = !cart.length;
    cartPanel.querySelector(".clear-cart").hidden = !cart.length;
  }
  function openCart() { if (!cartPanel) return; lastFocusedElement = document.activeElement; cartPanel.classList.add("open"); document.querySelector(".cart-overlay").hidden = false; document.body.classList.add("cart-open"); cartToggle.setAttribute("aria-expanded", "true"); cartPanel.querySelector(".cart-close").focus(); }
  function closeCart() { if (!cartPanel) return; cartPanel.classList.remove("open"); document.querySelector(".cart-overlay").hidden = true; document.body.classList.remove("cart-open"); cartToggle.setAttribute("aria-expanded", "false"); lastFocusedElement?.focus(); }
  function addProduct(product, size) { const name = product.dataset.name; const price = Number(product.dataset.price); const image = product.querySelector("img")?.getAttribute("src") || ""; const existing = cart.find(item => item.name === name && item.size === size); if (existing) existing.quantity += 1; else cart.push({ name, price, size, image, quantity: 1 }); saveCart(); renderCart(); openCart(); }

  const quickView = document.createElement("dialog"); quickView.className = "quick-view"; quickView.innerHTML = `<button class="quick-view-close" type="button" aria-label="Close product details">&times;</button><div class="quick-view-content"></div>`; document.body.appendChild(quickView);
  quickView.querySelector(".quick-view-close").addEventListener("click", () => quickView.close()); quickView.addEventListener("click", event => { if (event.target === quickView) quickView.close(); });
  document.querySelectorAll(".product").forEach(product => {
    const image = product.querySelector("img"); image.tabIndex = 0; image.setAttribute("role", "button"); image.setAttribute("aria-label", `View details for ${product.dataset.name}`);
    const openDetails = () => { const type = product.querySelector(".product-type")?.textContent || "Just Life essential"; quickView.querySelector(".quick-view-content").innerHTML = `<div class="quick-view-image"><img src="${image.getAttribute("src")}" alt="${escapeHtml(product.dataset.name)}"></div><div class="quick-view-details"><p class="product-type">${escapeHtml(type)}</p><h2>${escapeHtml(product.dataset.name)}</h2><p class="quick-view-price">${money(Number(product.dataset.price))}</p><p class="quick-view-copy">An easy-to-style piece selected for comfort, repeat wear, and everyday plans.</p><p class="size-label">Select a size</p><div class="quick-sizes">${["XS","S","M","L"].map(size => `<button type="button" data-size="${size}">${size}</button>`).join("")}</div><p class="size-error" aria-live="polite"></p><button class="quick-add" type="button">Add to bag</button><ul><li>Free shipping on orders over $75</li><li>Easy 30-day returns</li></ul></div>`; quickView.showModal(); quickView.querySelectorAll(".quick-sizes button").forEach(button => button.addEventListener("click", () => { quickView.querySelectorAll(".quick-sizes button").forEach(option => option.classList.remove("selected")); button.classList.add("selected"); quickView.querySelector(".size-error").textContent = ""; })); quickView.querySelector(".quick-add").addEventListener("click", () => { const size = quickView.querySelector(".quick-sizes .selected")?.dataset.size; if (!size) { quickView.querySelector(".size-error").textContent = "Please choose a size first."; return; } quickView.close(); addProduct(product, size); }); };
    image.addEventListener("click", openDetails); image.addEventListener("keydown", event => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); openDetails(); } });
    product.querySelectorAll(".size").forEach(button => button.addEventListener("click", () => { product.querySelectorAll(".size").forEach(option => option.classList.remove("selected")); button.classList.add("selected"); }));
    product.querySelector(".add-to-cart")?.addEventListener("click", event => { const size = product.querySelector(".size.selected")?.dataset.size; if (!size) { event.currentTarget.textContent = "Select a size first"; setTimeout(() => { event.currentTarget.textContent = "Quick Add"; }, 1500); return; } addProduct(product, size); });
  });
  function initializeCollectionTools() {
    const grid = document.querySelector(".collection-grid-products");
    const toolbar = document.querySelector(".collection-toolbar");
    if (!grid || !toolbar) return;
    const products = [...grid.querySelectorAll(".product")];
    products.forEach((product, index) => { product.dataset.featuredOrder = index; });
    const categories = [...new Set(products.map(product => product.querySelector(".product-type")?.textContent.trim()).filter(Boolean))].sort();
    toolbar.innerHTML = `<label class="collection-control"><span>Filter</span><select id="category-filter"><option value="all">All categories</option>${categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}</select></label><span id="visible-products">${products.length} styles</span><label class="collection-control sort-control"><span>Sort by</span><select id="product-sort"><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name-asc">Name: A–Z</option></select></label>`;
    const filterSelect = toolbar.querySelector("#category-filter");
    const sortSelect = toolbar.querySelector("#product-sort");
    const count = toolbar.querySelector("#visible-products");
    const refresh = () => {
      const category = filterSelect.value;
      const sorted = [...products].sort((a, b) => {
        if (sortSelect.value === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
        if (sortSelect.value === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
        if (sortSelect.value === "name-asc") return a.dataset.name.localeCompare(b.dataset.name);
        return Number(a.dataset.featuredOrder) - Number(b.dataset.featuredOrder);
      });
      sorted.forEach(product => {
        const type = product.querySelector(".product-type")?.textContent.trim();
        product.hidden = category !== "all" && type !== category;
        grid.appendChild(product);
      });
      const visible = products.filter(product => !product.hidden).length;
      count.textContent = `${visible} ${visible === 1 ? "style" : "styles"}`;
    };
    filterSelect.addEventListener("change", refresh);
    sortSelect.addEventListener("change", refresh);
  }

  initializeCollectionTools();
  buildCart(); renderCart(); cartToggle?.addEventListener("click", () => cartPanel.classList.contains("open") ? closeCart() : openCart());
  document.addEventListener("click", event => { const button = event.target.closest("[data-action]"); if (!button?.closest(".cart-panel")) return; const index = Number(button.dataset.index); if (button.dataset.action === "increase") cart[index].quantity += 1; if (button.dataset.action === "decrease") cart[index].quantity -= 1; if (button.dataset.action === "remove" || cart[index]?.quantity === 0) cart.splice(index, 1); saveCart(); renderCart(); });
  document.addEventListener("change", event => {
    const select = event.target.closest("[data-cart-size]");
    if (!select) return;
    const index = Number(select.dataset.index);
    const item = cart[index];
    const duplicateIndex = cart.findIndex((candidate, candidateIndex) => candidateIndex !== index && candidate.name === item.name && candidate.size === select.value);
    if (duplicateIndex >= 0) {
      cart[duplicateIndex].quantity += item.quantity;
      cart.splice(index, 1);
    } else item.size = select.value;
    saveCart();
    renderCart();
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && cartPanel?.classList.contains("open")) closeCart(); });
  document.querySelectorAll(".wishlist-button").forEach(button => button.addEventListener("click", () => { button.classList.toggle("saved"); button.setAttribute("aria-pressed", String(button.classList.contains("saved"))); const icon = button.querySelector("i"); if (icon) icon.className = button.classList.contains("saved") ? "fas fa-heart" : "far fa-heart"; }));
  document.querySelectorAll(".signup-form").forEach(form => form.addEventListener("submit", event => { event.preventDefault(); const button = form.querySelector("button"); button.textContent = "You're on the list!"; button.disabled = true; }));
})();
