document.addEventListener("DOMContentLoaded", function() {
    // Initialize cart object to store quantities for each item
    const cart = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0
    };
    
    // Menu items with their prices
    const menuItems = {
      1: { name: "Paneer Tikka", price: 350 },
      2: { name: "Masala Dosa", price: 180 },
      3: { name: "Chana Masala", price: 220 },
      4: { name: "Vegetable Biryani", price: 280 },
      5: { name: "Palak Paneer", price: 250 },
      6: { name: "Aloo Gobi", price: 200 },
      7: { name: "Dal Makhani", price: 180 },
      8: { name: "Vegetable Samosas", price: 120 },
      9: { name: "Malai Kofta", price: 270 },
      10: { name: "Gulab Jamun", price: 100 }
    };
    
    // Create order button and cart display
    const orderSection = document.createElement('div');
    orderSection.className = 'order-section';
    
    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';
    cartItems.innerHTML = '<h3>Your Order</h3>';
    
    // Create the modal for order summary
    const orderModal = document.createElement('div');
    orderModal.className = 'order-modal';
    orderModal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Order Summary</h2>
        <div class="modal-body">
          <div id="order-details"></div>
          <div id="order-totals"></div>
        </div>
        <button id="confirm-order" class="confirm-order-btn">Confirm Order</button>
      </div>
    `;
    document.body.appendChild(orderModal);
    
    // Add event listener to close the modal
    document.querySelector('.close-modal').addEventListener('click', () => {
      orderModal.style.display = 'none';
    });
    
    // Close modal if clicked outside of modal content
    window.addEventListener('click', (event) => {
      if (event.target === orderModal) {
        orderModal.style.display = 'none';
      }
    });
    
    // Confirm order button event listener
    document.getElementById('confirm-order').addEventListener('click', () => {
      orderModal.style.display = 'none';
      
      // Reset cart after order confirmation
      for (const itemId in cart) {
        cart[itemId] = 0;
        document.getElementById(`qty-${itemId}`).textContent = '0';
      }
      updateCartDisplay();
      
      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'success-toast';
      successToast.textContent = 'Order placed successfully! Thank you.';
      document.body.appendChild(successToast);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        successToast.classList.add('hide');
        setTimeout(() => {
          document.body.removeChild(successToast);
        }, 300);
      }, 3000);
    });
    
    // Add quantity controls to each menu item
    const menuItemElements = document.querySelectorAll('.menu-item');
    menuItemElements.forEach((item, index) => {
      const itemId = index + 1;
      const quantityControl = document.createElement('div');
      quantityControl.className = 'quantity-control';
      quantityControl.innerHTML = `
        <button class="qty-btn minus" data-id="${itemId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
          </svg>
        </button>
        <span class="qty" id="qty-${itemId}">0</span>
        <button class="qty-btn plus" data-id="${itemId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
        </button>
      `;
      
      item.querySelector('.menu-details').appendChild(quantityControl);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.plus').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        cart[itemId]++;
        document.getElementById(`qty-${itemId}`).textContent = cart[itemId];
        updateCartDisplay();
      });
    });
    
    document.querySelectorAll('.minus').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        if (cart[itemId] > 0) {
          cart[itemId]--;
          document.getElementById(`qty-${itemId}`).textContent = cart[itemId];
          updateCartDisplay();
        }
      });
    });
    
    // Create place order button
    const orderButton = document.createElement('button');
    orderButton.className = 'order-button';
    orderButton.textContent = 'Place Order';
    orderButton.addEventListener('click', calculateTotal);
    
    // Append cart and order button to order section
    orderSection.appendChild(cartItems);
    orderSection.appendChild(orderButton);
    
    // Add order section to the page
    document.querySelector('.menu-container').appendChild(orderSection);
    
    // Update cart display
    function updateCartDisplay() {
      let cartContent = '<h3>Your Order</h3>';
      let hasItems = false;
      
      for (const [itemId, quantity] of Object.entries(cart)) {
        if (quantity > 0) {
          hasItems = true;
          const { name, price } = menuItems[itemId];
          cartContent += `<div class="cart-item">
            <span>${name} x ${quantity}</span>
            <span>₹${(price * quantity).toFixed(2)}</span>
          </div>`;
        }
      }
      
      if (!hasItems) {
        cartContent += '<p>Your cart is empty</p>';
      }
      
      cartItems.innerHTML = cartContent;
    }
    
    // Calculate total and show modal with GST calculation
    function calculateTotal() {
      let totalBill = 0;
      let orderSummary = [];
      let itemCount = 0;
      let hasItems = false;
      
      for (const [itemId, quantity] of Object.entries(cart)) {
        if (quantity > 0) {
          hasItems = true;
          const { name, price } = menuItems[itemId];
          const itemTotal = price * quantity;
          totalBill += itemTotal;
          orderSummary.push({ name, quantity, price, itemTotal });
          itemCount += quantity;
        }
      }
      
      if (hasItems) {
        // Calculate GST (18%) only if 5 or more items ordered
        let gstAmount = 0;
        if (itemCount >= 5) {
          gstAmount = totalBill * 0.18;
        }
        const finalBill = totalBill + gstAmount;
        
        // Create order details HTML
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
        
        // Show the modal
        orderModal.style.display = 'flex';
        
        // Log order details to console
        console.log("Order taking process completed.");
        console.log("Order Summary:", orderSummary);
        console.log("Total Bill:", totalBill);
        console.log("GST Amount:", gstAmount.toFixed(2));
        console.log("Final Bill:", finalBill.toFixed(2));
      } else {
        // If no items, show message
        const emptyCartToast = document.createElement('div');
        emptyCartToast.className = 'error-toast';
        emptyCartToast.textContent = 'Please add items to your cart first.';
        document.body.appendChild(emptyCartToast);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          emptyCartToast.classList.add('hide');
          setTimeout(() => {
            document.body.removeChild(emptyCartToast);
          }, 300);
        }, 3000);
      }
    }
    
    // Initial cart display
    updateCartDisplay();
  });
