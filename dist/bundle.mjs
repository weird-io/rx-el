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


/**
 * Default template settings
 * @type {{argName: string, delimiters: {start: string, end: string}, encoders: {}, internalPrefix: string,
 *     encodersPrefix: string}}
 */
const TEMPLATE_SETTINGS = {
    argName: "data",
    encoders: {},
    internalPrefix: "_val",
    encodersPrefix: "_enc",
    delimiters: {
        start: "{{", end: "}}",
    },
};

/**
 * Default template syntax
 * @type {{encode: RegExp, conditional: RegExp, use: RegExp, define: RegExp, interpolate: RegExp, typeInterpolate:
 *     RegExp, defineParams: RegExp, evaluate: RegExp, useParams: RegExp, iterate: RegExp}}
 */
const TEMPLATE_SYNTAX = {
    evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    typeInterpolate: /\{\{%([nsb])=([\s\S]+?)\}\}/g,
    encode: /\{\{([a-z_$]+[\w$]*)?!([\s\S]+?)\}\}/g,
    use: /\{\{#([\s\S]+?)\}\}/g,
    useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$]+(?:\.[\w$]+|\[[^\]]+\])*|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\}|\[[^\]]*\])/g,
    define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    defineParams: /^\s*([\w$]+):([\s\S]+)/,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
};

/**
 *
 */
class ReactiveHTMLElementTemplate {

    sid = 0; // FIXME: use UUIDs
    needEncoders = {}; // FIXME: remove need encoders instance variable
    template = null;

    constructor(template, config) {
        this.template = template;
        this.config = config ? {...TEMPLATE_SETTINGS, ...config} : TEMPLATE_SETTINGS;
    }

    /**
     * Renders template with data and definitions
     * @param data
     * @param def
     * @returns {*}
     */
    render(data, def) {

        const ds = this.config.delimiters;
        const syntax = ds && !this.sameDelimiters(ds) ? this.resolveSyntax(ds) : {...TEMPLATE_SYNTAX};

        this.sid = 0; // FIXME: use UUIDs
        this.needEncoders = {};

        const str = this.resolveDefs(this.config, syntax, this.template, def || {});

        const render = this.strip(str)
            .replace(/'|\\/g, "\\$&")
            .replace(syntax.interpolate, this.renderInterpolateSyntax.bind(this))
            .replace(syntax.typeInterpolate, this.renderTypeInterpolateSyntax.bind(this))
            .replace(syntax.encode, this.renderEncodeSyntax.bind(this))
            .replace(syntax.conditional, this.renderConditionalSyntax.bind(this))
            .replace(syntax.iterate, this.renderIterateSyntax.bind(this))
            .replace(syntax.evaluate, this.renderEvaluateSyntax.bind(this))
            .replace(/\n/g, "\\n")
            .replace(/\t/g, "\\t")
            .replace(/\r/g, "\\r")
            .replace(/(\s|;|\}|^|\{)out\+='';/g, "$1")
            .replace(/\+''/g, "");

        const args = Array.isArray(this.config.argName) ? this.properties(this.config.argName) : this.config.argName;

        return new Function(this.config.encodersPrefix, `return function(${args}){let out='${render}';return out;};`)(this.config.encoders)(data);

    }

    /**
     * Resolves definitions in the template.
     * @param config
     * @param syn
     * @param block
     * @param def
     * @returns {string}
     */
    resolveDefs(config, syn, block, def) {

        // Ensure the block is a string
        block = (typeof block === "string") ? block : block.toString();

        return block

            // FIXME: Encapsulate method and variables
            .replace(syn.define, (_, code, assign, value) => {

                if (code.indexOf("def.") === 0) {
                    code = code.substring(4);
                }
                if (!(code in def)) {
                    if (assign === ":") {
                        value.replace(syn.defineParams, (_, param, v) => {
                            def[code] = {arg: param, text: v};
                        });
                        if (!(code in def)) def[code] = value;
                    } else {
                        new Function("def", `def['${code}']=${value}`)(def);
                    }
                }
                return ""

            })

            // FIXME: Encapsulate method and variables
            .replace(syn.use, (_, code) => {
                code = code.replace(syn.useParams, (_, s, d, param) => {
                    if (def[d] && def[d].arg && param) {
                        const rw = unescape((d + ":" + param).replace(/'|\\/g, "_"));
                        def.__exp = def.__exp || {};
                        def.__exp[rw] = def[d].text.replace(
                            new RegExp(`(^|[^\\w$])${def[d].arg}([^\\w$])`, "g"),
                            `$1${param}$2`
                        );
                        return s + `def.__exp['${rw}']`
                    }
                });
                const v = new Function("def", "return " + code)(def);
                return v ? this.resolveDefs(config, syn, v, def) : v
            })

    }

    renderDefineSyntax(_, code, assign, value) {

    }

    renderUseSyntax() {

    }

    /**
     * Removes breaks, tabs and comments
     * @param str
     * @returns {string}
     */
    strip(str) {
        return str.trim().replace(/[\t ]+(\r|\n)/g, "\n").replace(/(\r|\n)[\t ]+/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "");
    }

    /**
     * Renders interpolation syntax
     * @param _
     * @param code
     * @returns {string}
     */
    renderInterpolateSyntax(_, code) {
        return `'+(${unescape(code)})+'`;
    }

    /**
     * Renders type interpolate syntax
     * @param _
     * @param typ
     * @param code
     * @returns {string}
     */
    renderTypeInterpolateSyntax(_, typ, code) {

        this.sid++;

        const TYPES = {n: "number", s: "string", b: "boolean",};
        const val = this.config.internalPrefix + this.sid;
        const error = `throw new Error("expected ${TYPES[typ]}, got "+ (typeof ${val}))`;
        return `';const ${val}=(${unescape(code)});if(typeof ${val}!=="${TYPES[typ]}") ${error};out+=${val}+'`
    }

    /**
     * Renders encode syntax
     * @param _
     * @param enc
     * @param code
     * @returns {string}
     */
    renderEncodeSyntax(_, enc = "", code) {
        this.needEncoders[enc] = true;
        code = unescape(code);
        const e = enc ? "." + enc : '[""]';
        return `'+${this.config.encodersPrefix}${e}(${code})+'`;
    }

    /**
     * Renders conditional syntax
     * @param _
     * @param elseCase
     * @param code
     * @returns {string|string}
     */
    renderConditionalSyntax(_, elseCase, code) {
        if (code) {
            code = unescape(code);
            return elseCase ? `';}else if(${code}){out+='` : `';if(${code}){out+='`
        }
        return elseCase ? "';}else{out+='" : "';}out+='"
    }

    /**
     * Renders iterate syntax
     * @param _
     * @param arr
     * @param vName
     * @param iName
     * @returns {string}
     */
    renderIterateSyntax(_, arr, vName, iName) {

        if (!arr) return "';} } out+='"
        this.sid++;
        const defI = iName ? `let ${iName}=-1;` : "";
        const incI = iName ? `${iName}++;` : "";
        const val = this.config.internalPrefix + this.sid;
        return `';const ${val}=${unescape(arr)};if(${val}){${defI}for (const ${vName} of ${val}){${incI}out+='`

    }

    /**
     * Renders evaluate syntax
     * @param _
     * @param code
     * @returns {string}
     */
    renderEvaluateSyntax(_, code) {
        return `';${unescape(code)}out+='`;
    }


    /**
     *
     * @param start
     * @param end
     * @returns {boolean}
     */
    sameDelimiters({start, end}) {
        const d = TEMPLATE_SETTINGS.delimiters;
        return d.start === start && d.end === end
    }

    /**
     * Resolves syntax
     * @param start
     * @param end
     * @returns {{}}
     */
    resolveSyntax({start, end}) {
        return TEMPLATE_SYNTAX.map((syn) => this.strToRegExp(syn.toString().replace(/\\\{\\\{/g, this.escape(start)).replace(/\\\}\\\}/g, this.escape(end))));
    }

    /**
     *
     * @param str
     * @returns {*}
     */
    escape(str) {
        return str.replace(/([{}[\]()<>\\\/^$\-.+*?!=|&:])/g, "\\$1")
    }

    /**
     *
     * @param str
     * @returns {RegExp}
     */
    strToRegExp(str) {
        const [, rx, flags] = str.match(/^\/(.*)\/([\w]*)$/);
        return new RegExp(rx, flags)
    }

    /**
     *
     * @param args
     * @returns {string}
     */
    properties(args) {
        return args.reduce((s, a, i) => s + (i ? "," : "") + a, "{") + "}"
    }

}

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


 class ReactiveHTMLElement extends HTMLElement {
    data;

    constructor() {
        super();

        this.data = this.produceReactiveDataProxy();
        this.addEventListener('datachange', this.handleDataChange.bind(this));
    }

    /**
     * Convert a template string into HTML DOM nodes
     * @param  {String} str The template string
     * @return {HTMLElement}       The template HTML
     */
    stringToHTML(str) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');

        return doc.body;
    }

    /**
     * Get the type for a node
     * @param  {HTMLElement}   node The node
     * @return {String}      The type
     */
    getNodeType(node) {
        if (node.nodeType === 3) return 'text';
        if (node.nodeType === 8) return 'comment';

        return node.tagName.toLowerCase();
    }

    /**
     * Get the content from a node
     * @param  {HTMLElement}   node The node
     * @return {String}      The type
     */
    extractNodeContent(node) {
        if (node.childNodes && node.childNodes.length > 0) return null;

        return node.textContent;
    }

    /**
     * Compare the template to the UI and make updates
     * @param  {HTMLElement} template The template HTML
     * @param  {HTMLElement} elem     The UI HTML
     */
    applyDomDiff(template, elem) {
        // Get arrays of child nodes
        const domNodes = Array.prototype.slice.call(elem.childNodes);
        const templateNodes = Array.prototype.slice.call(template.childNodes);

        // If extra elements in DOM, remove them
        const count = domNodes.length - templateNodes.length;
        if (count > 0) {
            for (; count > 0; count--) {
                domNodes[domNodes.length - count].parentNode.removeChild(
                    domNodes[domNodes.length - count]
                );
            }
        }

        // Diff each item in the templateNodes
        templateNodes.forEach((node, index) => {
            // If element doesn't exist, create it
            if (!domNodes[index]) {
                elem.appendChild(node.cloneNode(true));
                return;
            }

            // If element is not the same type, replace it with new element
            if (this.getNodeType(node) !== this.getNodeType(domNodes[index])) {
                domNodes[index].parentNode.replaceChild(
                    node.cloneNode(true),
                    domNodes[index]
                );
                return;
            }

            // If content is different, update it
            const templateContent = this.extractNodeContent(node);
            if (
                templateContent &&
                templateContent !== this.extractNodeContent(domNodes[index])
            ) {
                domNodes[index].textContent = templateContent;
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
                const fragment = document.createDocumentFragment();
                this.applyDomDiff(node, fragment);
                domNodes[index].appendChild(fragment);
                return;
            }

            // If there are existing child elements that need to be modified, diff them
            if (node.childNodes.length > 0) {
                this.applyDomDiff(node, domNodes[index]);
            }
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
        const isNoDomDiffing = this.hasAttribute('no-dom-diffing');

        if (isNoDomDiffing) {
            this.innerHTML = new ReactiveHTMLElementTemplate(
                this.template
            ).render(this.data);
        } else {
            const rendered = this.stringToHTML(
                new ReactiveHTMLElementTemplate(this.template).render(this.data)
            );

            this.applyDomDiff(rendered, this);
        }

        this.dispatchEvent(new Event('rendered'));
    }
}

export { ReactiveHTMLElement, ReactiveHTMLElementTemplate };
