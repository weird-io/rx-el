import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

class DeviceStatus extends ReactiveHTMLElement {

  template =  '<em class="device-status-health {{=data.model.status}}" title="{{=data.model.status}}">{{=data.model.status}}</em>';

  constructor() {

    super();

    // Should prevent re-assigning data object.
    this.data.model = this.produceModel();

  }

  produceModel() {
    return {
      status: 'online'
    }
  }

}

// Define the new custom element
customElements.define( 'device-status', DeviceStatus );
