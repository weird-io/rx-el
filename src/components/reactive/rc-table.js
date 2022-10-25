import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

const RC_TABLE_TEMPLATE =
    '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Register</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' +
        '{{? data && data.model}}' +
            '{{~Object.keys(data.model) : name}}' +
                '{{~data.model[name].parameters : parameter}}' +
                '<tr>' +
                    '<td>{{=name}}</td>' +
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
        // this.src = this.produceEventSource();

        // document.querySelector('rc-filter').addEventListener('onCheck', this.handleOnCheck.bind(this));
    }

    handleOnCheck( e ) {
        this.data.model = this.getFilteredData( e.target.getValues() );
    }

    getFilteredData( filters ){
        return !!filters && filters.length > 0
            ? this.data.model.filter( ({ name }) => filters.includes( name )) // produces type error: this.data.model.filter not a func
            : this.data.model;
    }

    produceModel() {
        // fetch( '/api/register' ).then( this.handleModelResponse.bind( this ) );
        const mockData = {"sys-1-memory":{"name":"sys-1-memory","parameters":[{"id":"9dc65e98-e2de-4d26-aabe-fbecdfcb9124","max":"2","min":"0","name":"total","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"ed3fa550-94f0-416d-b950-7b029d849a3a","max":"2","min":"0","name":"used","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"3ad77472-d3ea-49f4-9f51-b34f39f92311","max":"2","min":"0","name":"voltage","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"4820006e-e497-4d0a-ae20-c61d708e51ae","max":"2","min":"0","name":"datetime","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"96d69635-256e-4f7e-a3c6-846ca216dba5","max":"2","min":"0","name":"ram","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"750a1a3a-28fb-46ea-a6a2-a2cca9568ea4","max":"2","min":"0","name":"available","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"2e4b478c-c6c8-4647-9a76-cc272241cab3","max":"2","min":"0","name":"temp","ref":"0","threshold":"1","type":"INT","value":{}}],"path":"/usr/bin/vcgencmd","type":"io.weird.gateway.register.RaspberrySystemRegister"},"M103":{"name":"M103","parameters":[{"id":"048dcc91-1ca9-4707-928e-86f8703eeadc","max":"32768","min":"0","name":"Motor Status","ref":"41009","threshold":"0","type":"INT","value":{}},{"id":"b4cc4e00-71c5-4315-a500-7de4850c7e5c","max":"50","min":"0","name":"Motor frecuency (Hz)","ref":"41011","threshold":"0","type":"INT","value":{}},{"id":"e8cbc2b2-75f5-4881-b78c-9e99daece282","max":"255","min":"0","name":"Motor torque (%)","ref":"41013","threshold":"0","type":"INT","value":{}},{"id":"9e6916b6-fc54-40f8-b31f-546ca07f128a","max":"10","min":"0","name":"Motor current (A)","ref":"41015","threshold":"0","type":"INT","value":{}},{"id":"f94fb64f-8996-4781-8927-db31e3ad095b","max":"999","min":"0","name":"Active electrical power (KW)","ref":"41017","threshold":"0","type":"INT","value":{}},{"id":"040bfcc9-a0c8-42e9-b9d1-69e34129a916","max":"65535","min":"0","name":"Electrical energy consumed by the motor (KWh)","ref":"41019","threshold":"0","type":"INT","value":{}},{"id":"c5eed7cc-3aca-4aa9-a520-c38ea166aa6a","max":"4095","min":"0","name":"Starter Fault Code (See****)","ref":"41021","threshold":"0","type":"INT","value":{}},{"id":"5367d232-fc3e-42c3-91b0-584d324f3793","max":"","min":"0","name":"Spare","ref":"41023","threshold":"0","type":"INT","value":{}},{"id":"1c5fbf8d-ee2f-4b8e-b86a-54374baff326","max":"1193046","min":"0","name":"Motor Run Time (H)","ref":"41581","threshold":"0","type":"INT","value":{}},{"id":"fdcf9c83-6062-4c84-a74e-b98699fdd4ed","max":"4294967295","min":"0","name":"Number of motor starts","ref":"41583","threshold":"0","type":"INT","value":{}}],"path":"127.0.0.1:50202","type":"io.weird.gateway.register.ModbusSlaveRegister"},"M102":{"name":"M102","parameters":[{"id":"5c347d75-58d3-4f77-ab2f-13d38a348965","max":"32768","min":"0","name":"Motor Status","ref":"40977","threshold":"0","type":"INT","value":{}},{"id":"76ea1725-e85d-4944-921e-bf77a3dcf937","max":"50","min":"0","name":"Motor frecuency (Hz)","ref":"40979","threshold":"0","type":"INT","value":{}},{"id":"3ad9e9c2-9546-4a5a-ab93-d7df2f8345a2","max":"255","min":"0","name":"Motor torque (%)","ref":"40981","threshold":"0","type":"INT","value":{}},{"id":"d524375e-a759-473e-b71f-2ac291e75f5d","max":"20","min":"0","name":"Motor current (A)","ref":"40983","threshold":"0","type":"INT","value":{}},{"id":"21e1692b-caa0-4a4a-95d8-f887dddc6330","max":"999","min":"0","name":"Active electrical power (KW)","ref":"40985","threshold":"0","type":"INT","value":{}},{"id":"a38370f4-d8bc-48e6-a59a-e6b0f29666d3","max":"65535","min":"0","name":"Electrical energy consumed by the motor (KWh)","ref":"40987","threshold":"0","type":"INT","value":{}},{"id":"af1e2f45-4bbc-427c-a1b8-359dcd614fcb","max":"4095","min":"0","name":"Starter Fault Code (See****)","ref":"40989","threshold":"0","type":"INT","value":{}},{"id":"74b7fbd8-5421-4c52-a9b5-04cb6662b705","max":"","min":"0","name":"Spare","ref":"40991","threshold":"0","type":"INT","value":{}},{"id":"3a5b9a29-5aee-40a5-982b-bbd716f1a7ac","max":"1193046","min":"0","name":"Motor Run Time (H)","ref":"41573","threshold":"0","type":"INT","value":{}},{"id":"8aaf8c82-7600-4654-ac69-5d69daa0e524","max":"4294967295","min":"0","name":"Number of motor starts","ref":"41575","threshold":"0","type":"INT","value":{}}],"path":"127.0.0.1:50201","type":"io.weird.gateway.register.ModbusSlaveRegister"},"sys-0-cpu":{"name":"sys-0-cpu","parameters":[{"id":"f1237c24-2e9e-450d-8dd3-4d9f9829d28b","max":"2","min":"0","name":"temperature","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"4c4ba7b3-4085-4895-8142-47ce239bb8ac","max":"2","min":"0","name":"voltage","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"e0f43c46-55cc-4057-8388-1948806eaa42","max":"2","min":"0","name":"usage","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"39757fdc-b7df-4399-afc6-8f355454c470","max":"2","min":"0","name":"model","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"9db1317f-0bdf-4be9-8764-4186e3bbc0de","max":"2","min":"0","name":"cores","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"6b2ad4c4-317e-4641-ac05-0647c9453600","max":"2","min":"0","name":"load status","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"f2d373bb-73bd-4a80-975a-1bce75fd244e","max":"2","min":"0","name":"frequency","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"8735f59a-8715-4205-a86e-55e5ae515584","max":"2","min":"0","name":"features","ref":"0","threshold":"1","type":"INT","value":{}}],"path":"/usr/bin/vcgencmd","type":"io.weird.gateway.register.RaspberrySystemRegister"},"M101":{"name":"M101","parameters":[{"id":"23a9e21c-88d9-4830-b0ab-a6649be0028a","max":"32768","min":"0","name":"Motor Status","ref":"40993","threshold":"0","type":"INT","value":{}},{"id":"dceac342-c51b-4434-888b-5514c9e1dc2f","max":"50","min":"0","name":"Motor frecuency (Hz)","ref":"40995","threshold":"0","type":"INT","value":{}},{"id":"372bf909-8c98-4fd4-858a-d058cb6d5c20","max":"255","min":"0","name":"Motor torque (%)","ref":"40997","threshold":"0","type":"INT","value":{}},{"id":"b0c97412-2d30-4407-96f1-f9fdf3868006","max":"20","min":"0","name":"Motor current (A)","ref":"40999","threshold":"0","type":"INT","value":{}},{"id":"54bea75b-361b-4b1d-a2a8-8c57eb0312b0","max":"999","min":"0","name":"Active electrical power (KW)","ref":"41001","threshold":"0","type":"INT","value":{}},{"id":"ae348588-1343-4610-b2ec-c73a77709632","max":"65535","min":"0","name":"Electrical energy consumed by the motor (KWh)","ref":"41003","threshold":"0","type":"INT","value":{}},{"id":"4c9e2b00-801c-4d7f-b5ea-8f032b454b2a","max":"4095","min":"0","name":"Starter Fault Code (See****)","ref":"41005","threshold":"0","type":"INT","value":{}},{"id":"a63c978f-d79b-482c-8d87-788109057665","max":"","min":"0","name":"Spare","ref":"41007","threshold":"0","type":"INT","value":{}},{"id":"8df146c2-ab7e-4e00-8a56-0d0866126380","max":"1193046","min":"0","name":"Motor Run Time (H)","ref":"41577","threshold":"0","type":"INT","value":{}},{"id":"e4b94390-9bdd-4bf4-a23e-f93454624b7c","max":"4294967295","min":"0","name":"Number of motor starts","ref":"41579","threshold":"0","type":"INT","value":{}}],"path":"127.0.0.1:50200","type":"io.weird.gateway.register.ModbusSlaveRegister"},"sys-3-process":{"name":"sys-3-process","parameters":[{"id":"0247f38e-721c-443b-8644-5ec55b06ce85","max":"2","min":"0","name":"temp","ref":"0","threshold":"1","type":"INT","value":{}}],"path":"/usr/bin/vcgencmd","type":"io.weird.gateway.register.RaspberrySystemRegister"},"sys-2-network":{"name":"sys-2-network","parameters":[{"id":"3c051d15-5872-4e32-8f5f-a98421d6aa34","max":"2","min":"0","name":"input","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"30e1eb01-e4ed-41c4-b5b3-ff4f37fd2718","max":"2","min":"0","name":"output","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"1184f590-5d15-450b-b3e1-43c058167468","max":"2","min":"0","name":"bandwidth","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"3604c503-72ec-4fee-aa45-a49d3f1ddb8d","max":"2","min":"0","name":"latency","ref":"0","threshold":"1","type":"INT","value":{}},{"id":"959093cc-bc53-43d7-96a1-f85e3fb40c93","max":"2","min":"0","name":"status","ref":"0","threshold":"1","type":"INT","value":{}}],"path":"/usr/bin/vcgencmd","type":"io.weird.gateway.register.RaspberrySystemRegister"}};

        const mockRequest = new Promise( ( resolve ) => {
            resolve( mockData );
        });

        mockRequest.then( this.handleModelResponseRead.bind( this ));
    }

    // handleModelResponse( res ) {
    //     res.json().then( this.handleModelResponseRead.bind( this ) );
    // }

    handleModelResponseRead( model ) {
        this.data.model = model;
    }

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
customElements.define( 'rc-table', RCTable );
