document.addEventListener('DOMContentLoaded', function() {
  const scripts = [
    '/js/helpers.js',
    '/js/products.js',
    '/js/modal.js',
    '/js/cart.js',
    '/js/main.js',
    '/js/login.js',
    '/js/register.js',
	'/js/admin.js'
  ];

  let loadedScripts = 0;

  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`${src} loaded`);
      loadedScripts++;
      if (loadedScripts === scripts.length) {
        console.log('All scripts loaded.');
        initializeApp();
      }
    };
    document.body.appendChild(script);
  });
});
