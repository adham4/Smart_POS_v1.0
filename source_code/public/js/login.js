document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('📥 إرسال بيانات تسجيل الدخول:', { username, password });

    fetch('http://127.0.0.1:8083/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('❌ فشل في تسجيل الدخول.');
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            console.log('🟢 تسجيل الدخول ناجح، دور المستخدم:', data.role);
            localStorage.clear(); // 🧹 تفريغ البيانات القديمة
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
    
            // إعادة التوجيه حسب دور المستخدم
            if (data.role === 'manager') {
                window.location.href = '/dashboard.html';
            } else if (data.role === 'cashier') {
                window.location.href = '/cashier.html';
            }
        } else {
            alert(data.error || 'فشل تسجيل الدخول.');
        }
    })
    .catch(error => console.error('❌ خطأ أثناء تسجيل الدخول:', error));
    
});
