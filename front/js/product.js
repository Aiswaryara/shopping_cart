"use strict";
//get query string param
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
//store product from api
let productItems;
//element selectors
const title = document.getElementById("title");
const price = document.getElementById("price");
const colorSelect = document.getElementById("colors");
const description = document.querySelector("#description");
const imageContainer = document.querySelector(".item__img");
const addToCartButton = document.getElementById("addToCart");
const quantity = document.getElementById("quantity");

async function loadProduct() {
  if (!productId) {
    console.error("No product ID found in URL.");
    return;
  }

  productItems = await fetchProduct();
  if (productItems) {
    displayProduct();
  }
}

async function fetchProduct() {
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

function displayProduct() {
  title.innerHTML = productItems.name;
  price.innerHTML = productItems.price;
  description.innerHTML = productItems.description;
  imageContainer.innerHTML = `<img src="${productItems.imageUrl}" alt="${productItems.name}">`;

  // document.getElementById("colors").addEventListener("change", function () {
  //   let selectedColor = this.value;
  // });
  colorSelect.innerHTML = `<option value="">--Please, select a color --</option>`;

  // Check if colors exist before iterating
  if (productItems?.colors && Array.isArray(productItems.colors)) {
    productItems.colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      colorSelect.appendChild(option);
    });
  } else {
    console.error("No colors found for this product.");
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// function saveCart(cart) {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

function addToCart(quantity) {
  const cart = getCart();
  const item = {
    id: productId,
    quantity: quantity,
    color: colorSelect.value,
  };

  //update if we have color and id
  const isExists = cart.find((cartItem) => {
    if (cartItem.color === colorSelect.value && cartItem.id === productId) {
      return true;
    } else {
      return false;
    }
  });

  if (isExists) {
    const addItemToCart = cart.map((cartItem) => {
      if (cartItem.color === colorSelect.value && cartItem.id === productId) {
        return {
          ...cartItem,
          quantity: Number(item.quantity) + Number(quantity),
        };
      } else {
        return cartItem;
      }
    });
    console.log(addItemToCart);
    //localStorage.setItem('cart', JSON.stringify(addItemToCart));
  } else {
    const addItemToCart = [...cart, item];
    localStorage.setItem("cart", JSON.stringify(addItemToCart));
  }
  alert("Product added to cart!");
}

document.addEventListener("DOMContentLoaded", () => {
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      // const id = getProductId();
      // const name = document.getElementById('title').innerHTML;
      // const price = document.getElementById('price').innerHTML;
      // const color = document.getElementById('colors').value;
      const { name, _id } = productItems;
      const qtyValue = parseInt(quantity.value);

      if (!_id || !name) {
        alert("An error has occurred please contact Admin.");
        return;
      }

      if (qtyValue <= 0 || !colorSelect.value) {
        alert("Please select a valid color and quantity.");
        return;
      }

      addToCart(qtyValue);
    });
  }
});

window.onload = loadProduct;
