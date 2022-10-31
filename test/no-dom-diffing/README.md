# Stress testing (IIoT-gateway)

- This is a stress test of the `ReactiveHTMLElement` used for gateway dashboard.
- The test **does not** use a DOM diffing algorithm.

## Running a test

1. You will need a web server to avoid CORS issues because the test is written in vanilla JavaScript using modules. If you are using VS Code, you can install [Live Server ](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and then open `index.html` with _Live Server_ inside VS Code.
2. Once you are on the page you must first provide the inputs for three dropdowns, after that you can click **Run Test** button to observe the results in real time.
3. Every time the input of the field (e.g. entries number) is changed - the button **Run Test** has to be clicked again to apply the changes.

## What's under the hood

- Once the the required fields are selected, the custom element `<device-component>` will be injected into the DOM
- The child elements of the custom-element will be continuously removed and then re-added to the DOM as frequently as selected by the user.
- For the purpose of this test the **render time** starts with the function call that triggers the DOM update and finishes with the painting of new data.
- You can observe the **Actual renders per second** and **Average time per render** in real time. The data you see is the average of the **last 1 second**.
- If the difference between **Actual renders per second** and the render frequency selected by user is more than 5 (renders) - a ⚠️ warning will be displayed notifying of the low performance. In that case the CPU usage is maxed out and the machine cannot keep up with the selected render frequency based on the selected combination of inputs.

## License

MIT
