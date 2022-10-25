import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

const RC_TABLE_TEMPLATE =
    '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Register</th>' +
                '<th>Param</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' +
        '{{? data && data.model}}' +
            '{{~Object.keys(data.model) : name}}' +
                '{{~data.model[name].parameters : parameter}}' +
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

       /*
       * NOTE
        Uncomment below rc-filter onCheck listener to watch browser crash.

        It will sometimes get stuck on loading for a while,
        sometimes crashes the browser, sometimes crashes when
        you try to check/uncheck checkboxes.
       */

        document.querySelector('rc-filter').addEventListener('onCheck', this.handleOnCheck.bind(this));
    }

    handleOnCheck( e ) {
        this.data.model = this.getFilteredData( e.target.getValues() );
    }

    getFilteredData( filters ){
        return !!filters && filters.length > 0
            ? console.log( filters ) // filter data according to the array returned from this
            : console.log( 'no filters' ); // show empty table
    }

    produceModel() {
        fetch('../../mockRegisterData.json').then( this.handleModelResponse.bind(this) );
    }

    handleModelResponse( res ) {
        res.json().then( this.handleModelResponseRead.bind( this ) );
    }

    handleModelResponseRead( model ) {
        this.data.model = model;
    }
}

// Define the new custom element
customElements.define( 'rc-table', RCTable );
