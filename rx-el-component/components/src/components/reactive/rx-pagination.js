import ReactiveHTMLElement from '../../reactive/ReactiveHTMLElement.js';

const DEVICE_REGISTER_TABLE_PAGINATION_TEMPLATE =
    '<div class="pagination">' +
        '<nav class="page-nav">' +
            '<a class="btn btn-secondary btn-compact icon-left btn-back disabled">' +
                '<c-icon class="icon-chevron chevron-left"></c-icon>' +
                'Back' +
            '</a>' +

            '<ul class="btn-list btn-group btn-group-compact">' +
                '<li>' +
                    '<a class="btn btn-secondary btn-compact active">1</a>' +
                '</li>' +
                '<li>' +
                '   <a class="btn btn-secondary btn-compact">2</a>' +
                '</li>' +
                '<li>' +
                    '<a class="btn btn-secondary btn-compact">3</a>' +
                '</li>' +
            '</ul>' +

            '<a class="btn btn-secondary icon-right btn-next btn-compact">' +
                'Next' +
                '<c-icon class="icon-chevron chevron-right"></c-icon>' +
            '</a>' +
        '</nav>' +

        '<div class="page-size">' +
            '<c-radio-select class="select select-compact radio-select pagination-select" id="pagination-select">' +
                '<input type="checkbox" class="toggle-checkbox select-checkbox" id="pagination-select-checkbox" data-toggle-checkbox/>' +
                '<label for="pagination-select-checkbox" class="toggle-label select-label" data-toggle-label>' +
                    '10' +
                '</label>' +
                '<ul class="radio-list">' +
                    '<li>' +
                        '<label for="rpp-10" class="radio-li-label">' +
                        '<input type="radio" class="radio-li-input no-radio" name="page-size-selection" id="rpp-10" value="10" data-radio-li checked/>' +
                            '10' +
                        '</label>' +
                    '</li>' +
                    '<li>' +
                        '<label for="rpp-50" class="radio-li-label">' +
                        '<input type="radio" class="radio-li-input no-radio" name="page-size-selection" id="rpp-50" data-radio-li value="50"/>' +
                            '50' +
                        '</label>' +
                    '</li>' +
                    '<li>' +
                        '<label for="rpp-100" class="radio-li-label">' +
                        '<input type="radio" class="radio-li-input no-radio" name="page-size-selection" id="rpp-100" data-radio-li value="100"/>' +
                            '100' +
                        '</label>' +
                    '</li>' +
                '</ul>' +
            '</c-radio-select>' +
            '<span>Results per page</span>' +
        '</div>' +

        '<div class="page-index">' +
            '<span><span class="current-page-size">10</span> of <span>123</span> results</span>' +
        '</div>' +
    '</div>';

class RxPagination extends ReactiveHTMLElement {

    template = DEVICE_REGISTER_TABLE_PAGINATION_TEMPLATE;

    constructor() {

        super();

        this.data.model = this.produceModel();

        this.addEventListener('change', this.handleChange.bind(this));
    }

    produceModel() {}

    handleChange( e ) {
        if ( e.target.classList.contains('radio-li-input') ) {
            this.querySelector('.current-page-size').innerText = e.target.value;
        }
    }
}

customElements.define('rx-pagination', RxPagination );
