class CCheckboxSelect extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('change', this.handleChange.bind(this));
    }

    handleChange( e ) {
        if ( e.target.name === 'toggle-all' ) {
            this.setAllCheckboxes( e.target.checked );
        }

        this.dispatchEvent( new Event('onCheck', { bubbles: true }));
    }

    setAllCheckboxes( value ) {
        Array.from( this.querySelectorAll('input[data-checkbox-li]') ).map(( checkbox ) => checkbox.checked = value )
    }

    getValues() {
        return Array.from( this.querySelectorAll('input[data-checkbox-li]:checked')).map( checkbox => checkbox.value );
    }
}

customElements.define('c-checkbox-select', CCheckboxSelect);
