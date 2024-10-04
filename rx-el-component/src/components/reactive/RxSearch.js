import  * as rx from 'rx-el';


const SEARCH_TEMPLATE = '<div class="search-input">' +
                                            '<input placeholder="Search...."/>' +
                                        '</div>' +
                                        '<ul class="tag-list">' +
                                            '<li>' +
                                                '<div class="tag icon-right">' +
                                                    '#M101' +
                                                    '<c-icon class="icon-close"></c-icon>' +
                                                '</div>' +
                                            '</li>' +
                                        '</ul>';

class RxSearch extends rx.ReactiveHTMLElement {

    template = SEARCH_TEMPLATE;

    constructor() {

        super();

        this.data.model = this.produceModel();

    }

    produceModel() {}
}

customElements.define('rx-search', RxSearch );
