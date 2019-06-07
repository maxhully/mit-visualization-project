
//////// vicky ////////

var graph; // = 0 if no histogram, 1 else

// variables for histogram set up
var margin, width, height, formatCount,
 old_maxbin, old_minbin, maxbin, minbin, 
 histogram, bins;

var xScale, yScale, xAxis, yAxis, svg, bar, rects;

function makeHist(old_csvdata, csvdata, col, var_svg_id) {

    formatCount = d3.format(",.0f");
    console.log("in makeHist function");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    console.log("old_maxbin: ", old_maxbin);
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    console.log("old_minbin", old_minbin);

    maxbin = d3.max(csvdata, function(d) { return +d[col]; });
    console.log("maxbin: ", maxbin);
    minbin = d3.min(csvdata, function(d) { return +d[col]; });
    console.log("minbin: ", minbin);
    
    margin = {top: 10, right: 30, bottom: 50, left: 100};
    width = 450 - margin.left - margin.right;
    height = 250 - margin.top - margin.bottom;
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale.domain())
    .thresholds(xScale.ticks(20)); // split into 20 bins

    svg = d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    bins = histogram(csvdata)

    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // set up the bars
    bar = svg.selectAll(".bar")
    .data(bins)
    .enter()  
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; });

    rects = bar.append("rect")
    .attr("x", 1)// move 1px to right
    .attr("width", xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
    .attr("height", function(d) { return height - yScale(d.length); }); 

  // add the x axis and x-label
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .text("Number of Splits");

      // add the y axis and y-label
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale));

    svg.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count");

    graph = true;   
  
};


function updateHist(csvdata, col, var_svg_id) {
    console.log("In updateHist function")

    maxbin = d3.max(csvdata, function(d) { return +d[col]; });
    console.log("maxbin: ", maxbin);
    minbin = d3.min(csvdata, function(d) { return +d[col]; });
    console.log("minbin: ", minbin);

    xScale = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    // yScale = d3.scaleLinear()
    // .range([height, 0]);

    var newhistogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale.domain())
    .thresholds(xScale.ticks(20)); // split into 20 bins

    var newbins = newhistogram(csvdata)

    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg = d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    bar.data(newbins)
    .transition()
    .duration(1000)
    .attr("transform", function(d) 
        { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
    .select("rect")
    .attr("x", 1)// move 1px to right
    .attr("width", xScale(newbins[0].x1) - xScale(newbins[0].x0) - 1)
    .attr("height", function(d) { return height - yScale(d.length); }); 

    d3.select(".x.axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));
    // d3.select('.x.axis')
    // .attr("transform", "translate(0," + height + ")")
    // .call(xScale);
};

// Read in .csvdata and make graphs

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

    graph = false;

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
    var filterData = this.filterData;
    var data = this.data;
    // console.log("filteredData: ", filteredData);
    // console.log("Data: ", Data);
    if (graph) {
        // if the histogram exists then update its data
        updateHist(filterData, "nb_splits", "#nb_sp");  
        // updateHist(filteredData, "nb_cuts", "#nb_cuts");
      } else {
        // otherwise create the histogram
        makeHist(data, filterData, "nb_splits", "#nb_sp");
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
    
    if (graph) {
        // if the histogram exists then update its data
        updateHist(filterData, "nb_splits", "#nb_sp");  
        updateHist(filterData, "nb_cuts", "#nb_cuts");
      } else {
        // otherwise create the histogram
        makeHist(data, filterData, "nb_splits", "#nb_sp");
        makeHist(data, filterData, "nb_cuts", "#nb_cuts");
      }
};