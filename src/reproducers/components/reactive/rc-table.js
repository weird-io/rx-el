import ReactiveHTMLElement from '../../../reactive/ReactiveHTMLElement.js';

const RC_TABLE_TEMPLATE =
    '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Register</th>' +
                '<th>Param</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' +
        '{{? data && data.filtered}}' +
            '{{~Object.keys(data.filtered) : name}}' +
                '{{~data.filtered[name].parameters : parameter}}' +
                '<tr>' +
                    '<td>{{=name}}</td>' +
                    '<td>{{=parameter.name}}</td>' +
                '</tr>' +
                '{{~}}' +
            '{{~}}' +
        '{{?}}' +
        '</tbody>' +
    '</table>';

class RCTable extends ReactiveHTMLElement {

    template = RC_TABLE_TEMPLATE;

    constructor() {

        super();

        this.data.model = this.produceModel();
        this.data.filtered = {};

        document.querySelector('rc-filter').addEventListener('onCheck', this.handleOnCheck.bind(this));
    }

    handleOnCheck( e ) {
        this.data.filtered = this.getFilteredData( e.target.getValues() );
        console.log(this.data.filtered);
    }

    getFilteredData( filters ){
        return !!filters && filters.length > 0
            // below "works" in the sense that it filters accordingly. Refreshing of the table takes a few seconds after
            // every click but every onCheck takes longer than the one before it and eventually the browser crashes.

            // wait a few seconds after clicking a checkbox to see the delayed change
            ? Object.keys( this.data.model )
                .filter(( name) => filters.includes( name ))
                .reduce(( obj, key) => {
                    return Object.assign( obj, {
                        [key]: this.data.model[key]
                    });
                }, {})
            : console.log('unchecked all filters'); // show empty table with a placeholder or something
    }

    produceModel() {
        fetch('../mockdata/register-data.json').then( this.handleModelResponse.bind(this) );
    }

    handleModelResponse( res ) {
        res.json().then( this.handleModelResponseRead.bind( this ) );
    }

    handleModelResponseRead( model ) {
        this.data.model = model;
        this.data.filtered = model;
    }
}

// Define the new custom element
customElements.define( 'rc-table', RCTable );
