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

"use strict"

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
}

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
export default class ReactiveHTMLElementTemplate {

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
                    code = code.substring(4)
                }
                if (!(code in def)) {
                    if (assign === ":") {
                        value.replace(syn.defineParams, (_, param, v) => {
                            def[code] = {arg: param, text: v}
                        })
                        if (!(code in def)) def[code] = value
                    } else {
                        new Function("def", `def['${code}']=${value}`)(def)
                    }
                }
                return ""

            })

            // FIXME: Encapsulate method and variables
            .replace(syn.use, (_, code) => {
                code = code.replace(syn.useParams, (_, s, d, param) => {
                    if (def[d] && def[d].arg && param) {
                        const rw = unescape((d + ":" + param).replace(/'|\\/g, "_"))
                        def.__exp = def.__exp || {}
                        def.__exp[rw] = def[d].text.replace(
                            new RegExp(`(^|[^\\w$])${def[d].arg}([^\\w$])`, "g"),
                            `$1${param}$2`
                        )
                        return s + `def.__exp['${rw}']`
                    }
                })
                const v = new Function("def", "return " + code)(def)
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

        this.sid++

        const TYPES = {n: "number", s: "string", b: "boolean",};
        const val = this.config.internalPrefix + this.sid
        const error = `throw new Error("expected ${TYPES[typ]}, got "+ (typeof ${val}))`
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
        this.needEncoders[enc] = true
        code = unescape(code)
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
            code = unescape(code)
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
        this.sid++
        const defI = iName ? `let ${iName}=-1;` : ""
        const incI = iName ? `${iName}++;` : ""
        const val = this.config.internalPrefix + this.sid
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
        const d = TEMPLATE_SETTINGS.delimiters
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




