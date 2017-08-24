TreeMap = function(data) {
    var PA = "#tree-map";
    vis = this;
    vis.parentElement = PA;
    vis.data = data;
    vis.margin = margin;
    vis.width = $(PA).width() - vis.margin.left - vis.margin.right;
    vis.height = $(PA).height() - vis.margin.top - vis.margin.bottom;
    $("#tree-map").append('<h5 align="center" id="brkdwn">State Breakdown by Industry</h5>');
    vis.svg = d3.select(PA).append("div")
        .style("position", "absolute")
        .attr({
            width: vis.width + vis.margin.left + vis.margin.right,
            height: vis.height + vis.margin.top + vis.margin.bottom,
	    class: "svg-content"
        });
    vis.color = d3.scale.category20c();
}

TreeMap.prototype.initVis = function() {
    var vis = this;

    vis.treemap = d3.layout.treemap()
        .sticky(false)
        .size([vis.width, vis.height])
        .value(function(d) { return d.size; });
    vis.wrangleData();
}

TreeMap.prototype.wrangleData = function() {
    vis = this;
    var idCtr = 0;
    vis.data.forEach(function(yr) {
        yr.states.forEach(function(d) {
            d.id = idCtr++;
        });
        idCtr = 0;
    });
}

TreeMap.prototype.updateVis = function(d) {
    var vis = this;

    var id = (d.id == null) ? sortedStates.indexOf(d.state) : d.id;

    var yearData = vis.data[$("select.year option:selected").val()];

    var stateData = null;

    yearData.states.every(function(d){
        if(d.id == id){
            stateData = d;
            return false;
        }
        else return true;
    });

    $("#brkdwn").html(states[stateData.state] + " Breakdown by Industry");

    var aqwtot = dotot = icwfrtot = igwfrtot = miwtot = pswtot = ptwtot = liwfrto = irwfrto = 0;
    
    stateData.counties.forEach(function(d){
        aqwtot += +d.AQWTotl;
        dotot += +d.DOTOTAL;
        icwfrtot += +d.ICWFrTo;
        igwfrtot += +d.IGWFrTo;
        miwtot += +d.MIWtotl;
        pswtot += +d.PSWtotl;
        ptwtot += +d.PTWtotl;
        liwfrto += +d.LIWFrTo;
        irwfrto += +d.IRWFrTo;
    });
    
    vis.tree = {
        name: "tree",
        children: [
            {
                name: "Irrigation",
                children: [
                    {name: "Crops", size: icwfrtot},
                    {name: "Golf", size: igwfrtot},
                    {name: "Other", size: irwfrto}
                ]
            },
            {
                name: "Industry",
                children: [
                    {name: "Aquaculture", size: aqwtot},
                    {name: "Mining", size: miwtot},
                    {name: "Thermoelectric", size: ptwtot},
                    {name: "Livestock", size: liwfrto}
                ]
            },
            {
                name: "Human",
                children: [
                    {name: "Domestic", size: dotot},
                    {name: "Public Supply", size: pswtot}
                ]
            }

        ]
    }

    vis.treemap.value(function(d){
        return d.size;
    });

    var node = vis.svg.selectAll(".node")
        .data(vis.treemap.nodes(vis.tree));
    
    node
        .enter()
        .append("div")
        .attr("class", "node")

    node
        .transition()
        .duration(600)
        .call(position)
        .style("background", function(d) {
            return d.children ? vis.color(d.name) : null;
        })
        .text(function(d) { return d.children ? null : d.name; });    
    
    node.exit().remove();
}

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
