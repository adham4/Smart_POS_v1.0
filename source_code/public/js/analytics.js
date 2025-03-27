document.addEventListener("DOMContentLoaded", async function () {
    try {
        // 🔹 جلب البيانات من الـ API
        const [analyticsResponse, lowStockResponse] = await Promise.all([
            fetch("/api/analytics"),
            fetch("/api/analytics/low-stock")
        ]);

        const data = await analyticsResponse.json();
        const lowStockData = await lowStockResponse.json();

        console.log("📊 بيانات التحليلات:", data);
        console.log("📉 بيانات المنتجات القريبة من النفاد:", lowStockData);

        if (!data) throw new Error("لم يتم استلام بيانات صحيحة من الخادم");

        // 🔹 تحديث الكروت بالبيانات
        document.getElementById("totalOrders").textContent = data.totalOrders || 0;
        document.getElementById("totalRevenue").textContent = (data.totalRevenue || 0) + " L.E";

        const safeList = (arr) => Array.isArray(arr) && arr.length ? arr : [];

        document.getElementById("topProducts").innerHTML = safeList(data.topProducts)
            .map(p => `<li>${p.name}</li>`).join("") || "لا يوجد بيانات";

        document.getElementById("leastProducts").innerHTML = safeList(data.leastProducts)
            .map(p => `<li>${p.name}</li>`).join("") || "لا يوجد بيانات";

        document.getElementById("topCustomers").innerHTML = safeList(data.topCustomers)
            .map(cust => `<li>${cust.name}</li>`).join("") || "لا يوجد بيانات";

        // 🔹 تحديث قائمة المنتجات القريبة من النفاد

        // ✅ التأكد من وجود `lowStockContainer`
        const lowStockContainer = document.getElementById("lowStockCount");
        if (!lowStockContainer) {
            console.error("❌ عنصر `lowStockCount` غير موجود في HTML!");
            return;
        }

        // ✅ تحديث قائمة المنتجات القريبة من النفاد
        if (!lowStockData || !lowStockData.success) {
            console.error("❌ خطأ: لم يتم استلام بيانات المخزون القليل بشكل صحيح!");
            lowStockContainer.innerHTML = "<li>❌ حدث خطأ في تحميل البيانات</li>";
            return;
        }

        const lowStockItems = lowStockData.lowStock || [];
        const expiryItems = lowStockData.expirySoon || [];

        // ✅ دمج المنتجات القليلة المخزون والمنتجات القريبة من انتهاء الصلاحية
        const uniqueItems = [...lowStockItems, ...expiryItems].reduce((acc, item) => {
            if (!acc.find(i => i.id === item.id)) acc.push(item);
            return acc;
        }, []);

        if (uniqueItems.length > 0) {
            lowStockContainer.innerHTML = uniqueItems
                .map(item => {
                    let expiryNotice = item.expiryDate ? ` - Exp: ${item.expiryDate.split("T")[0]}` : "";
                    return `<li>${item.name} (${item.quantity})${expiryNotice}</li>`;
                })
                .join("");
        } else {
            lowStockContainer.innerHTML = "<li>لا توجد منتجات قريبة من النفاد أو انتهاء الصلاحية</li>";
        }


        // 🔹 تفعيل المخططات عند الضغط على الكروت
        const overlay = document.getElementById("chartOverlay");
        const chartCanvas = document.getElementById("chartCanvas");
        const closeChart = document.getElementById("closeChart");

        let chartInstance = null;

        document.querySelectorAll(".analytics-card").forEach(card => {
            card.addEventListener("click", function () {
                const chartType = this.getAttribute("data-chart");

                if (chartType) {
                    overlay.classList.remove("hidden");

                    if (chartInstance !== null) {
                        chartInstance.destroy();
                    }

                    chartInstance = renderChart(chartType, chartCanvas, data, lowStockData);
                }
            });
        });

        overlay.addEventListener("click", function (event) {
            // ✅ التأكد من أن المستخدم ضغط على الـ overlay وليس على المخطط نفسه
            if (event.target === overlay) {
                overlay.classList.add("hidden");
                if (chartInstance !== null) {
                    chartInstance.destroy();
                    chartInstance = null;
                }
            }
        });

    } catch (error) {
        console.error("❌ خطأ أثناء تحميل البيانات:", error);
        document.getElementById("error-message").textContent = "حدث خطأ أثناء تحميل البيانات.";
    }
});

// 🔹 دالة إنشاء الرسوم البيانية
function renderChart(chartType, canvas, data, lowStockData) {
    // التحقق من وجود عنصر الـ canvas
    if (!canvas) {
        console.error("❌ عنصر الـ canvas غير موجود!");
        return null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("❌ لا يمكن الحصول على `context` للرسم!");
        return null;
    }

    console.log("🎨 نوع المخطط:", chartType);

    // تدمير المخطط السابق إذا كان موجودًا
    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }

    let chartData = {}; // تخزين بيانات المخطط

    switch (chartType) {
        case "ordersChart":
            chartData = {
                labels: data.last7Days.map(d => d.date),
                datasets: [{
                    label: "Total Orders",
                    data: data.last7Days.map(d => d.orders),
                    backgroundColor: "rgba(255, 69, 0, 0.5)",
                    borderColor: "#ff4500",
                    borderWidth: 2
                }]
            };
            break;

        case "revenueChart":
            chartData = {
                labels: data.last7Days.map(d => d.date),
                datasets: [{
                    label: "Revenue",
                    data: data.last7Days.map(d => d.revenue),
                    backgroundColor: "rgba(34, 139, 34, 0.5)",
                    borderColor: "green",
                    borderWidth: 2
                }]
            };
            break;

        case "topProductsChart":
            chartData = {
                labels: data.topProducts.map(p => p.name),
                datasets: [{
                    label: "Best Seller",
                    data: data.topProducts.map(p => p.sold),
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "teal",
                    borderWidth: 2
                }]
            };
            break;

        case "leastProductsChart":
            chartData = {
                labels: data.leastProducts.map(p => p.name),
                datasets: [{
                    label: "Least Seller",
                    data: data.leastProducts.map(p => p.sold),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "red",
                    borderWidth: 2
                }]
            };
            break;

        case "lowStockChart":
            if (!lowStockData.success) {
                console.error("⚠️ لا توجد بيانات للمخزون القليل!");
                return;
            }
        
            const lowStockItems = lowStockData.lowStock || [];
            const expiryItems = lowStockData.expirySoon || [];
        
            // 🛠️ تجميع البيانات في كائن بدون تكرار
            const uniqueItems = {};
        
            [...lowStockItems, ...expiryItems].forEach(item => {
                if (!uniqueItems[item.name]) {
                    uniqueItems[item.name] = {
                        name: item.name,
                        quantity: 0,
                        daysToExpiry: 0
                    };
                }
                if (item.quantity) uniqueItems[item.name].quantity = item.quantity;
                if (item.expiryDate) {
                    uniqueItems[item.name].daysToExpiry = moment(item.expiryDate).diff(moment(), "days");
                }
            });
        
            // 📊 تحويل البيانات إلى مصفوفات للمخطط
            const labels = Object.keys(uniqueItems);
            const quantities = labels.map(name => uniqueItems[name].quantity);
            const expiryDays = labels.map(name => uniqueItems[name].daysToExpiry);
        
            chartData = {
                labels: labels,
                datasets: [
                    {
                        label: "Low Stock",
                        data: quantities,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        borderColor: "red",
                        borderWidth: 2
                    },
                    {
                        label: "Expiry Day",
                        data: expiryDays,
                        backgroundColor: "rgba(255, 165, 0, 0.5)",
                        borderColor: "orange",
                        borderWidth: 2
                    }
                ]
            };
            break;

        case "topCustomersChart":
            if (!Array.isArray(data.topCustomers) || data.topCustomers.length === 0) {
                console.warn("⚠️ لا توجد بيانات كافية لإنشاء مخطط أفضل العملاء!");
                return;
            }
        
            const customerNames = data.topCustomers.map(customer => customer.name);
            const customerOrders = data.topCustomers.map(customer => customer.ordersCount); // ✅ استخدام عدد الطلبات بدلًا من totalSpent
        
            chartData = {
                labels: customerNames,
                datasets: [{
                    label: "Total Orders",
                    data: customerOrders, // ✅ البيانات الصحيحة
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "blue",
                    borderWidth: 2
                }]
            };
            break;

        default:
            console.warn("⚠️ نوع المخطط غير معروف:", chartType);
            return null;
    }

    // إنشاء المخطط باستخدام مكتبة Chart.js
    canvas.chartInstance = new Chart(ctx, { 
        type: "bar", 
        data: chartData, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        } 
    });

    return canvas.chartInstance;
}