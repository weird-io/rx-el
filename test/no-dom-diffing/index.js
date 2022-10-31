function runTest() {
  const content = document.querySelector('.content');
  content.innerHTML = '';

  const component = document.createElement('device-component');
  content.appendChild(component);
}

function validateUserInputs() {
  const templateOptions = document.getElementById('template');
  const renderFrequencyOptions = document.getElementById('render-frequency');
  const entriesNumberOptions = document.getElementById('entries');
  const selectedTemplateName =
    templateOptions.options[templateOptions.selectedIndex];
  const selectedRenderFrequency =
    renderFrequencyOptions.options[renderFrequencyOptions.selectedIndex];
  const selectedEntriesNumber =
    entriesNumberOptions.options[entriesNumberOptions.selectedIndex];
  const button = document.querySelector('button');

  if (
    !selectedTemplateName.disabled &&
    !selectedRenderFrequency.disabled &&
    !selectedEntriesNumber.disabled
  ) {
    button.disabled = false;
  } else button.disabled = true;
}
