document.addEventListener('DOMContentLoaded', () => {
    const params = new URL(document.location.toString()).searchParams;
    if (!params.has('birthdate'))
        window.location.replace('/index.html');
    const birthdateString = params.get('birthdate') ?? '';
    const birthdate = new Date(birthdateString);
    if (isNaN(birthdate))
        window.location.replace('/index.html');

    document.getElementById('birthdate').textContent = birthdate.toFrenchFormat()
    const diffDays = new Date().diffDays(birthdate);
    const container = document.getElementById("profile-container")
    const timeline = new UserTimeline()
    timeline.add(
        new TimelineItem(diffDays, 1, birthdate.addDays(diffDays)))
    for (var i = 1; i < 4; i++) {
        timeline.add(
            new TimelineItem(i, 10000, birthdate.addDays(i * 10000))
        )
    }
    for (var i = 1; i < 30; i++) {
        timeline.add(
            new TimelineItem(i, 1000, birthdate.addDays(i * 1000))
        )
    }
    const allElements = timeline.getSorted();
    let todayElement = null
    allElements.forEach((item, i) => {
        setTimeout(() => {
            const el = item.createElement();
            container.appendChild(el)
            if (item.date.isToday()) {
                todayElement = el;
            }
        }, i * 25)
    });
    setTimeout(() => {
        todayElement.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth"
        })
    }, allElements.length * 25)
})

class TimelineItem {
    constructor(occurence, multiple, date) {
        this.occurence = occurence;
        this.multiple = multiple;
        this.date = date;
        this.total = occurence * multiple
        this.numberFormat = new Intl.NumberFormat('fr-FR')
    }
    createElement() {
        const node = document.createElement('div');
        node.classList.add('timeline-item');
        if (this.date.isToday())
            node.classList.add('today');
        node.setAttribute('data-multiple', this.multiple);
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = this.date.toFrenchFormat();
        node.appendChild(dateElement);
        const eventElement = document.createElement('div');
        const occurenceElement = document.createElement('span');
        occurenceElement.classList.add('occurence')
        occurenceElement.appendChild(
            document.createTextNode(
                this.numberFormat.format(this.total)))
        const sup = document.createElement('sup')
        sup.textContent = this.total === 1 ? 'er' : 'ème'
        occurenceElement.appendChild(sup)
        eventElement.appendChild(occurenceElement)
        const eventSpan = document.createElement('span')
        eventSpan.textContent = ' journiversaire';
        eventElement.appendChild(eventSpan)
        node.appendChild(eventElement);
        return node;
    }
    getTime() {
        return this.date.getTime();
    }
}

class UserTimeline {
    constructor() {
        this.dictionary = {};
    }
    add(item) {
        const itemTime = item.getTime()
        const existing = this.dictionary[itemTime];
        if (!existing || existing.multiple < item.multiple)
            this.dictionary[itemTime] = item;
    }
    getSorted() {
        return Object.values(this.dictionary)
            .sort((a, b) => a.getTime() - b.getTime())
    }
}