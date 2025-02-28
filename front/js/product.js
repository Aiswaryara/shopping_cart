function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

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
    document.querySelector(".item").innerHTML = `<p>Product not found.</p>`;
  }
}

function displayProduct(product) {
  document.querySelector("#title").innerHTML = product.name;
  document.querySelector("#price").innerHTML = product.price;
  document.querySelector("#description").innerHTML = product.description;

  const imageContainer = document.querySelector(".item__img");
  imageContainer.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}">`;
}

async function loadProduct() {
  const productId = getProductId();
  if (!productId) {
    console.error("No product ID found in URL.");
    return;
  }

  const product = await fetchProduct(productId);
  if (product) {
    displayProduct(product);
  }
}

document.getElementById("colors").addEventListener("change", function () {
  let selectedColor = this.value;
});

window.onload = loadProduct;

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, name, price, color, quantity) {
  let cart = getCart();

  alert("Product added to cart!");
}

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButton = document.getElementById("addToCart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const name = document.getElementById("title").innerHTML;
      const price = document.getElementById("price").innerHTML;
      const color = document.getElementById("colors").value;
      const quantity = parseInt(document.getElementById("quantity").value);

      if (!id || !name || !price || !color || quantity <= 0) {
        alert("Please select a valid color and quantity.");
        return;
      }

      addToCart(id, name, price, color, quantity);
    });
  }
});
