const productItems = document.querySelector(".items");
console.log(productItems);

async function getData() {
  const url = "http://localhost:3000/api/products";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    productItems.innerHTML = json
      .map(
        (product) => `
        <a href="./product.html?id=${product._id}">
          <article>
          <img src="${product.imageUrl}" alt="${product.name}" />
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
        </a>
      `
      )
      .join("");
  } catch (error) {
    console.error(error.message);
  }
}

getData();
