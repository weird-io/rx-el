import * as rx from 'rx-el';

class ModalDialog extends rx.ReactiveHTMLElement {
    constructor() {
        super();
        this.data = {
            isOpen: false
        };
    }

    connectedCallback() {
        this.render();
        this.querySelector('#open').addEventListener('click', () => {
            this.data.isOpen = true;
            this.render();
        });
        this.querySelector('#close').addEventListener('click', () => {
            this.data.isOpen = false;
            this.render();
        });
    }

    template = `
        <div>
            <button id="open">Open Modal</button>
            {{? data.isOpen }}
            <div class="modal">
                <div class="modal-content">
                    <span id="close" class="close">&times;</span>
                    <p>Modal content</p>
                </div>
            </div>
            {{?}}
        </div>
    `;
}

customElements.define('rx-modal-dialog', ModalDialog);
