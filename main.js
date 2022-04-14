/* 
    *** 
    GLOBAL VARIABLES   
    *** 
*/

const attributeType = {
    "year": "quantitative",
    "miles": "quantitative",
    "time": "quantitative",
    "pace": "quantitative",
    "cal": "quantitative",
    "steps": "quantitative",
    "heart rate": "quantitative",
    "VO2": "quantitative",
    "elev": "quantitative",
    "EPM": "quantitative",
    "TOD": "quantitative",
    "hour": "quantitative",
    "ppl": "quantitative",
    "temp": "quantitative",

    "month": "categorical",
    "season": "categorical",
    "date": "categorical",
    "day": "categorical",
    "shoes": "categorical",
    "race": "categorical",
    "towns": "categorical",
    "state": "categorical",
    "terrain": "categorical",
    "conditions": "categorical",
    "podcast": "categorical",
    "physical mood": "categorical",
    "mental mood": "categorical",
    "abs": "categorical"
}

/* 
    *** 
    EVENT LISTENERS  
    *** 
*/

window.addEventListener('load', async () => {
    const attributes = new Set(["conditions", "pace"]);
    makeVisualization(attributes)
});
// EL: On page load, default visualization mileage trend graph
// EL: On page load, load variable selection

/* 
    *** 
    FUNCTIONS 
    ***
*/

//makeVisualization(attributes: {}) => None
function makeVisualization(attributes) {
    removeOldVisualization();

    const vis_div = "#main-vis-wrapper"
    const data_url = "https://raw.githubusercontent.com/aacastillo/Runners-Data/main/RunningDataset.csv";
    if (attributes.size === 1) {
        const [a1] = attributes;
        if (attributeType[a1] === "categorical") return buildBarChart(a1, vis_div, data_url);
        if (attributeType[a1] === "quantitative") return buildTrendGraph(a1, vis_div, data_url);
        console.log("ERROR: invalid attribute selected or no type found");
    } else if (attributes.size === 2) {
        const [a1, a2] = attributes;
        if (attributes.size === 1 && attributeType[a1] === "categorical") return buildClusterBarChart(a1, a2, vis_div, data_url);
        if (attributes.size === 1 && attributeType[a1] === "quantitative") return buildScatterPlot(a1, a2, vis_div, data_url);
        //Note: when making a whisker plot, make sure that a1, the first attribute passed, is categorical
        if (attributeType[a1] === "categorical" && attributeType[a2] ==="quantitative") return buildWhiskerPlot(a1, a2, vis_div, data_url);
        console.log("ERROR: invalid attributes selected or no type found");
    } else {
        console.log("ERROR: too many attributes selected");
    }
}

//removeOldVisualization() => None
function removeOldVisualization() {
    let cur_vis_div = document.getElementById("main-vis-wrapper");
    const parent_vis_div = document.getElementById("main-vis");
    parent_vis_div.removeChild(cur_vis_div);

    let new_vis_div = document.createElement('div');
    new_vis_div.setAttribute('id', 'main-vis-wrapper');
    parent_vis_div.appendChild(new_vis_div);
}

//buildBarChart() => None
function buildBarChart() {

}

//buildTrendGraph => None
function buildTrendGraph() {

}

//buildClusterBarChart => None
function buildClusterBarChart() {

}

//buildScatterPlot => None
function buildScatterPlot() {

}

//buildWhiskerPlot(a1: categorical string, a2: quantitative string) => None
function buildWhiskerPlot(a1, a2, vis_div, data_url) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(vis_div)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Read the data and compute summary statistics for each specie
    d3.csv(data_url, function(data) {

        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.a1;})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g.a2;}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return g.a2;}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return g.a2;}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)

        // Show the X scale
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(["rainy", "snowy", "windy", "hot", "clear"])
            .paddingInner(1)
            .paddingOuter(.5)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([3,9])
            .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        // Show the main vertical line
        svg
            .selectAll("vertLines")
            .data(sumstat)
            .enter()
            .append("line")
                .attr("x1", function(d){return(x(d.key))})
                .attr("x2", function(d){return(x(d.key))})
                .attr("y1", function(d){return(y(d.value.min))})
                .attr("y2", function(d){return(y(d.value.max))})
                .attr("stroke", "black")
                .style("width", 40)

        // rectangle for the main box
        var boxWidth = 100
        svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // Show the median
        svg
            .selectAll("medianLines")
            .data(sumstat)
            .enter()
            .append("line")
                .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
                .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
                .attr("y1", function(d){return(y(d.value.median))})
                .attr("y2", function(d){return(y(d.value.median))})
                .attr("stroke", "black")
                .style("width", 80)
    })
}