function initializeRegister() {
  console.log('register.js initialized');
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      fetch('/api/register', {
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
			
		  const username = document.getElementById('username').value;
		  const password = document.getElementById('password').value;
          alert(`Реєстрація успішна! Тепер ви можете увійти. логін ${username} пароль ${password}`);
          window.location.href = 'login';
        } else {
          alert('Користувач з таким іменем вже існує.');
        }
      });
    });
  }
}
