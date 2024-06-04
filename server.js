const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
let products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get(['/about', '/about.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get(['/partners', '/partners.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'partners.html'));
});

app.get(['/cart', '/cart.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get(['/login', '/login.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get(['/register', '/register.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get(['/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, 'your_jwt_secret');
	res.json({ success: true, username: user.username, token });
  } else {
    res.json({ success: false });
  }
});

app.post('/api/register', (req, res) => {
  const { username, password, isAdmin } = req.body;
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    res.json({ success: false, message: 'Користувач з таким іменем вже існує' });
  } else {
    const newUser = { username, password, isAdmin, cart: [] };
    users.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json({ success: true });
  }
});

app.get('/api/cart/:username', (req, res) => {
  console.log(`Fetching cart for user: ${req.params.username}`);
  const user = users.find(user => user.username === req.params.username);
  if (user) {
    res.json(user.cart || []);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/api/cart/:username/remove', (req, res) => {
  console.log(`Removing item from cart for user: ${req.params.username}`);
  const user = users.find(user => user.username === req.params.username);
  if (user) {
    const productId = parseInt(req.body.id, 10); // Ensure productId is an integer
    console.log(`Product ID to remove: ${productId}, Type: ${typeof productId}`);
    console.log('Cart before removal:', user.cart);
    user.cart = user.cart.filter(item => item.id !== productId);
    console.log('Cart after removal:', user.cart);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/api/cart/:username', (req, res) => {
  console.log(`Updating cart for user: ${req.params.username}`);
  const user = users.find(user => user.username === req.params.username);
  if (user) {
    user.cart = req.body.cart;
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/admin', (req, res) => {
  console.log('Received request for /admin');
  const token = req.headers.authorization;
  if (!token) {
    console.log('No token provided');
    
	return res.sendFile(path.join(__dirname, 'views', 'adminNoAccess.html'));
	//return res.status(401).send('Token is required');
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      console.log('Invalid token');
      return res.status(401).send('Invalid token');
    }

    const username = decoded.username;
    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading users file');
      }

      const users = JSON.parse(data);
      const user = users.find(user => user.username === username);

      if (user && user.isAdmin) {
        console.log(`Admin access granted for user: ${username}`);
        res.sendFile(path.join(__dirname, 'views', 'admin.html'));
      } else {
        res.status(403).send('Access denied');
      }
    });
  });
});


app.get('/api/users', (req, res) => {
  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading users file');
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});


app.delete('/api/users/:username', (req, res) => {
  const usernameToDelete = req.params.username;
  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading users file');
    }

    let users = JSON.parse(data);
    users = users.filter(user => user.username !== usernameToDelete);

    fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).send('Error writing users file');
      }
      res.json({ success: true });
    });
  });
});


/*
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


