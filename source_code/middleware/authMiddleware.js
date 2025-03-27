const jwt = require('jsonwebtoken');
const secretKey = 'mySuperSecretKey123'; // تأكد من استخدام نفس الـ Secret Key في التوكن

// ✅ Middleware للتحقق من صلاحية المستخدم بناءً على الدور المسموح
const authMiddleware = (allowedRoles) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'جلسة غير صالحة أو انتهت.' });
        }

        req.user = decoded;
        console.log('🧑‍💼 Role المستخدم:', decoded.role); // ✅ التحقق من الـ Role

        // التحقق من الدور المسموح به
        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: 'ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.' });
        }

        next();
    });
};

module.exports = { authMiddleware };

// 🚦 ميدلوير للتحقق من الصلاحيات
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: '❌ يجب تسجيل الدخول أولاً.' });
        }

        const userRole = req.user.role;

        // 👑 لو المستخدم مدير، يسمح له بكل شيء
        if (userRole === 'manager') {
            return next();
        }

        // ✅ التحقق من الأدوار المسموح بها
        if (allowedRoles.includes(userRole)) {
            return next();
        } else {
            console.log(`🚫 الدور ${userRole} غير مصرح له بالوصول إلى هذا المورد.`);
            return res.status(403).json({ error: '🚫 لا تملك الصلاحية للوصول إلى هذا المورد.' });
        }
    };
};

module.exports = { authMiddleware, authorizeRoles };
