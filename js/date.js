Date.prototype.diffDays = function (date) {
    var utcThis = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    var utcOther = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

    return Math.floor((utcThis - utcOther) / 86400000);
}
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
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