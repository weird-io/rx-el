import * as rx from "rx-el";

class DragDrop extends rx.ReactiveHTMLElement {

    template = `
        <div class="lambda-flow-tool">
            <div class="content">
                <div class="toolbox">
                    <a class="btn btn-primary" draggable="true">Schedule (source)</a>
                    <a class="btn btn-primary" draggable="true">Fetch (process)</a>
                    <a class="btn btn-primary" draggable="true">Cypher (sink)</a>
                    <a class="btn btn-outlined btn-round run-button" id="runButton">START</a>
                </div>
            </div>
            <div class="content">
                <div class="canvas" id="canvas"></div>
            </div>
        </div>
    `;

    constructor() {
        super();
        this.data.model = {};
        this.droppedButtons = [];
        this.arrows = [];
        this.addDragAndDropListeners = this.addDragAndDropListeners.bind(this);
        this.createArrow = this.createArrow.bind(this);
        this.drawArrows = this.drawArrows.bind(this);
        this.updateArrowPosition = this.updateArrowPosition.bind(this);
    }

    connectedCallback() {
        const buttons = this.querySelectorAll('.btn');
        const canvas = this.querySelector('.canvas');
        const runButton = this.querySelector('#runButton');

        runButton.addEventListener('click', () => {
            this.drawArrows();
        });

        buttons.forEach(button => {
            button.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('isCanvas', 'false');
                e.dataTransfer.setData('buttonHTML', e.target.outerHTML);
                e.dataTransfer.setData('offsetX', e.offsetX);
                e.dataTransfer.setData('offsetY', e.offsetY);
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const isCanvas = e.dataTransfer.getData('isCanvas') === 'true';
            const offsetX = parseInt(e.dataTransfer.getData('offsetX'), 10);
            const offsetY = parseInt(e.dataTransfer.getData('offsetY'), 10);
            const dropX = e.clientX - canvas.getBoundingClientRect().left - offsetX;
            const dropY = e.clientY - canvas.getBoundingClientRect().top - offsetY;

            let droppedButton;

            if (isCanvas) {
                const buttonId = e.dataTransfer.getData('buttonId');
                droppedButton = document.getElementById(buttonId);
                droppedButton.style.left = `${dropX}px`;
                droppedButton.style.top = `${dropY}px`;
            } else {
                const buttonHTML = e.dataTransfer.getData('buttonHTML');
                const newElement = document.createElement('div');
                newElement.innerHTML = buttonHTML;
                droppedButton = newElement.firstElementChild;
                droppedButton.id = 'btn-' + Date.now();
                droppedButton.style.position = 'absolute';
                droppedButton.style.left = `${dropX}px`;
                droppedButton.style.top = `${dropY}px`;
                canvas.appendChild(droppedButton);
                this.droppedButtons.push(droppedButton);
                this.addDragAndDropListeners();
            }

            this.drawArrows();
        });
    }

    addDragAndDropListeners() {
        const canvas = this.querySelector('.canvas');
        const newButtons = canvas.querySelectorAll('.btn');
        newButtons.forEach(button => {
            button.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('isCanvas', 'true');
                e.dataTransfer.setData('buttonId', e.target.id);
                e.dataTransfer.setData('offsetX', e.offsetX);
                e.dataTransfer.setData('offsetY', e.offsetY);
            });

            button.addEventListener('dragend', (e) => {
                this.updateArrowPosition();
            });


            button.addEventListener('mousemove', (e) => {
                this.updateArrowPosition();
            });
        });
    }

    createArrow(x1, y1, x2, y2) {
        const svgNS = "http://www.w3.org/2000/svg";
        const arrow = document.createElementNS(svgNS, "svg");

        arrow.setAttribute("class", "arrow");
        arrow.setAttribute("style", "position: absolute; pointer-events: none; top: 0; left: 0;");
        arrow.setAttribute("width", "100%");
        arrow.setAttribute("height", "100%");

        const defs = document.createElementNS(svgNS, "defs");


        const gradient = document.createElementNS(svgNS, "linearGradient");
        gradient.setAttribute("id", "bubble-gradient");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "0%");

        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("style", "stop-color:#5666C4; stop-opacity:1");
        gradient.appendChild(stop1);

        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttribute("offset", "50%");
        stop2.setAttribute("style", "stop-color:#DD72F3; stop-opacity:0.6");
        gradient.appendChild(stop2);

        const stop3 = document.createElementNS(svgNS, "stop");
        stop3.setAttribute("offset", "100%");
        stop3.setAttribute("style", "stop-color:#FFE26A; stop-opacity:0.4");
        gradient.appendChild(stop3);

        defs.appendChild(gradient);


        const marker = document.createElementNS(svgNS, "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "10");
        marker.setAttribute("refX", "10");
        marker.setAttribute("refY", "3");
        marker.setAttribute("orient", "auto");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M 0,0 L 0,6 L9,3 z");
        path.setAttribute("fill", "url(#bubble-gradient)");
        marker.appendChild(path);

        defs.appendChild(marker);

        // Append defs to SVG
        arrow.appendChild(defs);

        // Line with gradient
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "url(#bubble-gradient)"); // Use gradient here
        line.setAttribute("stroke-width", "4");
        line.setAttribute("stroke-linecap", "round");

        arrow.appendChild(line);


        line.setAttribute("marker-end", "url(#arrowhead)");

        this.querySelector('.canvas').appendChild(arrow);
        this.arrows.push({ arrow, line, x1, y1, x2, y2 });
    }

    drawArrows() {
        if (this.droppedButtons.length < 2) return;

        this.querySelectorAll('.arrow').forEach(arrow => arrow.remove());
        this.arrows = [];

        for (let i = 0; i < this.droppedButtons.length - 1; i++) {
            const startButton = this.droppedButtons[i];
            const endButton = this.droppedButtons[i + 1];

            const rect1 = startButton.getBoundingClientRect();
            const rect2 = endButton.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2 - this.querySelector('.canvas').getBoundingClientRect().left;
            const y1 = rect1.top + rect1.height / 2 - this.querySelector('.canvas').getBoundingClientRect().top;
            const x2 = rect2.left + rect2.width / 2 - this.querySelector('.canvas').getBoundingClientRect().left;
            const y2 = rect2.top + rect2.height / 2 - this.querySelector('.canvas').getBoundingClientRect().top;

            this.createArrow(x1, y1, x2, y2);
        }
    }

    updateArrowPosition() {
        this.drawArrows();
    }
}

customElements.define('rx-drag-drop', DragDrop);
