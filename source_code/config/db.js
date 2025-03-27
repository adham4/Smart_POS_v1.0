const { Sequelize } = require('sequelize');
const config = require("./config.json").development; // تحميل إعدادات البيئة `development`

// إنشاء اتصال بقاعدة البيانات باستخدام الإعدادات من `config.json`
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false // تعطيل تسجيل الاستعلامات في الكونسول
});

// اختبار الاتصال
sequelize.authenticate()
    .then(() => console.log('✅ Database Connected'))
    .catch(err => console.error('❌ Error:', err));

module.exports = sequelize; // ✅ تأكد من تصدير `sequelize`
