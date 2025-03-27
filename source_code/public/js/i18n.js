// public/js/i18n.js

const loadTranslations = async () => {
    return new Promise((resolve, reject) => {
        if (window.i18next?.isInitialized) {
            console.log('✅ i18next already initialized');
            resolve();
            return;
        }

        if (window.i18next && window.i18nextHttpBackend) {
            window.i18next
                .use(window.i18nextHttpBackend)
                .init({
                    lng: localStorage.getItem('language') || 'en',
                    debug: true,
                    fallbackLng: 'en',
                    ns: ['translation'],
                    defaultNS: 'translation',
                    backend: {
                        loadPath: '/locales/{{lng}}.json'
                    }
                }, (err, t) => {
                    if (err) {
                        console.error('❌ i18next init error:', err);
                        reject(err);
                    } else {
                        console.log('✅ i18next initialized');
                        // ✅ تأخير بسيط لضمان تحميل الترجمات بالكامل قبل الوصول إليها
                        setTimeout(() => resolve(), 100);
                    }
                });
        } else {
            console.error('❌ i18next or i18nextHttpBackend not loaded');
            reject('i18next or i18nextHttpBackend not loaded');
        }
    });
};

const changeLanguage = async (lang) => {
    try {
        if (window.i18next && window.i18next.language !== lang) {
            await window.i18next.changeLanguage(lang);
            console.log(`🌍 Language changed to: ${lang}`);
            localStorage.setItem('language', lang);
            window.dispatchEvent(new Event('languageChanged'));
        }
    } catch (err) {
        console.error(`❌ Failed to change language to ${lang}`, err);
    }
};

const updateTexts = () => {
    if (!window.i18next?.isInitialized || !window.i18next.language) {
        console.warn('⚠️ i18next not initialized yet');
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const translation = window.i18next.t(key);

        if (!translation || translation === key) {
            console.warn(`⚠️ Missing translation for key: "${key}"`);
            el.textContent = `[${key}]`; // ✅ عرض المفتاح إذا لم توجد الترجمة
        } else {
            el.textContent = translation;
        }
    });
};

const initTranslations = async () => {
    try {
        await loadTranslations();

        // ✅ تحديث النصوص عند تحميل الترجمة بالكامل
        if (window.i18next.isInitialized) {
            updateTexts();
        } else {
            window.i18next.on('initialized', updateTexts);
        }

        // ✅ تحديث النصوص عند تغيير اللغة
        window.addEventListener('languageChanged', updateTexts);

        console.log('✅ Translations initialized');
    } catch (error) {
        console.error('❌ Failed to initialize translations:', error);
    }
};

// ✅ حدث تغيير اللغة يدويًا
window.addEventListener('languageChanged', updateTexts);

// ✅ جعل الدوال متاحة عالميًا
window.loadTranslations = loadTranslations;
window.changeLanguage = changeLanguage;
window.updateTexts = updateTexts;
window.initTranslations = initTranslations;

// ✅ تهيئة الترجمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initTranslations);