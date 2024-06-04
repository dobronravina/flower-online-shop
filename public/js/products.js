function loadProducts() {
  return fetchJSON('/api/products')
    .then(data => {
	  console.log("products loaded!");
      window.products = data;
      const productsContainer = document.querySelector('.products');
      if (productsContainer) {
        productsContainer.innerHTML = '';
        data.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h2>${product.name}</h2>
            <p>Ціна: ${product.price} грн</p>
            <p>${product.description}</p>
            <button class="add-to-cart-button" data-id="${product.id}">Додати до корзини</button>
          `;
          productsContainer.appendChild(productElement);
        });

        document.querySelectorAll('.product-image').forEach(function(image) {
          image.addEventListener('click', function() {
            const productId = parseInt(image.parentElement.querySelector('.add-to-cart-button').getAttribute('data-id'), 10);
            showAddToCartModal(productId);
          });
        });

        document.querySelectorAll('.add-to-cart-button').forEach(button => {
          button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'), 10);
            showAddToCartModal(productId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

function addToCart(productId) {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Будь ласка, увійдіть, щоб додати товар до корзини.');
    return Promise.resolve(false);
  }

  return fetchJSON(`/api/cart/${username}`)
    .then(cart => {
      const product = cart.find(item => item.id === productId);
      if (product) {
        product.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
      return fetch(`/api/cart/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart })
      });
    })
    .then(response => response.json())
    .then(data => {
		updateCartStatus();
      return data.success;
    })
    .catch(error => {
      console.error('Error:', error);
      return false;
    });
}
