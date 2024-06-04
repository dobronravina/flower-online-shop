function showAddToCartModal(productId) {
  const modal = document.getElementById('modal');
  const addToCartButton = document.getElementById('add-to-cart-button');
  const closeButton = document.querySelector('.close-button');
  const cancelButton = document.getElementById('cancel-button');
  const okButton = document.getElementById('ok-button');
  const modalMessage = document.getElementById('modal-message');

  if (modal && addToCartButton) {
    modal.style.display = 'block';
    modalMessage.textContent = 'Додати товар до корзини?';
    addToCartButton.style.display = 'inline-block';
    cancelButton.style.display = 'inline-block';
    okButton.style.display = 'none';

    addToCartButton.onclick = function() {
      addToCart(productId).then(success => {
        if (success) {
          modalMessage.textContent = 'Товар додано до корзини!';
          addToCartButton.style.display = 'none';
          cancelButton.style.display = 'none';
          okButton.style.display = 'inline-block';
          console.log('Product added to cart');
        } else {
          modalMessage.textContent = 'Помилка при додаванні товару до корзини.';
          console.log('Error adding product to cart');
        }
      });
    };

    closeButton.onclick = function() {
      console.log('Close button clicked');
      modal.style.display = 'none';
    };

    cancelButton.onclick = function() {
      console.log('Cancel button clicked');
      modal.style.display = 'none';
    };

    okButton.onclick = function() {
      console.log('OK button clicked');
      modal.style.display = 'none';
    };

    window.onclick = function(event) {
      if (event.target === modal) {
        console.log('Window clicked');
        modal.style.display = 'none';
      }
    };
  } else {
    console.error('Modal or Add to Cart button not found');
  }
}
