const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./config/db");
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

// استيراد الراوتس
const userRoutes = require("./routes/users");
const loginRoutes = require("./routes/login"); // تأكد من استيراد ملف المسارات بشكل صحيح
const productsRoutes = require("./routes/Products");
const orderRoutes = require("./routes/order");
const salesRoutes = require("./routes/sales");
const inventoryRoutes = require("./routes/inventory");
const discountRoutes = require("./routes/discountRoutes");
const closingRoutes = require("./routes/closing");
const customerRoutes = require("./routes/customers");
const authRoutes = require("./routes/auth"); // ✅ تأكد أن المسار صحيح
const ordersRoutes = require("./routes/orders");
const indexRoutes = require("./routes/index");
const paymentRoutes = require("./routes/payments");
const dashboardRoutes = require("./routes/dashboard");
const systemRoutes = require("./routes/systemRoutes");
const analyticsRoutes = require("./routes/analytics");
const commentRoutes = require('./routes/comment');
const languageRoutes = require('./routes/languageRoutes');

const app = express();

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en', // اللغة الافتراضية
        backend: {
            loadPath: './locales/{{lng}}.json' // مسار ملفات اللغات
        },
        detection: {
            order: ['querystring', 'cookie', 'header'], // ترتيب كشف اللغة
            caches: ['cookie'] // حفظ اللغة المختارة في الكوكيز
        },
        interpolation: {
            escapeValue: false // عدم الهروب من القيم
        }
});

app.use(middleware.handle(i18next));
app.use('/locales', express.static(path.join(__dirname, 'locales')));

// ✅ استخدام الـ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ ربط الراوتس
app.use("/api/users", userRoutes); // ✅ إدارة المستخدمين
app.use("/api/auth", authRoutes); // ✅ المصادقة (تسجيل الدخول والخروج)
app.use("/api/products", productsRoutes);
app.use("/api/order", orderRoutes); // ✅ لاحظ أنها 'orders' بالجمع
app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api", closingRoutes);
app.use("/api/customers", customerRoutes); 
app.use("/login", loginRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/", indexRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", systemRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/comments', commentRoutes);
app.use(languageRoutes);

app.use(express.static(path.join(__dirname, "public")));
// استخدم المتغير السري
require("dotenv").config();
console.log("🔑 JWT Secret عند التشغيل:", process.env.JWT_SECRET);

// ✅ اختبار الاتصال بقاعدة البيانات
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to the database successfully!"))
  .catch((err) => console.error("⚠️ Error connecting to the database:", err));

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
