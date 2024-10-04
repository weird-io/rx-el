import * as rx from 'rx-el';

class RxBarGraph extends rx.ReactiveHTMLElement {
    DEFAULT_AXIS_MARGIN = [0, 0, 60, 60];
    DEFAULT_AXIS_X_INTERVALS = 20;
    DEFAULT_AXIS_Y_INTERVALS = 10;

    template = `
        {{? data?.model}}
            <svg width="100%" height="{{=data.height}}" transform="scale(1, -1)">
                <g>
                {{~data.axis.x.interval : interval}}
                    <line class="line-graph-x-axis" x1="{{=interval.x}}" y1="{{=interval.y}}" x2="{{=interval.x}}" y2="{{=data.axis.y.h + data.box.m[2]}}" stroke="#f0f0f0"></line>
                    <text x="{{=interval.x}}" y="{{=-(data.box.m[2] - 10 - 20)}}" stroke="#000" font-size="10" text-anchor="middle" transform="scale(1, -1)">{{=interval.label}}</text>
                {{~}}
                </g>
                <g>
                {{~data.axis.y.interval : interval}}
                    <line class="line-graph-y-axis" x1="{{=interval.x}}" y1="{{=interval.y}}" x2="{{=data.axis.x.w + data.box.m[3]}}" y2="{{=interval.y}}" stroke="#f0f0f0"></line>
                    <text x="{{=data.box.m[3] - 20}}" y="{{=-(interval.y - 5)}}" stroke="#000" font-size="10" text-anchor="end" transform="scale(1, -1)">{{=interval.label}}</text>
                {{~}}
                </g>
                <g>
                {{~data.model.points : p : index}}
                    <rect 
                        x="{{=data.calculateBarOffset(p, data.model.points.length)}}" 
                        y="{{=data.box.m[2]}}" 
                        width="{{=data.calculateBarWidth(data.model.points.length)}}" 
                        height="{{=p.val}}" 
                        fill="{{=data.calculateGradientColor(index, data.model.points.length)}}" 
                        class="bar"
                    ></rect>
                {{~}}
                </g>
            </svg>
        {{?}}
    `;

    constructor() {
        super();
        this.defaultInterval = 15;

    }

    connectedCallback() {

        this.data.calculateBarWidth = this.calculateBarWidth.bind(this);
        this.data.calculateBarOffset = this.calculateBarOffset.bind(this);
        this.data.calculateGradientColor = this.calculateGradientColor.bind(this);

        this.data.height = this.offsetHeight || 200;


        const points = this.produceRandomPoints();
        this.data.model = {
            interval: this.defaultInterval,
            points: points,
        };

        this.data.box = {
            w: this.offsetWidth,
            h: this.offsetHeight,
            m: this.DEFAULT_AXIS_MARGIN,
        };

        this.data.range = {
            x: this.calculateRangeX(points),
            y: this.calculateRangeY(points),
        };

        this.data.axis = {
            x: this.calculateAxisX(),
            y: this.calculateAxisY(),
        };
    }

    calculateBarOffset(p, l) {
        const axisXWidth = this.data.axis.x.w;
        const marginLeft = this.data.box.m[3];
        return marginLeft + p.t * (axisXWidth / l);
    }

    calculateBarWidth(l) {
        const axisXWidth = this.data.axis.x.w;
        return l > 0 ? axisXWidth / l : 0;
    }

    produceRandomPoints() {
        const N = Math.floor(Math.random() * 10) + 1;
        return Array.from({ length: N }, (_, i) => ({
            val: Math.floor(Math.random() * (320 - 1 + 1)) + 1,
            t: i,
        }));
    }

    calculateAxisX() {
        const R = this.data.range.x;
        const M = this.data.box.m;
        const N = this.DEFAULT_AXIS_X_INTERVALS;
        const W = this.data.box.w - (M[1] + M[3]);

        return {
            w: W,
            interval: [...Array(N).keys()].map(i => {
                const x = (W * i) / N;
                return {
                    x: x + M[3],
                    y: M[2],
                    label: this.calculateAxisLabelX(x, R, W),
                };
            }),
        };
    }

    calculateAxisY() {
        const R = this.data.range.y;
        const M = this.data.box.m;
        const N = this.DEFAULT_AXIS_Y_INTERVALS;
        const H = this.data.box.h - (M[0] + M[2]);

        return {
            h: H,
            interval: [...Array(N).keys()].map(i => {
                const y = (H * i) / N;
                return {
                    x: M[3],
                    y: y + M[2],
                    label: this.calculateAxisLabelY(y, R, H),
                };
            }),
        };
    }

    calculateRange(points, key, min = null, max = null) {
        const values = points.map(p => p[key]);

        if (min === null) {
            min = Math.min(...values);
        }

        if (max === null) {
            max = Math.max(...values);
        }

        const d = max - min;

        return {
            min: min,
            max: max,
            d: d,
        };
    }

    calculateRangeX(points) {
        const min = this.getAttribute('data-range-x-min');
        const max = this.getAttribute('data-range-x-max');
        return this.calculateRange(points, 't', min, max);
    }

    calculateRangeY(points) {
        const min = 0; // Y-axis always starts at 0
        const max = this.getAttribute('data-range-y-max') || null;
        return this.calculateRange(points, 'val', min, max);
    }

    calculateAxisLabelX(x, range, width) {
        // Convert x position to a label
        return Math.round((x / width) * (range.max - range.min) + range.min);
    }

    calculateAxisLabelY(y, range, height) {
        // Convert y position to a label
        return Math.round((y / height) * (range.max - range.min) + range.min);
    }

    calculateGradientColor(index, total) {
        const startColor = [255, 226, 106];
        const middleColor = [221, 114, 243];
        const endColor = [86, 102, 196];

        const getColor = (start, end, factor) => Math.round(start + (end - start) * factor);

        if (total === 1) {
            return `rgb(${middleColor[0]}, ${middleColor[1]}, ${middleColor[2]})`;
        }

        const factor = index / (total - 1);
        let r, g, b;

        if (factor < 0.5) {
            const subFactor = factor * 2;
            r = getColor(startColor[0], middleColor[0], subFactor);
            g = getColor(startColor[1], middleColor[1], subFactor);
            b = getColor(startColor[2], middleColor[2], subFactor);
        } else {
            const subFactor = (factor - 0.5) * 2;
            r = getColor(middleColor[0], endColor[0], subFactor);
            g = getColor(middleColor[1], endColor[1], subFactor);
            b = getColor(middleColor[2], endColor[2], subFactor);
        }

        return `rgb(${r},${g},${b})`;
    }
}

customElements.define('rx-bar-graph', RxBarGraph);
