import * as rx from 'rx-el';

class RxScatterGraph extends rx.ReactiveHTMLElement{

    template = `
        {{? data?.model}}
            <svg>
                {{~data.model.points : p}}
                    <circle cx="{{=data.calculateBarOffset( p, data.model.points.length )}}" cy="{{=data.height - p.val}}" r="5" fill="rgb(75, 149, 217)"></circle>
                {{~}}
            </svg>
        {{?}}
    `;


    constructor() {
        super();
        this.defaultInterval = 15;
    }

    connectedCallback() {
        this.data.calculateBarWidth = this.calculateBarWidth.bind( this );
        this.data.calculateBarOffset = this.calculateBarOffset.bind( this );
        this.data.height = this.offsetHeight;
        this.data.model = {
            interval: this.defaultInterval,
            points: this.produceRandomPoints(),
        };
    }

    /**
     *
     * @param p
     * @param l
     * @returns {number}
     */
    calculateBarOffset( p, l ) {

        let o = 0;
        let w = this.calculateBarWidth( l )
        if ( p && l > 0 ) {
            o = p.t * w;
        }
        return o;

    }

    /**
     *
     * @param points
     * @returns {number}
     */
    calculateBarWidth( l ) {

        let w = 0;
        if ( l > 0 ) {
            w = ( this.offsetWidth / l );
        }
        return w;
    }

    produceRandomPoints() {

        const N = Math.floor( 10 + Math.random() * 10 );
        const points = [];

        for (let i = 0; i < N; i++) {
            points.push({val: 20 + ( Math.random() * 20 ), t: i });
        }

        return points;
    }

}

customElements.define('rx-scatter-graph', RxScatterGraph );
