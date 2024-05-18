let totalPrice = 0;

function addToCart(productName, price) {
    // Add the product to the shopping bag (you can customize this as per your requirements)
    var shoppingBag = document.getElementById("shopping-bag");
    var item = document.createElement("div");
    //item.textContent = productName + " - $" + price.toFixed(2);
    shoppingBag.appendChild(item);

	totalPrice += price;
    document.getElementById("total-price").textContent = "$" + totalPrice.toFixed(2);

    // Show a tooltip when hovering over the shopping bag icon
    var shoppingBagIcon = document.querySelector(".shopping-bag-icon");
    shoppingBagIcon.title = "Items in Cart: " + productName + " - $" + price.toFixed(2);
}