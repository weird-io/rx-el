import * as Rx from 'rx-el';

class RxAlert extends Rx.ReactiveHTMLElement {
    template = `
    {{? data && data.model}}
        <div class="alert alert-{{=data.model.group.toLowerCase()}}">
            {{=data.model.text}}
        </div>
    {{?}}
    <style>
        .alert {
            padding: 0.75em 1.25em;
            margin: 0.5em 0;
            border: 1px solid transparent;
            border-radius: 0.25em;
        }
        .alert-primary { background-color: #cce5ff; color: #004085; border-color: #b8daff; }
        .alert-secondary { background-color: #e2e3e5; color: #383d41; border-color: #d6d8db; }
        .alert-success { background-color: #d4edda; color: #155724; border-color: #c3e6cb; }
        .alert-danger { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
        .alert-warning { background-color: #fff3cd; color: #856404; border-color: #ffeeba; }
        .alert-info { background-color: #d1ecf1; color: #0c5460; border-color: #bee5eb; }
        .alert-light { background-color: #fefefe; color: #818182; border-color: #fdfdfe; }
        .alert-dark { background-color: #d6d8d9; color: #1b1e21; border-color: #c6c8ca; }
    </style>
    `;

    constructor() {
        super();
        this.data = {};
        this.data.group = this.getAttribute('group') || 'primary';
        this.data.model = {
            group: this.data.group.toUpperCase(),
            text: this.innerHTML.trim() || 'Alert message'
        };
    }

    connectedCallback() {
    }
}

customElements.define('rx-alert', RxAlert);
