class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.checkbox = this.querySelector('input[type=checkbox]');
        this.checkbox.addEventListener('click', this.handleTheme );
    }

    handleTheme = () => {
        document.documentElement.setAttribute('theme', this.checkbox.checked ? 'light' : 'default' );
    };
}

customElements.define('theme-toggle', ThemeToggle);
