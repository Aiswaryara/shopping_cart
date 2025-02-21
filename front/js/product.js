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

window.onload = loadProduct;
