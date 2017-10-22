////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var screenWidth = $(window).innerWidth(), 
	mobileScreen = (screenWidth > 500 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
//How many pixels should the two halves be pulled apart
var pullOutSize = (mobileScreen? 20 : 50)

//////////////////////////////////////////////////////
//////////////////// Titles on top ///////////////////
//////////////////////////////////////////////////////

var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
	titleOffset = mobileScreen ? 15 : 40,
	titleSeparate = mobileScreen ? 30 : 0;

//Title	top left
titleWrapper.append("text")
	.attr("class","title left")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left - outerRadius - titleSeparate))
	.attr("y", titleOffset)
	.text("Continentes");
titleWrapper.append("line")
	.attr("class","titleLine left")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6)
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4)
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
//Title top right
titleWrapper.append("text")
	.attr("class","title right")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left + outerRadius + titleSeparate))
	.attr("y", titleOffset)
	.text("Categoría Deportes");
titleWrapper.append("line")
	.attr("class","titleLine right")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6 + 2*(outerRadius + titleSeparate))
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4 + 2*(outerRadius + titleSeparate))
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
	
////////////////////////////////////////////////////////////
/////////////////// Animated gradient //////////////////////
////////////////////////////////////////////////////////////

var defs = wrapper.append("defs");
var linearGradient = defs.append("linearGradient")
	.attr("id","animatedGradient")
	.attr("x1","0%")
	.attr("y1","0%")
	.attr("x2","100%")
	.attr("y2","0")
	.attr("spreadMethod", "reflect");

linearGradient.append("animate")
	.attr("attributeName","x1")
	.attr("values","0%;100%")
//	.attr("from","0%")
//	.attr("to","100%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("animate")
	.attr("attributeName","x2")
	.attr("values","100%;200%")
//	.attr("from","100%")
//	.attr("to","200%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("stop")
	.attr("offset","5%")
	//.attr("stop-color","#E8E8E8");
	.attr("stop-color","#FCCFCE");
linearGradient.append("stop")
	.attr("offset","45%")
	//.attr("stop-color","#A3A3A3");
	.attr("stop-color","#FD9593");
linearGradient.append("stop")
	.attr("offset","55%")
	//.attr("stop-color","#A3A3A3");
	.attr("stop-color","#FD9593");
linearGradient.append("stop")
	.attr("offset","95%")
	//.attr("stop-color","#E8E8E8");
	.attr("stop-color","#FCCFCE");
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["CAT A","CAT B","CAT C","CAT D","CAT E",""
		    ,"AFRICA","ASIA","EUROPA","OTROS","NORTEAMERICA","OCEANIA","SURAMERICA",""];

var respondents = 2025, //Total number of respondents (i.e. the number that make up the total group
	emptyPerc = 0.5, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [
[0,0,0,0,0,0,31,145,176,0,228,40,7,0],
[0,0,0,0,0,0,20,25,308,0,139,23,38,0],
[0,0,0,0,0,0,3,148,79,2,33,5,12,0],
[0,0,0,0,0,0,8,90,353,0,59,24,27,0],
[0,0,0,0,0,0,13,3,17,0,14,39,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
[31,20,3,8,13,0,0,0,0,0,0,0,0,0],
[145,25,148,90,3,0,0,0,0,0,0,0,0,0],
[176,308,79,353,17,0,0,0,0,0,0,0,0,0],
[0,0,2,0,0,0,0,0,0,0,0,0,0,0],
[221,101,21,32,14,0,0,0,0,0,0,0,0,0],
[40,23,5,24,39,0,0,0,0,0,0,0,0,0],
[7,38,12,27,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0]
			  ];

var MatrixMedallasAtletas = {
"CAT A-AFRICA": {"medallas":"31", "atletas":"459", "indice":"6,75%"},
"CAT A-ASIA": {"medallas":"145", "atletas":"769", "indice":"18,86%"},
"CAT A-EUROPA": {"medallas":"176", "atletas":"1677", "indice":"10,49%"},
"CAT A-OTROS": {"medallas":"0", "atletas":"2", "indice":"0,00%"},
"CAT A-NORTEAMERICA": {"medallas":"228", "atletas":"662", "indice":"34,44%"},
"CAT A-OCEANIA": {"medallas":"40", "atletas":"214", "indice":"18,69%"},
"CAT A-SURAMERICA": {"medallas":"7", "atletas":"341", "indice":"2,05%"},
"CAT B-AFRICA": {"medallas":"20", "atletas":"212", "indice":"9,43%"},
"CAT B-ASIA": {"medallas":"25", "atletas":"367", "indice":"6,81%"},
"CAT B-EUROPA": {"medallas":"308", "atletas":"1082", "indice":"28,47%"},
"CAT B-OTROS": {"medallas":"0", "atletas":"0", "indice":"0,00%"},
"CAT B-NORTEAMERICA": {"medallas":"139", "atletas":"368", "indice":"37,77%"},
"CAT B-OCEANIA": {"medallas":"23", "atletas":"219", "indice":"10,50%"},
"CAT B-SURAMERICA": {"medallas":"38", "atletas":"303", "indice":"12,54%"},
"CAT C-AFRICA": {"medallas":"3", "atletas":"155", "indice":"1,94%"},
"CAT C-ASIA": {"medallas":"148", "atletas":"629", "indice":"23,53%"},
"CAT C-EUROPA": {"medallas":"79", "atletas":"626", "indice":"12,62%"},
"CAT C-OTROS": {"medallas":"2", "atletas":"6", "indice":"33,33%"},
"CAT C-NORTEAMERICA": {"medallas":"33", "atletas":"167", "indice":"19,76%"},
"CAT C-OCEANIA": {"medallas":"5", "atletas":"78", "indice":"6,41%"},
"CAT C-SURAMERICA": {"medallas":"12", "atletas":"135", "indice":"8,89%"},
"CAT D-AFRICA": {"medallas":"8", "atletas":"156", "indice":"5,13%"},
"CAT D-ASIA": {"medallas":"90", "atletas":"521", "indice":"17,27%"},
"CAT D-EUROPA": {"medallas":"353", "atletas":"1213", "indice":"29,10%"},
"CAT D-OTROS": {"medallas":"0", "atletas":"1", "indice":"0,00%"},
"CAT D-NORTEAMERICA": {"medallas":"59", "atletas":"225", "indice":"26,22%"},
"CAT D-OCEANIA": {"medallas":"24", "atletas":"166", "indice":"14,46%"},
"CAT D-SURAMERICA": {"medallas":"27", "atletas":"283", "indice":"9,54%"},
"CAT E-AFRICA": {"medallas":"13", "atletas":"45", "indice":"28,89%"},
"CAT E-ASIA": {"medallas":"3", "atletas":"75", "indice":"4,00%"},
"CAT E-EUROPA": {"medallas":"17", "atletas":"161", "indice":"10,56%"},
"CAT E-OTROS": {"medallas":"0", "atletas":"0", "indice":"0,00%"},
"CAT E-NORTEAMERICA": {"medallas":"14", "atletas":"62", "indice":"22,58%"},
"CAT E-OCEANIA": {"medallas":"39", "atletas":"85", "indice":"45,88%"},
"CAT E-SURAMERICA": {"medallas":"0", "atletas":"64", "indice":"0,00%"}
};



//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord() //Call the stretched chord function 
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle)
	.pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#581845"); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#581845"); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

var divInterno = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);


var divExterno = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.style("font-size", mobileScreen ? "8px" : "10px" )
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; })
  .call(wrapChord, 100)
  .on("mouseover", function(d, i) {
       divExterno.transition()
		         .duration(200)
		         .style("opacity", .9);
       divExterno.html(Math.trunc(+d.value) + "<br>Medallas")
		         .style("left", (d3.event.pageX + 20) + "px")
		         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       divExterno.transition()
		         .duration(500)
		         .style("opacity", 0);
       });

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path)
	.on("mouseover", fadeOnChord)
	.on("mouseout", fade(opacityDefault));	

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
	//hideTooltip();
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
		.transition()
		.style("opacity", opacity);
	divInterno.transition()		
	          .duration(500)		
		      .style("opacity", 0);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	showTooltip(d);
	wrapper.selectAll("path.chord")
		.transition()
		.style("opacity", function(d) {
			return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;

		});
}//fadeOnChord

function showTooltip(d) {
	var key = Names[d.source.index] + "-" + Names[d.target.index];
	var value = d.target.value;
   divInterno.transition()
      .duration(200)
      .style("opacity", .9);
   //divInterno.html(d.target.value)
   divInterno.html(function(d) {
					return value + " - " + MatrixMedallasAtletas[key]["atletas"] + "<br>"+ 
						   MatrixMedallasAtletas[key]["indice"]
						   ;
   				   })
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
}


/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord