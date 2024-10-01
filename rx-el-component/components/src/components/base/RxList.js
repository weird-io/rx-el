import * as rx from 'rx-el';

class TodoList extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data = {
            items: [],
            newItem: ''
        };
    }

    connectedCallback() {
        this.render();
        this.querySelector('input').addEventListener('input', (e) => {
            this.data.newItem = e.target.value;
        });
        this.querySelector('button').addEventListener('click', () => {
            if (this.data.newItem) {
                this.data.items.push(this.data.newItem);
                this.data.newItem = '';
                this.render();
            }
        });
    }

    template = `
        <div>
            <input type="text" value="{{=data.newItem}}">
            <button>Add</button>
            <ul>
                {{~data.items : item}}
                    <li>{{=item}}</li>
                {{~}}
            </ul>
        </div>
    `;
}

customElements.define('rx-todo-list', TodoList);
