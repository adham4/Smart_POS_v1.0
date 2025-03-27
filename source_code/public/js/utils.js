// public/js/utils.js

export function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = i18next.t(key);
    });
}