function initAdmin() {
	  
  if (window.location.pathname === '/admin') {
	console.log('admin.js loaded');


	const noAccessPage = document.getElementById('admin-no-access-container');
    if (noAccessPage) {
		loadPageWithToken('/admin');
		return;		
	}

	document.getElementById('add-user-form').addEventListener('submit', function(event) {
		event.preventDefault();
		const username = document.getElementById('new-username').value;
		const password = document.getElementById('new-password').value;
		const role = document.getElementById('new-role').value;
		const isAdmin = role === 'admin';

		fetch('/api/register', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({ username, password, isAdmin })
		})
		.then(response => response.json())
		.then(data => {
		  if (data.success) {
			alert('Користувача додано успішно');
			loadUsers();
		  } else {
			alert('Помилка при додаванні користувача');
		  }
		});
	});
	
	
	
	document.getElementById('delete-user-form').addEventListener('submit', function(event) {
		event.preventDefault();
		const username = document.getElementById('delete-username').value;
		const currentUser = localStorage.getItem('username');

		if (username === currentUser) {
		  alert('Ви не можете видалити себе.');
		  return;
		}

		fetch('/api/users')
		  .then(response => response.json())
		  .then(users => {
			const user = users.find(user => user.username === username);
			if (user) {
			  if (confirm(`Користувач ${username} знайдено. Ви впевнені, що хочете його видалити?`)) {
				deleteUser(username);
			  }
			} else {
			  alert(`Користувача ${username} не знайдено.`);
			}
		  });
  });

	loadUsers();

  }
}

function deleteUser(username) {
    const currentUser = localStorage.getItem('username');
    if (username === currentUser) {
      alert('Ви не можете видалити себе.');
      return;
    }

    fetch(`/api/users/${username}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`Користувача ${username} видалено успішно`);
        loadUsers();
      } else {
        alert(`Помилка при видаленні користувача ${username}`);
      }
    });
  }
	
function loadUsers() {
	fetch('/api/users')
	  .then(response => response.json())
	  .then(users => {
		const usersTableBody = document.querySelector('#users-table tbody');
		usersTableBody.innerHTML = '';
		let userCount = 0;
		let adminCount = 0;
		users.forEach(user => {
		  const userRow = document.createElement('tr');
		  userRow.innerHTML = `
			<td>${user.username}</td>
			<td>${user.isAdmin ? 'Адміністратор' : 'Користувач'}</td>
		  `;
		  usersTableBody.appendChild(userRow);
		  if (user.isAdmin) {
			adminCount++;
		  } else {
			userCount++;
		  }
		});
		document.getElementById('user-count').textContent = userCount;
		document.getElementById('admin-count').textContent = adminCount;
	  });
}
	
	