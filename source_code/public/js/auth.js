window.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('role'); // "cashier" أو "manager"
    const token = localStorage.getItem('token'); // التوكن
    const currentPage = window.location.pathname;

    if (!token) {
        alert('غير مصرح لك بالدخول. من فضلك سجل الدخول أولًا.');
        window.location.href = 'index.html';
        return;
    }

    // مثال على إرسال التوكن في الطلبات المحمية
    fetch('/protected-route', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // إرسال التوكن في الهيدر
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            alert('غير مصرح لك بالدخول.');
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('خطأ أثناء المصادقة:', error);
        window.location.href = 'index.html';
    });

    // الصفحات المسموح بها لكل نوع مستخدم
    const allowedPagesForCashier = ['/cashier.html', '/receipt.html'];
    const allowedPagesForManager = [
        '/dashboard.html',
        '/cashier.html',
        '/inventory.html',
        '/manage_orders.html',
        '/monthly.html',
        '/daily.html',
        '/daily_closing.html',
        '/monthly_report.html',
        '/products.html',
        '/sales.html',
        '/users.html',
        '/receipt.html',
    ];

    // إذا المستخدم غير مسجل الدخول
    if (!userRole) {
        alert('غير مصرح لك بالدخول. من فضلك سجل الدخول أولًا.');
        window.location.href = 'index.html';
        return;
    }

    // التحقق من صلاحيات الكاشير
    if (userRole === 'cashier' && !allowedPagesForCashier.includes(currentPage)) {
        alert('غير مصرح لك بالدخول لهذه الصفحة.');
        window.location.href = 'index.html';
        return;
    }

    // التحقق من صلاحيات المدير
    if (userRole === 'manager' && !allowedPagesForManager.includes(currentPage)) {
        alert('غير مصرح لك بالدخول لهذه الصفحة.');
        window.location.href = 'index.html';
        return;
    }

    // تسجيل الخروج عند الضغط على زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('role');
            window.location.href = 'index.html';
        });
    }
});
