// Main JavaScript for Taj Restaurant menu with localStorage cart
document.addEventListener('DOMContentLoaded', function() {
  // Initialize menu and cart
  let menuItems = [];
  let cart = {};
  
  // Function to load the cart from localStorage
  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('tajRestaurantCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      console.log('Cart loaded from localStorage:', cart);
    }
  }
  
  // Function to save the cart to localStorage
  function saveCartToLocalStorage() {
    localStorage.setItem('tajRestaurantCart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  }
  
  // Function to fetch menu data from JSON file
  async function fetchMenuData() {
    try {
      // Show loading state
      document.querySelector('.menu-content').innerHTML = '<div class="loading">Loading menu items...</div>';
      
      // Fetch the menu data from the JSON file in the same directory
      const response = await fetch('menu.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch menu data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store menu items
      menuItems = data.menu;
      
      // Render menu items
      renderMenuItems(menuItems);
      
      // Setup event listeners for quantity controls
      setupQuantityControls();
      
      // Create order section if it doesn't exist
      if (!document.querySelector('.order-section')) {
        createOrderSection();
      }
      
      // Update cart display
      updateCartDisplay();
      
    } catch (error) {
      console.error('Error loading menu:', error);
      document.querySelector('.menu-content').innerHTML = `<div class="loading">Error loading menu: ${error.message}</div>`;
    }
  }
  
  // Function to render menu items
  function renderMenuItems(items) {
    const menuContent = document.querySelector('.menu-content');
    menuContent.innerHTML = '';
    
    items.forEach((item, index) => {
      const itemId = index + 1;
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.innerHTML = `
        <div class="menu-img-container">
          <img class="menu-img" src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu-details">
          <h2>${item.name}</h2>
          <p class="menu-description">${item.description}</p>
          <p class="menu-price">₹${item.price}</p>
          <div class="quantity-control">
            <button class="qty-btn minus" data-id="${itemId}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <span class="qty" id="qty-${itemId}">${cart[itemId] || 0}</span>
            <button class="qty-btn plus" data-id="${itemId}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      menuContent.appendChild(menuItem);
    });
  }
  
  // Function to create the order section
  function createOrderSection() {
    const orderSection = document.createElement('div');
    orderSection.className = 'order-section';
    
    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';
    cartItems.innerHTML = '<h3>Your Order</h3>';
    
    const orderButton = document.createElement('button');
    orderButton.className = 'order-button';
    orderButton.textContent = 'Place Order';
    orderButton.addEventListener('click', calculateTotal);
    
    orderSection.appendChild(cartItems);
    orderSection.appendChild(orderButton);
    
    document.querySelector('.menu-container').insertBefore(
      orderSection, 
      document.querySelector('.menu-footer')
    );
  }
  
  // Function to setup quantity control buttons
  function setupQuantityControls() {
    // Add event listeners to the plus buttons
    document.querySelectorAll('.plus').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        addItemToCart(itemId);
      });
    });
    
    // Add event listeners to the minus buttons
    document.querySelectorAll('.minus').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        removeItemFromCart(itemId);
      });
    });
  }
  
  // Function to add an item to the cart
  function addItemToCart(itemId) {
    // Initialize if not exists
    if (!cart[itemId]) {
      cart[itemId] = 0;
    }
    
    // Increment quantity
    cart[itemId]++;
    
    // Update displayed quantity
    document.getElementById(`qty-${itemId}`).textContent = cart[itemId];
    
    // Update cart display
    updateCartDisplay();
    
    // Save to localStorage
    saveCartToLocalStorage();
  }
  
  // Function to remove an item from the cart
  function removeItemFromCart(itemId) {
    // Only proceed if the item exists in the cart
    if (cart[itemId] && cart[itemId] > 0) {
      // Decrement quantity
      cart[itemId]--;
      
      // Update displayed quantity
      document.getElementById(`qty-${itemId}`).textContent = cart[itemId];
      
      // If quantity reaches 0, remove from cart object
      if (cart[itemId] === 0) {
        delete cart[itemId];
      }
      
      // Update cart display
      updateCartDisplay();
      
      // Save to localStorage
      saveCartToLocalStorage();
    }
  }
  
  // Function to update the cart display
  function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    let cartHTML = '<h3>Your Order</h3>';
    let hasItems = false;
    
    // Loop through all items in the cart
    for (const [itemId, quantity] of Object.entries(cart)) {
      if (quantity > 0) {
        hasItems = true;
        const index = parseInt(itemId) - 1;
        const item = menuItems[index];
        if (item) {
          const itemTotal = item.price * quantity;
          
          cartHTML += `
            <div class="cart-item">
              <span>${item.name} x ${quantity}</span>
              <span>₹${itemTotal}</span>
            </div>
          `;
        }
      }
    }
    
    // If there are no items, show empty cart message
    if (!hasItems) {
      cartHTML += '<p>Your cart is empty</p>';
    }
    
    // Update the cart
    cartItemsContainer.innerHTML = cartHTML;
  }
  
  // Calculate order total and show modal
  function calculateTotal() {
    let totalBill = 0;
    let orderSummary = [];
    let itemCount = 0;
    let hasItems = false;
    
    for (const [itemId, quantity] of Object.entries(cart)) {
      if (quantity > 0) {
        hasItems = true;
        const index = parseInt(itemId) - 1;
        const item = menuItems[index];
        const itemTotal = item.price * quantity;
        totalBill += itemTotal;
        orderSummary.push({ 
          name: item.name, 
          quantity, 
          price: item.price, 
          itemTotal 
        });
        itemCount += quantity;
      }
    }
    
    if (!hasItems) {
      showToast('Please add items to your cart first', 'error');
      return;
    }
    
    // Calculate GST (18%) only if 5 or more items ordered
    let gstAmount = 0;
    if (itemCount >= 5) {
      gstAmount = totalBill * 0.18;
    }
    const finalBill = totalBill + gstAmount;
    
    // Create modal if it doesn't exist
    if (!document.querySelector('.order-modal')) {
      createOrderModal();
    }
    
    // Display order details in modal
    displayOrderDetails(orderSummary, totalBill, gstAmount, finalBill, itemCount);
    
    // Show the modal
    document.querySelector('.order-modal').style.display = 'flex';
  }
  
  // Create the order modal
  function createOrderModal() {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Order Summary</h2>
        <div id="order-details"></div>
        <div id="order-totals"></div>
        <button class="confirm-order-btn">Confirm Order</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listener to close the modal
    document.querySelector('.close-modal').addEventListener('click', () => {
      document.querySelector('.order-modal').style.display = 'none';
    });
    
    // Close modal if clicked outside of modal content
    window.addEventListener('click', (event) => {
      if (event.target === document.querySelector('.order-modal')) {
        document.querySelector('.order-modal').style.display = 'none';
      }
    });
    
    // Confirm order button
    document.querySelector('.confirm-order-btn').addEventListener('click', () => {
      // Close the modal
      document.querySelector('.order-modal').style.display = 'none';
      
      // Reset cart
      cart = {};
      
      // Update localStorage
      saveCartToLocalStorage();
      
      // Update UI
      document.querySelectorAll('[id^="qty-"]').forEach(el => {
        el.textContent = '0';
      });
      
      // Update cart display
      updateCartDisplay();
      
      // Show success message
      showToast('Order placed successfully! Thank you.', 'success');
    });
  }
  
  // Display order details in modal
  function displayOrderDetails(orderSummary, totalBill, gstAmount, finalBill, itemCount) {
    let orderDetailsHTML = `
      <table class="order-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    orderSummary.forEach(item => {
      orderDetailsHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${item.itemTotal.toFixed(2)}</td>
        </tr>
      `;
    });
    
    orderDetailsHTML += `</tbody></table>`;
    
    // Create order totals HTML
    let orderTotalsHTML = `
      <div class="order-total-row">
        <span>Subtotal:</span>
        <span>₹${totalBill.toFixed(2)}</span>
      </div>
    `;
    
    // Only show GST if applicable
    if (itemCount >= 5) {
      orderTotalsHTML += `
        <div class="order-total-row">
          <span>GST (18%):</span>
          <span>₹${gstAmount.toFixed(2)}</span>
        </div>
      `;
    } else {
      orderTotalsHTML += `
        <div class="order-total-row">
          <span>GST:</span>
          <span>Not Applied (less than 5 items)</span>
        </div>
      `;
    }
    
    orderTotalsHTML += `
      <div class="order-total-row grand-total">
        <span>Total Bill:</span>
        <span>₹${finalBill.toFixed(2)}</span>
      </div>
    `;
    
    // Update modal content
    document.getElementById('order-details').innerHTML = orderDetailsHTML;
    document.getElementById('order-totals').innerHTML = orderTotalsHTML;
  }
  
  // Show toast notification
  function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.success-toast, .error-toast, .info-toast');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `${type}-toast`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
  
  // Initialize: Load cart from localStorage, then fetch menu
  loadCartFromLocalStorage();
  fetchMenuData();
});