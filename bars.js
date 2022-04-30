function buildCount (data, attr){
    var mil = true;
    let r = {};
    if(attr === 'towns'){
      data = townFix(data, 'year');
      attr = 'town';
    }
    console.log(data,attr);
    for(let i = 0; i < data.length; i++){
      let v = data[i][attr];
      if(v === "" || v === undefined){
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
    console.log(res);
    return res;
  }
  
  function buildClusterCount(data, att1, att2){
    var mil = true;
    let r = {}
    if(att1 === 'towns'){
      data = townFix(data, att2);
      att1 = 'town';
    }
    if(att2 === 'towns'){
      data = townFix(data, att1);
      att2 = 'town';
    }
    for(var i in data){
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

  function hasChar(str, c){
    for(var i in str){
      if(str[i] === c){
        return true;
      }
    }
    return false;
  }

  //returns [{town:Hadley}, ...]
  function townFix(d, att2){
    console.log(d.length);
    var r = [];
    for(var i in d){
      var twn = d[i].towns;
      if(twn != '' ){
        //console.log(i);
        if(!hasChar(twn,',')){
        r[r.push({'town': twn, 'miles': d[i].miles}) - 1][att2] = d[i][att2];
      }else{

      var cur = "";
      for(var j in twn){
        if(twn[j] === ','){
          //console.log(i,cur);
          r[r.push({'town': cur, 'miles': d[i].miles}) - 1][att2] = d[i][att2];;
          cur = '';
        }else if(twn[j] != ' '){
          cur += twn[j];
        }
      }

    }
    }
    }
    return r;
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
    console.log(dat);
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
    console.log(c);
    catSort(att,c);
    //console.log(c);
    let dom = [];
    for(var i in c){
      dom.push(c[i].val);
    }
    maxC = maxCount(c);
    if(dom.length > 15){
      margin.bottom = loc.h/8;
    }

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


    var div = d3.select("svg").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


    //rectangles
    g.selectAll('rect')
      .data(c)
      .enter()
      .append('rect')
    .attr("fill", "#69b3a2")
      .attr('x', function(d) {
          return bandScale(d.val);
      })
    .attr('y', function(d){console.log('here',d.count); return h - countScale(d.count) - 0*margin.bottom + loc.y;
    })
      .attr('width', bandScale.bandwidth())
      .attr('height', function(d) {
          return countScale(d.count);
      })
      .on("mouseover", function(d) {
          //console.log("hoverrr");		

          d3.select(this).attr('fill', 'lightgray');

        	g.append('g').attr('id', 'bar-tooltip').append('rect')
          .attr("x", bandScale(c[0].val) + 2)
          .attr('y', margin.top + loc.y)
          .attr('width', w/4+20)
          .attr('height', h/5)
          .attr('fill', 'lightgray');
          d3.select('#bar-tooltip')
          .append('text').text("Miles run where")
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 10)
          .attr('font-size', '8');
          if(att === 'towns'){
            att = 'town';
          }
          d3.select('#bar-tooltip')
          .append('text').text(att + " is " + d.val + ": ")
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 20)
          .attr('font-size', '8');
          d3.select('#bar-tooltip')
          .append('text').text(Math.round(d.count * 100) / 100)
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 30)
          .attr('font-size', '8')
          
          //.attr('cols', '10');
          //console.log(d);
        })
        .on('mouseout', function(d){
          //console.log('out');
          d3.select(this).attr('fill', '#69b3a2');
          d3.select('#bar-tooltip').remove();
        })
      ;
  
    //axis
    var xAxis = d3.axisBottom()
    .scale(bandScale);
    var xAxisEl = chart.append('g')
      .attr('transform', `translate(0, ${loc.h + loc.y - margin.bottom})`)
      .call(xAxis)
      ;
     if(dom.length > 11 && att != 'month'){
      xAxisEl.selectAll('text')
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start")
      .style('font-size', 5);
     } 
  
    var yAxis = d3.axisLeft().scale(countScale2)
      .ticks(4);
    var yAxisEl = chart.append('g')
    .attr('transform', 'translate(' + (margin.left + loc.x) + ',' + loc.y+ ')' )
    .call(yAxis);

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -10)
    .attr('x', 0)
    .text("Miles");
    var labeloffset = 35;
    if(dom.length > 11 && att != 'month'){
      labeloffset = 50;
    }
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("y", h+labeloffset)
    .attr('x', w/2)
    .text(att);
  }
  
  //Clusterrrrr---------------------------------------------
  function buildaClusterBarChart(loc, data, attr,svg){
    console.log(loc.y);
    let att1 = attr.Xaxis;
    let att2 = attr.Yaxis;
    var c = buildClusterCount(data,att1,att2);
    for(var i in c){
        catSort(att2, c[i].att);
    }
    catSort(att1, c, false);
    //console.log(c);
    // if(att2 === 'towns'){
    //   att2 = 'town';
    // }
    var chart = svg.append('g')
      .attr('class', 'chart');
    //const margin = { left: loc.w/10, right: loc.w/10, top: loc.h/10, bottom: loc.h/10 };
    const margin = {left:0,right:loc.w/15, top:0, bottom:0};
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
    if(dom1.length > 15){
      margin.bottom = loc.h/8;
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
      .domain([0, Math.round(maxC*3/2)])
      .range([0, h]);
    var countScale2 = d3.scaleLinear()
      .domain([0, Math.round(maxC*3/2)])
      .range([h+margin.top,margin.top]);

    var colorScaleMax = 1;
    if(att2 != 'town'){
    if(catOrder[att2].ordered){
        colorScaleMax = .5 + (1/dom2.length);
    }
    }
    var colorScale = d3.scaleBand()
      .domain(dom2)
      .range([0, colorScaleMax]);

    
        colorScale2 = function(index){
            if(att2 !='town' && catOrder[att2].ordered){
                return colorScale(dom2[index]);
            }
            var l = dom2.length;
            var ind = index;
            if(l%2 === 1){
                l--;
            }
            if(l%4 === 0){
                if(index%2 === 1){
                    ind = ((index + l/2)%l);
                }
            }else{
                if((index < l/2 && index % 2 === 0) || (index >= l/2 && index % 2 === 1)){
                    ind = ((index + l/2)%l);
                }
            }
            return colorScale(dom2[ind]);
        }

        

        // colorScale2 = function(index){
        //   if(catOrder[att2].ordered){
        //     return colorScale(dom2[index]);
        //   }
        //   var arr = [];
        //   var l = dom2.length;
        //   var odd = false;
        //   if(l%2 === 1){
        //     l--;
        //     odd = true;
        //   }
        //   console.log(l);
        //   for(var i = 0; i < l; i++){
        //     console.log(i);
        //     if(i < l/2 -1){
        //       arr.push(2*i + 1);
        //     }else if(i > l/2){
        //       arr.push(2*i - l);
        //     }else if(i === l/2 - 1){
        //       arr.push(l - 1);
        //     }else{
        //       arr.push(0);
        //     }
        //   }
        //   if(odd){
        //     arr.push(l)
        //   }
        //   console.log(arr);
        //   function f(n){
        //     return arr[n];
        //   }
        //   return colorScale(dom2[f(index)]);
        // }

  
    //bars
    const g = [];
    for(var j in c){
      g[j] = chart.append('g');
      const f = j;
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
      .attr('y', function(d){return h - countScale(d.count) + 0*margin.bottom + loc.y;
      })
        .attr('width', innerScale.bandwidth())
        .attr('height', function(d) {
            return countScale(d.count);
        })
        .attr("fill", d => {
          return d3.interpolateHslLong("#69b3a2", "blue")(colorScale2(dom2.indexOf(d.val)));
        })
        .on("mouseover", function(d) {
          //console.log("hoverrr");		

          d3.select(this).attr('fill', 'lightgray');

        	g[0].append('g').attr('id', 'bar-tooltip').append('rect')
          .attr("x", bandScale(c[0].val) + 2)
          .attr('y', margin.top + loc.y)
          .attr('width', w/3 + 15)
          .attr('height', h/4)
          .attr('fill', 'lightgray');
          //text
          d3.select('#bar-tooltip')
          .append('text').text("Miles run where")
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 10)
          .attr('font-size', '8');
          if(att1 === 'towns'){
            att1 = 'town';
          }
          if(att2 === 'towns'){
            att2 = 'town';
          }

          d3.select('#bar-tooltip')
          .append('text').text(att1 + " is " + c[f].val)
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 20)
          .attr('font-size', '8');
          d3.select('#bar-tooltip')
          .append('text').text("and " + att2 + " is " + d.val + ": ")
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 30)
          .attr('font-size', '8');
          d3.select('#bar-tooltip')
          .append('text').text(Math.round(d.count * 100) / 100)
          .attr('x', bandScale(c[0].val) + 10)
          .attr('y', margin.top + loc.y + 40)
          .attr('font-size', '8')
          
          //.attr('cols', '10');
          //console.log(d);
        })
        .on('mouseout', function(d){
          //console.log('out');
          d3.select(this).attr('fill', d => {
            return d3.interpolateHslLong("#69b3a2", "blue")(colorScale2(dom2.indexOf(d.val)));
          });
          d3.select('#bar-tooltip').remove();
        });
    }
  
    //axis stuff
    var xAxis = d3.axisBottom()
    .scale(bandScale);
    var xAxisEl = chart.append('g')
      .attr('transform', `translate(0, ${loc.h + loc.y - margin.bottom})`)
      .call(xAxis);
      if(dom1.length > 11 && att1 != 'month'){
        xAxisEl.selectAll('text')
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .style('font-size', 5);
       } 
    var yAxis = d3.axisLeft().scale(countScale2)
      .ticks(4);
      var yAxisEl = chart.append('g')
      .attr('transform', 'translate(' + (margin.left + loc.x) + ',' + loc.y+ ')' )
      .call(yAxis);
  
    // loc = {x:0, y:0, w:width, h:height}
    // var w = loc.w - margin.left - margin.right;
    // var h = loc.h - margin.top - margin.bottom;

    var legend = chart.append('g')
      .attr('id', 'legend');
    var l = {x:loc.x + w + w/100, y:loc.y, w:w/3, h:(h/40)*dom2.length};
    if(dom2.length < 25){l.h = l.h*2;}
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
          return d3.interpolateHslLong("#69b3a2", "blue")(colorScale2(dom2.indexOf(d)));
        });
      var font = 7;
    if(dom2.length > 25){
      font = 5;
    }
    for(var i in dom2){
      legend.append('text')
      .attr('x', l.x + l.w/9)
      .attr('y', legendScale(dom2[i])+ (0.75*l.h / dom2.length))
      .attr('font-size', font)
      .text(dom2[i]);
    }
    var labeloffset = 35;
    if(dom1.length > 11 && att1 != 'month'){
      labeloffset = 48;
    }

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -10)
    .attr('x', 0)
    .text("Miles");
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("y", h+labeloffset)
    .attr('x', w/2)
    .text(att1);
    
  }
  