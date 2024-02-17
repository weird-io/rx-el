function runTest() {
    const selectedAlgorithm = document.getElementById('algorithm').value;
    const content = document.getElementById('content');
    content.innerHTML = '';
    const component = document.createElement('rx-component');

    if (selectedAlgorithm === 'no-dom-diffing') {
        component.setAttribute('no-dom-diffing', '');
    }

    content.appendChild(component);
}

function validateUserInputs() {
    const button = document.querySelector('button');
    const entriesNumberOptions = document.getElementById('entries');
    const renderFrequencyOptions = document.getElementById('render-frequency');
    const templateOptions = document.getElementById('template');
    const algorithmOptions = document.getElementById('algorithm');
    const updatingDataPortionOptions = document.getElementById('updating-data');

    const selectedEntriesNumber =
        entriesNumberOptions.options[entriesNumberOptions.selectedIndex];
    const selectedRenderFrequency =
        renderFrequencyOptions.options[renderFrequencyOptions.selectedIndex];
    const selectedTemplateName =
        templateOptions.options[templateOptions.selectedIndex];
    const selectedAlgorithm =
        algorithmOptions.options[algorithmOptions.selectedIndex];

    if (selectedAlgorithm.value === 'dom-diffing') {
        updatingDataPortionOptions.disabled = false;
    } else updatingDataPortionOptions.disabled = true;

    if (
        !selectedEntriesNumber.disabled &&
        !selectedRenderFrequency.disabled &&
        !selectedTemplateName.disabled &&
        !selectedAlgorithm.disabled
    ) {
        button.disabled = false;
    } else button.disabled = true;
}
