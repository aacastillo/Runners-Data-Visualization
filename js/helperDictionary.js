const AttributeType = {
    "miles": "quantitative",
    "time": "quantitative",
    "pace": "quantitative",
    "calories": "quantitative",
    "steps": "quantitative",
    "heart rate": "quantitative",
    "V02 Max": "quantitative",
    "elevation": "quantitative",
    "EPM": "quantitative",
    "time of day": "quantitative",
    "hour": "quantitative",
    "people": "quantitative",
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
};

const QuantitativeAttributes = [
    "miles","time","pace","calories","steps","heart rate","VO2","elevation","EPM","time of day","hour","people","temp"
];

const CategoricalAttributes = [
    "year","month","season","date","day","shoes","race","towns","state","terrain","conditions","podcast","physical","mental","abs"
];

const CatOrder = {
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
                sun:1, mon:2, tue:3, wen:4, thu:5, fri:6, sat:7
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

const Units = {
    "miles": "",
    "time": "",
    "pace": "min/mile",
    "cal": "",
    "steps": "",
    "heart rate": "bpm",
    "V02 Max": "mL/kg/min",
    "elev": "",
    "EPM": "elev/mile",
    "TOD": "",
    "hour": "",
    "people": "",
    "temp": "degrees F",
    "apply": function(att, str){
        if(AttributeType[att] === 'qualitative' || this[att] === ''){
            return str;
        }
        return str + '(' + this[att] + ')';
    }
};

function strFix(n){
    //console.log(typeof(n));
    if(typeof(n) === 'string'){
        return parseFloat(n);
    }
    else{ return n;}
}

function getDomain(data, att){
    var r = []
    for(var i in data){
        if(!r.includes(data[i][att])){
            r.push(data[i][att])
        }
    }
    if(CatOrder[att].ordered === true){
            for(var i = 0; i < r.length; i++){ 
              for(var j = 0; j < ( r.length - i -1 ); j++){
                if(CatOrder.compare(att,r[j],r[j+1]) > 0){
                  swap(r,j+1,j);
                }
              }
            }
    }
    return r;
}