const customerTableBody = document.getElementById("customers-table-body");
const addButton = document.getElementById("add-btn");
const editButton = document.getElementById("edit-btn");
const deleteButton = document.getElementById("delete-btn");

const customerNameInput = document.getElementById("customer-name");
const customerPhoneInput = document.getElementById("customer-phone");
const customerAddressInput = document.getElementById("customer-address");

let selectedCustomerId = null; 

const fetchCustomers = async () => {
    try {
        const res = await fetch("/api/customers");
        const customers = await res.json();

        customerTableBody.innerHTML = "";
        customers.forEach((customer) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.address || "N/A"}</td>
                <td>${customer.totalOrders || 0}</td>
                <td>${customer.totalSpent || 0.00} EGP</td>
            `;
            row.addEventListener("click", () => selectCustomer(customer));
            customerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ خطأ أثناء جلب العملاء:", error);
        alert("⚠️ حدث خطأ أثناء جلب البيانات");
    }
};

const selectCustomer = (customer) => {
    selectedCustomerId = customer.id;
    customerNameInput.value = customer.name;
    customerPhoneInput.value = customer.phone;
    customerAddressInput.value = customer.address || "";
};

const sortTable = (columnIndex) => {
    const table = document.getElementById("customers-table-body");
    const rows = Array.from(table.rows);
    
    let ascending = table.getAttribute(`data-sort-${columnIndex}`) !== "asc";
    
    rows.sort((a, b) => {
        let valueA = a.cells[columnIndex].textContent.trim();
        let valueB = b.cells[columnIndex].textContent.trim();

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

    rows.forEach(row => table.appendChild(row));
    
    table.setAttribute(`data-sort-${columnIndex}`, ascending ? "asc" : "desc");
};

addButton.addEventListener("click", async () => {
    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const address = customerAddressInput.value.trim();

    if (!name || !phone) {
        alert("⚠️ الاسم ورقم الهاتف مطلوبين");
        return;
    }

    try {
        const res = await fetch("/customers/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, address }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ تم إضافة العميل بنجاح");
            fetchCustomers(); 
            resetForm();
        } else {
            alert(data.message || "⚠️ فشل في إضافة العميل");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء إضافة العميل:", error);
        alert("⚠️ حدث خطأ أثناء إضافة العميل");
    }
});

editButton.addEventListener("click", async () => {
    if (!selectedCustomerId) {
        alert("⚠️ حدد عميلًا لتحديثه");
        return;
    }

    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const address = customerAddressInput.value.trim();

    if (!name || !phone) {
        alert("⚠️ الاسم ورقم الهاتف مطلوبين");
        return;
    }

    try {
        const res = await fetch(`/api/customers/${selectedCustomerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, address }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ تم تحديث بيانات العميل بنجاح");
            fetchCustomers(); 
            resetForm();
        } else {
            alert(data.message || "⚠️ فشل في تحديث البيانات");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء تحديث العميل:", error);
        alert("⚠️ حدث خطأ أثناء تحديث العميل");
    }
});

deleteButton.addEventListener("click", async () => {
    if (!selectedCustomerId) {
        alert("⚠️ حدد عميلًا للحذف");
        return;
    }

    if (!confirm("❗ هل أنت متأكد أنك تريد حذف هذا العميل؟")) return;

    try {
        const res = await fetch(`/api/customers/${selectedCustomerId}`, {
            method: "DELETE",
        });

        const data = await res.json();
        if (res.ok) {
            alert("🗑️ تم حذف العميل بنجاح");
            fetchCustomers(); 
            resetForm();
        } else {
            alert(data.message || "⚠️ فشل في حذف العميل");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء حذف العميل:", error);
        alert("⚠️ حدث خطأ أثناء حذف العميل");
    }
});

const resetForm = () => {
    customerNameInput.value = "";
    customerPhoneInput.value = "";
    customerAddressInput.value = "";
    selectedCustomerId = null;
};

document.addEventListener("DOMContentLoaded", fetchCustomers);
