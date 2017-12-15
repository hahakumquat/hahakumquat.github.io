function position(){this.style("left",function(t){return t.x+"px"}).style("top",function(t){return t.y+"px"}).style("width",function(t){return Math.max(0,t.dx-1)+"px"}).style("height",function(t){return Math.max(0,t.dy-1)+"px"})}TreeMap=function(t){var e="#tree-map";vis=this,vis.parentElement=e,vis.data=t,vis.margin=margin,vis.width=$(e).width()-vis.margin.left-vis.margin.right,vis.height=$(e).height()-vis.margin.top-vis.margin.bottom,$("#tree-map").append('<h5 align="center" id="brkdwn">State Breakdown by Industry</h5>'),vis.svg=d3.select(e).append("div").style("position","absolute").attr({width:vis.width+vis.margin.left+vis.margin.right,height:vis.height+vis.margin.top+vis.margin.bottom,"class":"svg-content"}),vis.color=d3.scale.category20c()},TreeMap.prototype.initVis=function(){var t=this;t.treemap=d3.layout.treemap().sticky(!1).size([t.width,t.height]).value(function(t){return t.size}),t.wrangleData()},TreeMap.prototype.wrangleData=function(){vis=this;var t=0;vis.data.forEach(function(e){e.states.forEach(function(e){e.id=t++}),t=0})},TreeMap.prototype.updateVis=function(t){var e=this,i=null==t.id?sortedStates.indexOf(t.state):t.id,n=e.data[$("select.year option:selected").val()],r=null;n.states.every(function(t){return t.id!=i||(r=t,!1)}),$("#brkdwn").html(states[r.state]+" Breakdown by Industry");var o=dotot=icwfrtot=igwfrtot=miwtot=pswtot=ptwtot=liwfrto=irwfrto=0;r.counties.forEach(function(t){o+=+t.AQWTotl,dotot+=+t.DOTOTAL,icwfrtot+=+t.ICWFrTo,igwfrtot+=+t.IGWFrTo,miwtot+=+t.MIWtotl,pswtot+=+t.PSWtotl,ptwtot+=+t.PTWtotl,liwfrto+=+t.LIWFrTo,irwfrto+=+t.IRWFrTo}),e.tree={name:"tree",children:[{name:"Irrigation",children:[{name:"Crops",size:icwfrtot},{name:"Golf",size:igwfrtot},{name:"Other",size:irwfrto}]},{name:"Industry",children:[{name:"Aquaculture",size:o},{name:"Mining",size:miwtot},{name:"Thermoelectric",size:ptwtot},{name:"Livestock",size:liwfrto}]},{name:"Human",children:[{name:"Domestic",size:dotot},{name:"Public Supply",size:pswtot}]}]},e.treemap.value(function(t){return t.size});var a=e.svg.selectAll(".node").data(e.treemap.nodes(e.tree));a.enter().append("div").attr("class","node"),a.transition().duration(600).call(position).style("background",function(t){return t.children?e.color(t.name):null}).text(function(t){return t.children?null:t.name}),a.exit().remove()};