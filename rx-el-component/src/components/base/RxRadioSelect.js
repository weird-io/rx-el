class RxRadioSelect extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick( e ) {
        if ( e.target.hasAttribute('data-radio-li') ) {
            this.querySelector('label[data-toggle-label]').innerText = e.target.value;
            this.querySelector('input[data-toggle-checkbox]').checked = false;
        }
    }
}

customElements.define('c-radio-select', RxRadioSelect );
