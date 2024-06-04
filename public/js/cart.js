function initCart() {
  if (window.location.pathname === '/cart') {
	  console.log('cart.js loaded');
	  const username = localStorage.getItem('username');
	  if (username) {
		loadCart(username);
	  } else {
		document.querySelector('.cart-items').innerHTML = '<p>Будь ласка, увійдіть, щоб переглянути корзину.</p>';
	  }

	  const checkoutButton = document.getElementById('checkout-button');
	  if (checkoutButton) {
		checkoutButton.addEventListener('click', function() {
		  alert('Функціонал "Оформлення замовлення" ще в розробці.');
		});
	  }
  }
}

function loadCart(username) {
  console.log(`Loading cart for user: ${username}`);
  fetch(`/api/cart/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(cart => {
      console.log('Cart loaded:', cart);
      const cartItemsContainer = document.querySelector('.cart-items');
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;
      cart.forEach(item => {
        const product = window.products.find(p => p.id === item.id); // Знайти продукт за id
        if (product) {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details">
              <h2>${product.name}</h2>
              <p>Ціна: ${product.price} грн</p>
              <p>Кількість: ${item.quantity}</p>
              <button class="remove-from-cart-button" data-id="${item.id}">Видалити</button>
            </div>
          `;
          cartItemsContainer.appendChild(cartItem);
          totalPrice += product.price * item.quantity;
        } else {
          console.error(`Product with id ${item.id} not found`);
        }
      });
      document.getElementById('total-price').textContent = totalPrice;

      document.querySelectorAll('.remove-from-cart-button').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          console.log(`Removing product with id: ${productId} from cart`);
          removeFromCart(username, productId);
        });
      });
    })
    .catch(error => {
      console.error('Error loading cart:', error);
      document.querySelector('.cart-items').innerHTML = '<p>Помилка завантаження корзини.</p>';
    });
}

function removeFromCart(username, productId) {
  console.log(`Sending request to remove product with id: ${productId} for user: ${username}`);
  fetch(`/api/cart/${username}/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: productId })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server:', data);
      if (data.success) {
        loadCart(username);
        updateCartCount(); // Оновлюємо кількість товарів у корзині
      } else {
        console.error('Error removing item from cart:', data.message);
      }
    })
    .catch(error => {
      console.error('Error removing item from cart:', error);
    });
}

function updateCartCount() {
  const username = localStorage.getItem('username');
  if (username) {
    fetch(`/api/cart/${username}`)
      .then(response => response.json())
      .then(cart => {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = cart.length;
        } else {
          console.error('Cart count element not found');
        }
      })
      .catch(error => {
        console.error('Error loading cart count:', error);
      });
  }
}
