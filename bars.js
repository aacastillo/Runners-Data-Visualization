function buildCount (data, attr){
    let r = {};
    for(let i = 0; i < data.length; i++){
      let v = data[i][attr];
      if(r[v] >= 0){
        r[v]++
      }else{
        r[v] = 1;
      }
    }
    //console.log(r);
    let res = [];
    for(var j in r){
      res.push({val: j, count: r[j]});
    }
    //console.log(res);
    return res;
  }
  
  function buildClusterCount(data, att1, att2){
    let r = {}
    for(var i in data){
      //console.log(att1,att2);
      let v = data[i][att1];
      let x = data[i][att2];
      if(r[v] != undefined){
        r[v].total++;
        if(r[v][x] >= 0){
          r[v][x]++;
        }else{
          r[v][x] = 1;
        }
      }else{
        r[v] = {total: 1};
        r[v][x] = 1;
      }
    }
  
    var res = [];
    for(var j in r){
      var tempArr = [];
      for(var i in r[j]){
        if(i != "total"){
          tempArr.push({val: i, count: r[j][i]});
        }
      }
      res.push({val: j, att: tempArr});
    }
    return res;
  }
  
  function maxCount(d){
    let max = 0;
    for(var i in d){
      max = Math.max(max, d[i].count);
    }
    return max;
  }
  
  function maxClusterCount(d){
    var max = 0;
    for(var i in d){
      //console.log(d[i]);
      max = Math.max(max, maxCount(d[i].att))
    }
    return max;
  }
  
  function buildBarChart (loc, data, attr){
  
    let svg = d3.select('svg'); //can be deleted if global svg
    var chart = svg.append('g')
      .attr('class', 'chart')
    const margin = { left: loc.w/10, right: loc.w/10, top: loc.h/10, bottom: loc.h/10 };
    
    let att = attr.Xaxis;
    let c = buildCount(data,att);
    let dom = [];
    for(var i in c){
      dom.push(c[i].val);
    }
    maxC = maxCount(c);
  
    var w = loc.w - margin.left - margin.right;
    var h = loc.h - margin.top - margin.bottom;
    //scales
    var bandScale = d3.scaleBand()
      .domain(dom)
      .range([margin.left + loc.x, w + + loc.x])
      .paddingInner(0.05);
  
    var countScale = d3.scaleLinear()
      .domain([0, Math.round(maxC*4/3)])
      .range([0,h]);
    var countScale2 = d3.scaleLinear()
      .domain([0, Math.round(maxC*4/3)])
      .range([h+margin.top,margin.top]);
  
    const g = chart.append('g');
    //rectangles
    g.selectAll('rect')
      .data(c)
      .enter()
      .append('rect')
    .attr("fill", "blue")
      .attr('x', function(d) {
          return bandScale(d.val);
      })
    .attr('y', function(d){return h - countScale(d.count) + margin.bottom + loc.y;
    })
      .attr('width', bandScale.bandwidth())
      .attr('height', function(d) {
          return countScale(d.count);
      });
  
    //axis
    var xAxis = d3.axisBottom()
    .scale(bandScale);
    var xAxisEl = chart.append('g')
      .attr('transform', `translate(0, ${loc.h + loc.y - margin.bottom})`)
      .call(xAxis);
  
    var yAxis = d3.axisLeft().scale(countScale2)
      .ticks(4);
    var yAxisEl = chart.append('g')
    .attr('transform', 'translate(' + (margin.left + loc.x) + ',' + loc.y+ ')' )
    .call(yAxis);
  }
  
  //Clusterrrrr---------------------------------------------
  function buildClusterBarChart(loc, data, attr){
    console.log(loc.y);
    let att1 = attr.Xaxis;
    let att2 = attr.Yaxis;
    var c = buildClusterCount(data,att1,att2);
  
    let svg = d3.select('svg');//remove if global svg
    var chart = svg.append('g')
      .attr('class', 'chart');
    const margin = { left: loc.w/10, right: loc.w/10, top: loc.h/10, bottom: loc.h/10 };
    //put domains in array form
    let dom1 = [];
    for(var i in c){
      dom1.push(c[i].val);
    }
  
    let domt = {};
    for(var i in c){
      for(var j in c[i].att){
        //console.log(c[i].att[j]);
        domt[c[i].att[j].val] = 0;
      }
    }
    var dom2 = [];
    for(var i in domt){
      dom2.push(i);
    }
    
    var w = loc.w - margin.left - margin.right;
    var h = loc.h - margin.top - margin.bottom;
  
    //make scales
    var bandScale = d3.scaleBand()
      .domain(dom1)
      .range([loc.x+margin.left, loc.x+w])
      .paddingInner(0.2);
  
    var maxC = maxClusterCount(c);
    
    var countScale = d3.scaleLinear()
      .domain([0, Math.round(maxC*4/3)])
      .range([0, h]);
    var countScale2 = d3.scaleLinear()
      .domain([0, Math.round(maxC*4/3)])
      .range([h + loc.y, loc.y]);
  
    var colorScale = d3.scaleBand()
      .domain(dom2)
      .range([0, .5 + (1/dom2.length)])
  
    //bars
    const g = [];
    for(var j in c){
      g[j] = chart.append('g');
      //setup cluster scale
      var innerScale = d3.scaleBand()
      .domain(dom2)
      .range([bandScale(c[j].val),bandScale(c[j].val) + bandScale.bandwidth()])
      .paddingInner(0.005);
      //actual bars
      g[j].selectAll('rect')
        .data(c[j].att)
        .enter()
        .append('rect')
      .attr('class', d => {d.val;})
      .attr('x', function(d) {
            return innerScale(d.val);
        })
      .attr('y', function(d){return h - countScale(d.count) + margin.bottom + loc.y;
      })
        .attr('width', innerScale.bandwidth())
        .attr('height', function(d) {
            return countScale(d.count);
        })
        .attr("fill", d => {
          return d3.interpolateHslLong("red", "blue")(colorScale(d.val));
        });
    }
  
    //axis stuff
    var xAxis = d3.axisBottom()
    .scale(bandScale);
    var xAxisEl = chart.append('g')
      .attr('transform', `translate(0, ${loc.h + loc.y - margin.bottom})`)
      .call(xAxis);
    var yAxis = d3.axisLeft().scale(countScale2)
      .ticks(4);
    var yAxisEl = chart.append('g')
    .attr('transform', 'translate(' + (margin.left + loc.x) + ', '+ margin.bottom +')' )
    .call(yAxis);
  
  
    var legend = chart.append('g')
      .attr('id', 'legend');
    var l = {x:loc.x + w - w/4, y:loc.y, w:w/3, h:h/4};
    var legendScale = d3.scaleBand()
      .domain(dom2)
      .range([l.y, l.y +l.h])
      .padding(.05);
    legend.selectAll('rect')
      .data(dom2)
      .enter()
      .append('rect')
      .attr('x', d => {
        return l.x;
      })
      .attr('width', l.w/10)
      .attr('y', d => {
        return legendScale(d);
      })
      .attr('height', d => {
        return legendScale.bandwidth();
      })
      .attr("fill", d => {
          return d3.interpolateHslLong("red", "blue")(colorScale(d));
        });
    for(var i in dom2){
      legend.append('text')
      .attr('x', l.x + l.w/9)
      .attr('y', legendScale(dom2[i])+ (0.75*l.h / dom2.length))
      .attr('font-size', '9')
      .text(dom2[i]);
    }
    
  }
  