document.addEventListener("DOMContentLoaded", function () {
    const receiptData = JSON.parse(localStorage.getItem("receiptData"));

    if (!receiptData) {
        console.error("❌ لم يتم العثور على بيانات الإيصال!");
        document.getElementById("receipt-container").innerHTML = "<p>❌ لا يوجد إيصال متاح!</p>";
        return;
    }

    document.getElementById("order-id").innerText = receiptData.id || "N/A";
    document.getElementById("customer-name").innerText = receiptData.customerName?.trim() || "N/A";
    document.getElementById("customer-phone").innerText = receiptData.customerPhone?.trim() || "N/A";
    document.getElementById("customer-address").innerText = receiptData.customerAddress?.trim() || "N/A";
    document.getElementById("order-date").innerText = receiptData.orderDate || "N/A";
    document.getElementById("delivery-price").innerText = `${receiptData.deliveryPrice || 0} EGP`;
    document.getElementById("order-total").innerText = `${receiptData.orderTotal || 0} EGP`;

    let subtotal = 0;
    const orderDetailsContainer = document.getElementById("order-details");
    orderDetailsContainer.innerHTML = "";

    if (receiptData.orderDetails && Array.isArray(receiptData.orderDetails)) {
        receiptData.orderDetails.forEach(item => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            subtotal += quantity * price;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name || "N/A"}</td>
                <td>${quantity}</td>
                <td>${price} EGP</td>
            `;
            orderDetailsContainer.appendChild(row);
        });
    }

    document.getElementById("subtotal").innerText = `${subtotal} EGP`;
    const discount = receiptData.discount || 0;
    document.getElementById("discount").innerText = `${discount} EGP`;
});
