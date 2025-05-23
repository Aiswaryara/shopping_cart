// Get the cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
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
    document.getElementById(
      "cart__items"
    ).innerHTML = `<product>Product not found.</product>`;
  }
}

// Update total quantity and total price using reduce()
async function updateTotals() {
  const cart = getCart();
  const totals = await cart.reduce(async (accPromise, item) => {
    const acc = await accPromise;
    const product = await fetchProduct(item.id);
    if (product) {
      acc.totalQuantity += parseInt(item.quantity);
      acc.totalPrice += parseInt(item.quantity) * product.price;
    }
    return acc;
  }, Promise.resolve({ totalQuantity: 0, totalPrice: 0 }));

  document.getElementById("totalQuantity").textContent = totals.totalQuantity;
  document.getElementById("totalPrice").textContent =
    totals.totalPrice.toFixed(2);
}

// Update quantity
function updateQuantity(productId, color, newQuantity) {
  const cart = getCart();
  const item = cart.find((p) => p.id === productId && p.color === color);
  if (item) {
    item.quantity = parseInt(newQuantity);
    saveCart(cart);
    updateTotals();
  }
}

// Delete item
function deleteItem(productId, color) {
  let cart = getCart();
  cart = cart.filter((p) => !(p.id === productId && p.color === color));
  saveCart(cart);
  displayCart(); // Re-render the cart
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
      const displayCart = document.createElement("article");
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
            <p>${item.color}</p>
            <p>€${product.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantity : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Delete</p>
            </div>
          </div>
        </div>
      `;

      // Quantity change handler
      displayCart
        .querySelector(".itemQuantity")
        .addEventListener("change", (e) => {
          const newQuantity = parseInt(e.target.value);
          if (newQuantity >= 1 && newQuantity <= 100) {
            updateQuantity(item.id, item.color, newQuantity);
          } else {
            alert("Please enter a quantity between 1 and 100.");
            e.target.value = item.quantity;
          }
        });

      // Delete button handler
      displayCart.querySelector(".deleteItem").addEventListener("click", () => {
        deleteItem(item.id, item.color);
      });

      cartItemsContainer.appendChild(displayCart);
    }
  }

  updateTotals();
}
// === Form validation ===
const myForm = document.querySelector(".cart__order__form");

// Disable browser's native validation
myForm.setAttribute("novalidate", true);

myForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // === First Name ===
  const firstNameInput = document.getElementById("firstName");
  const firstNameError = document.getElementById("firstNameErrorMsg");
  const firstName = firstNameInput.value.trim();

  if (firstName === "") {
    firstNameError.textContent = "First Name is required.";
    firstNameInput.parentNode.classList.add("error");
    firstNameInput.parentNode.classList.remove("success");
  } else {
    firstNameError.textContent = "";
    firstNameInput.parentNode.classList.add("success");
    firstNameInput.parentNode.classList.remove("error");
  }

  // === Last Name ===
  const lastNameInput = document.getElementById("lastName");
  const lastNameError = document.getElementById("lastNameErrorMsg");
  const lastName = lastNameInput.value.trim();

  if (lastName === "") {
    lastNameError.textContent = "Last Name is required.";
    lastNameInput.parentNode.classList.add("error");
    lastNameInput.parentNode.classList.remove("success");
  } else {
    lastNameError.textContent = "";
    lastNameInput.parentNode.classList.add("success");
    lastNameInput.parentNode.classList.remove("error");
  }

  // === Address ===
  const addressInput = document.getElementById("address");
  const addressError = document.getElementById("addressErrorMsg");
  const address = addressInput.value.trim();

  if (address === "") {
    addressError.textContent = "Address is required.";
    addressInput.parentNode.classList.add("error");
    addressInput.parentNode.classList.remove("success");
  } else {
    addressError.textContent = "";
    addressInput.parentNode.classList.add("success");
    addressInput.parentNode.classList.remove("error");
  }

  // === City ===
  const cityInput = document.getElementById("city");
  const cityError = document.getElementById("cityErrorMsg");
  const city = cityInput.value.trim();

  if (city === "") {
    cityError.textContent = "City is required.";
    cityInput.parentNode.classList.add("error");
    cityInput.parentNode.classList.remove("success");
  } else {
    cityError.textContent = "";
    cityInput.parentNode.classList.add("success");
    cityInput.parentNode.classList.remove("error");
  }

  // === Email ===
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailErrorMsg");
  const email = emailInput.value.trim();

  if (email === "") {
    emailError.textContent = "Email is required.";
    emailInput.parentNode.classList.add("error");
    emailInput.parentNode.classList.remove("success");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.parentNode.classList.add("error");
    emailInput.parentNode.classList.remove("success");
  } else {
    emailError.textContent = "";
    emailInput.parentNode.classList.add("success");
    emailInput.parentNode.classList.remove("error");
  }

  // === Submit Form if Valid ===
  const hasErrors =
    firstNameError.textContent ||
    lastNameError.textContent ||
    addressError.textContent ||
    cityError.textContent ||
    emailError.textContent;

  if (!hasErrors) {
    // storing in local storage before submit
    localStorage.setItem(
      "orderDetails",
      JSON.stringify({
        firstName,
        lastName,
        address,
        city,
        email,
      })
    );

    submitOrder();
  }
});
// === Submit Order ===
async function submitOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to your cart.");
    return;
  }

  // Get user details from the form
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  // Prepare the order data
  const orderData = {
    contact: {
      firstName,
      lastName,
      address,
      city,
      email,
    },
    products: cart.map((item) => item.id),
  };
  console.log(orderData);

  try {
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(
        "There was an error placing your order. Please try again."
      );
    }

    const orderResponse = await response.json();
    console.log("Order Response:", orderResponse);
    const orderId = orderResponse.orderId;
    console.log("Order ID:", orderId);
    localStorage.clear();

    window.location.href = `confirmation.html?orderId=${orderId}`;
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("There was an error submitting your order. Please try again.");
  }
}

// Init cart on page load
displayCart();
