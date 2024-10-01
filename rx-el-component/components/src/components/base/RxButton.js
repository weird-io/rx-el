import * as rx from '../../../../../dist/bundle.mjs';

class RxButton extends rx.ReactiveHTMLElement {
    template = `
    {{? data && data?.model}}
        <button class="btn" style="background-color: {{=data.backgroundColor}}; color: {{=data.color}};">
            {{=data.model.text}}
        </button>
    {{?}}
    <style>
        .btn {
            padding: 0.5em 1em;
            margin: 0.5em;
            border: none;
            border-radius: 0.25em;
            cursor: pointer;
        }
    </style>
    `;

    COLORS = {
        BLUE: '#007bff',
        WHITE: '#ffffff',
        BLACK: '#000000',
        GRAY: '#6c757d',
        GREEN: '#28a745',
        RED: '#dc3545',
        ORANGE: '#ffc107',
        TEAL: '#17a2b8',
        LIGHT_GRAY: '#f8f9fa',
        DARK_GRAY: '#343a40',
        TRANSPARENT: ''
    };

    VARIANTS = {
        PRIMARY: this.COLORS.BLUE,
        SECONDARY: this.COLORS.GRAY,
        SUCCESS: this.COLORS.GREEN,
        DANGER: this.COLORS.RED,
        WARNING: this.COLORS.ORANGE,
        INFO: this.COLORS.TEAL,
        LIGHT: this.COLORS.LIGHT_GRAY,
        DARK: this.COLORS.DARK_GRAY,
        LINK: this.COLORS.TRANSPARENT
    };

    constructor() {
        super();
        this.data = {};
        this.data.variant = this.getAttribute('variant')?.toUpperCase() || 'PRIMARY';
        this.data.type = this.getAttribute('type') || 'button';

        // Initialize colors before setting the model
        this.resolveColors(this.data.variant);

        this.data.model = {
            type: this.data.type.toLowerCase(),
            text: this.innerHTML.trim() || 'Button',
        };
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Resolves and assigns background color and text color based on the variant
     */
    resolveColors(variant) {
        this.data.backgroundColor = this.VARIANTS[variant] || this.COLORS.GRAY;
        this.data.color = variant === 'LIGHT' ? this.COLORS.BLACK : this.COLORS.WHITE;
    }
}

customElements.define('rx-button', RxButton);
