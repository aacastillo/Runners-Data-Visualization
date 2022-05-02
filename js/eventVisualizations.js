function DefaultVisualizations() {
    //whiskerplot - const attributes = new Set(["conditions", "pace"]);
    //const attributes = new Set(["conditions"]);
    //const attributes = new Set(["mental","terrain"]);
    //categoricalAttributes quantitativeAttributes

    setDropdownValue("primary-var-dropdown", "pace")

    const attributes1 = new Set(["pace"]);
    setDropdownValue("single-vis-1-dropdown", "pace")
    MakeVisualization(attributes1, "single-vis-1");

    const attributes2 = new Set(["pace", "miles"]);
    setDropdownValue("single-vis-2-dropdown", "miles")
    MakeVisualization(attributes2, "single-vis-2");

    const attributes3 = new Set(["pace", "terrain"]);
    setDropdownValue("single-vis-3-dropdown", "terrain")
    MakeVisualization(attributes3, "single-vis-3");

    const attributes4 = new Set(["pace","conditions"]);
    setDropdownValue("single-vis-4-dropdown", "conditions")
    MakeVisualization(attributes4, "single-vis-4");
}

function setDropdownValue(drop_id, value) {
    document.getElementById(drop_id).value = value;
}

function EventLoadVisualization(vis_id) {
    //console.log("[TEST] in event listener function EventLoadVisualization")
    if (vis_id.includes("primary")) { //primary variable selected
        //Make visualization for all secondary variables
        console.log("[TEST] in event listener function EventLoadVisualization - PRIMARY")
        const primaryVar = document.getElementById("primary-var-dropdown").value;
        VIDS.forEach(vid => loadVisualization(primaryVar, vid));
    } else { //Secondary variable selected
        //console.log("[TEST] in event listener function EventLoadVisualization - SECONDARY")
        const primaryVar = document.getElementById("primary-var-dropdown").value;
        const secondaryVar = document.getElementById(vis_id+"-dropdown").value;
        const attributes = new Set([primaryVar, secondaryVar]);
        MakeVisualization(attributes, vis_id);
    }
}

function loadVisualization(primaryVar, vis_id) {
    const secondaryVar = document.getElementById(vis_id+"-dropdown").value;
    const attributes = new Set([primaryVar, secondaryVar]);
    MakeVisualization(attributes, vis_id);
}