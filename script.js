// script.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            let productList = document.getElementById('product-list');
            let cart = [];
            let cartItems = document.getElementById('cart-items');
            let checkoutDetails = document.getElementById('checkout-details');
            let receiptDetails = document.getElementById('receipt-details');
            let checkoutButton = document.getElementById('checkout-button');
            let generateReceiptButton = document.getElementById('generate-receipt-button');
            let printReceiptButton = document.getElementById('print-receipt-button');
            
            // Function to render products
            function renderProducts() {
                productList.innerHTML = '';
                data.products.forEach(product => {
                    let productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <h3>${product.title}</h3>
                        <img src="${product.thumbnail}" alt="${product.title}">
                        <p>Price: $${product.price}</p>
                        <button onclick="confirmAddToCart(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
                    `;
                    productList.appendChild(productDiv);
                });
            }

            // Function to confirm and add product to cart
            window.confirmAddToCart = function(id, title, price, thumbnail) {
                if (confirm(`Are you sure you want to add ${title} to your cart?`)) {
                    addToCart(id, title, price, thumbnail);
                }
            }

            // Function to add product to cart
            function addToCart(id, title, price, thumbnail) {
                let product = data.products.find(p => p.id === id);
                if (product) {
                    cart.push({ ...product, price });
                    renderCart();
                }
            }

            // Function to render cart
            function renderCart() {
                cartItems.innerHTML = '';
                if (cart.length > 0) {
                    const ul = document.createElement('ul');
                    cart.forEach(product => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            ${product.title} - $${product.price.toFixed(2)}
                            <img src="${product.thumbnail}" alt="${product.title}">
                        `;
                        ul.appendChild(li);
                    });
                    cartItems.appendChild(ul);
                } else {
                    cartItems.innerHTML = '<p>Your cart is empty.</p>';
                }
            }

            // Function to proceed to checkout
            checkoutButton.addEventListener('click', function() {
                renderCheckout();
            });

            // Function to render checkout details
            function renderCheckout() {
                let totalAmount = cart.reduce((sum, product) => sum + product.price, 0);
                let qrCodeURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay+with+promptpay"; // Placeholder URL

                checkoutDetails.innerHTML = `
                    <h3>Order Summary</h3>
                    <p>Total Items: ${cart.length}</p>
                    <p>Total Amount: $${totalAmount.toFixed(2)}</p>
                    <p>Shipping: Free</p>
                    <p><strong>Amount Due: $${totalAmount.toFixed(2)}</strong></p>
                    <img src="${qrCodeURL}" alt="QR Code for Payment">
                    <p>Scan the QR code to pay with PromptPay</p>
                `;
                generateReceiptButton.style.display = 'block';
            }

            // Function to generate receipt
            generateReceiptButton.addEventListener('click', function() {
                let totalAmount = cart.reduce((sum, product) => sum + product.price, 0);
                let qrCodeURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay+with+promptpay"; // Placeholder URL

                receiptDetails.innerHTML = `
                    <h3>Receipt</h3>
                    <p><strong>Order Number:</strong> ${Math.floor(Math.random() * 1000000)}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        ${cart.map(product => `<li>${product.title} - $${product.price.toFixed(2)}</li>`).join('')}
                    </ul>
                    <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
                    <p><strong>Shipping:</strong> Free</p>
                    <p><strong>Amount Due:</strong> $${totalAmount.toFixed(2)}</p>
                    <img src="${qrCodeURL}" alt="QR Code for Payment">
                    <p>Scan the QR code to pay with PromptPay</p>
                `;
                printReceiptButton.style.display = 'block';
            });

            // Function to print receipt
            printReceiptButton.addEventListener('click', function() {
                window.print();
            });

            // Initial render
            renderProducts();
            renderCart();
            generateReceiptButton.style.display = 'none'; // Hide button initially
            printReceiptButton.style.display = 'none'; // Hide button initially
        });
});
