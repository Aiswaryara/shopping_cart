const productItems = document.querySelector('.items');
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
      .map(product => `
        <article class="item">
          <div class="item__img">
            <img src="${product.imageUrl}" alt="${product.name}" />
          </div>
          <div class="item__content">
            <div class="item__content__titlePrice">
             <h1>${product.name}</h1>
             <p>Price: $${product.price}</p>
            </div>
            <div class="item__content__description">
             <p>${product.description}</p>
            </div>
          </div>
        </article>
      `)
      .join('');
  } 
  catch (error) {
    console.error(error.message);
  }
}

getData();
