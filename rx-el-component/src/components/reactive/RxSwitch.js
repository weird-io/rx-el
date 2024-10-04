import * as rx from 'rx-el';

class RxSwitch extends rx.ReactiveHTMLElement {

    template = `
        <div class="content">
            <label class="switch">
                <input type="checkbox" id="toggleCheckbox">
                <span class="slider round"></span>
            </label>
        </div>
    `;

    constructor() {
        super();
        this.data = {
            isOn: false
        };
        this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
    }

    connectedCallback() {
        this.render();
        this.updateCheckboxState();
        this.querySelector('#toggleCheckbox').addEventListener('change', this.handleClick.bind(this));
        this.mutationObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['theme'],
            childList: false,
            subtree: false
        });
    }

    disconnectedCallback() {
        this.mutationObserver.disconnect();
    }

    handleClick() {
        this.data.isOn = !this.data.isOn;
        document.documentElement.setAttribute('theme', this.data.isOn ? 'light' : 'default');
    }

    updateCheckboxState() {
        const theme = document.documentElement.getAttribute('theme');
        this.data.isOn = theme === 'light';
        this.querySelector('#toggleCheckbox').checked = this.data.isOn;
    }

    handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'theme') {
                this.updateCheckboxState();
            }
        });
    }
}

customElements.define('rx-switch', RxSwitch);
