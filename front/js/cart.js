// Get the cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
// Fetch product details from API
async function fetchProduct(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`
    );
    if (!response.ok) {
      throw new Error("Product not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    document.querySelector(
      ".item"
    ).innerHTML = `<product>Product not found.</product>`;
  }
}

// Update total quantity and total price
async function updateTotals() {
  const cart = getCart();
  let totalQuantity = 0;
  let totalPrice = 0;

  for (const item of cart) {
    const product = await fetchProduct(item.id);
    if (product) {
      totalQuantity += parseInt(item.quantity);
      totalPrice += parseInt(item.quantity) * product.price;
    }
  }

  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
}

// Update quantity
function updateQuantity(productId, color, newQuantity) {
  const cart = getCart();
  const item = cart.find(
    (product) => product.id === productId && product.color === color
  );
  if (item) {
    item.quantity = parseInt(newQuantity);
    saveCart(cart);
    updateTotals();
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Display cart items
async function displayCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart__items");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<product>Your cart is empty.</product>";
    document.getElementById("totalQuantity").textContent = 0;
    document.getElementById("totalPrice").textContent = "0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";

  for (const item of cart) {
    const product = await fetchProduct(item.id);
    if (product) {
      const displayCart = document.createElement("div");
      displayCart.classList.add("cart__item");
      displayCart.setAttribute("data-id", item.id);
      displayCart.setAttribute("data-color", item.color);

      displayCart.innerHTML = `
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}" />
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <product>${item.color}</product>
            <product>€${product.price}</product>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <product>Quantity : </product>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            
          </div>
        </div>
      `;

      // Add event listener to quantity input
      displayCart
        .querySelector(".itemQuantity")
        .addEventListener("change", (e) => {
          const newQuantity = e.target.value;
          if (newQuantity >= 1 && newQuantity <= 100) {
            updateQuantity(item.id, item.color, newQuantity);
          } else {
            alert("Please enter a quantity between 1 and 100.");
          }
        });

      cartItemsContainer.appendChild(displayCart);
    }
  }

  updateTotals();
}

// Init cart on page load
displayCart();
