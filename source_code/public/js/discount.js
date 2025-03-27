// ✅ التحقق من تحميل الصفحة بشكل صحيح
document.addEventListener('DOMContentLoaded', () => {
    fetchDiscountCodes();
    fetchProducts();

    // أحداث الفورم
    document.getElementById('discount-form').addEventListener('submit', saveDiscountCode);
    document.getElementById('cancel-btn').addEventListener('click', resetForm);

    // إعداد الـ Dropdown للمنتجات
    const input = document.getElementById('applicable_products');
    input.addEventListener('click', toggleDropdown);

    // إغلاق الـ Dropdown عند الضغط خارجها
    document.addEventListener('click', handleOutsideClick);
});

// ✅ عرض أكواد الخصم في الجدول
async function fetchDiscountCodes() {
    try {
        const response = await fetch('/api/discounts');
        const data = await response.json();

        if (data.success) {
            const discountsTable = document.getElementById('discounts-table-body');
            discountsTable.innerHTML = '';

            data.discounts.forEach(discount => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${discount.code}</td>
                    <td>${discount.discount_type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount'}</td>
                    <td>${discount.discount_value}</td>
                    <td>${new Date(discount.start_date).toLocaleDateString()}</td>
                    <td>${new Date(discount.end_date).toLocaleDateString()}</td>
                    <td>${discount.applicable_products || 'All Products'}</td>
                    <td>${discount.is_active ? 'Active' : 'Inactive'}</td>
                `;
                
                // ✅ حدث الضغط على الصف لملء الفورم بالبيانات
                row.addEventListener('click', () => fillFormWithDiscountData(discount));
                
                discountsTable.appendChild(row);
            });
        } else {
            console.error('Failed to fetch discount codes:', data.message);
        }
    } catch (error) {
        console.error('Error fetching discount codes:', error);
    }
}

// ✅ ملء الفورم بالبيانات عند الضغط على الصف
function fillFormWithDiscountData(discount) {
    document.getElementById('discount-id').value = discount.id;
    document.getElementById('code').value = discount.code;
    document.getElementById('discount_type').value = discount.discount_type;
    document.getElementById('discount_value').value = discount.discount_value;
    document.getElementById('start_date').value = discount.start_date.split('T')[0];
    document.getElementById('end_date').value = discount.end_date.split('T')[0];

    selectedProducts = discount.applicable_products || [];
    updateProductInput(); // تحديث الحقل بالمنتجات المختارة
    
    document.getElementById('is_active').value = discount.is_active ? 'true' : 'false';
}

// ✅ حفظ (إضافة/تعديل) كود الخصم
async function saveDiscountCode(event) {
    event.preventDefault();

    const discountId = document.getElementById('discount-id').value;
    const code = document.getElementById('code').value;
    const discount_type = document.getElementById('discount_type').value;
    const discount_value = document.getElementById('discount_value').value;
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;
    const is_active = document.getElementById('is_active').value === 'true';

    const payload = {
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        applicable_products: selectedProducts, // إرسالها كمصفوفة مباشرة
        is_active
    };

    try {
        const method = discountId ? 'PUT' : 'POST';
        const endpoint = discountId ? `/api/discounts/${discountId}` : '/api/discounts';

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            resetForm();
            fetchDiscountCodes();
        } else {
            alert(`Failed to save discount code: ${data.message}`);
        }
    } catch (error) {
        console.error('Error saving discount code:', error);
        alert('An error occurred while saving the discount code.');
    }
}

// ✅ إعادة ضبط الفورم
function resetForm() {
    document.getElementById('discount-form').reset();
    document.getElementById('discount-id').value = '';
}

// 🆕 جلب المنتجات من السيرفر وعرضها في الـ Dropdown

// 🆕 قائمة المنتجات المختارة
let selectedProducts = [];

const productsList = document.getElementById('products-list');

// 🆕 جلب المنتجات من السيرفر وعرضها في الـ Dropdown
async function fetchProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/products', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 البيانات المستلمة:', data);

        // 🆕 عرض المنتجات في الـ Dropdown
        productsList.innerHTML = '';
        Object.values(data).flat().forEach(product => {
            const item = document.createElement('div');
            item.textContent = product.name;
            item.classList.add('dropdown-item');
            item.onclick = () => toggleProductSelection(product.name);
            productsList.appendChild(item);
        });

    } catch (error) {
        console.error('❌ خطأ أثناء تحميل المنتجات:', error);
    }
}

// ✅ دالة لإظهار وإخفاء الـ Dropdown
function toggleDropdown(event) {
    event.stopPropagation(); // منع الإغلاق عند الضغط داخل الحقل
    productsList.classList.toggle('hidden');
}

// ✅ عند اختيار/إلغاء تحديد منتج
function toggleProductSelection(productName) {
    const index = selectedProducts.indexOf(productName);
    if (index === -1) {
        // إضافة المنتج إذا لم يكن موجودًا
        selectedProducts.push(productName);
    } else {
        // إزالة المنتج إذا كان موجودًا بالفعل
        selectedProducts.splice(index, 1);
    }

    updateProductInput(); // تحديث حقل الإدخال
}

// ✅ تحديث حقل المنتجات المختارة
function updateProductInput() {
    const input = document.getElementById('applicable_products');
    input.value = selectedProducts.join(', '); // عرض المنتجات كمجموعة نصية
}

// ✅ إغلاق القائمة عند الضغط خارجها
function handleOutsideClick(event) {
    const input = document.getElementById('applicable_products');
    if (!input.contains(event.target) && !productsList.contains(event.target)) {
        productsList.classList.add('hidden');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("delete-discount");

    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            const discountId = document.getElementById("discount-id")?.value; // 🔍 احصل على ID الخصم المحدد

            if (!discountId) {
                alert("❌ الرجاء تحديد كود خصم لحذفه!");
                return;
            }

            if (confirm("⚠️ هل أنت متأكد من حذف كود الخصم؟ لا يمكن التراجع!")) {
                deleteDiscount(discountId);
            }
        });
    }
});

// ✅ دالة حذف كود الخصم من الـ API
function deleteDiscount(discountId) {
    fetch(`/api/discounts/${discountId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ تم حذف كود الخصم بنجاح!");
            location.reload(); // 🔄 تحديث الصفحة بعد الحذف
        } else {
            alert(`❌ خطأ: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("❌ فشل حذف كود الخصم:", error);
        alert("❌ حدث خطأ أثناء الحذف، حاول مجددًا!");
    });
}

// 🔀 دالة الترتيب
const sortTable = (columnIndex) => {
    const table = document.getElementById("discounts-table-body");
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