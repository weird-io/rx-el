/**
 * Copyright 2022 @ The Weird Science B.V.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ReactiveHTMLElementTemplate from './ReactiveHTMLElementTemplate.js';

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {HTMLElement}       The template HTML
 */
const stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

/**
 * Get the type for a node
 * @param  {HTMLElement}   node The node
 * @return {String}      The type
 */
const getNodeType = function (node) {
    if (node.nodeType === 3) return 'text';
    if (node.nodeType === 8) return 'comment';
    return node.tagName.toLowerCase();
};

/**
 * Get the content from a node
 * @param  {HTMLElement}   node The node
 * @return {String}      The type
 */
const getNodeContent = function (node) {
    if (node.childNodes && node.childNodes.length > 0) return null;
    return node.textContent;
};

/**
 * Get the attributes from a node
 * @param  {HTMLElement}   node The node
 * @return {Object}      The attributes
 */
const getNodeAttributes = function ( node ) {
    if ( getNodeType(node) === 'text' || getNodeType(node) === 'comment' ) {
        return null;
    }
    if ( node.getAttributeNames().length > 0 ) {
        const attributes = {};
        node.getAttributeNames().forEach( name => attributes[name] = node.getAttribute( name ));
        return attributes;
    }
    return null;
}

/**
 * Compare the template to the UI and make updates
 * @param  {HTMLElement} template The template HTML
 * @param  {HTMLElement} elem     The UI HTML
 */
const apply = function (template, elem) {
    // Get arrays of child nodes
    var domNodes = Array.prototype.slice.call(elem.childNodes);
    var templateNodes = Array.prototype.slice.call(template.childNodes);

    // If extra elements in DOM, remove them
    var count = domNodes.length - templateNodes.length;
    if (count > 0) {
        for (; count > 0; count--) {
            domNodes[domNodes.length - count].parentNode.removeChild(
                domNodes[domNodes.length - count]
            );
        }
    }

    // Diff each item in the templateNodes
    templateNodes.forEach(function (node, index) {
        // If element doesn't exist, create it
        if (!domNodes[index]) {
            elem.appendChild(node.cloneNode(true));
            return;
        }

        // If element is not the same type, replace it with new element
        if (getNodeType(node) !== getNodeType(domNodes[index])) {
            domNodes[index].parentNode.replaceChild(
                node.cloneNode(true),
                domNodes[index]
            );
            return;
        }

        // If content is different, update it
        var templateContent = getNodeContent(node);
        if (
            templateContent &&
            templateContent !== getNodeContent(domNodes[index])
        ) {
            domNodes[index].textContent = templateContent;
        }

        // If attributes are different, update it
        var templateAttributes = getNodeAttributes( node );
        if (
            templateAttributes &&
            JSON.stringify(templateAttributes) !== JSON.stringify(getNodeAttributes( domNodes[index] ))
        ) {
            Object.keys(templateAttributes).forEach( key => domNodes[index].setAttribute( key, templateAttributes[key]));
        }

        // If target element should be empty, wipe it
        if (
            domNodes[index].childNodes.length > 0 &&
            node.childNodes.length < 1
        ) {
            domNodes[index].innerHTML = '';
            return;
        }

        // If element is empty and shouldn't be, build it up
        // This uses a document fragment to minimize reflows
        if (
            domNodes[index].childNodes.length < 1 &&
            node.childNodes.length > 0
        ) {
            var fragment = document.createDocumentFragment();
            apply(node, fragment);
            domNodes[index].appendChild(fragment);
            return;
        }

        // If there are existing child elements that need to be modified, diff them
        if (node.childNodes.length > 0) {
            apply(node, domNodes[index]);
        }
    });
};

class DomDiffingReactiveHTMLElement extends HTMLElement {
    data;
    mutationObserver;

    constructor() {
        super();

        this.data = this.produceReactiveDataProxy();
        this.addEventListener('datachange', this.handleDataChange.bind(this));

        // When attribute values change, dispatch an event with the attribute name to listen to,
        // so the template can update & rerender
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes") {
                    this.dispatchEvent(new CustomEvent('attributeUpdate', {
                        detail: {
                            name: mutation.attributeName,
                        },
                    }));
                }
            });
        });

        this.mutationObserver.observe(this, {
            attributes: true,
        });
    }

    /**
     * Produces a reactive data proxy.
     * @returns {{}|boolean|*}
     */
    produceReactiveDataProxy() {
        // FIXME: Component reference
        // Because a Proxy is an exotic object, it cannot be extended.
        // In order to get a reference to the
        // This is not ideal from a performance perspective.
        const component = this;
        const proxies = new WeakSet();
        const REACTIVE_OBJECT_PROXY_HANDLER = {
            /**
             * When a data variable is set, a proxy tree is constructed.
             *
             * When a change in the data is detected ( e.g. something is "set" ),
             * the component will dispatch a datachange event and will render itself.
             *
             * @param target
             * @param prop
             * @param receiver
             * @returns {boolean}
             */
            set(target, prop, receiver) {
                const result = Reflect.set(
                    target,
                    prop,
                    this.decorateReceiverWithProxy(receiver)
                );
                component.dispatchEvent(new Event('datachange'));

                return result;
            },

            /**
             * Decorates a receiver with a proxy if it is an object or a collection
             * @param target
             * @param prop
             * @param receiver
             * @returns {*}
             */
            decorateReceiverWithProxy(receiver) {
                if (typeof receiver === 'object' && !proxies.has(receiver)) {
                    for (let p in receiver) {
                        receiver[p] = this.decorateReceiverWithProxy(
                            receiver[p]
                        );
                    }
                    receiver = new Proxy(
                        receiver,
                        REACTIVE_OBJECT_PROXY_HANDLER
                    );
                    proxies.add(receiver);
                }

                return receiver;
            },
        };

        return new Proxy({}, REACTIVE_OBJECT_PROXY_HANDLER);
    }

    /**
     * Handles a change in the data by rendering the template
     * @param e
     */
    handleDataChange(e) {
        this.render();
    }

    /**
     * Render template and replaces the innter html
     *
     * @param  {string} name property name
     * @param  {string} value property value
     * @return
     */
    render() {
        const rendered = stringToHTML(
            new ReactiveHTMLElementTemplate(this.template).render(this.data)
        );

        apply(rendered, this);

        this.dispatchEvent(new Event('rendered'));
    }
}

export default DomDiffingReactiveHTMLElement;
