// Retrieve the cart items from storage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let tbody = document.getElementById('cart-items');
let itemsPerPage = 10;
let currentPage = 1;

// Function to render the cart items for the current page
function renderCartItems() {
  // Clear the table body before rendering new items
  tbody.innerHTML = '';

  // Calculate the start and end indexes for the current page
  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;

  // Check if the cart is empty
  if (cartItems.length === 0) {
    let emptyCartMessage = document.createElement('h3');
    emptyCartMessage.textContent = 'Cart is Empty. Please add items.';
    emptyCartMessage.style.textAlign = 'center';
    let emptyCartRow = document.createElement('tr');
    let emptyCartCell = document.createElement('td');
    emptyCartCell.colSpan = 6;
    emptyCartCell.appendChild(emptyCartMessage);
    emptyCartRow.appendChild(emptyCartCell);
    tbody.appendChild(emptyCartRow);
  } else {
    // Iterate over the cart items and create table rows
    for (let i = startIndex; i < endIndex && i < cartItems.length; i++) {
      let item = cartItems[i];
      let row = document.createElement('tr');
      // ... your existing code to create table rows
      let imageCell = document.createElement('td');
      let image = document.createElement('img');
      image.src = item.image;
      imageCell.appendChild(image);
      row.appendChild(imageCell);
      let nameCell = document.createElement('td');
      nameCell.textContent = item.name;
      row.appendChild(nameCell);
      let priceCell = document.createElement('td');
      priceCell.textContent = '₹' + item.price;
      row.appendChild(priceCell);

      let quantityCell = document.createElement('td');
      let quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = item.quantity; // Assuming the quantity is stored in the `quantity` property
      quantityInput.addEventListener('input', function() {
        // Update the quantity
        let newQuantity = parseInt(quantityInput.value);
        if (newQuantity < 1) {
          quantityInput.value = 1;
          newQuantity = 1;
        }
        item.quantity = newQuantity;
        updateCartItem(item, newQuantity); // Update the quantity in the localStorage
        updateSubtotal(subtotalCell, item.price, newQuantity); // Update the subtotal
      });
      quantityCell.appendChild(quantityInput);
      row.appendChild(quantityCell);

      // ... your existing code for subtotal and delete
      let subtotalCell = document.createElement('td');
      let subtotal = item.price * item.quantity; // Assuming the subtotal is calculated as the price multiplied by the quantity
      subtotalCell.textContent = '₹' + subtotal;
      row.appendChild(subtotalCell);


      let deleteCell = document.createElement('td');
      let deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt'; // Assuming you're using Font Awesome
      deleteIcon.style.cursor = 'pointer';
      deleteIcon.addEventListener('click', function() {
        removeCartItem(i); // Pass the index of the item to be removed
        renderCartItems(); // Render the cart items again after removal
        updateCartTotal();
      });
      deleteCell.appendChild(deleteIcon);
      row.appendChild(deleteCell);

      tbody.appendChild(row);

    }

    // Check if all items have been displayed
    if (endIndex >= cartItems.length) {
      let endCartMessage = document.createElement('h3');
      endCartMessage.textContent = 'End of Cart.';
      endCartMessage.style.textAlign = 'center';
      let endCartRow = document.createElement('tr');
      let endCartCell = document.createElement('td');
      endCartCell.colSpan = 6;
      endCartCell.appendChild(endCartMessage);
      endCartRow.appendChild(endCartCell);
      tbody.appendChild(endCartRow);
    }
  }

  // Show/hide pagination buttons based on the number of items
  let prevButton = document.getElementById('prev-page');
  let nextButton = document.getElementById('next-page');
  if (cartItems.length <= itemsPerPage) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
  } else {
    prevButton.style.display = currentPage > 1 ? 'inline' : 'none';
    nextButton.style.display = endIndex < cartItems.length ? 'inline' : 'none';
  }
}

function updateCartItem(item, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  // Find the item in the cart and update its quantity
  cartItems.forEach(function(cartItem) {
    if (cartItem.name === item.name) {
      cartItem.quantity = quantity;
    }
  });
  localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the updated cart items back to localStorage
  updateCartTotal(); // Update the cart total
}

// Function to remove an item from the cart
function removeCartItem(index) {
  cartItems.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the updated cart items back to localStorage
}


// Function to update the subtotal
function updateSubtotal(subtotalCell, price, quantity) {
  // ... your existing code to update the subtotal
  let subtotal = price * quantity;
  subtotalCell.textContent = '₹' + subtotal;
}

// Pagination button event handlers
let prevButton = document.getElementById('prev-page');
prevButton.addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage--;
    renderCartItems();
  }
});

let nextButton = document.getElementById('next-page');
nextButton.addEventListener('click', function() {
  let totalPages = Math.ceil(cartItems.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCartItems();
  }
});

// Function to calculate and update the cart subtotal and total
function updateCartTotal() {
  let cartSubtotal = 0;
  cartItems.forEach(function(item) {
    let subtotal = item.price * item.quantity;
    cartSubtotal += subtotal;
  });

  let shipping = 0; // Assuming shipping is free

  let cartTotal = cartSubtotal + shipping;

  // Update the subtotal and total elements in the HTML
  let subtotalElement = document.getElementById('cart-subtotal');
  let totalElement = document.getElementById('cart-total');
  subtotalElement.textContent = '₹ ' + cartSubtotal.toFixed(2);
  totalElement.textContent = '₹ ' + cartTotal.toFixed(2) + '/-';
}


// After rendering the cart items
renderCartItems();

// After adding, removing, or updating quantities
updateCartTotal();

