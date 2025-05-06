document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('birthdate-picker')
        .setAttribute('max', new Date().addDays(-1).toISOString().split("T")[0]);
})