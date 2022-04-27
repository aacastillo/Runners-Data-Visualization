function buildCount (data, attr){
    var mil = true;
    let r = {};
    for(let i = 0; i < data.length; i++){
      let v = data[i][attr];
      if(v === ""){
          continue;
      }
      if(r[v] >= 0){
        if(mil){
            r[v] += parseFloat(data[i].miles);
        }else{
            r[v]++
        }
      }else{
          if(mil){
                r[v] = parseFloat(data[i].miles);
          }else{
                r[v] = 1;
          }
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
    var mil = true;
    let r = {}
    for(var i in data){
      //console.log(att1,att2);
      let v = data[i][att1];
      let x = data[i][att2];
      if(v === "" || x === "" || v === undefined || x === undefined){
        continue;
      }
      if(r[v] != undefined){
        r[v].total++;
        if(r[v][x] >= 0){
            if(mil){
                r[v][x] += parseFloat(data[i].miles);
            }else{
                r[v][x]++
            }
        }else{
            if(mil){
                r[v][x] = parseFloat(data[i].miles);
          }else{
                r[v][x] = 1;
          }
        }
      }else{
        r[v] = {total: 1};
        if(mil){
            r[v][x] = parseFloat(data[i].miles);
        }else{
            r[v][x] = 1;
      }
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

  function getDimensions() {
    const main_vis = document.getElementById("main-vis-wrapper");
    var margin = {top: 50, right: 90, bottom: 50, left: 100},
    width = main_vis.offsetWidth - margin.left - margin.right,
    height = main_vis.offsetHeight - margin.top - margin.bottom;
    console.log(width, height);
    return [margin, width, height];
    }

    function swap(arr, i1, i2, idk){
        // console.log(arr);
        // console.log(arr[0]);
        if(!idk){
        var t = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = t;
        }
    }

    function catSort(att, dat, idk){
        if(!catOrder[att].ordered){
            return;
        }
        for(var i in dat){
            for(var j = 0; j < dat.length - i - 1; j++){
                if(catOrder.compare(att, dat[j].val, dat[j+1].val)>0){
                    console.log("swap in progress");
                    swap(dat, j, j+1, idk);
                }
            }
        }
    }
  //--------------------------------------------------------------------------------------------------------------
  function buildaBarChart (loc, data, attr, svg){
    //
    //
    var chart = svg.append('g')
      .attr('class', 'chart')
    /*const margin = { left: loc.w/10, right: loc.w/10, top: loc.h/10, bottom: loc.h/10 }; */
    const margin = {left:0,right:0, top:0, bottom:0};
    
    let att = attr.Xaxis;
    let c = buildCount(data,att);
    catSort(att,c, false);
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
  function buildaClusterBarChart(loc, data, attr){
    console.log(loc.y);
    let att1 = attr.Xaxis;
    let att2 = attr.Yaxis;
    var c = buildClusterCount(data,att1,att2);
    for(var i in c){
        catSort(att2, c[i].att, false);
    }
    catSort(att1, c, false);
    console.log(c);
  
    let svg = d3.select('svg');//remove if global svg
    var chart = svg.append('g')
      .attr('class', 'chart');
    //const margin = { left: loc.w/10, right: loc.w/10, top: loc.h/10, bottom: loc.h/10 };
    const margin = {left:loc.w/10,right:0, top:0, bottom:0};
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
      if(catOrder[att2].ordered){
        if(dom2.length === 0){
           continue;
        }
        for(var j = dom2.length - 1; j >= 0; j--){
            if(catOrder.compare(att2, dom2[j], dom2[j-1])<0){
               swap(dom2, j, j-1);
             }else{
                  break;
              }
        }
      }
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
  