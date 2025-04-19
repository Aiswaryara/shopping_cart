// confirmation.js

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Extract the orderId
const orderId = urlParams.get("orderId");

// Find the span element where we want to insert the orderId
const orderIdElement = document.getElementById("orderId");

// Display the orderId if available
if (orderId && orderIdElement) {
  orderIdElement.textContent = orderId;
} else {
  orderIdElement.textContent = "N/A";
}
