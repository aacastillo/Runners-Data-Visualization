//makeVisualization(attributes: {}, vis_div: str) => None
function MakeVisualization(attributes, vis_div) {
    removeOldVisualization(vis_div);

    //const data_url = 'C:/Users/dayle/OneDrive/Desktop/cs571/Runners-Data-Visualization';
    const data_url = 'https://raw.githubusercontent.com/aacastillo/Runners-Data/main/RunningData.csv';
    
    if (attributes.size === 1) {
        const [a1] = attributes;
        if (AttributeType[a1] === "categorical") return buildBarChart(a1, vis_div, data_url);
        if (AttributeType[a1] === "quantitative") return buildTrendGraph(a1, vis_div, data_url);
        console.log("ERROR: invalid attribute selected or no type found");
    } else if (attributes.size === 2) {
        const [a1, a2] = attributes;
        if (AttributeType[a1] === "categorical" && AttributeType[a2] === "categorical") return buildClusterBarChart(a1, a2, vis_div, data_url);
        if (AttributeType[a1] === "quantitative" && AttributeType[a2] === "quantitative") return buildScatterPlot(a1, a2, vis_div, data_url);
        //Note: when making a whisker plot, make sure that a1, the first attribute passed, is categorical
        if (categoricalAndQuantitative(a1, a2)) return buildWhiskerPlot(a1, a2, vis_div, data_url);
        console.log(attributes.size, attributes)
        console.log("ERROR: invalid attributes selected or no type found");
    } else {
        console.log("ERROR: Well, something broke with attribute size");
    }
}

function categoricalAndQuantitative(a1, a2) {
    if ((AttributeType[a1] === "categorical" && AttributeType[a2] ==="quantitative") || (AttributeType[a1] === "quantitative" && AttributeType[a2] ==="categorical")) {
        return true
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

function getDimensions(vis_div) {
    const main_vis = document.getElementById(vis_div);
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = main_vis.offsetWidth - margin.left - margin.right,
    height = main_vis.offsetHeight - margin.top - margin.bottom;
    return [margin, width, height];
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
        //console.log(data);
        BuildaBarChart({x:0, y:0, w:width, h:height}, data, {Xaxis: a1, Yaxis:""}, svg, "#"+vis_div);
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
            data = data.filter(function(x){
                return !(x['value'] === "")
            })

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) {return d.date; }))
                .range([ 0, width ]);
            svg.append("text")      // text label for the x axis
                .attr("x",width/2)
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

            if(Units[a1] != ''){
                a1 += ('(' + Units[a1] + ')');
            }
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(a1);
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
                .y(function(d) {return y(d.value) })
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
        BuildaClusterBarChart({x:0, y:0, w:width, h:height}, data, {Xaxis: a1, Yaxis:a2}, svg, "#"+vis_div);
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
        
        data = data.filter(function(x){
            return !(x[a1] === "" || x[a2] === '')
        })


        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, 1.05 * data.reduce((prev, current) => Math.max(prev, current[a1]), 0)])
        .range([ 0, width ]);
        //labels
        svg.append("text")      // text label for the x axis
                .attr("x",width/2)
                .attr("y",  height + margin.bottom - 10)
                .style("text-anchor", "middle")
                .text(Units.apply(a1,a1));
        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(Units.apply(a2,a2));
        //end labels
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 1.05 * data.reduce((prev, current) => Math.max(prev, current[a2]), 0)])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        //tooltips
        //tooltip from gallery
        var Tooltip = d3.select('#'+vis_div)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
    
      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        //console.log('hello?')
        var adjust = tooltipAdjust(vis_div, window.innerWidth, window.innerHeight);
        Tooltip
          .html(a1+': ' + Units.apply(a1,Math.round(d[a1] * 100) / 100) + " <br>" + a2 +': ' + Units.apply(a2,Math.round(d[a2] * 100) / 100))
          .style("left", (d3.mouse(this)[0] + adjust[0]) + "px")
          .style("top", (d3.mouse(this)[1] + adjust[1]) + "px")
          .style("opacity", 1)
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      }

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
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    })
}

//buildWhiskerPlot(a1: categorical string, a2: quantitative string) => None
function buildWhiskerPlot(a1, a2, vis_div, data_url) {
    const categorical = (AttributeType[a1] === "categorical"? a1:a2);
    const quantitative = (AttributeType[a1] === "quantitative"? a1:a2);
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
        
        data = data.filter(function(x){
            return !(x[categorical] === "" || x[quantitative] === '' || x[categorical] === undefined || x[quantitative] === undefined)
        })
        //townfix time
        var f = (n) => n;
        if(a1 === 'towns'){
            data = townFix2(data, quantitative);
            categorical = 'town';
            f = n => 'town';
        }
        //console.log(data);
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d[categorical];})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g[quantitative];}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return g[quantitative];}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return g[quantitative];}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data);
        //labels

        svg.append("text")      // text label for the x axis
                .attr("x",width/2)
                .attr("y",  height + margin.bottom - 10)
                .style("text-anchor", "middle")
                .text(categorical);
        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(Units.apply(quantitative,quantitative));
        //end of labels
        // Show the X scale
        //console.log(getDomain(data,'town'));
        //console.log(a1);
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(getDomain(data,f(categorical)))
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