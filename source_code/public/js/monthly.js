// ✅ جلب بيانات التقفيل الشهري
async function fetchMonthlySummary() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ لا يوجد توكن");
        return;
    }

    try {
        const response = await fetch("/api/monthly-summary", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("❌ خطأ في جلب بيانات التقفيل الشهري:", response.statusText);
            return;
        }

        const data = await response.json();
        console.log("📊 Monthly Data:", data);

        // ✅ عرض البيانات في الواجهة
        document.getElementById("totalOrders").textContent = data.total_orders || 0;
        document.getElementById("totalSandwiches").textContent = data.total_sandwiches || 0;
        document.getElementById("totalRevenue").textContent = (data.total_revenue || 0) + " EGP";
        document.getElementById("totalCost").textContent = (data.total_cost || 0) + " EGP";
        document.getElementById("totalEarnings").textContent = (data.total_earnings || 0) + " EGP";
        document.getElementById("totalDiscount").textContent = (data.totalDiscount || 0) + " EGP";

        // ✅ التأكد من عرض المدفوعات الأونلاين بالاسم الصحيح
        document.getElementById("totalOnlinePayments").textContent = (data.onlinePaymentsTotal || 0) + " EGP";
    } catch (error) {
        console.error("❌ خطأ أثناء جلب بيانات التقفيل الشهري:", error);
    }
}

// ✅ استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", fetchMonthlySummary);

// ✅ إغلاق الشهر
document.getElementById("closeMonthBtn").addEventListener("click", async function () {
    if (!confirm("⚠️ هل أنت متأكد من إغلاق الشهر؟ لا يمكن التراجع!")) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ لا يوجد توكن!");
            return;
        }

        const response = await fetch("/api/close-month", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("✅ تم إغلاق الشهر بنجاح!");
            location.reload();
        } else {
            console.error("❌ خطأ في إغلاق الشهر:", result.message || "خطأ غير معروف");
            alert("❌ خطأ في النظام!");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء إغلاق الشهر:", error);
        alert("❌ خطأ في النظام!");
    }
});

// ✅ التحقق من حالة إغلاق الشهر
async function checkIfMonthClosed() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ لا يوجد توكن");
            return;
        }

        const response = await fetch("/api/monthly-summary", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data && data.total_orders !== undefined) {
            if (data.total_orders === 0) {
                document.getElementById("closeMonthBtn").disabled = true;
                document.getElementById("closeMonthBtn").textContent = "🔒 Closed";
            } else {
                document.getElementById("closeMonthBtn").disabled = false;
                document.getElementById("closeMonthBtn").textContent = "Close Month";
            }
        } else {
            document.getElementById("closeMonthBtn").disabled = false;
            document.getElementById("closeMonthBtn").textContent = "🔒 Closed";
        }
    } catch (error) {
        console.error("❌ خطأ أثناء التحقق من إغلاق الشهر:", error);
    }
}

// ✅ استدعاء الفحص عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", checkIfMonthClosed);

// ✅ طباعة التقرير الشهري
function openReport() {
    const printWindow = window.open('/monthly_report.html', '_blank', 'width=400,height=600');
    printWindow.onload = function () {
        printWindow.print();
    };
}