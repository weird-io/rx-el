import ReactiveHTMLElement from '../../../reactive/ReactiveHTMLElement.js';

const RC_FILTER_TEMPLATE =
    '<c-checkbox-select>' +
        '<ul class="checkbox-list">' +
            '<li>' +
                '<label for="toggle-all">' +
                '<input type="checkbox" name="toggle-all" id="toggle-all" checked/>' +
                    'Select all' +
                '</label>' +
            '</li>' +
            '{{? data && data.model}}' +
                '{{~Object.keys(data.model) : name }}' +
                '<li>' +
                    '<label for="{{=name}}">' +
                    '<input type="checkbox" id="{{=name}}" value="{{=name}}" data-checkbox-li checked/>' +
                        '{{=name}}' +
                    '</label>' +
                '</li>' +
            '{{~}}' +
        '{{?}}' +
        '</ul>' +
    '</c-checkbox-select>';

class RcFilter extends ReactiveHTMLElement {

    template = RC_FILTER_TEMPLATE;

    constructor() {
        super();

        this.data.model = this.produceModel();
    }

    produceModel() {
        fetch('../mockdata/register-data.json').then( this.handleModelResponse.bind(this) );
    }

    handleModelResponse( res ) {
        res.json().then( this.handleModelResponseRead.bind( this ) );
    }

    handleModelResponseRead( model ) {
        this.data.model = model;
    }
}

customElements.define('rc-filter', RcFilter );



