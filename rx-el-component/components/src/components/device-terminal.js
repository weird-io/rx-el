// Creates an autonomous custom element.
class DeviceTerminal extends HTMLElement {
    constructor() {
        // Always call super first in constructor.
        super();
         // Create a shadowRoot
        this.attachShadow({mode: 'open'}).innerHTML = ` <!-- sets and returns this.shadowRoot -->
            <span>pi@rasberrypi ~ $</span>
        `;
    }
}
// Define the new element using kebab-case naming convention (kebab-case) requires a dash.
window.customElements.define('device-terminal', DeviceTerminal);
