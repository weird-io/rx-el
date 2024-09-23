import * as rx from "rx-el";

class FlowDesigner extends rx.ReactiveHTMLElement {

    template = `
        <div class="flow-designer">
            <div class="content">
                <div class="toolbox">
                    <span class="btn btn-primary" draggable="true" data-name="schedule" data-type="source">Schedule (source)</span>
                    <span class="btn btn-primary" draggable="true" data-name="fetch" data-type="process">Fetch (process)</span>
                    <span class="btn btn-primary" draggable="true" data-name="uppercase" data-type="process">Uppercase (process)</span>
                    <span class="btn btn-primary" draggable="true" data-name="lowercase" data-type="process">Lowercase (process)</span>
                    <span class="btn btn-primary" draggable="true" data-name="cypher" data-type="sink">Cypher (sink)</span>
                    <span class="btn btn-primary" draggable="true" data-name="elastic" data-type="sink">Elastic (sink)</span>
                </div>
            </div>
            <div class="content">
                <div class="canvas" id="canvas">
                    <h4>This is the flow</h4>
                    {{~data.model.flow.children : lambda}}
                    <span class="flow-designer-lambda btn btn-primary {{=lambda.type}}" style="left: {{=lambda.position.x}}px; top: {{=lambda.position.y}}px">{{=lambda.name}}</span>
<!--                        {{~lambda.children: lambda}}-->
<!--                        <span class="flow-designer-lambda btn btn-primary" style="left: {{=lambda.position.x}}px; top: {{=lambda.position.y}}px">{{=lambda.type}}</span>-->
<!--                        {{~}}-->
                    {{~}}
                </div>
            </div>
        </div>
    `;

    constructor() {

        super();

        // schedule -> fetch -> uppercase -> cypher
        //                   -> lowercase -> sql
        //                                -> redis
        //          -> fetch -> cypher

        this.data.model = {
            flow: {
                children: []
            }
        }

    }

    handleDragEnd( e ) {

        const name = e.target.getAttribute( 'data-name' );
        const type = e.target.getAttribute( 'data-type' );

        const canvas = this.querySelector('#canvas');
        const w = e.target.offsetWidth;
        const x = e.clientX - canvas.getBoundingClientRect().left - w/2;
        const y = e.clientY - canvas.getBoundingClientRect().top;

        this.data.model.flow.children.push( new Lambda( name, type, { x, y } ) );

    }

    handleDragOver( e ) {
        e.preventDefault();
    }

    handleDragStart( e ) {
        console.log( e.type );
    }

    connectedCallback() {
        this.addEventListener( 'dragstart', this.handleDragStart.bind( this ) );
        this.addEventListener( 'dragover', this.handleDragOver.bind( this ) );
        this.addEventListener( 'dragend', this.handleDragEnd.bind( this ) );
    }

}

class Position {
    x = 0
    y = 0
}

class Lambda {

    name = null
    type = null
    position = null
    children = []

    constructor( name, type, position ) {
        this.name = name;
        this.type = type;
        this.position = position;
    }

}


customElements.define('rx-flow-designer', FlowDesigner);
