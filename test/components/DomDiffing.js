import DomDiffingReactiveHTMLElement from '/src/reactive/DomDiffingReactiveHTMLElement.js';
import Test from '../Test.js';

class DomDiffingComponent extends Test(DomDiffingReactiveHTMLElement) {}

customElements.define('dom-diffing-component', DomDiffingComponent);
