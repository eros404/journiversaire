const solar = 86400_000
const stellar = 86164_098

Date.prototype.diffDays = function (date, mode = 'solar') {
    var utcThis = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
    var utcOther = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return mode === 'stellar'
        ? Math.floor((solar * (utcThis - utcOther) / stellar) / stellar)
        : Math.floor((utcThis - utcOther) / solar);
}
Date.prototype.addDays = function (days, mode = 'solar') {
    const nbSeconds = mode === 'stellar' ? stellar : solar;
    const current = this.getTime() / solar * nbSeconds
    return new Date(current + days * nbSeconds);
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

export function getBirthdateFromUrl() {
    const params = new URL(document.location.toString()).searchParams;
    if (!params.has('birthdate'))
        return null;
    const birthdateString = params.get('birthdate') ?? '';
    const birthdate = new Date(birthdateString);
    return isNaN(birthdate) ? null : birthdate;
}