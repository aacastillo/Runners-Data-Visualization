{/* <select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select> */}

// quantAttr, categAttr = [], make sure to make it render all attributetype keys and skip over variables that are already selected
// Might have to store items as tuple of (index, attribute) to insert back into list
function RenderDropdown(div_id) {
    let dropdownMenu = document.createElement("select");
    dropdownMenu.classList.add("form-select");

    setDropdownName(div_id, dropdownMenu);
    QuantitativeAttributes.forEach(att => createDropdownItem(att, dropdownMenu));
    addDivider(dropdownMenu);
    CategoricalAttributes.forEach(att => createDropdownItem(att, dropdownMenu));

    let dropdownParent = document.getElementById(div_id);
    dropdownParent.appendChild(dropdownMenu);
}

function setDropdownName(div_id, dropdownMenu) {
    let selectOption = document.createElement("option");
    selectOption.selected = true;
    selectOption.innerHTML = (div_id.includes("single") ?  "Select Variable" :  "Primary Variable");
    dropdownMenu.appendChild(selectOption)
}

function createDropdownItem(attribute, dropdownMenu) {
    let option = document.createElement("option");
    option.setAttribute("value", attribute)
    option.innerHTML = attribute.toUpperCase();
    dropdownMenu.appendChild(option);
}

function addDivider(dropdownMenu) {
    let divider = document.createElement("option");
    let hr = document.createElement("hr");
    hr.classList.add("dropdown-divider");
    divider.appendChild(hr);
    dropdownMenu.appendChild(divider);
}

