function RenderDropdowns() {
    RenderDropdown("primary-var");
    VIDS.forEach(vis_id => RenderDropdown(vis_id))
}

function RenderDropdown(vis_id) {
    let dropdownParent = document.getElementById(vis_id+"-dropdown");
    addTrendBarOption(vis_id);
    QuantitativeAttributes.forEach(att => createDropdownItem(att, dropdownParent));
    addDivider(dropdownParent);
    CategoricalAttributes.forEach(att => createDropdownItem(att, dropdownParent));
    dropdownParent.addEventListener('change', function() {EventLoadVisualization(vis_id)});
}

function addTrendBarOption(vis_id) {
    if(!vis_id.includes("primary")) {
        let dropdownParent = document.getElementById(vis_id+"-dropdown");
        let option = document.createElement("option");
        option.setAttribute("value", "trend/bar")
        option.innerHTML = "trend/bar".toUpperCase();
        dropdownParent.appendChild(option);
    }
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

