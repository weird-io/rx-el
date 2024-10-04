import * as rx from "rx-el";

class RxLineGraph extends rx.ReactiveHTMLElement {


    DEFAULT_AXIS_MARGIN = [0, 0, 60, 60];
    DEFAULT_AXIS_X_INTERVALS = 20;
    DEFAULT_AXIS_Y_INTERVALS = 10;

    template = `
        {{? data?.model}}
            <svg class="line-graph-svg" xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)">
           
                <defs>
                    <radialGradient id="bubble-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:#5666C4; stop-opacity:1" />
                        <stop offset="30%" style="stop-color:#DD72F3; stop-opacity:0.8" />
                        <stop offset="60%" style="stop-color:#DD72F3; stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#FFE26A; stop-opacity:0.4" />
                    </radialGradient>
                </defs>
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
       
                <polyline points="{{=data.calculatePolyLine(data.model.points)}}" stroke="url(#bubble-gradient)" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
              
              
            </svg>
        {{?}}
    `;

    constructor() {
        super();
    }

    connectedCallback() {
        try {
            let m = JSON.parse(this.getAttribute('data-axis-margin')) || this.DEFAULT_AXIS_MARGIN;

            this.data.axis = {
                x: { interval: parseInt(this.getAttribute('data-axis-x-intervals')) || this.DEFAULT_AXIS_X_INTERVALS },
                y: { interval: parseInt(this.getAttribute('data-axis-y-intervals')) || this.DEFAULT_AXIS_Y_INTERVALS },
            };

            this.data.box = {
                w: this.offsetWidth,
                h: this.offsetHeight,
                m: m || this.DEFAULT_AXIS_MARGIN,
            };

            this.data.calculateAxisX = this.calculateAxisX.bind(this);
            this.data.calculateAxisY = this.calculateAxisY.bind(this);
            this.data.calculatePolyLine = this.calculatePolyLine.bind(this);
            this.data.calculateScalarX = this.calculateScalarX.bind(this);
            this.data.calculateScalarY = this.calculateScalarY.bind(this);


            const model = this.getAttribute('data-model');
            const points = model ? JSON.parse(model) : this.generateRandomPoints();

            this.data.val = {
                x: this.getAttribute('data-val-x') || 'x',
                y: this.getAttribute('data-val-y') || 'y',
            };


            this.data.range = {
                x: this.calculateRangeX(points),
                y: this.calculateRangeY(points),
            };

            this.data.axis = {
                x: this.calculateAxisX(),
                y: this.calculateAxisY(),
            };

            this.data.model = {
                points: points,
            };

        } catch (error) {
            console.error('Error in connectedCallback:', error);
        }
    }

    generateRandomPoints() {
        const pointCount = Math.floor(10 + Math.random() * 10); // Generate between 10 and 20 points
        return Array.from({ length: pointCount }, (_, i) => ({
            x: i,
            y: 20 + Math.random() * 80, // Y values between 20 and 100
        }));
    }

    calculateAxisX() {
        let R = this.data.range.x;
        let M = this.data.box.m;
        let N = this.data.axis.x.interval;
        let W = this.data.box.w - (M[1] + M[3]);

        return {
            w: W,
            interval: [...Array(N).keys()].map(i => {
                let x = (W * i / N);
                return {
                    x: x + M[3],
                    y: M[2],
                    i: i,
                    label: this.calculateAxisLabelX(x, R, W),
                };
            }),
        };
    }

    calculateAxisLabelX(x, R, W) {
        return Math.round(((x / W) * R.d) + parseInt(R.min));
    }

    calculateAxisY() {
        let R = this.data.range.y;
        let M = this.data.box.m;
        let N = this.data.axis.y.interval;
        let H = this.data.box.h - (M[0] + M[2]);

        return {
            h: H,
            interval: [...Array(N).keys()].map(i => {
                let y = (H * i / N);
                return {
                    x: M[3],
                    y: y + M[2],
                    i: i,
                    label: this.calculateAxisLabelY(y, R, H),
                };
            }),
        };
    }

    calculateAxisLabelY(y, R, H) {
        return Math.round(((y / H) * R.d) + parseInt(R.min));
    }

    calculatePolyLine(points) {
        return points.map(p => `${this.calculateScalarX(p)},${this.calculateScalarY(p)}`).join(' ');
    }

    calculateRange(points, v, min, max) {
        let values = points.map(p => p[v]);

        if (min === null) {
            min = Math.min(...values);
        }

        if (max === null) {
            max = Math.max(...values);
        }

        let d = max - min;

        return {
            min: min,
            max: max,
            d: d,
        };
    }

    calculateRangeX(points) {
        let min = this.getAttribute('data-range-x-min');
        let max = this.getAttribute('data-range-x-max');

        return this.calculateRange(points, this.data.val.x, min, max);
    }

    calculateRangeY(points) {
        let min = 0; // Always start the Y-axis at 0
        let max = this.getAttribute('data-range-y-max');

        if (max === null) {
            max = Math.max(...points.map(p => p[this.data.val.y]));
        }

        let d = max - min;

        return {
            min: min,
            max: max,
            d: d
        }
    }
    // calculateRangeY(points) {
    //     let min = this.getAttribute('data-range-y-min');
    //     let max = this.getAttribute('data-range-y-max');
    //
    //     return this.calculateRange(points, this.data.val.y, min, max);
    // }

    calculateScalar(v, R, d, m0 = 0, m1 = 0) {
        v -= R.min;
        v *= (d - (m0 + m1)) / (R.d);
        v += m0;

        return v;
    }

    calculateScalarX(p) {
        return this.calculateScalar(p[this.data.val.x], this.data.range.x, this.data.box.w, this.data.box.m[3], this.data.box.m[1]);
    }

    calculateScalarY(p) {
        return this.calculateScalar(p[this.data.val.y], this.data.range.y, this.data.box.h, this.data.box.m[2], this.data.box.m[0]);
    }
}

customElements.define('rx-line-graph', RxLineGraph);
