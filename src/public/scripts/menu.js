async function fetchMenu(category) {
    const response = await fetch(`/api/menu/${category}`);
    const products = await response.json();

    const container = document.getElementById("menu-container");
    container.innerHTML = ""; 

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ${product.price} DKK</p>
        `;
        container.appendChild(productCard);
    });
}

fetchMenu("sandwiches");
