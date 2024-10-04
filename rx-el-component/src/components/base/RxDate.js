import * as rx from 'rx-el';

class RxDate extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data.model = {}
        this.data = {
            model: {
                date: new Date().toISOString().split('T')[0]
            }
        };
    }

    connectedCallback() {

        this.addEventListener('input', (e) => {
            this.data.model.date = e.target.value;
            this.render();
        });
    }

    template = `
        <div>
            <label for="datePicker">Pick a date:</label>
            <span>
            <input class="date-picker-input" value="{{=data.model.date}}">
            <i class="icon icon-calendar"></i>
            </span>         
            <p>Selected date: {{=data.model.date}}</p>
            <div class="date-picker-calendar">
            <span class="date-picker-header"></span>
            <div class="date-picker-dates"></div>
</div>
        </div>
    `;
}

customElements.define('rx-date-picker', RxDate);
