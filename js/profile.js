document.addEventListener('DOMContentLoaded', () => {
    const birthdate = getBirthdateFromUrl();
    if (birthdate == null)
        window.location.replace('/index.html');
    const returnLink = document.getElementById('return-link');
    returnLink.setAttribute(
        'href',
        returnLink.getAttribute('href') + `?birthdate=${birthdate.toHtmlFormat()}`
    )
    document.getElementById('birthdate').textContent = birthdate.toFrenchFormat();
    const timeline = new UserTimeline()
    const changeMode = document.getElementById('change-mode-button')
    timeline.build(birthdate, changeMode.getAttribute('data-value'))
    timeline.draw(true);
    changeMode
        .addEventListener('click', () => {
            changeMode.setAttribute(
                'data-value',
                timeline.currentMode === 'solar' ? 'stellar' : 'solar')
            timeline.build(
                birthdate, changeMode.getAttribute('data-value'));
            timeline.draw()
        })
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
    build(birthdate, mode = 'solar') {
        this.currentMode = mode;
        this.dictionary = {}
        const diffDays = new Date().diffDays(birthdate, mode);
        this.add(
            new TimelineItem(diffDays, new Date()))
        for (var i = 1; i <= 15; i++) {
            const days = i * 5000
            this.add(
                new TimelineItem(days, birthdate.addDays(days, mode))
            )
        }
    }
    add(item) {
        this.dictionary[item.getTime()] = item;
    }
    getArraySorted() {
        return Object.entries(this.dictionary)
            .sort((a, b) => a[0] - b[0])
            .map(kv => kv[1])
    }
    draw(scrollToTodayAfter = false) {
        const container = document.getElementById("profile-container");
        container.innerHTML = ''
        const allElements = this.getArraySorted();
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
        if (scrollToTodayAfter)
            setTimeout(() => {
                todayElement.scrollIntoView({
                    block: "start",
                    inline: "nearest",
                    behavior: "smooth"
                })
            }, allElements.length * 25)
    }
}