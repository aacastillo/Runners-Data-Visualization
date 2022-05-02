function DefaultVisualizations() {
    //whiskerplot - const attributes = new Set(["conditions", "pace"]);
    //const attributes = new Set(["conditions"]);
    //const attributes = new Set(["mental","terrain"]);
    //categoricalAttributes quantitativeAttributes

    setDropdownValue("primary-var-dropdown", "miles")

    const attributes1 = new Set(["miles"]);
    setDropdownValue("single-vis-1-dropdown", "trend/bar")
    MakeVisualization(attributes1, "single-vis-1");

    const attributes2 = new Set(["miles", "temp"]);
    setDropdownValue("single-vis-2-dropdown", "temp")
    MakeVisualization(attributes2, "single-vis-2");

    const attributes3 = new Set(["miles", "year"]);
    setDropdownValue("single-vis-3-dropdown", "year")
    MakeVisualization(attributes3, "single-vis-3");

    const attributes4 = new Set(["miles","steps"]);
    setDropdownValue("single-vis-4-dropdown", "steps")
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