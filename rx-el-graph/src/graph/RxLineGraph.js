import ReactiveHTMLElement from "../../../rx-el-core/src/reactive/ReactiveHTMLElement.js";


class RxLineGraph extends ReactiveHTMLElement {
    template = `
            <svg height="{{=data.model.height}}" width="{{=data.model.width}}">
                <polyline points="{{=data.model.points}}" fill="none" stroke="rgb(75, 149, 217)" stroke-width="2" />
            </svg>
        `;

      connectedCallback() {
              this.data.model = {
                  points: "0,100 50,25 50,75 100,0",
                  y: 2,
                  x: 3,
                  height: parseFloat(this.getAttribute('data-model-height')),
                  width: parseFloat(this.getAttribute('data-model-width')),
              };
          }
  }


customElements.define('rx-line-graph', RxLineGraph);