function RenderDropdowns() {
    RenderDropdown("primary-var");
    VIDS.forEach(vis_id => RenderDropdown(vis_id))
}

function RenderDropdown(vis_id) {
    let dropdownParent = document.getElementById(vis_id+"-dropdown");
    QuantitativeAttributes.forEach(att => createDropdownItem(att, dropdownParent));
    addDivider(dropdownParent);
    CategoricalAttributes.forEach(att => createDropdownItem(att, dropdownParent));
    dropdownParent.addEventListener('change', function() {EventLoadVisualization(vis_id)});
}

function createDropdownItem(attribute, dropdownParent) {
    let option = document.createElement("option");
    option.setAttribute("value", attribute)
    option.innerHTML = attribute.toUpperCase();
    dropdownParent.appendChild(option);
}

function addDivider(dropdownParent) {
    let divider = document.createElement("option");
    divider.disabled = true;
    let hr = document.createElement("hr");
    hr.classList.add("dropdown-divider");
    divider.appendChild(hr);
    dropdownParent.appendChild(divider);
}

