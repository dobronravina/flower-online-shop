function createMenu() {
  const header = document.createElement('header');
  header.innerHTML = `
    <img src="/images/header.jpg" alt="Квітковий Магазин">
    <h1>Квітковий Магазин</h1>
    <nav>
      <ul>
        <li><a href="index" id="nav-home">Головна</a></li>
        <li><a href="partners" id="nav-partners">Для партнерів</a></li>
        <li><a href="about" id="nav-about">Про нас</a></li>
        <li><a href="cart" id="nav-cart">Корзина (<span id="cart-count">0</span>)</a></li>
        <li><a href="login" id="login-button">Авторизація</a></li>
      </ul>
    </nav>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  const loginButton = document.getElementById('login-button');
  const username = localStorage.getItem('username');
  if (username) {
    loginButton.textContent = `Вітаємо, ${username}`;
    loginButton.href = 'login';
  } else {
    loginButton.href = 'login';
  }

  updateCartStatus();

  const path = window.location.pathname;
  if (path === '/index') {
    document.getElementById('nav-home').classList.add('active');
  } else if (path === '/partners') {
    document.getElementById('nav-partners').classList.add('active');
  } else if (path === '/about') {
    document.getElementById('nav-about').classList.add('active');
  } else if (path === '/cart') {
    document.getElementById('nav-cart').classList.add('active');
  } else if (path === '/login') {
    document.getElementById('login-button').classList.add('active');
  }
}

function updateCartStatus() {
  const username = localStorage.getItem('username');
  if (username) {
    fetchJSON(`/api/cart/${username}`)
      .then(cart => {
        const cartButton = document.getElementById('nav-cart');
        const itemCount = cart.length;
        if (itemCount === 0) {
          cartButton.textContent = 'Корзина (пусто)';
        } else {
          cartButton.innerHTML = `Корзина (<span id="cart-count">${itemCount}</span>)`;
        }
      })
      .catch(error => {
        console.error('Error loading cart:', error);
      });
  }
}

function fetchJSON(url, options) {
  return fetch(url, options).then(response => response.json());
}


function loadPageWithToken(url) {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(url, {
      headers: {
        'authorization': token
      }
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then(text => { throw new Error(text) });
      }
    })
    .then(html => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(error => {
      console.error('Access denied:', error);
      alert(error.message);
    });
  } else {
    alert('No token found. Please log in first.');
  }
}