document.addEventListener("DOMContentLoaded", function () {

    // ربط زر إغلاق اليوم بالدالة الصحيحة
    const closeDayBtn = document.getElementById("close-day-btn");
    if (closeDayBtn) {
        closeDayBtn.addEventListener("click", closeDay);
    }

    // استدعاء الدوال عند تحميل الصفحة
    fetchDailySummary();
    checkIfDayClosed();
});

// 🟢 دالة جلب ملخص اليوم من السيرفر
async function fetchDailySummary() {
    try {
        const response = await fetch("/api/daily-summary");
        const data = await response.json();

        console.log('🔍 API Response:', data); // ✅ تأكد أن البيانات تصل للواجهة

        document.getElementById("totalOrders").textContent = data.totalOrders;
        document.getElementById("totalSandwiches").textContent = data.totalSandwiches;
        document.getElementById("total-revenue").textContent = data.totalRevenue + " EGP";
        document.getElementById("total-cost").textContent = data.totalCost + " EGP";
        document.getElementById("total-earnings").textContent = data.totalEarnings + " EGP";

        // ✅ إظهار الخصومات بالقيمة الصحيحة
        document.getElementById("total-discount").textContent = data.discount + " EGP";

        // ✅ إظهار المدفوعات الإلكترونية بالقيمة الصحيحة
        document.getElementById("total-online-payments").textContent = data.onlinePaymentsTotal + " EGP";

    } catch (error) {
        console.error("❌ Error fetching daily summary:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchDailySummary);

// 🔴 دالة إغلاق اليوم وتحديث قاعدة البيانات
async function closeDay() {
    if (!confirm("⚠️ هل أنت متأكد من إغلاق اليوم؟ لا يمكن التراجع!")) return;

    try {
        const response = await fetch("/api/close-day", { method: "POST" });
        const result = await response.json();

        if (result.success) {
            alert("✅ تم إغلاق اليوم بنجاح!");
            location.reload(); // تحديث الصفحة بعد الإغلاق
        }
    } catch (error) {
        console.error("❌ Error closing the day:", error);
        alert("❌ خطأ في النظام!");
    }
}

// 🟢 دالة التحقق من إذا كان اليوم مغلقًا
async function checkIfDayClosed() {
    try {
        const response = await fetch("/api/daily-summary");
        const data = await response.json();

        if (data.totalOrders === 0) {
            const closeDayBtn = document.getElementById("close-day-btn");
            if (closeDayBtn) {
                closeDayBtn.disabled = true;
                closeDayBtn.textContent = "🔒 Closed";
            }
        }
    } catch (error) {
        console.error("❌ خطأ أثناء التحقق من إغلاق اليوم:", error);
    }
}

// 🟢 دالة فتح التقرير والطباعة
function openReport() {
    const printWindow = window.open('/daily_closing.html', '_blank', 'width=400,height=600');
    printWindow.onload = function () {
        printWindow.print();
    };
}