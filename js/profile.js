document.addEventListener('DOMContentLoaded', () => {
    const birthdate = getBirthdateFromUrl();
    if (birthdate == null)
        window.location.replace('/index.html');
    const returnLink = document.getElementById('return-link');
    returnLink.setAttribute(
        'href',
        returnLink.getAttribute('href') + `?birthdate=${birthdate.toHtmlFormat()}`
    )
    document.getElementById('birthdate').textContent = birthdate.toFrenchFormat()
    const diffDays = new Date().diffDays(birthdate);
    const container = document.getElementById("profile-container")
    const timeline = new UserTimeline()
    timeline.add(
        new TimelineItem(diffDays, birthdate.addDays(diffDays)))
    for (var i = 1; i <= 15; i++) {
        const days = i * 5000
        timeline.add(
            new TimelineItem(days, birthdate.addDays(days))
        )
    }
    const allElements = timeline.getArraySorted();
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
    constructor(nbDays, date) {
        this.date = date;
        this.nbDays = nbDays
        this.numberFormat = new Intl.NumberFormat('fr-FR')
    }
    createElement() {
        const node = document.createElement('div');
        node.classList.add('timeline-item');
        if (this.date.isToday())
            node.classList.add('today');
        [10_000].forEach(multiple => {
            if (this.nbDays % multiple === 0)
                node.setAttribute('data-multiple', multiple);
        })
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = this.date.toFrenchFormat();
        node.appendChild(dateElement);
        const eventElement = document.createElement('div');
        const occurenceElement = document.createElement('span');
        occurenceElement.classList.add('occurence')
        occurenceElement.appendChild(
            document.createTextNode(
                this.numberFormat.format(this.nbDays)))
        const sup = document.createElement('sup')
        sup.textContent = this.nbDays === 1 ? 'er' : 'ème'
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
    getArraySorted() {
        return Object.values(this.dictionary)
            .sort((a, b) => a.getTime() - b.getTime())
    }
}