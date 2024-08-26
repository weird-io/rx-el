import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

const DEVICE_DETAILS_TEMPLATE =     '{{? data && data.model}}' +
                                    '<h2>{{=data.model.name}}</h2>' +
                                    '<dl class="definition-list">' +
                                        '{{~data.model.parameters : parameter}}' +
                                        '<dt>{{=parameter.name}}</dt>' +
                                        '<dd>{{=parameter.value.value}}</dd>' +
                                        '{{~}}' +
                                    '{{?}}' +
                                    '</dl>';

class DeviceDetails extends ReactiveHTMLElement {

    template = DEVICE_DETAILS_TEMPLATE;

    constructor() {

        super();

        // Should prevent re-assigning data object.
        this.data.model = this.produceModel();
        this.src = this.produceEventSource();

    }

    produceModel() {
        fetch( this.getAttribute('src')).then( this.handleModelResponse.bind( this ) );
    }

    handleModelResponse( res ) {
        res.json().then( this.handleModelResponseRead.bind( this ) );
    }

    handleModelResponseRead( model ) {
        this.data.model = model;
    }

    /**
     * Produces an event source
     * @param
     * @return {EventSource} Eventsource
     */
    produceEventSource() {

        // const es = new EventSource( 'http://localhost:8080/event-stream' );
        const es = new EventSource( '/api/subscribe' );

        // es.addEventListener('open', this.handleOpenEvent.bind( this ) );
        // es.addEventListener('error', this.handleErrorEvent.bind( this ) );
        // es.addEventListener( 'message', this.handleMessageEvent.bind( this ) );
        es.addEventListener( 'datachange', this.handleMessageEvent.bind( this ) );

        return es;

    }

    handleOpenEvent( e ) {
        // connection is live
        // console.log( e );
    }

    handleErrorEvent( e ) {
        // connection is not-live
        this.data.model.parameters[ 2 ].value = ( Math.random() * 5 ) + '%'
    }

    handleMessageEvent( e ) {
        // console.log( e );
        this.produceModel();
    }

}

// Define the new custom element
customElements.define( 'device-details', DeviceDetails );
