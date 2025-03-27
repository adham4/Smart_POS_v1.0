const orderSummary = document.getElementById('order-summary');
const orderTotal = document.getElementById('order-total');
const menuItemsContainer = document.getElementById('menu-items');
const phoneInput = document.getElementById('customer-phone');
const nameInput = document.getElementById('customer-name');
const addressInput = document.getElementById('customer-address');
const deliveryPriceSelect = document.getElementById('delivery-price');
const submitButton = document.getElementById('submit-order');

function fetchCustomerData(phone) {
    fetch(`/api/customers/${phone}`)            
    .then(response => {
            if (!response.ok) {
                throw new Error("❌ العميل غير موجود");
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ بيانات العميل المسترجعة:", data); // ✅ راقب البيانات في الكونسول
            if (data.length > 0) {
                const customer = data[0]; // ✅ أول عميل مطابق للبحث
                nameInput.value = customer.name || "";
                addressInput.value = customer.address || "";
            } else {
                nameInput.value = "";
                addressInput.value = "";
            }
        })
        .catch(error => {
            console.warn(error);
            nameInput.value = "";
            addressInput.value = "";
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("customer-phone");
    const nameInput = document.getElementById("customer-name");
    const addressInput = document.getElementById("customer-address");

    if (!phoneInput || !nameInput || !addressInput) {
        console.warn("⚠️ تأكد من وجود جميع الحقول المطلوبة في HTML");
        return;
    }

    phoneInput.addEventListener("input", function () {
        let phone = phoneInput.value.trim();
        if (phone.length === 11) {
            fetchCustomerData(phone);
        }
    });
});

function setPaymentMethod(method) {
    document.getElementById('payment-method').value = method;

    const buttons = document.querySelectorAll('.payment-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`.payment-btn[data-method="${method}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

let currentOrder = [];
let products = {};
let deliveryPrice = 0;

deliveryPriceSelect.addEventListener('change', () => {
    deliveryPrice = parseFloat(deliveryPriceSelect.value) || 0;
    updateOrderTotal(); // ✅ تحديث التوتال بعد تعديل الديليفري
});

function fetchProducts() {
    fetch('/products', {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert("❌ Unauthorized! Please log in again.");
                window.location.href = "/index.html";
            }
            return Promise.reject(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Products Data:", data);
        window.categorizedProducts = data; 
        showMenu('beef'); // عرض قائمة "beef" بشكل افتراضي عند التحميل الأول
    })
    .catch(error => {
        console.error("❌ خطأ أثناء تحميل المنتجات:", error);
    });
}

function showMenu(category) {
    fetch(`/products/${category}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                menuItemsContainer.innerHTML = `<p>❌ لا توجد منتجات في هذه الفئة.</p>`;
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        menuItemsContainer.innerHTML = ''; // تفريغ القائمة القديمة

        if (data.length === 0) {
            menuItemsContainer.innerHTML = `<p>❌ لا توجد منتجات في هذه الفئة.</p>`;
            return;
        }

        data.forEach(product => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            menuItem.onclick = () => addToOrder(product.name, product.price); 
            
            menuItem.innerHTML = `
                <p class="menu-text">${product.name} - ${product.price} EGP</p>
            `;

            menuItemsContainer.appendChild(menuItem);
        });
    })
    .catch(error => console.error('❌ خطأ أثناء جلب العناصر من القائمة:', error));
}

function addToOrder(itemName, itemPrice) {
    currentOrder[itemName] = currentOrder[itemName] || { price: itemPrice, quantity: 0 };
    currentOrder[itemName].quantity++;
    renderOrderSummary();
}

function increaseQuantity(item) {
    if (currentOrder[item]) {
        currentOrder[item].quantity++;
        renderOrderSummary();
    }
}

function decreaseQuantity(item) {
    if (currentOrder[item] && currentOrder[item].quantity > 1) {
        currentOrder[item].quantity--;
        renderOrderSummary();
    }
}

function removeItem(item) {
    const itemRow = document.querySelector(`.order-row[data-item="${item}"]`);

    if (itemRow) {
        itemRow.classList.add('removing');
        setTimeout(() => {
            delete currentOrder[item];
            itemRow.remove(); // إزالة العنصر المحدد فقط
            renderOrderSummary(); // إعادة الحساب بدون مسح القائمة
        }, 300); // نفس مدة الـ transition في الـ CSS
    }
}

function renderOrderSummary() {
    let total = 0;

    for (let item in currentOrder) {
        let { price, quantity, comment = [] } = currentOrder[item];
        price = parseFloat(price) || 0;

        total += price * quantity;

        let orderRow = document.querySelector(`.order-row[data-item="${item}"]`);

        if (orderRow) {
            orderRow.querySelector('.order-quantity').textContent = quantity;
            orderRow.querySelector('.order-price').textContent = `${price.toFixed(2)} EGP`;

            const commentContainer = orderRow.querySelector('.order-comment');
            commentContainer.innerHTML = '';

            if (comment.length > 0) {
                comment.forEach(({ text, price }) => {
                    price = parseFloat(price) || 0;

                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment-item');
                    commentElement.innerHTML = `
                        <span>${text.trim()}</span>
                        <span>${price.toFixed(2)} </span>
                    `;
                    commentContainer.appendChild(commentElement);
                });

                commentContainer.style.display = 'block';
            } else {
                commentContainer.style.display = 'none';
            }
        } else {
            orderRow = document.createElement('div');
            orderRow.className = 'order-row adding';
            orderRow.setAttribute('data-item', item);

            orderRow.innerHTML = `
                <div class="order-info">
                    <span class="order-item">${item}</span>
                    <span class="order-quantity">${quantity}</span>
                    <span class="order-price">${price.toFixed(2)} EGP</span>
                    <div class="order-actions">
                        <button onclick="increaseQuantity('${item}')">+</button>
                        <button onclick="decreaseQuantity('${item}')">-</button>
                        <button onclick="removeItem('${item}')">X</button>
                        <button onclick="openCommentCard('${item}')">💬</button>
                    </div>
                </div>
                <div class="order-comment" style="display: ${comment.length > 0 ? 'block' : 'none'};">
                    ${comment
                        .map(({ text, price }) => {
                            price = parseFloat(price) || 0;
                            return `<div class="comment-item">
                                <span>${text.trim()}</span>
                                <span>${price.toFixed(2)}  </span>
                            </div>`;
                        }).join('')}
                </div>
            `;

            orderSummary.appendChild(orderRow);
            setTimeout(() => orderRow.classList.remove('adding'), 10);
        }
    }

    // ✅ تحديث التوتال بعد كل تحديث للطلب
    updateOrderTotal(); 

    const existingRows = document.querySelectorAll('.order-row');
    existingRows.forEach(row => {
        const itemName = row.getAttribute('data-item');
        if (!currentOrder[itemName]) {
            row.classList.add('removing');
            setTimeout(() => row.remove(), 300);
        }
    });

    if (orderSummary.scrollHeight > 250) {
        orderSummary.classList.add('collapsed');
    } else {
        orderSummary.classList.remove('collapsed');
    }
}

function updateOrderTotal() {
    let total = 0;

    Object.values(currentOrder).forEach(details => {
        total += details.price * details.quantity;
    
        // ✅ جمع قيمة التعليقات مع التوتال
        if (details.comment && details.comment.length) {
            details.comment.forEach(c => {
                total += parseFloat(c.price) || 0; // ✅ يجمع سعر التعليق اليدوي
            });
        }
    });

    // ✅ إضافة الدليفري على التوتال
    total += deliveryPrice;

    // ✅ تحديث التوتال في الواجهة
    document.getElementById('order-total').innerText = total.toFixed(2);
}

const overlay = document.createElement('div');
overlay.classList.add('overlay');
overlay.style.display = 'none';

const commentCard = document.createElement('div');
commentCard.classList.add('comment-card');
commentCard.innerHTML = `
    <div class="comment-header">
        <button id="closeCommentCard">✖</button>
    </div>
    
    <textarea id="customComment" placeholder="اكتب تعليقك هنا..."></textarea>
    
    <select id="commentPriceDropdown" class="price-dropdown">
    <option value="0">بدون سعر إضافي</option>
    <option value="5">5 EGP</option>
    <option value="10">10 EGP</option>
    <option value="15">15 EGP</option>
    <option value="20">20 EGP</option>
    <option value="25">25 EGP</option>
    <option value="30">30 EGP</option>
</select>
    <!-- أشهر التعليقات -->
    <div class="popular-comments" id="popularComments">
        <!-- التعليقات المشهورة ستُضاف هنا تلقائيًا -->
    </div>
    
    <button id="saveComment">حفظ</button>
`;

commentCard.style.display = 'none';

document.body.appendChild(overlay);
document.body.appendChild(commentCard);

let selectedItem = null;

function openCommentCard(item) {
    if (!item) {
        console.error('❌ العنصر غير صالح.');
        return;
    }

    selectedItem = item; // ✅ تعيين العنصر المحدد

    // ✅ تفريغ التعليق اليدوي عند الفتح
    document.getElementById('customComment').value = '';

    // ✅ إذا كان هناك تعليقات يدوية مخزنة، قم بعرضها
    if (currentOrder[item]?.manualComments?.length > 0) {
        document.getElementById('customComment').value = currentOrder[item].manualComments.join(' || ');
    }

    // ✅ استدعاء التعليقات الشائعة
    fetchPopularComments();

    // ✅ عرض الكارد في منتصف الشاشة
    overlay.style.display = 'block';
    commentCard.style.display = 'block';
    commentCard.style.top = '50%';
    commentCard.style.left = '50%';
    commentCard.style.transform = 'translate(-50%, -50%)';

    console.log(`✅ تم فتح الكارد للعنصر: ${item}`);
}

function closeCommentCard() {
    overlay.style.display = 'none';
    commentCard.style.display = 'none';
}

async function fetchPopularComments() {
    const popularCommentsContainer = document.getElementById('popularComments');
    popularCommentsContainer.innerHTML = '';

    try {
        const response = await fetch('/comments/popular');
        const comments = await response.json();

        comments.forEach(comment => {
            // ✅ إنشاء زر لكل تعليق مثبت
            const commentButton = document.createElement('button');
            commentButton.classList.add('comment-btn');
            commentButton.style.backgroundColor = comment.color;

            // ✅ تنسيق النص على سطرين
            commentButton.innerHTML = `
                <div class="comment-text">${comment.commentText}</div>
                <div class="comment-price">${comment.price}</div>
            `;

            // ✅ عند الضغط على الزر، يضيف التعليق للطلب
            commentButton.onclick = () => {
                console.log(comment); // ✅ تأكد إن فيه قيمة
                if (comment && comment.commentText && comment.price !== undefined) {
                    addComment(comment.commentText, comment.price);
                } else {
                    console.error('❌ التعليق غير موجود أو القيم ناقصة.');
                }
            };
            popularCommentsContainer.appendChild(commentButton);
        });
    } catch (error) {
        console.error('❌ Failed to load popular comments:', error);
    }
}

function addComment(comment, price = 0, isManual = false) {
    if (!selectedItem) {
        console.error('❌ لم يتم تحديد عنصر لإضافة التعليق عليه.');
        return;
    }

    if (!comment?.trim()) {
        console.error('❌ لا يمكن إضافة تعليق فارغ.');
        return;
    }

    price = parseFloat(price) || 0;

    // ✅ إنشاء الطلب لو مش موجود
    if (!currentOrder[selectedItem]) {
        currentOrder[selectedItem] = { price: 0, quantity: 0, comment: [] };
    }

    if (!Array.isArray(currentOrder[selectedItem].comment)) {
        currentOrder[selectedItem].comment = [];
    }

    // ✅ التأكد من عدم تكرار التعليق بنفس النص والسعر
    const alreadyExists = currentOrder[selectedItem].comment.some(
        c => c.text === comment && c.price === price
    );

    if (!alreadyExists) {
        currentOrder[selectedItem].comment.push({ text: comment, price, isManual });
    }

    console.log(`✅ بعد الإضافة:`, currentOrder[selectedItem]);

    // ✅ تحديث التوتال بعد الإضافة
    updateOrderTotal();
    updateOrderCommentsDisplay(selectedItem);

    // ✅ غلق الكارد بعد الإضافة لو مش تعليق يدوي
    if (!isManual) closeCommentCard(); 
}

document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('click', () => {
        selectedItem = item.getAttribute('data-id');
        console.log(`✅ المنتج المحدد: ${selectedItem}`);
    });
});

function setComment(comment, price) {
    console.log(`🚀 محاولة إضافة تعليق: ${comment} بسعر: ${price}`);

    if (!selectedItem) {
        console.error('❌ لم يتم تحديد عنصر.');
        return;
    }

    if (!currentOrder[selectedItem]) {
        currentOrder[selectedItem] = { price: 0, quantity: 0, comment: [] };
    }

    if (!Array.isArray(currentOrder[selectedItem].comment)) {
        currentOrder[selectedItem].comment = [];
    }

    // ✅ إضافة التعليق
    currentOrder[selectedItem].comment.push({ text: comment, price });

    console.log(`✅ بعد الإضافة:`, currentOrder[selectedItem]);

    // ✅ تحديث العرض والتوتال
    updateOrderCommentsDisplay(selectedItem);
    updateOrderTotal();
}

function addManualComment(item) {
    const commentInput = document.getElementById('commentInput').value.trim();
    const priceInput = parseFloat(document.getElementById('priceInput').value) || 0;

    if (!commentInput) {
        console.error('❌ لا يمكن إضافة تعليق فارغ.');
        return;
    }

    // ✅ تعيين العنصر المختار
    selectedItem = item;

    // ✅ استخدم `addComment()` بدلاً من التعديل المباشر
    addComment(commentInput, priceInput, true); 

    // ✅ تحديث التوتال بعد الإضافة
    updateOrderTotal();
    updateOrderCommentsDisplay(item);

    // ✅ تفريغ الحقول بعد الإضافة
    document.getElementById('commentInput').value = '';
    document.getElementById('priceInput').value = '';
}

function updateQuantity(itemIndex, newQuantity) {
    if (!currentOrder[itemIndex]) return;

    const existingComments = [...(currentOrder[itemIndex].comment || [])];
    currentOrder[itemIndex].quantity = newQuantity;
    currentOrder[itemIndex].comment = existingComments;

    updateOrderCommentsDisplay(itemIndex);
    updateOrderTotal();
}

function updateOrderCommentsDisplay(item) {
    const orderRow = document.querySelector(`.order-row[data-item="${item}"]`);
    if (!orderRow) return;

    const commentContainer = orderRow.querySelector('.order-comment');
    commentContainer.innerHTML = ''; // ✅ مسح التعليقات القديمة قبل التحديث

    const comments = currentOrder[item].comment || [];
    comments.forEach(({ text, price }) => {
        price = parseFloat(price) || 0;

        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-item');

        const textElement = document.createElement('span');
        textElement.textContent = text;

        const priceElement = document.createElement('span');
        priceElement.textContent = `${price.toFixed(2)} `;

        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.setAttribute('data-text', text);
        removeButton.setAttribute('data-price', price);
        removeButton.onclick = () => removeComment(item, text, price, removeButton);

        commentElement.appendChild(textElement);
        commentElement.appendChild(priceElement);
        commentElement.appendChild(removeButton);

        commentContainer.appendChild(commentElement);
    });

    commentContainer.style.display = comments.length > 0 ? 'block' : 'none';

    renderOrderSummary(); // ✅ تحديث واجهة الطلب بالكامل
}

function updateCommentCount(item, text, price, change) {
    const order = currentOrder[item];
    if (!order || !order.comment) return;

    order.comment = order.comment.map(c => {
        if (c.text === text && c.price === price) {
            const newCount = Math.max(1, (c.count || 1) + change);
            return { ...c, count: newCount };
        }
        return c;
    });

    renderOrderSummary();
}

function removeComment(item, text, price, element) {
    if (!item || !currentOrder[item]) return;

    currentOrder[item].comment = currentOrder[item].comment.filter(
        c => !(c.text === text && parseFloat(c.price).toFixed(2) === parseFloat(price).toFixed(2))
    );

    updateOrderCommentsDisplay(item);
    renderOrderSummary();
}

document.getElementById('saveComment').addEventListener('click', () => {
    const comment = document.getElementById('customComment').value.trim();
    const selectedPrice = parseFloat(document.getElementById('commentPriceDropdown').value);

    if (!comment) {
        console.error('❌ لا يمكن إضافة تعليق فارغ.');
        return;
    }

    if (isNaN(selectedPrice)) {
        console.error('❌ سعر التعليق غير صحيح.');
        return;
    }

    setComment(comment, selectedPrice);

    // ✅ إغلاق الكارد بعد الحفظ
    if (overlay) overlay.style.display = 'none';
    if (commentCard) commentCard.style.display = 'none';
});

document.getElementById('closeCommentCard').addEventListener('click', closeCommentCard);

overlay.addEventListener('click', closeCommentCard);





document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 35; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} EGP`;
        deliveryPriceSelect.appendChild(option);
    }
    fetchProducts(); // تحميل المنتجات من قاعدة البيانات
    deliveryPriceSelect.addEventListener('change', renderOrderSummary);
    submitButton.addEventListener('click', submitOrder);
});

async function getBestDiscountCode(orderDetails) {
    try {
        const productNames = orderDetails.map(item => item.name);
        console.log("🔍 البحث عن أكواد خصم للمنتجات:", productNames);

        const response = await fetch(`/api/discounts/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: productNames })
        });

        if (!response.ok) {
            throw new Error("❌ فشل في جلب كود الخصم");
        }

        const data = await response.json();
        console.log("🔹 بيانات كود الخصم المستلمة من السيرفر:", data);
        
        return data.bestDiscountCode || null;
    } catch (error) {
        console.error("❌ خطأ أثناء جلب كود الخصم:", error);
        return null;
    }
}

async function submitOrder() {
    if (!nameInput.value.trim() || !phoneInput.value.trim() || !addressInput.value.trim()) {
        alert("❌ يرجى إدخال بيانات العميل كاملة");
        return;
    }

    if (Object.keys(currentOrder).length === 0) {
        alert("❌ لا يمكن إرسال طلب فارغ");
        return;
    }

    const orderDetails = Object.entries(currentOrder).map(([name, details]) => ({
        name,
        price: details.price,
        quantity: details.quantity,
        comments: (details.comment || []).map(c => ({ // ✅ إصلاح مشكلة undefined
            text: c.text,
            price: c.price
        }))
    }));

    // ✅ جلب أفضل كود خصم متاح
    let discountCode = null;
    try {
        discountCode = await getBestDiscountCode(orderDetails);
        console.log("🔹 أفضل كود خصم متاح:", discountCode);
    } catch (error) {
        console.error("⚠️ خطأ أثناء جلب كود الخصم:", error);
    }

    const orderData = {
        customer: {
            name: nameInput.value.trim(),
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim(),
        },
        deliveryPrice: parseFloat(deliveryPriceSelect.value) || 0,
        orderTotal: parseFloat(orderTotal.textContent) || 0,
        orderDetails, 
        payment_method: document.getElementById('payment-method').value,
        discountCode,
    };

    console.log("📤 الطلب قبل الإرسال:", orderData);

    fetch('/api/order', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.order) {
            console.log("✅ الطلب تم بنجاح:", data);
            resetForm();
            updateOrderTotal(); // ✅ تحديث التوتال بعد الإرسال
        } else {
            throw new Error(data.message || "حدث خطأ غير معروف");
        }
    })
    .catch(error => {
        console.error("❌ خطأ أثناء إرسال الطلب:", error);
        alert(`❌ خطأ: ${error.message}`);
    });
}

function resetForm() {
    nameInput.value = '';
    addressInput.value = '';
    phoneInput.value = '';
    deliveryPriceSelect.value = '0';
    orderTotal.textContent = '0.00';
    orderSummary.innerHTML = '';
    currentOrder = {};
}

document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("customer-phone"); // ✅ إدخال رقم الهاتف
    const suggestionsBox = document.getElementById("suggestions"); // ✅ صندوق الاقتراحات

    if (!phoneInput) {
        console.warn("⚠️ لم يتم العثور على عنصر إدخال رقم الهاتف!");
        return;
    }

    // 🛠️ دالة لتحويل الأرقام العربية إلى إنجليزية لتجنب الأخطاء
    function convertArabicNumbersToEnglish(str) {
        return str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
    }

    phoneInput.addEventListener("input", async function () {
        let phone = phoneInput.value.trim();
        phone = convertArabicNumbersToEnglish(phone); // ✅ تحويل الرقم قبل الإرسال

        if (phone.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/api/customers/${phone}`);
            if (!response.ok) throw new Error("❌ فشل في جلب البيانات من السيرفر");

            const customers = await response.json();
            suggestionsBox.innerHTML = ""; // ✅ مسح القائمة السابقة

            if (customers.length === 0) {
                suggestionsBox.style.display = "none";
                return;
            }

            customers.forEach(customer => {
                const suggestion = document.createElement("div");
                suggestion.classList.add("suggestion-item"); // ✅ تحسين المظهر
                suggestion.textContent = customer.phone;
                suggestion.addEventListener("click", function () {
                    phoneInput.value = customer.phone;
                    suggestionsBox.style.display = "none";
                    fetchCustomerData(customer.phone);
                });
                suggestionsBox.appendChild(suggestion);
            });

            suggestionsBox.style.display = "block";
        } catch (error) {
            console.error("❌ خطأ أثناء تحميل الأرقام:", error);
        }
    });

    // ✅ إخفاء قائمة الاقتراحات عند النقر خارجها
    document.addEventListener("click", function (e) {
        if (!phoneInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = "none";
        }
    });
});