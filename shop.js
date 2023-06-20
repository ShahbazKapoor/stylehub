function addToCart(name, image, price, quantity) {
  // Retrieve the existing cart items from storage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Check if the item already exists in the cart
  let existingItem = cartItems.find(function(item) {
    return item.name === name;
  });

  if (existingItem) {
    // Item already exists, show an alert
    // alert('Item already exists in the cart');
    Swal.fire({
      text: 'Item already exists in cart',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
    });
    return; // Stop the function execution
  } else {
    // Create a new item object with the product details
    const item = {
      name: name,
      image: image,
      price: price,
      quantity: quantity
    };

    // Add the item to the cart
    cartItems.push(item);

    // Store the updated cart items back to storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Show success message
    Swal.fire({
      text: 'Item added to cart',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
    });

    // Update the cart total
    updateCartTotal();
  }
}
