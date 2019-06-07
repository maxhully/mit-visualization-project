
//////// vicky ////////

var graph; // = 0 if no histogram, 1 else

// variables for histogram set up
var old_maxbin, old_minbin, maxbin, minbin, numbins,
binsize, binmargin, margin, width, height, old_xmin, old_xmax, xmin, xmax;

var x, x2, y, xAxis, yAxis, svg, bar;

function parser(csvdata, col) {
    csvdata.forEach(function(d, i){
        d.pMPG = +d[col];
    })
    
    // console.log("in parser function: csvdata", csvdata);
    return csvdata;
};

function makeHist(old_csvdata, csvdata, col, var_svg_id) {
    console.log("in makeHist function");
    old_maxbin = Math.ceil(d3.max(old_csvdata, function(d) { return +d[col]; }));
    console.log("old_maxbin: ", old_maxbin);
    old_minbin = Math.floor(d3.min(old_csvdata, function(d) { return +d[col]; }));
    console.log("old_minbin", old_minbin);

    maxbin = Math.ceil(d3.max(csvdata, function(d) { return +d[col]; }));
    console.log("maxbin: ", maxbin);
    minbin = Math.floor(d3.min(csvdata, function(d) { return +d[col]; }));
    console.log("minbin: ", minbin);

    numbins = 20;
    binsize = 2;
    console.log(binsize);

    binmargin = .2; 
    margin = {top: 30, right: 50, bottom: 50, left: 100};
    width = 750 - margin.left - margin.right;
    height = 450 - margin.top - margin.bottom;

    // Set the limits of the x axis
    old_xmin = old_minbin - 1;
    old_xmax = old_maxbin + 1;

    xmin = minbin - 1;
    xmax = maxbin + 1;

    var histdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
        if (i < histdata.length) {
            histdata[i] = { numfill: 0, meta: "" };
        }
    };

    // console.log("histdata BEFORE: ", histdata);

    csvdata.forEach(function(d) {
        var bin = Math.floor((d.pMPG - minbin) / binsize);
        if ((bin.toString() != "NaN") && (bin < histdata.length)) {
            histdata[bin].numfill += 1;
        }
    });
    // console.log("histdata AFTER: ", histdata);

    // This scale is for determining the widths of the histogram bars
    // Must start at 0 or else x(binsize a.k.a dx) will be negative
    x = d3.scale.linear()
    .domain([0, (old_xmax - old_xmin)])
    .range([0, width]);

    // Scale for the placement of the bars
    x2 = d3.scale.linear()
    .domain([old_xmin, old_xmax])
    .range([0, width]);

    // Make an array with the mpg values
    var values = [];
    csvdata.forEach(function(d) { values.push(d[col]); });

    // console.log("values: ", values);
    // console.log("csvdata updated: ", csvdata);

    y = d3.scale.linear()
    .domain([0, d3.max(histdata, function(d) { return d.numfill; })])
    .range([height, 0]);

    xAxis = d3.svg.axis()
    .scale(x2)
    .orient("bottom");
    var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left");


    // put the graph in the "mpg" div
    svg = d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.call(tip);

    // set up the bars
    bar = svg.selectAll(".bar")
    .data(histdata)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { 
      return "translate(" + x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; 
    });

    bar.append("rect")
    .attr("x", x(binmargin))
    .attr("width", x(binsize - 2*binmargin))
    .attr("height", function(d) { return height - y(d.numfill); });

    // add rectangles of correct size at correct location
    

    // add the x axis and x-label
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
    svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("padding-bottom", "2%")
    .text("Number of Splits");

    // add the y axis and y-label
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);
    
    svg.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count");
    // 
    graph = true;   
  
};


function updateHist(csvdata, col, var_svg_id) {
    console.log("In updateHist function")

    maxbin = Math.ceil(d3.max(csvdata, function(d) { return +d[col]; }));
    console.log("maxbin: ", maxbin);
    minbin = Math.floor(d3.min(csvdata, function(d) { return +d[col]; }));
    console.log("minbin: ", minbin);

    xmin = minbin - 1;
    xmax = maxbin + 1;

    var newhistdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
        if (i < newhistdata.length) {
            newhistdata[i] = { numfill: 0, meta: "" };
        }
    };

    // console.log("newhistdata BEFORE: ", newhistdata);

    csvdata.forEach(function(d) {
        var bin = Math.floor((d.pMPG - minbin) / binsize);
        if ((bin.toString() != "NaN") && (bin < newhistdata.length)) {
            newhistdata[bin].numfill += 1;
        }
    });
    // console.log("newhistdata AFTER: ", newhistdata);

    // This scale is for determining the widths of the histogram bars
    // Must start at 0 or else x(binsize a.k.a dx) will be negative

    // Make an array with the mpg values
    var values = [];
    csvdata.forEach(function(d) { values.push(d[col]); });

    // console.log("values: ", values);
    // console.log("csvdata updated: ", csvdata);



    // put the graph in the "mpg" div
    svg = d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    bar.data(newhistdata)
      .transition()
      .duration(1000)
      .attr("transform", function(d,i) {
          return "translate(" + x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; 
        })
      .select('rect')
      .attr('x', x(binmargin))
      .attr("width", x(binsize - 2 * binmargin))
      .attr("height", function(d) { return height - y(d.numfill); });

    // add rectangles of correct size at correct location    

    // add the x axis
    d3.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
};

// Read in .csv data and make graphs

///////////////////////////////////////////////


Range=function(_parentElement, _data, _filterData){
    this.parentElement  = _parentElement;
    this.data = _data;
    this.filterData = _filterData;

    this.default_egs_min = d3.min(this.data, function(d) { return +d.election_ATG17_egs; } );
    this.default_egs_max = d3.max(this.data, function(d) { return +d.election_ATG17_egs; } );
    // console.log("this.default_egs_min: ", this.default_egs_min);
    // console.log("this.default_egs_max: ", this.default_egs_max);

    this.filter_egs_min = d3.min(this.filterData, function(d) { return +d.election_ATG17_egs; } );
    this.filter_egs_max = d3.max(this.filterData, function(d) { return +d.election_ATG17_egs; } );

    // console.log("this.filter_egs_min: ", this.filter_egs_min);
    // console.log("this.filter_egs_max: ", this.filter_egs_max);
    
    d3.select("#filter_egs_min").attr("value", this.filter_egs_min);
    // console.log("filter min value updated on html = ", d3.select("#filter_egs_min").attr("value"));

    d3.select("#filter_egs_max").attr("value", this.filter_egs_max);
    // console.log("filter max value updated on html = ", d3.select("#filter_egs_max").attr("value"));
    

    $(function() {
        $( "#slider-range" ).slider({
            range: true,
            step: 0.001,
            min: this.default_egs_min,
            max: this.default_egs_max,
            values: [ $("#filter_egs_min").val(), $("#filter_egs_max").val()],
            slide: function( event, ui ) {
                var min_amount = ui.values[ 0 ]*100;
                min_amount = min_amount.toFixed(1);
                var max_amount = ui.values[ 1 ]*100;
                max_amount = max_amount.toFixed(1);

                $( "#amount" ).val( min_amount + "% and " + max_amount + "%");
                $("#filter_egs_min").val(ui.values[ 0 ]);
                $("#filter_egs_max").val(ui.values[ 1 ]);
            }
        });
        this.filter_egs_min = $("#filter_egs_min").val();
        this.filter_egs_max = $("#filter_egs_max").val();

        var min_amount = $( "#slider-range" ).slider( "values", 0 )*100;
        min_amount = min_amount.toFixed(2);
        var max_amount = $( "#slider-range" ).slider( "values", 1 )*100;
        max_amount = max_amount.toFixed(2);

        $( "#amount" ).val( min_amount + "%" + " and " + max_amount + "%" );
    });





    var filteredData = parser(this.filterData, "nb_splits");
    var Data = parser(this.data, "nb_splits");
    // console.log("filteredData: ", filteredData);
    // console.log("Data: ", Data);
    if (graph) {
        // if the histogram exists then update its data
        updateHist(filteredData, "nb_splits", "#nb_sp");  
        // updateHist(filteredData, "nb_cuts", "#nb_cuts");  
      } else {
        // otherwise create the histogram
        makeHist(Data, filteredData, "nb_splits", "#nb_sp");
        // makeHist(Data, filteredData, "nb_cuts", "#nb_cuts");  
      };

    this.update_range();
}



Range.prototype.update_range = function(){
    filterData = this.filterData;
    data = this.data;
    filter_egs_min = this.filter_egs_min;
    filter_egs_max = this.filter_egs_max;
    default_egs_min = this.default_egs_min;
    default_egs_max = this.default_egs_max;

    // console.log("*****\nIn update_range function");
    // console.log("filterData before filtering: ", filterData);
    

    $(function() {
        $( "#slider-range" ).slider({
            range: true,
            step: 0.001,
            min: default_egs_min,
            max: default_egs_max,
            values: [ $("#filter_egs_min").val(), $("#filter_egs_max").val()],
            slide: function( event, ui ) {
                var min_amount = ui.values[ 0 ]*100;
                min_amount = min_amount.toFixed(1);
                var max_amount = ui.values[ 1 ]*100;
                max_amount = max_amount.toFixed(1);

                $( "#amount" ).val( min_amount + "% and " + max_amount + "%");
                $("#filter_egs_min").val(ui.values[ 0 ]);
                $("#filter_egs_max").val(ui.values[ 1 ]);
            }
        });
        filter_egs_min = $("#filter_egs_min").val();
        filter_egs_max = $("#filter_egs_max").val();
        
        var min_amount = $( "#slider-range" ).slider( "values", 0 )*100;
        min_amount = min_amount.toFixed(1);
        var max_amount = $( "#slider-range" ).slider( "values", 1 )*100;
        max_amount = max_amount.toFixed(1);

        $( "#amount" ).val( min_amount + "%" + " and " + max_amount + "%" );
    });


    filterData = filterData.filter(function(d) { 
        // console.log("In filtering data function. Price max = ", price_max);
        // console.log("In filtering data function. Price min = ", price_min);
        return ((+d.election_ATG17_egs <= filter_egs_max) && (+d.election_ATG17_egs >= filter_egs_min) );
    });

    // update histograms
    console.log("In update_range function just before first parser filterData")
    var filteredData = parser(filterData, "nb_splits");
    var Data = parser(data, "nb_splits");
    console.log("In update_range function just before first parser data")
    // console.log("filteredData: ", filteredData);
    // console.log("Data: ", Data);
    
    if (graph) {
        // if the histogram exists then update its data
        updateHist(filteredData, "nb_splits", "#nb_sp");  
        // updateHist(filteredData, "nb_cuts", "#nb_cuts");
      } else {
        // otherwise create the histogram
        makeHist(Data, filteredData, "nb_splits", "#nb_sp");
        // makeHist(Data, filteredData, "nb_cuts", "#nb_cuts");
      }
};