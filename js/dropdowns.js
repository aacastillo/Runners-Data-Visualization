function RenderDropdowns() {
    RenderDropdown("primary-var");
    VIDS.forEach(vis_id => RenderDropdown(vis_id))
}

function RenderDropdown(vis_id) {
    let dropdownParent = document.getElementById(vis_id+"-dropdown");
    addTrendBarOption(vis_id);
    addDivider(dropdownParent, "");
    addDivider(dropdownParent, "Categorical");
    CategoricalAttributes.forEach(att => createDropdownItem(att, dropdownParent));
    addDivider(dropdownParent, "");
    addDivider(dropdownParent, "Quantitative");
    QuantitativeAttributes.forEach(att => createDropdownItem(att, dropdownParent));
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

function addDivider(dropdownParent, text) {
    let divider = document.createElement("option");
    divider.innerHTML = text;
    divider.disabled = true;
    dropdownParent.appendChild(divider);
}

