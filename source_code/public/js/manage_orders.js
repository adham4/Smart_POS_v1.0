document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
});

const ordersTableBody = document.getElementById("orders-table-body");

// 🔹 **جلب الطلبات من الروت الجديد**
function fetchOrders() {
    fetch("http://127.0.0.1:8083/api/orders")
        .then(response => response.json())
        .then(data => {
            console.log("📦 الطلبات بعد الإلغاء:", data); // ✅ تأكد إن isCancelled = "Yes"
            renderOrders(data);
        })
        .catch(error => console.error("❌ خطأ في جلب الطلبات:", error));
}


// 🔹 **عرض الطلبات في الجدول**
function renderOrders(orders) {
    ordersTableBody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.customerPhone}</td>
            <td>${order.customerAddress}</td>
            <td>${order.orderTotal} EGP</td>
            <td id="details-${order.id}">جارٍ التحميل...</td>
            <td>${order.payment_status === "Paid" ? "Electronic" : "Cash"}</td> 
            <td>${order.isCancelled === "Yes" ? "YES" : "NO"}</td>
            `;

        // إضافة حدث عند النقر على الصف
        row.addEventListener("click", () => {
            displayOrderDetails(order);
        });

        ordersTableBody.appendChild(row);

        // 🔹 **تنسيق تفاصيل الطلب بعد جلبها**
        formatOrderDetails(order.orderDetails, order.id);
    });
}

// 🔹 **عرض تفاصيل الطلب في الحقول العلوية**
function displayOrderDetails(order) {
    console.log(order); // تحقق من القيم
    document.getElementById("order-id").value = order.id; // رقم الطلب
    document.getElementById("order-quantity").value = order.deliveryPrice || 0; // سعر التوصيل
    
    // 🔥 هنسيب التوتال يتحدث بعد تنفيذ formatOrderDetails()
    formatOrderDetails(order.orderDetails, order.id, order.deliveryPrice, true);
}

// 🔹 **تنسيق تفاصيل الطلب بعد جلبها**
function formatOrderDetails(orderDetails, orderId, deliveryPrice = 0, updateTotalField = false) {
    fetch("http://127.0.0.1:8083/api/orders/format-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderDetails })
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById(`details-${orderId}`);
        container.innerHTML = "";

        if (!Array.isArray(data.formatted)) {
            console.error("❌ البيانات المسترجعة ليست مصفوفة");
            container.innerHTML = "⚠️ خطأ في العرض";
            return;
        }

        let calculatedTotal = 0;

        data.formatted.forEach(item => {
            const row = document.createElement("div");
            row.classList.add("order-item");

            let productTotal = parseFloat(item.price) * item.quantity;

            const commentsTotal = item.comments.reduce((sum, comment) => sum + (parseFloat(comment.price) || 0) * item.quantity, 0);
            const manualCommentsTotal = item.manualComments.reduce((sum, comment) => sum + ((parseFloat(comment.price) || 0) * item.quantity), 0);

            productTotal += commentsTotal + manualCommentsTotal;
            calculatedTotal += productTotal;

            row.innerHTML = `
                <div class="item-details">
                    <strong>${item.name}</strong> — ${item.price} EGP x ${item.quantity}
                    = ${(parseFloat(item.price) * item.quantity).toFixed(2)} EGP
                </div>
                <div class="item-comments">
                    ${item.comments.map(comment => `
                        <div class="comment-item">
                            💬 ${comment.text} — 💰 ${comment.price} EGP
                        </div>
                    `).join("")}
                    ${item.manualComments.map(comment => `
                        <div class="comment-item">
                            📝 ${comment.text} ${comment.price ? `— 💰 ${comment.price} EGP` : ""}
                        </div>
                    `).join("")}
                </div>
                <div class="item-total">
                    <strong>💰 الإجمالي: ${productTotal.toFixed(2)} EGP</strong>
                </div>
            `;

            container.appendChild(row);
        });

        // ✅ إضافة قيمة الدليفري لو موجودة
        if (deliveryPrice) {
            calculatedTotal += parseFloat(deliveryPrice);
        }

        // ✅ تحديث التوتال في الجدول
        const totalCell = document.querySelector(`#details-${orderId}`).parentElement.cells[4];
        if (totalCell) {
            totalCell.textContent = `${calculatedTotal.toFixed(2)} EGP`;
        }

        // ✅ تحديث التوتال في الحقول العلوية لما يتم اختيار الطلب
        if (updateTotalField) {
            document.getElementById("order-total").value = calculatedTotal.toFixed(2);
        }
    })
    .catch(error => {
        console.error("❌ خطأ في تنسيق تفاصيل الطلب:", error);
        document.getElementById(`details-${orderId}`).innerHTML = "⚠️ خطأ في العرض";
    });
}

// 🔹 **إلغاء الطلب**
document.getElementById("cancel-btn").addEventListener("click", () => {
    const orderId = document.getElementById("order-id").value;
    if (!orderId) {
        alert("⚠️ يرجى تحديد طلب لإلغاءه.");
        return;
    }

    if (!confirm("⚠️ هل أنت متأكد من إلغاء هذا الطلب؟")) return;

    fetch(`/api/orders/${orderId}/cancel`, { method: "PUT" })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ تم إلغاء الطلب بنجاح");
            fetchOrders(); // ✅ إعادة تحميل الطلبات

            // ✅ تحديث الحالة في الواجهة مباشرة
            const statusCell = document.querySelector(`#details-${orderId}`).parentElement.querySelectorAll("td")[6];
            if (statusCell) {
                statusCell.textContent = "YES";
            }
        } else {
            alert("❌ فشل في إلغاء الطلب");
        }
    })
    .catch(error => console.error("❌ خطأ أثناء إلغاء الطلب:", error));
});

// 🔀 دالة الترتيب
const sortTable = (columnIndex) => {
    const table = document.getElementById("orders-table-body");
    const rows = Array.from(table.rows);
    
    // 👀 تحديد إذا كان الترتيب تصاعدي أو تنازلي
    let ascending = table.getAttribute(`data-sort-${columnIndex}`) !== "asc";
    
    rows.sort((a, b) => {
        let valueA = a.cells[columnIndex].textContent.trim();
        let valueB = b.cells[columnIndex].textContent.trim();

        // 🔢 لو القيم أرقام، حولها لأرقام للمقارنة
        if (!isNaN(valueA) && !isNaN(valueB)) {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }

        if (ascending) {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    // 🧹 إعادة ترتيب الصفوف في الجدول
    rows.forEach(row => table.appendChild(row));
    
    // 🔄 تحديث حالة الترتيب
    table.setAttribute(`data-sort-${columnIndex}`, ascending ? "asc" : "desc");
};