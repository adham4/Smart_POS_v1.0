let allProducts = []; // لتخزين جميع المنتجات عند التحميل الأول


// 🛒 جلب المنتجات من الـ API وتخزينها في allProducts
async function fetchProducts() {
    try {
        const response = await fetch("http://127.0.0.1:8083/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 401) {
            alert("⚠️ يجب تسجيل الدخول للوصول إلى هذه الصفحة.");
            window.location.href = "/index.html";
            return;
        }

        console.log("📦 الاستجابة من الـ API:", response);

        if (!response.ok) {
            console.error(`❌ خطأ في الطلب: ${response.status} ${response.statusText}`);
            return;
        }

        allProducts = await response.json(); // ✅ تخزين البيانات في المتغير العام
        console.log("📦 البيانات المستلمة:", allProducts);

        const products = Object.values(allProducts).flat(); // ✅ تحويل الكائنات إلى مصفوفة موحدة للعرض
        console.log("✅ البيانات المجهزة للعرض:", products);

        renderProducts(products);

    } catch (error) {
        console.error('⚠️ خطأ أثناء جلب المنتجات:', error);
    }
}

// عرض المنتجات في الجدول
function renderProducts(products) {
    if (!Array.isArray(products)) {
        console.error("⚠️ البيانات المستلمة ليست مصفوفة:", products);
        return;
    }

    const tableBody = document.getElementById('product-table');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.sold}</td>
        `;

        row.addEventListener('click', () => fillFormFields(product));
        tableBody.appendChild(row);
    });
}

// تعبئة الحقول العلوية عند اختيار منتج من الجدول
function fillFormFields(product) {
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
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

// إضافة منتج جديد
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value)
    };

    try {
        const response = await fetch("http://127.0.0.1:8083/products/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('✅ تم إضافة المنتج بنجاح.');
            fetchProducts(); // إعادة تحميل المنتجات
            document.getElementById('add-product-form').reset(); // إعادة تعيين الحقول
        } else {
            alert('⚠️ خطأ أثناء إضافة المنتج.');
        }
    } catch (error) {
        console.error('⚠️ خطأ أثناء الاتصال بالخادم:', error);
    }
});

// تعديل منتج
document.getElementById('edit-btn').addEventListener('click', async () => {
    const productId = document.getElementById('product-id').value;
    if (!productId) {
        alert('⚠️ يرجى اختيار منتج للتعديل.');
        return;
    }

    const product = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value)
    };

    try {
        const response = await fetch(`http://127.0.0.1:8083/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('✅ تم تعديل المنتج بنجاح.');
            fetchProducts();
            document.getElementById('add-product-form').reset();
        } else {
            alert('⚠️ خطأ أثناء تعديل المنتج.');
        }
    } catch (error) {
        console.error('⚠️ خطأ أثناء الاتصال بالخادم:', error);
    }
});

// حذف منتج
document.getElementById('delete-btn').addEventListener('click', async () => {
    const productId = document.getElementById('product-id').value;
    if (!productId) {
        alert('⚠️ يرجى اختيار منتج للحذف.');
        return;
    }

    if (!confirm('⚠️ هل أنت متأكد أنك تريد حذف هذا المنتج؟')) return;

    try {
        const response = await fetch(`http://127.0.0.1:8083/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('🗑️ تم حذف المنتج بنجاح.');
            fetchProducts();
            document.getElementById('add-product-form').reset();
        } else {
            alert('⚠️ خطأ أثناء حذف المنتج.');
        }
    } catch (error) {
        console.error('⚠️ خطأ أثناء الاتصال بالخادم:', error);
    }
});

// تصفية المنتجات بناءً على البحث
function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    if (!allProducts || allProducts.length === 0) {
        console.warn("⚠️ لم يتم تحميل المنتجات بعد.");
        return;
    }

    const filteredProducts = Object.values(allProducts).flat().filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderProducts(filteredProducts);
}

// تطبيق الفلترة بناءً على الخيار المحدد في القائمة المنسدلة
function applyFilter() {
    const filterOption = document.getElementById('filter-options').value;
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    
    let filteredProducts = Object.values(allProducts).flat();

    // 🔍 تطبيق البحث أولاً إذا كان هناك نص مكتوب في البحث
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // 📌 تطبيق الفلترة بعد البحث
    switch (filterOption) {
        case 'most-sold':
            filteredProducts.sort((a, b) => b.sold - a.sold);
            break;
        case 'highest-price':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'lowest-price':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'category':
            filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            break;
    }

    renderProducts(filteredProducts);
}

function exportProductsToPDF() {
    const productsArray = Object.values(allProducts).flat(); // تحويل `allProducts` إلى مصفوفة

    if (!productsArray.length) {
        alert("Nothing To Export ⚠️");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Products List", 14, 10);

    let y = 20;
    productsArray.forEach((product, index) => {
        doc.text(`${index + 1}. ${product.name} - ${product.category} - ${product.price} EGP`, 10, y);
        y += 10;
    });

    doc.save("products-list.pdf");
}

function exportProductsToExcel() {
    const productsArray = Object.values(allProducts).flat(); // تحويل `allProducts` إلى مصفوفة

    if (!productsArray.length) {
        alert("Nothing To Export ⚠️");
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(productsArray);

    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products-list.xlsx");
}

// تحميل البيانات عند فتح الصفحة
window.onload = fetchProducts;