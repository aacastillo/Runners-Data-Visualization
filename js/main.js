window.addEventListener('load', async () => {
    RenderDropdowns();
    DefaultVisualizations()
});

/*
    Default primary variable and secondary variable selections - on page load
        Primary variable: miles
        Vis 1: Variable: date - Trend Graph
        Vis 2: Var: Pace - Scatterplot
        Vis 3: Var: Terrain - whiskerplot
        Vis 4: Var: Mental - whiskerplot

    If primary variable selected, rerender all visualization - when primary dropdown selected
        MakeAllVisualization(primary)
            for each dropdown element //4
                MakeVisualization (div_id, [primary, secondary])

        
    If secondary variable selected, render that visualization only - when elemenet of dropdown class selected
        Make Visualization for that 

    MakeVisualization(ID, [primary, secondary])
        remove old warning
        if secondary and primary are the same, then throw warning
        else make super the visualization

*/
