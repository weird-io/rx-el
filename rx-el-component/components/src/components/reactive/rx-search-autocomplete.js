import  * as rx from 'rx-el';


const AUTOCOMLETE_FIELD__TEMPLATE =
    '<div class="search-input">' +
    '<input type="text" placeholder="Autocomplete...">' +
    '{{? data?.model?.filteredOptions?.length }}' +
    '<ul>' +
    '{{~data.model.filteredOptions : option:i}}' +
    '<li data-index="{{=i}}">' +
    '{{=option}}' +
    '</li>' +
    '{{~}}' +
    '</ul>' +
    '{{?}}'



class RxAutocomplete extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data.model = {}
        this.data = {
            options: this.getAttribute('options') ? JSON.parse(this.getAttribute('options')) : this.DEFAULT_OPTIONS,
            model: {
                filteredOptions: []
            }
        };
    }

    connectedCallback() {
        this.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            this.data.model.filteredOptions = this.data.options.filter(o => o.toLowerCase().includes(value));
            console.log(value, this.data.model);
            this.render();
        })

        this.addEventListener('keyup', (e) => {
            const key = e.key;
            switch (key) {
                case "Enter":
                    e.target.value = this.data.model.filteredOptions[0];
                    this.data.model.filteredOptions = [];
                    this.render();
                    break;
            }


        })
    }

    DEFAULT_OPTIONS = [
        "Bananas", "Apples", "Cherries", "Berries"
    ]

    template = AUTOCOMLETE_FIELD__TEMPLATE;
}


customElements.define('rx-search-autocomplete', RxAutocomplete);


