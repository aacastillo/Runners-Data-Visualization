/* 
    *** 
    GLOBAL VARIABLES   
    *** 
*/

const attributeType = {
    
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

    "year": "categorical",
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
    "physical": "categorical",
    "mental": "categorical",
    "abs": "categorical"
}


const catOrder = {
    "year": {"ordered": true,
              "order" : {
                  '2019': 1, '2020': 2, '2021': 3, '2022' : 4
              }},
    "month": {"ordered": true,
              "order" : {
                  jan: 1, feb: 2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9,
                  oct:10, nov:11, dec:12
              }},
    "season": {"ordered": true,
                "order": {
                    spring:1, summer:2, fall:3, winter:4
                }},
    "day": {"ordered": true,
            "order": {
                'sun':1, 'mon':2, 'tue':3, 'wen':4, 'thu':5, 'fri':6, 'sat':7
            }},
    "shoes": {"ordered": false},
    "race": {"ordered": true,
             "order": {
                 n:1, y:2
             }},
    "towns": {"ordered": false},
    "state": {"ordered": false},
    "terrain": {"ordered": false},
    "conditions": {"ordered": false},
    "shoes": {"ordered": false},
    "physical": {"ordered": true,
            "order": {
                terrible:1, bad:2, ok:3, good:4, amazing:5
            }},
    "mental": {"ordered": true,
            "order": {
                terrible:1, bad:2, ok:3, good:4, amazing:5
            }},
    "abs": {"ordered": false},
    "podcast": {"ordered": false},

    //function for easy comparing
    //all inputs are strings
    //returns - if v1 before v2, + if after, 0 if the same
    compare: function (att, v1, v2){
        if(!this[att].ordered){
            return undefined;
        }
        return this[att].order[v1]-this[att].order[v2];
    }
};

const units = {
    "miles": "mi",
    "time": "",
    "pace": "min/mile",
    "cal": "",
    "steps": "",
    "heart rate": "bpm",
    "VO2": "mL/kg/min",
    "elev": "",
    "EPM": "elev/mile",
    "TOD": "",
    "hour": "",
    "ppl": "",
    "temp": "degrees F",
};


/* 
    *** 
    EVENT LISTENERS  
    *** 
*/

window.addEventListener('load', async () => {
    //whiskerplot - const attributes = new Set(["conditions", "pace"]);
    //const attributes = new Set(["conditions"]);
    //const attributes = new Set(["mental","terrain"]);


    //

    const attributes1 = new Set(["conditions", "pace"]);
    makeVisualization(attributes1, "single-vis-1");

    const attributes2 = new Set(["miles", "pace"]);
    makeVisualization(attributes2, "single-vis-2");

    const attributes3 = new Set(["pace"]);
    makeVisualization(attributes3, "single-vis-3");

    const attributes4 = new Set(["mental","terrain"]);
    makeVisualization(attributes4, "single-vis-4");


});

/* 
    *** 
    FUNCTIONS 
    ***
*/

//makeVisualization(attributes: {}, vis_div: str) => None
function makeVisualization(attributes, vis_div) {

    removeOldVisualization(vis_div);

    //const data_url = 'C:/Users/dayle/OneDrive/Desktop/cs571/Runners-Data-Visualization';
    const data_url = 'https://raw.githubusercontent.com/aacastillo/Runners-Data/main/RunningData.csv';
    
    if (attributes.size === 1) {
        const [a1] = attributes;
        if (attributeType[a1] === "categorical") return buildBarChart(a1, vis_div, data_url);
        if (attributeType[a1] === "quantitative") return buildTrendGraph(a1, vis_div, data_url);
        console.log("ERROR: invalid attribute selected or no type found");
    } else if (attributes.size === 2) {
        const [a1, a2] = attributes;
        if (attributeType[a1] === "categorical" && attributeType[a2] === "categorical") return buildClusterBarChart(a1, a2, vis_div, data_url);
        if (attributeType[a1] === "quantitative" && attributeType[a2] === "quantitative") return buildScatterPlot(a1, a2, vis_div, data_url);
        //Note: when making a whisker plot, make sure that a1, the first attribute passed, is categorical
        if (attributeType[a1] === "categorical" && attributeType[a2] ==="quantitative") return buildWhiskerPlot(a1, a2, vis_div, data_url);
        console.log("ERROR: invalid attributes selected or no type found");
    } else {
        console.log("ERROR: too many attributes selected");
    }
}

//removeOldVisualization() => None
function removeOldVisualization(vis_div) {
    let cur_vis_div = document.getElementById(vis_div);
    const parent_vis_div = document.getElementById(vis_div+"-wrapper");
    parent_vis_div.removeChild(cur_vis_div);

    let new_vis_div = document.createElement('div');
    new_vis_div.setAttribute('id', vis_div);
    new_vis_div.classList.add("vis");
    parent_vis_div.appendChild(new_vis_div);
}

//buildBarChart() => None
function buildBarChart(a1, vis_div, data_url) {
    const [margin, width, height] = getDimensions(vis_div);
    var svg = d3.select("#"+vis_div)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(data_url, function(data){
        buildaBarChart({x:0, y:0, w:width, h:height}, data, {Xaxis: a1, Yaxis:""}, svg);
    })
}

//buildTrendGraph => None
function buildTrendGraph(a1, vis_div, data_url) {
    // set the dimensions and margins of the graph
    const [margin, width, height] = getDimensions(vis_div);

    // append the svg object to the body of the page
    var svg = d3.select("#"+vis_div)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv(data_url, 

        // format variables
        function(d){
            return { date : d3.timeParse("%Y/%m/%d")(d.year + "/" + d.date), value : d[a1] }
          },
        function(data) {
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) {return d.date; }))
                .range([ 0, width ]);
            svg.append("text")      // text label for the x axis
                .attr("x", 265 )
                .attr("y",  height + margin.bottom)
                .style("text-anchor", "middle")
                .text("Date");
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.value; })])
                .range([ height, 0 ]);
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(a1 + "(min/mile)");
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add the line
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
        }
    )
}

//buildClusterBarChart => None
function buildClusterBarChart(a1, a2, vis_div, data_url) {
    const [margin, width, height] = getDimensions(vis_div);
    var svg = d3.select("#"+vis_div)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    d3.csv(data_url, function(data){
        buildaClusterBarChart({x:0, y:0, w:width, h:height}, data, {Xaxis: a1, Yaxis:a2}, svg);
    })
}

//buildScatterPlot => None
function buildScatterPlot(a1, a2, vis_div, data_url) {
    // set the dimensions and margins of the graph
    const [margin, width, height] = getDimensions(vis_div);

    // append the svg object to the body of the page
    var svg = d3.select("#" + vis_div)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv(data_url, function(data) {

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1.05 * data.reduce((prev, current) => Math.max(prev, current[a1]), 0)])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 1.05 * data.reduce((prev, current) => Math.max(prev, current[a2]), 0)])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return x(d[a1]); } )
            .attr("cy", function (d) { return y(d[a2]); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")

    })
}

//buildWhiskerPlot(a1: categorical string, a2: quantitative string) => None
function buildWhiskerPlot(a1, a2, vis_div, data_url) {
    // set the dimensions and margins of the graph
    const [margin, width, height] = getDimensions(vis_div);

    // append the svg object to the body of the page
    var svg = d3.select("#"+vis_div)
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
        .key(function(d) { return d[a1];})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g[a2];}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return g[a2];}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return g[a2];}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)

        // Show the X scale
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(["rainy", "snowy", "windy", "clear", "cloudy", "foggy", "humid", "indoors", "partly cloudy", "sunny"])
            .paddingInner(1)
            .paddingOuter(.5)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([7,13])
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
        var boxWidth = 20
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

function getDimensions(vis_div) {
    const main_vis = document.getElementById(vis_div);
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = main_vis.offsetWidth - margin.left - margin.right,
    height = main_vis.offsetHeight - margin.top - margin.bottom;
    return [margin, width, height];
}