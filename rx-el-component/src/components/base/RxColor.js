import * as rx from 'rx-el';

class RxColor extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data = {
            model: {
                color: '#ff0000'
            }
        };
    }

    connectedCallback() {
        this.render();
        this.querySelector('input').addEventListener('input', (e) => {
            this.data.model.color = e.target.value;
            this.render();
        });
    }

    template = `
        <div>
            <label for="colorPicker">Pick a color:</label>
            <input type="color" id="colorPicker" value="{{=data.model.color}}">
            <p>Selected color: <span style="color: {{=data.model.color}};">{{=data.model.color}}</span></p>
        </div>
    `;
}

customElements.define('rx-color-picker', RxColor);
