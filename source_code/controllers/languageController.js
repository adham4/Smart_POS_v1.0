const changeLanguage = (req, res) => {
    const { lng } = req.params;

    // قائمة باللغات المتاحة
    const availableLanguages = ['en', 'ar', 'fr', 'es'];

    if (!availableLanguages.includes(lng)) {
        console.log(`❌ Unsupported language: ${lng}`);
        return res.status(400).json({ error: 'Language not supported' });
    }

    res.cookie('i18next', lng);
    console.log(`✅ Language changed to: ${lng}`);
    
    return res.status(200).json({ message: `Language changed to ${lng}` });
};

// ✅ استرجاع اللغة الحالية (اختياري)
const getCurrentLanguage = (req, res) => {
    const currentLanguage = req.cookies.i18next || 'en';
    return res.status(200).json({ language: currentLanguage });
};

module.exports = {
    changeLanguage,
    getCurrentLanguage
};