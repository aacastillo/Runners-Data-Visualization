
let attributeType = {
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

//makeVisualization(attributes: {}) => NULL
function makeVisualization(attributes) {
    removeOldVisualization();

    if (attributes.length === 1) {
        let a  = attributes.iterator().next();
        if (attributeType[a] === "categorical") {
            buildBarChart();
        } else if (attributeType[a] === "quantitative") {
            buildTrendGraph();
        } else {
            console.log("ERROR: invalid attribute selected or no type found");
        }
    } else if (attributes.length === 2) {
        if (attributes.length === 1 && a1 === "categorical") {
            buildClusterBarChart();
        } else if (attributes.length === 1 && a1 === "quantitative") {
            buildScatterPlot();
        } else if (attributes.has("categorical") && a_set.has("quantitative")) {
            buildWhiskerPlot();
        } else {
            console.log("ERROR: invalid attributes selected or no type found")
        }
    } else {
        console.log("ERROR: too many attributes selected");
    }
}

//removeOldVisualization
function removeOldVisualization() {
    //Remove visualization div wrapper and append a new one to the parent div, visualization layout
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

//buildWhiskerPlot => None
function buildWhiskerPlot() {

}