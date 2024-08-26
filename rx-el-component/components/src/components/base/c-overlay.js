class COverlay extends HTMLElement {
    constructor() {
        super();

        document.addEventListener('click', this.handleClick.bind( this ));
        document.addEventListener('keyup', this.handleKeyUp.bind( this ));
    }

    handleClick( e ) {
        if ( e.target.hasAttribute('data-overlay-action' ) ){

            e.target.getAttribute('data-overlay-action') === 'open' && e.target.getAttribute( 'data-overlay-target' ) === this.id
                ? this.classList.add('visible')
                : this.classList.remove('visible');

            // this assumes there are only open and close values for data-overlay-action, which this
            // reasonable I think. But if we'd add more actions, remove the ternary
        }
    }

    handleKeyUp( e ) {
        if ( this.classList.contains( 'visible' ) && e.keyCode === 27 ){ // escape key
            this.classList.remove('visible')
        }
    }
}

customElements.define('c-overlay', COverlay );
