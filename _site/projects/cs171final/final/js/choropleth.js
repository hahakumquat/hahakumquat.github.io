var countyById = d3.map();
var stateById = d3.map();
var NUMCOLORS = 9;
// Weird order of state rendering
var mappedStates = ["WA", "ID", "MT", "ND", "MN", "ME", "MI", "WI", "OR", "SD", "NH", "VT", "NY", "WY", "IA", "NE", "MA", "IL", "PA", "CT", "RI", "CA", "UT", "NV", "OH", "IN", "NJ", "CO", "WV", "MO", "KS", "DE", "MD", "VA", "KY", "AZ", "OK", "NM", "TN", "NC", "TX", "AR", "SC", "AL", "GA", "MS", "LA", "FL", "HI", "AK"];
var sortedStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NI", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
var states = {
    "WA": "Washington",
    "ID": "Idaho",
    "MT": "Montana",
    "ND": "North Dakota",
    "MN": "Minnesota",
    "ME": "Maine",
    "MI": "Michigan",
    "WI": "Wisconsin",
    "OR": "Oregon",
    "SD": "South Dakota",
    "NH": "New Hampshire",
    "VT": "Vermont",
    "NY": "New York",
    "WY": "Wyoming",
    "IA": "Iowa",
    "NE": "Nebraska",
    "MA": "Massachusetts",
    "IL": "Illinois",
    "PA": "Pennsylvania",
    "CT": "Connecticut",
    "RI": "Rhode Island",
    "CA": "California",
    "UT": "Utah",
    "NV": "Nevada",
    "OH": "Ohio",
    "IN": "Indiana",
    "NJ": "New Jersey",
    "CO": "Colorado",
    "WV": "West Virginia",
    "MO": "Missouri",
    "KS": "Kansas",
    "DE": "Delaware",
    "MD": "Maryland",
    "VA": "Virginia",
    "KY": "Kentucky",
    "AZ": "Arizona",
    "OK": "Oklahoma",
    "NM": "New Mexico",
    "TN": "Tennessee",
    "NC": "North Carolina",
    "TX": "Texas",
    "AR": "Arkansas",
    "SC": "South Carolina",
    "AL": "Alabama",
    "GA": "Georgia",
    "MS": "Mississippi",
    "LA": "Louisiana",
    "FL": "Florida",
    "HI": "Hawaii",
    "AK": "Alaska"
};

// Creates all static information
Choropleth = function(mapData) {
    var vis = this;
    vis.mapData = mapData;
    vis.log = d3.scale.log()
        .base(2)
        .range([0, NUMCOLORS]);
    vis.linear = d3.scale.linear()
        .range([0, NUMCOLORS]);
    vis.quantize = d3.scale.quantize()
        .domain([0, NUMCOLORS])
        .range(d3.range(NUMCOLORS-1).map(function(i) {
            return colorbrewer.Blues[NUMCOLORS][i]; }));
    vis.projection = d3.geo.albersUsa()
        .scale(950)
        .translate([350, 250]);
    vis.path = d3.geo.path()
        .projection(vis.projection);
    vis.maxTotalCounty = 0;
    vis.maxGroundCounty = 0;
    vis.maxSurfaceCounty = 0;
    vis.maxTotalState = 0;
    vis.maxGroundState = 0;
    vis.maxSurfaceState = 0;
    vis.tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 10]);
}

// Creates assets to be shown on screen
Choropleth.prototype.initVis = function() {
    var vis = this;

    vis.tip.html(function(region) {
        var reg = $("form.region input:radio:checked").val();
        var obj, str;
        if (reg === "states") {
            obj = stateById.get(shift(region.id));
            str = '<p id="tips"><h5 id="tiptitle">'+states[obj.state]+"</h5>";
            if (obj.sumTotal <= 0)
                return str+"<br>No Data.";
            str += "<br>Total (Mgal/d): " + obj.sumTotal;
            str += "<br>Ground (Mgal/d): " + obj.sumGround;
            str += "<br>Surface (Mgal/d): " + obj.sumSurface;
            str += "</p>";
        }
        else {
            obj = countyById.get(region.id);
            str = '<p id="tips"><h5 id="tiptitle">'+obj.name+", "+obj.state+"</h5>";
	    if (obj[TOTALWATER] <= 0)
	        return str+"<br>No Data.";
            str += "<br>Total (Mgal/d): " + obj[TOTALWATER];
            str += "<br>Ground (Mgal/d): " + obj[TOTALGROUND];
            str += "<br>Surface (Mgal/d): " + obj[TOTALSURFACE];
            str += "</p>";
        }
        return str;
    });

    vis.svg.call(vis.tip);

    vis.leg = vis.svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (vis.width-vis.margin.left*3) + ", " + (vis.height/2) + ")")
    vis.leg
        .append("text")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Mgal/day");

    $("#choropleth").append("<h4>A Map of Water Consumption</h4><p>Take a look at water consumption by ground water and surface water across the US by cities and counties. The darker the blue, the more water is consumed in that region. As expected, water consumption is highest in places with high populations, especially in California. It is our job to tackle these high-consumptive areas to reduce the water burden.</p>")
    
    vis.updateVis();
}

function shift(i) {
    if (i > 3) i--;
    if (i > 5) i--;
    if (i > 9) i--;
    if (i > 11) i--;
    if (i > 39) i--;
    if (i > 47) i--;
    return i-1;
}

Choropleth.prototype.wrangleData = function() {
    var vis = this;
    vis.filteredData = vis.data[$("select.year option:selected").val()];
    vis.filteredData.states.forEach(function(state, i) {
	var stateSumTotal = 0;
	var stateSumGround = 0;
	var stateSumSurface = 0;
        state.counties.forEach(function(county) {
	    stateSumTotal += county[TOTALWATER];
	    stateSumGround += county[TOTALGROUND];
	    stateSumSurface += county[TOTALSURFACE];
            countyById.set(+county.fips, county);
	    if (vis.maxTotalCounty < county[TOTALWATER])
                vis.maxTotalCounty = county[TOTALWATER];
	    if (vis.maxGroundCounty < county[TOTALGROUND])
		vis.maxGroundCounty= county[TOTALGROUND];
	    if (vis.maxSurfaceCounty < county[TOTALSURFACE])
		vis.maxSurfaceCounty = county[TOTALSURFACE];
        })
        state.sumGround = Math.round(stateSumGround);
        state.sumSurface = Math.round(stateSumSurface);
        state.sumTotal = Math.round(stateSumTotal);
	stateById.set(i, state);
	if (vis.maxTotalState < stateSumTotal)
	    vis.maxTotalState = stateSumTotal;
	if (vis.maxGroundState < stateSumGround)
	    vis.maxGroundState = stateSumGround;
	if (vis.maxSurfaceState < stateSumSurface)
	    vis.maxSurfaceState = stateSumSurface;
    });
}

Choropleth.prototype.updateVis = function() {
    var vis = this;
    var reg = $("form.region input:radio:checked").val();
    vis.wrangleData();
    if (reg === "counties")
    {
        var scale = vis.log;
        if ($("form.water-type input:checkbox:checked").length == 2)
	    scale.domain([1, vis.maxTotalCounty]);
        else {
	    if ($("form.water-type input:checkbox:checked").val() == "gw")
	        scale.domain([1, vis.maxGroundCounty]);
	    else
	        scale.domain([1, vis.maxSurfaceCounty]);
        }
    }
    else {
        var scale = vis.linear;
        if ($("form.water-type input:checkbox:checked").length == 2)
	    scale.domain([1, vis.maxTotalState]);
        else {
	    if ($("form.water-type input:checkbox:checked").val() == "gw")
	        scale.domain([1, vis.maxGroundState]);
	    else
	        scale.domain([1, vis.maxSurfaceState]);
        }
    }

    vis.leg.selectAll("g").remove();
    for (var k = 1; k <= NUMCOLORS; k++) {
        gr = vis.leg//.select("g")
            //.remove()
            .append("g")
            .attr("transform", "translate(0, "+(k * 15)+")")
        gr
            //.select("rect")
            //.remove()
            .append("rect")
            .attr("width", "13px")
            .attr("height", "13px")
            .attr("stroke", "gray")
            .attr("fill", colorbrewer.Blues[NUMCOLORS][NUMCOLORS-k])

        gr
            //.select("text")
            //.remove()
            .append("text")
            .attr("fill", "black")
            .attr("text-anchor", "end")
            .attr("transform", "translate(-2, 13)")
            .text(Math.round(scale.domain()[1]/NUMCOLORS * (NUMCOLORS-k))+"+");
    }

    if (regionChanged) {
	vis.svg.selectAll(".region").remove();
	regionChanged = false;
    }
    var group = vis.svg
        .selectAll(".region")
        .data(topojson.feature(vis.mapData, vis.mapData.objects[reg]).features)

    group.enter()
	.append("g")
	.attr("class", "region")
	.append("path")
        .attr("d", vis.path)
        .style("stroke", "red")
        .style("stroke-opacity", 0)
        .style("stroke-width", 2)
        .on("mouseover", function(d,i) {
            d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                .style('stroke-opacity', 1);
            vis.tip.show(d);
        })
        .on('mouseout', function(d,i) {
            d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                .style('stroke-opacity', 0);
            vis.tip.hide(d);
        })
    //vis.tip.hide)
        .on("click", function(d) {
            if (reg === "counties") {
                triggerUpdates(countyById.get(d.id));
            }
            else {
                triggerUpdates(stateById.get(shift(d.id)));
            }
        });

    group.transition().duration(700).style("fill", function(d) {
        if (reg === "counties") {
            if (countyById.get(d.id) === undefined) {
                return "red";
            }
	    if (countyById.get(d.id)[TOTALWATER] <= 0) {
	        return "darkgray";
	    }
            return vis.quantize(scale(+countyById.get(d.id)[TOTALWATER]));
        }
        else {
            id = shift(d.id);
            if (stateById.get(id) === undefined) {
                return "red";
            }
            if (stateById.get(id).sumTotal <= 0) {
                return "darkgray";
            }
            return vis.quantize(scale(+stateById.get(id).sumTotal));
        }
    });

    group.exit()
	.remove();
}
