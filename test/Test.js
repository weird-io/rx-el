import ReactiveHTMLElement from '../src/reactive/ReactiveHTMLElement.js';
import {
    DEVICE_DETAILS_TEMPLATE,
    DEVICE_REGISTER_TEMPLATE,
    mockModel,
} from './constants.js';

class Test extends ReactiveHTMLElement {
    renderTimeEl = document.getElementById('render-time');
    rendersCountEl = document.getElementById('actual-renders');
    warningEl = document.getElementById('warning');

    selectedEntriesNumber = document.getElementById('entries').value;
    selectedRenderFrequency = document.getElementById('render-frequency').value;
    selectedTemplateName = document.getElementById('template').value;
    selectedAlgorithm = document.getElementById('algorithm').value;
    selectedUpdatingDataPortion =
        document.getElementById('updating-data').value;

    template =
        this.selectedTemplateName === 'device-register'
            ? DEVICE_REGISTER_TEMPLATE
            : this.selectedTemplateName === 'device-details' &&
              DEVICE_DETAILS_TEMPLATE;
    // To get an interval time in ms we divide 1000ms (as we are interested in renders per 1s) by the selected render frequency
    intervalTime = Math.round(1000 / this.selectedRenderFrequency);
    modelKeysNumber = Object.keys(mockModel).length;
    updatingKeysNumber = 0;
    updatingKeysList = [];
    modelsNumber = this.selectedEntriesNumber / this.modelKeysNumber;
    modelArray = [];
    renderTimes = [];
    rendersCount = 0;
    updatingDOMInterval = null;
    metricsUpdateInterval = null;

    constructor() {
        super();

        if (this.selectedAlgorithm === 'dom-diffing') {
            // Important: since the increment for portion of updating data is 25% - make sure the number of model keys multiplied by 0.25 gives a whole number
            this.updatingKeysNumber =
                this.modelKeysNumber * this.selectedUpdatingDataPortion;
            this.updatingKeysList = Object.keys(mockModel).slice(
                0,
                this.updatingKeysNumber
            );
        }

        this.modelArray = Array(this.modelsNumber)
            .fill()
            .map(() => {
                // Create a unique object reference for each array item
                const uniqueObject = { ...mockModel };

                return uniqueObject;
            });

        this.runUpdatingDOMInterval();
        this.runMetricsUpdateInterval();
    }

    runUpdatingDOMInterval() {
        this.updatingDOMInterval = setInterval(() => {
            performance.mark('render_start');
            // Create a copy of modelArray to avoid reference clashes
            const updatedArray = [...this.modelArray];
            // Updates DOM via ReactiveElement algorithm
            this.data.model = updatedArray;
            // If dom-diffing algorithm is selected - mutate the original modelArray items to update only part of the data
            if (this.selectedAlgorithm === 'dom-diffing') {
                this.modelArray.forEach((obj) => {
                    this.updatingKeysList.forEach((key) => {
                        obj[key]++;
                    });
                });
            }
            // Queues a requestAnimationFrame relative to this executing Task
            this.runAfterFramePaint(() => {
                performance.mark('render_produced');
                this.rendersCount++;

                const measure = performance.measure(
                    'RenderTime',
                    'render_start',
                    'render_produced'
                );
                this.renderTimes.push(measure.duration);
            });
        }, this.intervalTime);
    }

    runMetricsUpdateInterval() {
        this.metricsUpdateInterval = setInterval(() => {
            this.renderTimeEl.textContent = this.averageTime
                ? `${this.averageTime} ms`
                : 0;
            this.rendersCountEl.textContent = this.rendersCount;

            // if the difference between desired and actual renders is more than 5 => show warning
            this.selectedRenderFrequency - this.rendersCount > 5
                ? (this.warningEl.style.display = 'flex')
                : (this.warningEl.style.display = 'none');

            // Clean up the data each second
            this.renderTimes = [];
            this.rendersCount = 0;
        }, 1000);
    }

    /**
     * Run code after frame paint using requestAnimationFrame()
     * @param  {Function} callback The callback that runs after frame paint
     */
    runAfterFramePaint(callback) {
        // Queue a "before Render Steps" callback via requestAnimationFrame.
        requestAnimationFrame(() => {
            // MessageChannel is being used here as a generic mechanism to Post a Task to the Task Queue.
            const messageChannel = new MessageChannel();
            // Setup the callback to run in a Task
            messageChannel.port1.onmessage = callback;
            // Queue the Task on the Task Queue
            messageChannel.port2.postMessage(undefined);
        });
    }

    /**
     * Get the average time for renderTimes
     * @return {Number}      average number from renderTimes array entries
     */
    get averageTime() {
        return Math.round(
            this.renderTimes.reduce((m, n) => m + n, 0) /
                this.renderTimes.length
        );
    }

    // clean up intervals each time the custom element is disconnected from the document's DOM
    disconnectedCallback() {
        clearInterval(this.updatingDOMInterval);
        clearInterval(this.metricsUpdateInterval);
    }
}

customElements.define('rx-component', Test);
