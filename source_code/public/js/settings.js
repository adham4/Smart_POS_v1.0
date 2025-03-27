// public/js/settings.js

const initSettingsPage = async () => {
    try {
        await window.loadTranslations();

        if (window.i18next?.isInitialized) {
            window.updateTexts(); // ✅ تحديث النصوص بعد التحميل
        } else {
            console.warn('⚠️ i18next not initialized yet');
        }

        // ✅ تحديث النصوص عند تغيير اللغة
        window.addEventListener('languageChanged', window.updateTexts);

        // ✅ التعامل مع تغيير اللغة من القائمة المنسدلة
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                window.changeLanguage(selectedLang);
            });

            // ✅ ضبط القائمة على اللغة الحالية
            languageSelect.value = window.i18next.language;
        }

        // ✅ حفظ الإعدادات
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                const selectedLang = languageSelect.value;
                window.changeLanguage(selectedLang);
                alert(window.i18next.t('settingsSaved')); // ✅ استخدام i18next مباشرة
            });
        }
    } catch (error) {
        console.error('❌ Failed to initialize settings page:', error);
    }
};

document.addEventListener('DOMContentLoaded', initSettingsPage);