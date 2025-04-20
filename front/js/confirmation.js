document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  if (orderId) {
    document.getElementById("orderId").textContent = orderId;
  } else {
    document.getElementById("orderId").textContent = "Order ID is unavailable";
  }
});
