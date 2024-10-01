const DEVICE_CREATE_REGISTER_FORM_TEMPLATE =
    `<form class="form">
        <div class="form-group">
            <label>Type</label>
            <c-radio-select class="select radio-select">
                <input type="checkbox" class="toggle-checkbox select-checkbox" id="create-register-select-checkbox" data-toggle-checkbox/>
                <label for="create-register-select-checkbox" class="toggle-label select-label" data-toggle-label>
                    Select
                </label>
                <ul class="radio-list">
                    <li>
                        <label for="modbus-slave-register" class="radio-li-label">
                            <input type="radio" 
                                   class="radio-li-input" 
                                   name="create-register-selection" 
                                   value="Modbus Slave Register"
                                   data-radio-li
                                   id="modbus-slave-register" checked>
                            Modbus Slave Register
                        </label>
                    </li>
                    <li>
                        <label for="modbus-master-register" class="radio-li-label">
                            <input type="radio" 
                                   class="radio-li-input" 
                                   name="create-register-selection" 
                                   value="Modbus Master Register"
                                   data-radio-li
                                   id="modbus-master-register">
                            Modbus Master Register
                        </label>
                    </li>
                    <li>
                        <label for="canbus-register" class="radio-li-label">
                            <input type="radio" 
                                   class="radio-li-input" 
                                   name="create-register-selection" 
                                   value="Canbus Register"
                                   data-radio-li
                                   id="canbus-register">
                            Canbus Register
                        </label>
                    </li>
                </ul>
            </c-radio-select>
        </div>
        <div class="form-group">
            <label for="create-register-path">Path</label>
            <input type="text" id="create-register-path" placeholder="127.0.0.1:50266"/>
        </div>
        <div class="form-group">
            <label for="create-register-name">Name</label>
            <input type="text" id="create-register-name" placeholder="M124"/>
        </div>
        <div class="form-buttons">
            <a class="btn btn-primary btn-outlined" data-overlay-action="close">
                Cancel
            </a>
            <a class="btn btn-primary" data-overlay-action="close">
                Create
            </a>
        </div>
    </form>`;

class DeviceCreateRegisterForm extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = DEVICE_CREATE_REGISTER_FORM_TEMPLATE;
    }
}

customElements.define('device-create-register-form', DeviceCreateRegisterForm );
