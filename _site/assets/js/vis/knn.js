function TopK() {
    obj = {}
    obj.items = []
    
    obj.dist = function(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
        return Math.abs(p1[0] - p2[0]);
    };
    
    obj.enqueue = function(p, mousepoint, k) {
        added = false
        d = obj.dist(mousepoint, [p[0], p[1]]);
        for (var i = 0; i < obj.items.length; i++) {
            if (obj.items[i][1] > d) {
                obj.items.splice(i, 0, [p, d]);
                added = true;
                break
            }
        }
        if (obj.items.length > k) {
            obj.items.pop();
        }
        if (!added && obj.items.length < k) {
            obj.items.push([p, d]);
        }
    }
    obj.find = function(data, mousepoint, k) {
        data.forEach(function(d) {
            obj.enqueue(d, mousepoint, k);
        });
        result = [];
        obj.items.forEach(function(i) {
            result.push(i[0]);
        });
        return result;
    }
    return obj;
}

d3.csv('/assets/data/sin-data.csv', function(err, raw_data) {
    format(raw_data);
});

function format(raw_data) {    
    extentX = d3.extent(raw_data, function(d) { return d.x });
    extentY = d3.extent(raw_data, function(d) { return d.y });
    data = raw_data.map(function(d) { return [(d['x'] - extentX[0]) / extentX[1],
                                       (d['y'] - extentY[0]) / extentY[1]]});
    vis = genVis(data);
}

function genVis(data) {
    var vis = this

    vis.k = document.getElementById("knn-slider").value;
        
    vis.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    }

    vis.width = $(".blog-container").width() / 2 - margin.left - margin.right;
    vis.height = $(".blog-container").width() / 2.5 - margin.top - margin.bottom;

    data = data.map(function(d) { return [d[0] * vis.width, d[1] * vis.height] });

    vis.svg = d3.select("#knn")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    vis.points = svg.append("g")
        .attr("class", "points")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return d[0]; })
        .attr("cy", function(d) { return d[1]; })
        .attr("r", 2)
        .style("opacity", 0.5);

    vis.hull = vis.svg.append("path")
        .attr("class", "hull")
        .style("opacity", 0.5)
        .style("fill", "red");

    vis.svg.mousemove = function(data) {
        q = TopK();
        var mousePos = d3.mouse(this.node());
        var knn = q.find(data, mousePos, vis.k);
        vis.hull.datum(d3.polygonHull(knn))
            .attr("d", function(d) { return "M" + d.join("L") + "Z" });
        points.style("fill", function(d) {
            return knn.indexOf(d) !== -1 ? "red" : null;;
        });
    }

    vis.svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill-opacity", 0)
        .on("mousemove", function() {
            vis.svg.mousemove(data);
        });

    vis.svg.append("text")
        .attr("x", vis.width / 2)
        .attr("y", vis.height)
        .text("GPA")
    vis.svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -vis.height / 2)
        .attr("y", 0)
        .text("STEM classes")

    return vis
}

document.getElementById("knn-slider").oninput = function(d) {
    vis.k = this.value;
    document.getElementById("knn-slider-label").innerHTML = this.value;
}
