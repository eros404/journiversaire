import { getBirthdateFromUrl } from '/js/date.js';

document.addEventListener('DOMContentLoaded', () => {
    const birthdate = getBirthdateFromUrl();
    const picker = document.getElementById('birthdate-picker');
    picker.setAttribute(
        'max',
        new Date().addDays(-1).toHtmlFormat());
    if (birthdate != null)
        picker.setAttribute('value', birthdate.toHtmlFormat())
})