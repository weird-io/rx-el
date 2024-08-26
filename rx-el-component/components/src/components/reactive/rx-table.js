import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

const TABLE_TEMPLATE = '<table class="table">' +
                                        '<thead class="tablet-only">' +
                                            '<tr>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                                '<th>Table head</th>' +
                                            '</tr>' +
                                        '</thead>' +
                                        '<tbody>' +
                                        // '{{? data && data.model}}' +
                                        //     '{{~Object.keys(data.model) : name}}' +
                                        //         '{{~data.model[name].parameters : parameter}}' +
                                                '<tr>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>Table body</td>' +
                                                    '<td>' +
                                                        '<ul class="btn-list btn-group">'+
                                                            '<li>' +
                                                                '<a class="btn">' +
                                                                    '<c-icon class="icon-medium icon-edit"></c-icon>' +
                                                                '</a>'+
                                                            '</li>'+
                                                            '<li>' +
                                                                '<a class="btn">' +
                                                                    '<c-icon class="icon-medium icon-delete"></c-icon>' +
                                                                '</a>'+
                                                            '</li>'+
                                                            '<li>' +
                                                            '<a class="btn">' +
                                                            '<c-icon class="icon-medium icon-eye"></c-icon>' +
                                                            '</a>'+
                                                            '</li>'+
                                                        '</ul>'+
                                                    '</td>' +
                                                '</tr>' +
                                        //         '{{~}}' +
                                        //     '{{~}}' +
                                        // '{{?}}' +
                                        '</tbody>' +
                                    '</table>';

class RxTable extends ReactiveHTMLElement {

    template = TABLE_TEMPLATE;

    constructor() {

        super();

        this.data.model = {}


        // document.querySelector('device-register-filter').addEventListener('onCheck', this.handleOnCheck.bind(this));
    }

    // handleOnCheck( e ) {
    //     this.data.model = this.getFilteredData( e.target.getValues() );
    // }

    // getFilteredData( filters ){
    //     return !!filters && filters.length > 0
    //         ? Object.keys( this.data.model ).forEach(( name => {
    //             if ( filters.includes( name ) ){
    //                 this.filteredData[name] = this.data.model[name]
    //             }
    //         }))
    //         : this.data.model;
    // }

    // produceModel() {
    //     fetch( '/api/register' ).then( this.handleModelResponse.bind( this ) );
    // }

    // handleModelResponse( res ) {
    //     res.json().then( this.handleModelResponseRead.bind( this ) );
    // }

    // handleModelResponseRead( model ) {
    //     this.data.model = model;
    // }

    /**
     * Produces an event source
     * @param
     * @return {EventSource} Eventsource
     */
    // produceEventSource() {
    //
    //     const es = new EventSource( '/api/subscribe' );
    //
    //     // es.addEventListener('open', this.handleOpenEvent.bind( this ) );
    //     // es.addEventListener('error', this.handleErrorEvent.bind( this ) );
    //     es.addEventListener( 'datachange', this.handleMessageEvent.bind( this ) );
    //
    //     return es;
    //
    // }

    handleOpenEvent( e ) {
        // connection is live
        // console.log( e );
    }

    handleErrorEvent( e ) {
        // connection is not-live
        // console.log( e );
    }

    handleMessageEvent( e ) {
        this.produceModel();
        // console.log( e );
    }



}

// Define the new custom element
customElements.define( 'rx-table', RxTable );
