var TOTALWATER = "TOWTotl";
var TOTALSURFACE = "TOWSWTo";
var TOTALGROUND = "TOWGWTo";

var margin = { top: 20, left: 20, right: 20, bottom: 20};
var choropleth, treeMap, stackedAreaChart, twitterFeed;
var regionChanged = false;
//Basic Object constructors
queue()
    .defer(d3.json, "data/data.json")
    .defer(d3.json, "data/us-10m.json")
    .await(function(e, data, mapData) {
        var idCtr = 0;
        data.forEach(function(yr) {
            yr.states.forEach(function(d) {
                d.id = idCtr++;
            });
            idCtr = 0;
        });
        choropleth = new Choropleth(mapData);
        treeMap = new TreeMap(data);
        stackedAreaChart = new StackedAreaChart();
        twitterFeed = new TwitterFeed();
        
        genVis(choropleth, "#choropleth", data);
        //genVis(treeMap, "#tree-map", data);
        genVis(stackedAreaChart, "#stacked-area", data);
        genVis(twitterFeed, "twitter-feed", data);
        
        choropleth.initVis();
        treeMap.initVis();
        stackedAreaChart.initVis();
        twitterFeed.initVis();
    });

function genVis(obj, parentElement, d) {
    obj.parentElement = parentElement;
    obj.data = d;
    obj.margin = margin;
    obj.width = $(parentElement).width() - margin.left - margin.right;
    obj.height = $(parentElement).height() - margin.top - margin.bottom;
    obj.svg = d3.select(parentElement).append("svg")
        .attr({
            width: obj.width + margin.left + margin.right,
            height: obj.height + margin.top + margin.bottom,
	    class: "svg-content"
        });
}

function triggerUpdates(d) {
    stackedAreaChart.updateVis(d);
    treeMap.updateVis(d);
}

$(".year").change(function() {
    choropleth.updateVis();
});

$("#gw").click(function(e) {
    if (!$("#sw").is(":checked") && !$(this).is(":checked")) {
        e.preventDefault();
	e.stopPropagation();
        return false;
    }
    else choropleth.updateVis();
});

$("#sw").click(function(e) {
    if (!$("#gw").is(":checked") && !$(this).is(":checked")) {
        e.preventDefault();
	e.stopPropagation();
        return false;
    }
    else choropleth.updateVis();
});

$(".region").change(function() {
    regionChanged = true;
    choropleth.updateVis();
});

// Icon click scroll additional feature
$("#p3").prepend('<h3 name="p3">See the data for yourself</h3>');
$("#to_p2").click(function(e) {
    var url = "#" + e.target.getAttribute("name");
    $('html, body').animate({
        scrollTop: $(url).offset().top
    }, 500);
    return false;
});

$("#to_p3").click(function(e) {
    var url = "#" + e.target.getAttribute("name");
    $('html, body').animate({
        scrollTop: $(url).offset().top
    }, 500);
    return false;
});
