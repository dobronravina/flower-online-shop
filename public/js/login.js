function initializeLogin() {
  console.log('login.js initialized');
  
  const authContainer = document.getElementById('auth-container');
  if (authContainer) {
    const username = localStorage.getItem('username');
    console.log('username from localStorage:', username);
    if (username) {
      console.log('User is already logged in');
      authContainer.innerHTML = `<p>Ви увійшли як <strong>${username}</strong></p><button id="logout-button">Вийти</button>`;
      document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        window.location.reload();
      });
    } else {
      console.log('User is not logged in');
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Response from server:', data);
            if (data.success) {
              localStorage.setItem('username', data.username);
              localStorage.setItem('token', data.token);
              window.location.href = 'index';
            } else {
              alert('Невірне ім\'я користувача або пароль');
            }
          });
        });
      }
    }
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.isAdmin) {
      const nav = document.querySelector('nav ul');
      const adminLink = document.createElement('li');
      adminLink.innerHTML = '<a href="/admin" id="admin-link">Admin</a>';
      nav.appendChild(adminLink);
    }
  }
}
