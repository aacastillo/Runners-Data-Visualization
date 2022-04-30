window.addEventListener('load', async () => {
    //whiskerplot - const attributes = new Set(["conditions", "pace"]);
    //const attributes = new Set(["conditions"]);
    //const attributes = new Set(["mental","terrain"]);
    //categoricalAttributes quantitativeAttributes

    RenderDropdown("primary-var-dropdown");

    const attributes1 = new Set(["VO2", "VO2"]);
    RenderDropdown("single-vis-1-dropdown");
    MakeVisualization(attributes1, "single-vis-1");

    const attributes2 = new Set(["time", "heart rate"]);
    RenderDropdown("single-vis-2-dropdown");
    MakeVisualization(attributes2, "single-vis-2");

    const attributes3 = new Set(["towns",'towns']);
    RenderDropdown("single-vis-3-dropdown");
    MakeVisualization(attributes3, "single-vis-3");

    const attributes4 = new Set(["year",'month']);
    RenderDropdown("single-vis-4-dropdown");
    MakeVisualization(attributes4, "single-vis-4");

});