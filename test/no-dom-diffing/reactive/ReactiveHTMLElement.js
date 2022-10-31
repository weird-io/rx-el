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

class ReactiveHTMLElement extends HTMLElement {
  data; // FIXME: prevent override data
  template; // FIXME: prevent override template

  constructor(template) {
    super();

    this.template = template;
    this.data = this.produceReactiveDataProxy();

    //
    this.addEventListener('datachange', this.handleDataChange.bind(this));
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
        if (typeof receiver === 'object') {
          for (let p in receiver) {
            receiver[p] = this.decorateReceiverWithProxy(receiver[p]);
          }
          receiver = new Proxy(receiver, REACTIVE_OBJECT_PROXY_HANDLER);
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
    this.dispatchEvent(new Event('rendered'));

    // TODO: calculate tree difference and update tree accordingly ( e.g. dom diff )
    this.innerHTML = new ReactiveHTMLElementTemplate(this.template).render(
      this.data
    );
  }
}

export default ReactiveHTMLElement;
