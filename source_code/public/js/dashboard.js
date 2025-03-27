// public/js/dashboard.js

document.addEventListener("DOMContentLoaded", async () => {
    const orderCount = document.getElementById("orderCount");
    const logoutBtn = document.getElementById("logoutBtn");
    const restartBtn = document.getElementById("restartServerBtn");
    const openCustomersPage = document.getElementById('openCustomersPage');
    const settingsBtn = document.getElementById('settingsBtn');

    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // ✅ التحقق من صلاحيات المستخدم
    if (userRole !== "manager") {
        alert(i18next.t("noPermission"));
        window.location.href = "/cashier.html";
        return;
    }

    // ✅ تحميل بيانات لوحة التحكم
    const loadDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard-data', {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            orderCount.textContent = data.totalOrders || "0";
        } catch (error) {
            console.error("❌ خطأ في تحميل بيانات اللوحة:", error);
        }
    };

    // ✅ إعادة تشغيل السيرفر
    const restartServer = async () => {
        try {
            const originalText = restartBtn.textContent;
            restartBtn.textContent = i18next.t("restartingServer");
            restartBtn.disabled = true;

            const response = await fetch("http://127.0.0.1:8083/api/restart-server", {
                method: "POST"
            });

            if (!response.ok) throw new Error("Failed to restart server");

            let isServerUp = false;
            const maxAttempts = 10;
            let attempts = 0;

            while (!isServerUp && attempts < maxAttempts) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const healthCheck = await fetch("http://127.0.0.1:8083/api/system-status");
                    if (healthCheck.ok) isServerUp = true;
                } catch (error) {
                    console.log("🚦 Waiting for server to restart...");
                }
                attempts++;
            }

            if (isServerUp) {
                sessionStorage.setItem("serverRestartSuccess", "true");
                window.location.reload();
            } else {
                alert(i18next.t("serverNotRestarted"));
            }
        } catch (error) {
            console.error("❌ Error restarting server:", error);
            alert(i18next.t("serverRestartFailed"));
        } finally {
            restartBtn.textContent = i18next.t("restartServer");
            restartBtn.disabled = false;
        }
    };

    // ✅ تحميل الترجمة وتحديث النصوص
    const loadTranslations = async () => {
        if (window.loadTranslations) {
            await window.loadTranslations();
            window.updateTexts();
        }
    };

    // ✅ تحديث النصوص عند تغيير اللغة
    window.addEventListener('languageChanged', window.updateTexts);

    // ✅ التهيئة
    await loadDashboardData();
    await loadTranslations();

    // ✅ زر تسجيل الخروج
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/index.html";
    });

    // ✅ زر Restart Server
    restartBtn.addEventListener("click", restartServer);

    // ✅ فتح صفحة العملاء
    openCustomersPage.addEventListener('click', () => {
        window.location.href = './customers.html';
    });

    // ✅ فتح صفحة الإعدادات
    settingsBtn.addEventListener('click', () => {
        window.location.href = '../settings.html';
    });

    // ✅ عرض رسالة نجاح إعادة التشغيل
    if (sessionStorage.getItem("serverRestartSuccess") === "true") {
        alert(i18next.t("serverRestartSuccess"));
        sessionStorage.removeItem("serverRestartSuccess");
    }
});