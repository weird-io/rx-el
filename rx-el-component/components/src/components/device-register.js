const DEVICE_REGISTER_TEMPLATE =
    `<div class="column">
        <div class="column"> 
            <div class="column four"> 
                <div class="content"> 
                    <device-register-search class="device-register-search"></device-register-search> 
                </div> 
            </div> 
            <div class="column four"> 
                <div class="content"> 
                    <device-register-filter class="device-register-filter"></device-register-filter> 
                </div> 
            </div> 
            <div class="column two">
                <div class="content">
                    <fieldset class="create-register-fieldset">
                        <a class="btn btn-primary icon-left device-create-register-btn" 
                           data-overlay-action="open"
                           data-overlay-target="device-create-register-overlay"
                           id="device-create-register-btn">
                           <c-icon class="icon-add"></c-icon>
                            Create register
                        </a>
                        
                        <c-overlay class="overlay device-create-register-overlay" id="device-create-register-overlay">
                            <device-create-register-form class="device-create-register-form"></device-create-register-form>
                        </c-overlay>
                    </fieldset>
                </div>
            </div>
        </div> 
        <div class="column"> 
            <div class="column">
                <div class="content"> 
                    <device-register-table class="table"></device-register-table> 
                </div> 
            </div>
            <div class="column">
                <div class="content">
                    <device-register-table-pagination class="pagination"></device-register-table-pagination>
                </div>
            </div>
        </div>
    </div>`;

class DeviceRegister extends HTMLElement {

    constructor() {

        super();

        this.innerHTML = DEVICE_REGISTER_TEMPLATE;
    }
}

window.customElements.define('device-register', DeviceRegister );
