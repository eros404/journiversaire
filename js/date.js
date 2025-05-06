Date.prototype.diffDays = function (date, mode = 'solar') {
    var utcThis = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
    var utcOther = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const nbSeconds = mode === 'stellar' ? 86164_098 : 86400_000;
    return Math.floor((utcThis - utcOther) / nbSeconds);
}
Date.prototype.addDays = function (days, mode = 'solar') {
    const nbSeconds = mode === 'stellar' ? 86164_098 : 86400_000;
    const date = new Date(this.valueOf());
    date.setMilliseconds(
        date.getMilliseconds() + days * nbSeconds);
    return date;
}
Date.prototype.isToday = function () {
    const today = new Date();
    return today.getFullYear() === this.getFullYear() &&
        today.getMonth() === this.getMonth() &&
        today.getDate() === this.getDate();
}
Date.prototype.toFrenchFormat = function () {
    return this.isToday()
        ? "Aujourd'hui"
        : this.toLocaleDateString('fr-FR', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
}
Date.prototype.toHtmlFormat = function () {
    return this.toISOString().split("T")[0];
}

function getBirthdateFromUrl() {
    const params = new URL(document.location.toString()).searchParams;
    if (!params.has('birthdate'))
        return null;
    const birthdateString = params.get('birthdate') ?? '';
    const birthdate = new Date(birthdateString);
    return isNaN(birthdate) ? null : birthdate;
}