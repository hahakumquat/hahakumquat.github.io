var IRRIGATIONFRESH = "IRWFrTo";
var THERMOELECTRICTOTAL = "PTWtotl";
var PUBLICSUPPLYTOTAL = "PSWtotl";
var DOMESTICTOTAL = "DOTOTAL";
var INDUSTRIALTOTAL = "INWtotl";
var LIVESTOCKTOTAL = "LIWFrTo";
var MININGTOTAL = "MIWtotl";
var THERMOCIRCTOTAL = "PCWTotl";
var industries = [THERMOCIRCTOTAL, PUBLICSUPPLYTOTAL, IRRIGATIONFRESH, DOMESTICTOTAL, THERMOELECTRICTOTAL, INDUSTRIALTOTAL, LIVESTOCKTOTAL, MININGTOTAL];
var indKey = {
    "IRWFrTo" : "Irrigation (Freshwater) Withdrawals",
    "PTWtotl" : "Thermoelectric (Total) Withdrawals",
    "PSWtotl" : "Public Supply (Total) Withdrawals",
    "DOTOTAL" : "Domestic (Total) Withdrawals",
    "INWtotl" : "Industrial (Total) Withdrawals",
    "LIWFrTo" : "Livestock (Total) Withdrawals",
    "MIWtotl" : "Mining (Total) Withdrawals",
    "PCWTotl" : "Thermoelectric Circulation (Total) WIthdrawals"
};

var colorScale = d3.scale.ordinal()
    .range(["#b3e0ff", "#66c2ff", "#008ae6", "#005c99", "#003d66", "#001f33", "000000"].reverse());
var parseDate = d3.time.format("%Y").parse;
var yrs;

StackedAreaChart = function() {
    this.displayData = [];
    this.margin = margin;
}

StackedAreaChart.prototype.initVis = function() {
    var vis = this;
    
    yrs = vis.data.map(function(d) { return parseDate(d.year.toString()) });
    colorScale.domain(yrs)
    
    vis.xScale = d3.time.scale()
        .range([0, vis.width - vis.margin.left * 4])
        .domain(d3.extent(yrs, function(d) { return d }));
    
    vis.yScale = d3.scale.linear()
        .range([vis.height, vis.margin.top * 3.5]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.xScale)
        .orient("bottom")
        .ticks(5)

    vis.yAxis = d3.svg.axis()
        .scale(vis.yScale)
        .orient("left")
    
    vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(" + (vis.margin.left  * 4) + ", " + (vis.height) + ")")

    vis.svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (vis.margin.left * 4) + ", 0)");

    vis.svg.append("text")
        .attr("class", "error")
        .attr("font-size", "25px")
        .attr("transform", "translate(" + (10+vis.width/2 + vis.margin.left) + ", " + (vis.height*2/3) + ")")
        .attr("visibility", "hidden")
        .attr("text-anchor", "middle")
        .text("No Data");

    vis.svg.append("text")
        .attr("id", "region-name")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (vis.width/2+vis.margin.left) + ", " + (vis.margin.top) + ")")
        .text("");

    vis.svg.append("text")
        .attr("font-size", "11px")
        //.attr("text-anchor", "middle")
        .attr("transform", "rotate(-90), translate(" + (-vis.height+vis.margin.top/2+vis.margin.left) + ", " + (vis.margin.top) + ")")
        .text("Withdrawals (Mgal/day)");

    vis.svg.append("text")
        .attr("font-size", "11px")
        //.attr("text-anchor", "middle")
        .attr("transform", "translate(" + (vis.width/2) + ", " + (vis.height + vis.margin.bottom * 2) + ")")
        .text("Year");

    vis.svg.append("text")
        .attr("id", "region-info")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (vis.width/2+vis.margin.left) + ", " + (vis.margin.top*2) + ")")
        .text("");
    
    vis.dataCategories = colorScale.domain();

    vis.stack = d3.layout.stack()
        .values(function(d) { return d.values; })

    vis.area = d3.svg.area()
        .x(function(d) { return vis.xScale(d.x) })
        .y0(function(d) { return vis.yScale(d.y0) })
        .y1(function(d) { return vis.yScale(d.y0 + d.y) });

    vis.svg.select(".x-axis").transition().call(vis.xAxis);
    vis.svg.select(".y-axis").transition().call(vis.yAxis);
   
}

StackedAreaChart.prototype.wrangleData = function(regionData) {
    var vis = this;
    var reg = $("form.region input:radio:checked").val();
    vis.transposedData = new Array();
    for (var k = 0; k < industries.length; k++) {
        vis.transposedData.push({
            name: industries[k],
            values: []
        });
    }
    if (reg === "counties") {
        $("#region-name").html(regionData.name + " Water Consumption Breakdown");
        vis.data.forEach(function(yearData) {
            industries.forEach(function(industry, i) {
                var pair = {};
                pair.x = parseDate(yearData.year.toString());
                pair.y = yearData.states[sortedStates.indexOf(regionData.state)].counties
                    .filter(function(obj) {
                        return obj.name == regionData.name
                    });
                if (pair.y.length == 0) {
                    pair.y = +0;
                }
                else {
                    pair.y = +pair.y[0][industry];
                }
                vis.transposedData[i].values.push(pair); 
            });
        });
    }
    else {
        $("#region-name").html(states[regionData.state]);
        vis.data.forEach(function(yearData) {
            industries.forEach(function(industry, i) {
                var pair = {};
                var sum = 0;
                pair.x = parseDate(yearData.year.toString());
                yearData.states[sortedStates.indexOf(regionData.state)]
                    .counties.forEach(function(d) {
                        sum += d[industry];
                    });
                pair.y = sum;
                vis.transposedData[i].values.push(pair);
            });
        });
    }
}

StackedAreaChart.prototype.updateVis = function(regionData) {
    var vis = this;
    
    vis.wrangleData(regionData);
    vis.displayData = vis.stack(vis.transposedData);
    
    if (!vis.isEmpty(vis.displayData)) {
        vis.svg.select(".error")
            .attr("visibility", "hidden");
        
        vis.yScale.domain([0, d3.max(vis.displayData, function(d) {
	    return d3.max(d.values, function(e) {
	       return +(e.y0 + e.y);
	    });
        })
	                  ]);

        var categories = vis.svg.selectAll(".area")
            .data(vis.displayData);
        
        $("#region-info").html("");
        categories.enter().append("path")
            .attr("class", "area")
            .attr("transform", "translate(" + (vis.margin.left * 4) + ", 0)");
        
        categories
  	    .style("fill", function(d) {
  	        return colorScale(d.name);
  	    })
            .attr("d", function(d) {
	        return vis.area(d.values);
            })
            .attr("stroke", "#DDD")
            .attr("stroke-opacity", "0")
            .attr("stroke-width", "4px")
            .on("mouseover", function(d) {
                d3.select(this).transition().attr("stroke-opacity", 1);
            })
            .on("mouseout", function(d) {
                if ($("#region-info").html() !== indKey[d.name]) {
                    d3.select(this).transition().attr("stroke-opacity", 0);
                }
            })
            .on("click", function(d) {
                
                d3.selectAll(".area").transition().attr("stroke-opacity", "0");
                $("#region-info").html(indKey[d.name]);
                d3.select(this).transition().attr("stroke-opacity", "1");
            });

        categories.exit().remove();

        vis.svg.select(".x-axis").transition().call(vis.xAxis);
        vis.svg.select(".y-axis").transition().call(vis.yAxis);
    }
    else {
        $("#region-info").html("");
        var err = vis.svg.select(".error")
            .attr("visibility", "visible");
        vis.svg.selectAll(".area").remove();
    }
}

StackedAreaChart.prototype.isEmpty = function(data) {
    vis = this;
    var f = true;
    data.forEach(function(d) {
        d.values.forEach(function(val) {
            if (val.y > 0) {
                f = false;
                return false;
            }
        });
    });
    return f;
}
