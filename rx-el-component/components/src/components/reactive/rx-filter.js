import  * as rx from 'rx-el';


const FILTER_TEMPLATE = '<c-checkbox-select class="select checkbox-select">' +
                                            '<input type="checkbox" class="toggle-checkbox select-checkbox" id="register-select-checkbox"/>' +
                                            '<label for="register-select-checkbox" class="toggle-label select-label">' +
                                                'Select' +
                                            '</label>' +
                                            '<ul class="checkbox-list">' +
                                                '<li>' +
                                                    '<label for="toggle-all" class="checkbox-li-label">' +
                                                        '<input type="checkbox" class="checkbox-li-input toggle-all" name="toggle-all" id="toggle-all" checked/>' +
                                                            'Select all' +
                                                    '</label>' +
                                                '</li>' +
                                                '{{? data && data.model}}' +
                                                    '{{~Object.keys(data.model) : name }}' +
                                                        '<li>' +
                                                            '<label for="{{=name}}" class="checkbox-li-label">' +
                                                            '   <input type="checkbox" class="checkbox-li-input" name="register-filter" id="{{=name}}" value="{{=name}}" data-checkbox-li checked/>' +
                                                                    '{{=name}}' +
                                                            '</label>' +
                                                        '</li>' +
                                                    '{{~}}' +
                                                '{{?}}' +
                                            '</ul>' +
                                        '</c-checkbox-select>';

class RxFilter extends rx.ReactiveHTMLElement{

    template = FILTER_TEMPLATE;

    constructor() {

        super();

        this.data.model = this.produceModel();
        this.src = this.produceEventSource();
    }

    produceModel() {
        fetch( '/api/register' ).then( this.handleModelResponse.bind( this ) );
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

        const es = new EventSource( '/api/subscribe' );

        es.addEventListener( 'datachange', this.handleMessageEvent.bind( this ) );

        return es;
    }

    handleMessageEvent() {
        this.produceModel();
    }
}

customElements.define('rx-filter', RxFilter );
