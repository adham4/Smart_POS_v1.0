// js/sales.js
(async () => {
    const response = await fetch('/api/sales');
    const sales = await response.json();
    const salesList = document.getElementById('sales-list');

    sales.forEach(sale => {
        const item = document.createElement('div');
        item.textContent = `Product ID: ${sale.productId}, Quantity Sold: ${sale.quantitySold}, Total Price: ${sale.totalPrice} EGP`;
        salesList.appendChild(item);
    });
})();
