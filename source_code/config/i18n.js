const i18n = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18n
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en', // اللغة الافتراضية
        backend: {
        loadPath: './locales/{{lng}}/translation.json', // مسار ملفات الترجمة
        },
        detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie'],
        },
        interpolation: {
        escapeValue: false, // لمنع التأثير على HTML
        },
    });

module.exports = i18n;