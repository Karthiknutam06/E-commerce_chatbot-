document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    function addMessage(text, isUser = false, isProduct = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");

        if (isProduct) {
            messageDiv.innerHTML = text; // Add HTML directly for products
        } else {
            messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        }

        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function searchDummyJSON(query) {
        try {
            const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
            const data = await response.json();

            if (data.products.length === 0) {
                return "⚠️ No products found.";
            }

            const product = data.products[0]; // Get the first matching product

            return `
                <div class="product">
                    <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                    <div class="product-info">
                        <strong>${product.title}</strong>
                        <p>💲${product.price}</p>
                        <button class="buy-btn" onclick="openPaymentPopup('${product.title}', ${product.price})">🛒 Buy Now</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("API Error:", error);
            return "⚠️ Error fetching products!";
        }
    }

    async function handleUserMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, true);
        userInput.value = "";

        let botResponse = await searchDummyJSON(userMessage);
        setTimeout(() => addMessage(botResponse, false, true), 1000);
    }

    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleUserMessage();
    });
});

// Fake Payment System
function openPaymentPopup(productName, productPrice) {
    const paymentPopup = document.getElementById("payment-popup");
    document.getElementById("payment-product-name").innerText = productName;
    document.getElementById("payment-product-price").innerText = `$${productPrice}`;
    paymentPopup.style.display = "block";
}

function closePaymentPopup() {
    document.getElementById("payment-popup").style.display = "none";
}

function processPayment() {
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    if (cardNumber.length === 16 && expiryDate && cvv.length === 3) {
        alert("✅ Payment Successful! Your order has been placed.");
        closePaymentPopup();
    } else {
        alert("⚠️ Invalid Payment Details. Please try again.");
    }
}
