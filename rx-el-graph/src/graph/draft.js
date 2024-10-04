import * as rx from "rx-el";

class RxLineGraphDraft extends rx.ReactiveHTMLElement {

    DEFAULT_AXIS_MARGIN = [0, 0, 60, 60];
    DEFAULT_AXIS_X_INTERVALS = 20;
    DEFAULT_AXIS_Y_INTERVALS = 10;
    DEFAULT_LINE_STROKE = '#000';
    DEFAULT_LINE_STROKE_WIDTH = 2;

    template = `
        {{? data?.model}}
            <svg class="line-graph-svg" xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)">
                <defs>
                </defs>

                {{? data.show.gridlinesY }}
                <g class="gridlines-y">
                    {{~data.axis.y.interval : interval}}
                        <line x1="{{=interval.x}}" y1="{{=interval.y}}" x2="{{=data.axis.x.w + data.box.m[3]}}" y2="{{=interval.y}}" stroke="{{=styles.axis.gridlineStroke}}"></line>
                    {{~}}
                </g>
                {{?}}

                {{? data.show.gridlinesX }}
                <g class="gridlines-x">
                    {{~data.axis.x.interval : interval}}
                        <line x1="{{=interval.x}}" y1="{{=interval.y}}" x2="{{=interval.x}}" y2="{{=data.axis.y.h + data.box.m[2]}}" stroke="{{=data.styles.axis.gridlineStroke}}"></line>
                    {{~}}
                </g>
                {{?}}

                {{? data.show.axisLabels }}
         
                <g class="axis-labels-x">
                    {{~data.axis.x.interval : interval}}
                        <text x="{{=interval.x}}" y="{{=-(data.box.m[2] - 10 - 20)}}" fill="{{=data.styles.axis.labelColor}}" font-size="{{=data.styles.axis.labelFontSize}}" text-anchor="middle" transform="scale(1, -1)">{{=interval.label}}</text>
                    {{~}}
                </g>
                <g class="axis-labels-y">
                    {{~data.axis.y.interval : interval}}
                        <text x="{{=data.box.m[3] - 20}}" y="{{=-(interval.y - 5)}}" fill="{{=data.styles.axis.labelColor}}" font-size="{{=data.styles.axis.labelFontSize}}" text-anchor="end" transform="scale(1, -1)">{{=interval.label}}</text>
                    {{~}}
                </g>
                {{?}}

         
                <g class="data-series">
                    {{~data.model : series, index}}
                        <polyline points="{{=data.calculatePolyLine(series)}}" 
                                  stroke="{{=data.getSeriesStyle(index, 'stroke')}}"
                                  fill="{{=data.getSeriesStyle(index, 'fill')}}"
                                  stroke-width="{{=data.getSeriesStyle(index, 'strokeWidth')}}"
                                  stroke-linecap="{{=data.getSeriesStyle(index, 'strokeLinecap')}}"
                                  stroke-linejoin="{{=data.getSeriesStyle(index, 'strokeLinejoin')}}">
                        </polyline>
                    {{~}}
                </g>
            </svg>
        {{?}}
    `;

    constructor() {
        super();
    }

    connectedCallback() {

        try {
            let m = JSON.parse(this.getAttribute('data-axis-margin')) || this.DEFAULT_AXIS_MARGIN;

            const xIntervals = parseInt(this.getAttribute('data-axis-x-intervals')) || this.DEFAULT_AXIS_X_INTERVALS;
            const yIntervals = parseInt(this.getAttribute('data-axis-y-intervals')) || this.DEFAULT_AXIS_Y_INTERVALS;


            this.data.box = {
                w: this.offsetWidth,
                h: this.offsetHeight,
                m: m,
            };


            this.data.calculateAxisX = this.calculateAxisX.bind(this);
            this.data.calculateAxisY = this.calculateAxisY.bind(this);
            this.data.calculatePolyLine = this.calculatePolyLine.bind(this);
            this.data.calculateScalarX = this.calculateScalarX.bind(this);
            this.data.calculateScalarY = this.calculateScalarY.bind(this);
            this.data.getSeriesStyle = this.getSeriesStyle.bind(this);


            const modelAttr = this.getAttribute('data-model');
            let model = modelAttr ? JSON.parse(modelAttr) : [this.generateRandomPoints()];

            if (!Array.isArray(model)) {
                model = [model];
            }

            this.data.model = model;


            this.data.val = {
                x: this.getAttribute('data-val-x') || 'x',
                y: this.getAttribute('data-val-y') || 'y',
            };


            this.data.range = {
                x: this.calculateRangeX(this.data.model),
                y: this.calculateRangeY(this.data.model),
            };


            this.data.axisLabelFormat = {
                x: this.getAttribute('data-axis-label-format-x') || '{value}',
                y: this.getAttribute('data-axis-label-format-y') || '{value}',
            };

            this.data.axis = {
                x: this.calculateAxisX(xIntervals),
                y: this.calculateAxisY(yIntervals),
            };


            this.data.styles = {
                line: {
                    stroke: this.getAttribute('data-line-stroke') || this.DEFAULT_LINE_STROKE,
                    strokeWidth: this.getAttribute('data-line-stroke-width') || this.DEFAULT_LINE_STROKE_WIDTH,
                    fill: this.getAttribute('data-line-fill') || 'none',
                    strokeLinecap: this.getAttribute('data-line-stroke-linecap') || 'round',
                    strokeLinejoin: this.getAttribute('data-line-stroke-linejoin') || 'round',
                },
                axis: {
                    stroke: this.getAttribute('data-axis-stroke') || '#f0f0f0',
                    gridlineStroke: this.getAttribute('data-gridline-stroke') || '#e0e0e0',
                    labelColor: this.getAttribute('data-axis-label-color') || '#000',
                    labelFontSize: this.getAttribute('data-axis-label-font-size') || '10',
                    labelFontFamily: this.getAttribute('data-axis-label-font-family') || 'sans-serif',
                },
            };


            const seriesStylesAttr = this.getAttribute('data-series-styles');
            this.data.seriesStyles = seriesStylesAttr ? JSON.parse(seriesStylesAttr) : [];


            this.data.show = {
                gridlinesX: this.getAttribute('data-show-gridlines-x') !== 'false',
                gridlinesY: this.getAttribute('data-show-gridlines-y') !== 'false',
                axisLabels: this.getAttribute('data-show-axis-labels') !== 'false',
            };

            // Invert Y-Axis
            this.data.invertY = this.getAttribute('data-invert-y') !== 'false';

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

    calculateAxisX(N) {
        let R = this.data.range.x;
        let M = this.data.box.m;
        let W = this.data.box.w - (M[1] + M[3]);

        return {
            w: W,
            interval: [...Array(N + 1).keys()].map(i => {
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
        const value = ((x / W) * R.d) + parseFloat(R.min);
        return this.formatAxisLabel(value, this.data.axisLabelFormat.x);
    }

    calculateAxisY(N) {
        let R = this.data.range.y;
        let M = this.data.box.m;
        let H = this.data.box.h - (M[0] + M[2]);

        return {
            h: H,
            interval: [...Array(N + 1).keys()].map(i => {
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
        const value = ((y / H) * R.d) + parseFloat(R.min);
        return this.formatAxisLabel(value, this.data.axisLabelFormat.y);
    }

    formatAxisLabel(value, formatString) {
        return formatString.replace('{value}', value.toFixed(2));
    }

    calculatePolyLine(points) {
        return points.map(p => `${this.calculateScalarX(p)},${this.calculateScalarY(p)}`).join(' ');
    }

    calculateRangeX(seriesArray) {
        let min = this.getAttribute('data-range-x-min');
        let max = this.getAttribute('data-range-x-max');

        let allXValues = seriesArray.flatMap(series => series.map(p => p[this.data.val.x]));

        return this.calculateRange(allXValues, min, max);
    }

    calculateRangeY(seriesArray) {
        let min = this.getAttribute('data-range-y-min');
        let max = this.getAttribute('data-range-y-max');

        let allYValues = seriesArray.flatMap(series => series.map(p => p[this.data.val.y]));

        return this.calculateRange(allYValues, min, max);
    }

    calculateRange(values, min, max) {
        if (min === null || min === undefined) {
            min = Math.min(...values);
        } else {
            min = parseFloat(min);
        }

        if (max === null || max === undefined) {
            max = Math.max(...values);
        } else {
            max = parseFloat(max);
        }

        let d = max - min;

        return {
            min: min,
            max: max,
            d: d,
        };
    }

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

    getSeriesStyle(index, styleProperty) {
        const seriesStyles = this.data.seriesStyles || [];
        const defaultStyle = this.data.styles.line[styleProperty];
        return (seriesStyles[index] && seriesStyles[index][styleProperty]) || defaultStyle;
    }
}

customElements.define('rx-line-graph-draft', RxLineGraphDraft);
