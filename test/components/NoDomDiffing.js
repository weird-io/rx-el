import NoDomDiffingReactiveHTMLElement from '/src/reactive/NoDomDiffingReactiveHTMLElement.js';
import Test from '../Test.js';

class NoDomDiffingComponent extends Test(NoDomDiffingReactiveHTMLElement) {}

customElements.define('no-dom-diffing-component', NoDomDiffingComponent);
