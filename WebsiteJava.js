//CAROUSEL FUNCTION
let currentIndex = 0;

function showSlide(index)
{
    const carouselInner = document.querySelector('.carousel-inner');
    const totalSlides = document.querySelectorAll('.carousel-item').length;

    if (index >= totalSlides)
    {
        currentIndex = 0;
    }
    
    else if (index < 0)
    {
        currentIndex = totalSlides - 1;
    }
    
    else
    {
        currentIndex = index;
    }

    const offset = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;
}

function nextSlide()
{
    showSlide(currentIndex + 1);
}

function prevSlide()
{
    showSlide(currentIndex - 1);
}

setInterval(nextSlide, 5000);

// ADD CART - SHOPPING CART FUNCTION
let cart = [];
let totalPrice = 0;
const cartDropdown = document.getElementById("cart-dropdown");
const shoppingBagIcon = document.getElementById("shopping-bag");
const totalPriceElement = document.getElementById("total-price");

function updateCart()
{
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

  cartDropdown.innerHTML = '';

  cart.forEach(item =>
  {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `${item.name} (${item.size}) - $${item.price.toFixed(2)}`;
    cartDropdown.appendChild(cartItem);
  });

  if (cart.length > 0)
  {
    cartDropdown.style.display = 'block';
  }
  
  else
  {
    cartDropdown.style.display = 'none';
  }
}

function addToCart(name, price, size)
{
  cart.push({ name, price, size });
  totalPrice += price;

  updateCart();
}

shoppingBagIcon.addEventListener("mouseenter", function ()
{
  if (cart.length > 0)
  {
    cartDropdown.style.display = 'block';
  }
});

shoppingBagIcon.addEventListener("mouseleave", function ()
{
  cartDropdown.style.display = 'none';
});

function selectSize(sizeElement)
{
  const allSizes = sizeElement.parentElement.querySelectorAll('.size');
  allSizes.forEach(size => size.classList.remove('selected'));
  sizeElement.classList.add('selected');

  selectedSize = sizeElement.textContent;
}

window.addEventListener('click', function (event)
{
  if (!shoppingBagIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
    cartDropdown.style.display = 'none';
  }
});

