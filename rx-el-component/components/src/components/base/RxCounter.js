import * as rx from 'rx-el';

class RxCounter extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data = {
            model: {
                counter: 0
            }
        };
    }

    connectedCallback() {
        this.render();

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);

        this.querySelector('.increment').addEventListener('click', this.increment);
        this.querySelector('.decrement').addEventListener('click', this.decrement);
    }

    increment() {
        this.data.model.counter++;
        this.render();
    }

    decrement() {
        this.data.model.counter--;
        this.render();
    }

    template = `
        <div>
            <span>{{=data.model.counter}}</span>
            <button class="increment">+</button>
            <button class="decrement">-</button>
        </div>
    `;
}

customElements.define('rx-counter', RxCounter);
