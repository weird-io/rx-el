# Stress testing (IIoT-gateway)

-   This is a stress test of `ReactiveHTMLElement` that can be used both with dom-diffing and without it.

## Running a test

1. You will need a web server to avoid CORS issues because the test is written in vanilla JavaScript using modules. If you are using VS Code, you can install [Live Server ](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and then open `index.html` with _Live Server_ inside VS Code.
2. Once you are on the page you must first provide the inputs for all available dropdowns, after that you can click **Run Test** button to observe the results in real time. The **Portion of updating data** dropdown is available only when the dom-diffing algorithm is selected.
3. Every time a new input value is selected (e.g. entries number) - the button **Run Test** has to be clicked again to apply the changes.

## What's under the hood

-   Once the the required fields are selected, the custom element `<rx-component>` will be injected into the DOM
-   For `no-dom-diffing` algorithm: the child elements of the custom-element will be continuously removed and then re-added to the DOM as frequently as selected by the user.
-   For `dom-diffing` algorithm: the same principle applies as with `no-dom-diffing` algorithm, yet only a selected portion (25% by default) of the child elements will be updated in the DOM.
-   For the purpose of this test the **render time** starts with the function call that triggers the DOM update and finishes with the painting of new data.
-   You can observe the **Actual renders per second** and **Average time per render** in real time. The data you see is the average of the **last 1 second**.
-   If the difference between **Actual renders per second** and the render frequency selected by user is more than 5 (renders) - a ⚠️ warning will be displayed notifying of the low performance. In that case the CPU usage is maxed out and the machine cannot keep up with the selected render frequency based on the selected combination of inputs.

## License

MIT
