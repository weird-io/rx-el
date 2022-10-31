import {
  DEVICE_DETAILS_TEMPLATE,
  DEVICE_REGISTER_TEMPLATE,
  mockModel,
} from '../constants.js';
import ReactiveHTMLElement from '../reactive/ReactiveHTMLElement.js';

class DeviceRegister extends ReactiveHTMLElement {
  renderTimeEl = document.getElementById('render-time');
  rendersCountEl = document.getElementById('actual-renders');
  warningEl = document.getElementById('warning');
  selectedTemplateName = document.getElementById('template').value;
  selectedRenderFrequency = document.getElementById('render-frequency').value;
  selectedEntriesNumber = document.getElementById('entries').value;
  template =
    this.selectedTemplateName === 'device-register'
      ? DEVICE_REGISTER_TEMPLATE
      : this.selectedTemplateName === 'device-details' &&
        DEVICE_DETAILS_TEMPLATE;
  // to get an interval time in ms we divide 1000ms (as we are interested in renders per 1s) by the selected render frequency
  intervalTime = Math.round(1000 / this.selectedRenderFrequency);
  modelKeysNumber = Object.keys(mockModel).length;
  modelsNumber = this.selectedEntriesNumber / this.modelKeysNumber;
  renderTimes = [];
  rendersCount = 0;
  updatingDOMInterval = null;
  metricsUpdateInterval = null;

  constructor() {
    super();

    this.runUpdatingDOMInterval();
    this.runMetricsUpdateInterval();
  }

  runUpdatingDOMInterval() {
    this.updatingDOMInterval = setInterval(() => {
      performance.mark('render_start');

      // Updates DOM
      this.data.model = Array(this.modelsNumber)
        .fill()
        .map(() => mockModel);

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
      this.renderTimeEl.innerHTML = `${this.averageTime} ms`;
      this.rendersCountEl.innerHTML = this.rendersCount;

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
   * Get the average time
   * @return {Number}      average number from renderTimes array entries
   */
  get averageTime() {
    return Math.round(
      this.renderTimes.reduce((m, n) => m + n, 0) / this.renderTimes.length
    );
  }

  disconnectedCallback() {
    clearInterval(this.updatingDOMInterval);
    clearInterval(this.metricsUpdateInterval);
  }
}

customElements.define('device-component', DeviceRegister);
