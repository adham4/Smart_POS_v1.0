document.addEventListener("DOMContentLoaded", () => {
    fetchInventory(); // تأكد من استدعاء عرض البيانات بعد تحميل الصفحة
});

const inventoryTable = document.getElementById("product-table");
const addForm = document.getElementById("add-product-form");
const editButton = document.getElementById("edit-btn");
const deleteButton = document.getElementById("delete-btn");

let selectedProductId = null;

// ✅ البحث في المنتجات عند الكتابة في حقل البحث
const searchInput = document.getElementById("search-input");
const filterOption = document.getElementById("filter-option");

if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        const query = searchInput.value.trim().toLowerCase();
        applyFilter(query);
    });
}

// ✨ إضافة مستمع الحدث للفلتر دون تعديل الـ HTML
if (filterOption) {
    filterOption.addEventListener("change", () => {
        applyFilter(searchInput.value.trim().toLowerCase());
    });
}


// ✅ تصفية البيانات وعرضها
function applyFilter(searchQuery = "") {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ لا يوجد توكن، تأكد من تسجيل الدخول.");
        return;
    }

    fetch("/api/inventory", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`❌ خطأ في جلب البيانات: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            console.error("❌ البيانات غير صحيحة:", data);
            throw new Error("البيانات المسترجعة ليست مصفوفة");
        }

        let filteredData = data;

        // 🔍 تصفية البحث
        if (searchQuery) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchQuery)
            );
        }

        // 🔹 تصفية البيانات حسب الفلتر المحدد
        if (filterOption) {
            const filterValue = filterOption.value;
            if (filterValue === "low-stock") {
                filteredData = filteredData.filter(item => item.quantity <= 5);
            } else if (filterValue === "new-arrivals") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                filteredData = filteredData.filter(item => new Date(item.createdAt) >= oneWeekAgo);
            } else if (filterValue === "near-expiry") {
                const today = new Date();
                const nearExpiryThreshold = new Date();
                nearExpiryThreshold.setDate(today.getDate() + 7);
                filteredData = filteredData.filter(item => {
                    const expiryDate = new Date(item.expiryDate);
                    return expiryDate >= today && expiryDate <= nearExpiryThreshold;
                });
            } else {
                // ✅ إذا كان الفلتر "all" أو فاضي، نعرض كل البيانات
                filteredData = data;
            }
        }

        filteredData.sort((a, b) => a.id - b.id);
        displayInventory(filteredData);
        checkForAlerts(filteredData); // ✨ عرض الإشعارات بعد الفلترة
    })
    .catch(error => console.error("❌ خطأ في جلب بيانات المخزون:", error));
}

// ✅ جلب بيانات المخزون من السيرفر وعرضها في الواجهة
function fetchInventory() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ لا يوجد توكن");
        return;
    }

    fetch('/api/inventory', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('📦 بيانات المخزون:', data);
        displayInventory(data); 
        checkForAlerts(data); // ✨ عرض الإشعارات عند الحاجة
    })
    .catch((error) => console.error('❌ خطأ في جلب البيانات:', error));
}

// ✅ عرض البيانات في الجدول
function displayInventory(data) {
    inventoryTable.innerHTML = ""; 

    if (data.length === 0) {
        inventoryTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">لا يوجد بيانات</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        let alertClass = "";
        if (item.quantity <= 5) {
            alertClass = "bg-warning"; 
        }
        const today = new Date();
        const expiryDate = new Date(item.expiryDate);
        if (expiryDate <= new Date(today.setDate(today.getDate() + 7))) {
            alertClass = "bg-danger"; 
        }

        row.className = alertClass;
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.min}</td>
            <td>${item.total || "0.00"}</td> 
            <td>${item.cost}</td>
            <td>${formatDate(item.createdAt)}</td> 
            <td>${formatDate(item.expiryDate)}</td>
        `;
        row.addEventListener("click", () => selectProduct(item));
        inventoryTable.appendChild(row);
    });
}

function formatDate(dateString) {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short", 
    });
}

// ✅ عرض الإشعارات عند انخفاض المخزون أو اقتراب تاريخ الصلاحية
function checkForAlerts(data) {
    const lowStockItems = data.filter(item => item.quantity <= 5);
    const nearExpiryItems = data.filter(item => {
        const today = new Date();
        const expiryDate = new Date(item.expiryDate);
        return expiryDate <= new Date(today.setDate(today.getDate() + 7));
    });

    if (lowStockItems.length > 0) {
        alert(`⚠️ تنبيه: المنتجات التالية منخفضة المخزون:\n${lowStockItems.map(item => `- ${item.name}: ${item.quantity}`).join('\n')}`);
    }

    if (nearExpiryItems.length > 0) {
        alert(`⏰ تنبيه: المنتجات التالية تقترب من تاريخ الصلاحية:\n${nearExpiryItems.map(item => `- ${item.name}: ${formatDate(item.expiryDate)}`).join('\n')}`);
    }
}

// 🔀 دالة الترتيب
const sortTable = (columnIndex) => {
    const table = document.getElementById("product-table");
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

// ✅ إضافة منتج جديد
addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("يجب تسجيل الدخول لإضافة منتجات");
        return;
    }

    const name = document.getElementById("product-name").value.trim();
    const quantity = parseFloat(document.getElementById("product-quantity").value);
    const cost = parseFloat(document.getElementById("product-cost").value);
    const expiryDate = document.getElementById("product-expiry").value;

    if (!name || isNaN(quantity) || isNaN(cost) || !expiryDate) {
        alert("يرجى ملء جميع الحقول بشكل صحيح");
        return;
    }

    fetch("/api/inventory/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, quantity, cost, expiryDate }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`❌ خطأ في جلب البيانات: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        fetchInventory();
        addForm.reset();
        selectedProductId = null;
    })
    .catch(error => console.error("❌ خطأ في إضافة المنتج:", error));
});


// ✅ تحديد المنتج للتعديل أو الحذف
function selectProduct(product) {
    selectedProductId = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-quantity").value = product.quantity;
    document.getElementById("product-cost").value = product.cost;
    document.getElementById("product-expiry").value = product.expiryDate;
    document.getElementById("product-total").value = product.total || "0.00"; // إضافة التوتال
    document.getElementById("product-min").value = product.min || "0"; // إضافة الحد الأدنى
}

// ✅ تعديل منتج
editButton.addEventListener("click", () => {
    if (!selectedProductId) {
        alert("يرجى اختيار منتج للتعديل");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("يجب تسجيل الدخول لإجراء التعديلات");
        return;
    }

    const name = document.getElementById("product-name").value.trim();
    const quantity = parseInt(document.getElementById("product-quantity").value, 10);
    const cost = parseFloat(document.getElementById("product-cost").value);
    const expiryDate = document.getElementById("product-expiry").value;
    const total = quantity * cost;

    if (!name || isNaN(quantity) || isNaN(cost) || !expiryDate) {
        alert("يرجى ملء جميع الحقول بشكل صحيح");
        return;
    }

    fetch(`/api/inventory/${selectedProductId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, quantity, total, cost, expiryDate }),
    })
    .then(response => response.json())
    .then(() => {
        fetchInventory();
        addForm.reset();
        selectedProductId = null;
    })
    .catch(error => console.error("❌ خطأ في تعديل المنتج:", error));
});

// ✅ حذف منتج
deleteButton.addEventListener("click", () => {
    if (!selectedProductId) {
        alert("يرجى اختيار منتج للحذف");
        return;
    }

    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("يجب تسجيل الدخول للحذف");
        return;
    }

    fetch(`/api/inventory/${selectedProductId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(() => {
        fetchInventory();
        addForm.reset();
        selectedProductId = null;
    })
    .catch(error => console.error("❌ خطأ في حذف المنتج:", error));
});

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.getElementById("product-table");
    if (!table) {
        console.error("❌ No table found to export to PDF.");
        return;
    }

    // ✅ Extracting data from the table
    const data = [];
    for (const row of table.rows) {
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        data.push(rowData);
    }

    // ✅ Setting up the table headers and body data
    const header = data[0]; // First row as headers
    const body = data.slice(1); // Remaining rows as data

    doc.text("Inventory Report", 14, 10);
    doc.autoTable({
        head: [header],
        body: body,
        startY: 20,
        styles: { fontSize: 10 },
        margin: { left: 10, right: 10 },
        theme: 'grid',
    });

    doc.save("inventory_report.pdf");
}

function exportToExcel() {
    const table = document.getElementById("product-table");
    if (!table) {
        console.error("❌ لا يوجد جدول لتصديره إلى Excel.");
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, "المخزون");
    XLSX.writeFile(wb, "inventory_report.xlsx");
}