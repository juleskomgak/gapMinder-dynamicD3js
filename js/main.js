/*
*    main.js
*    Data Visualization with D3.js
*    Gapminder 
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;
var time = 0;
var interval;
var formattedData;
	
var area = d3.scaleLinear()
    .range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000]);


// add tooltip

var tip = d3.tip()
			.attr("class", "d3-tip")
			.html(d => {
				var text= "<strong> Country : </strong> <pan style='color:red'> "+d.country +"</pan><br>"
				    text += "<strong> Continent : </strong> <pan style='color:red text-transform:capitalize'> "+d.continent +"</pan><br>"
					text += "<strong> Life_exp : </strong> <pan style='color:red'> "+d3.format(".2f")(d.life_exp) +"</pan><br>"
					text += "<strong> Income : </strong> <pan style='color:red'> "+d3.format("$,.0f")(d.income)+"</pan><br>"
					text += "<strong> Population : </strong> <pan style='color:red'> "+d3.format(",.0f")(d.population) +"</pan><br>"
				return text;
			});

// x scale	
var xScale = d3.scaleLog()
.base(10)
.domain([300, 150000])
.range([0, width]);


// y scale
var yScale = d3.scaleLinear()
.domain([90, 0])
.range([0, height]);
    
var g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// call the tip in g

g.call(tip);
		
// Labels
var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");
var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -125)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
	.text("Life Expectancy (Years)")

var timeLabel = g.append("text")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
	.text("1800");
var continentColor = d3.scaleOrdinal(d3.schemePastel1);

// create the legend 

var continents = ["europe", "asia", "americas", "africa"];

var legend = g.append("g")
				.attr("transform", "translate("+(width-10)+","+(height-125)+")" )

continents.forEach((continent,i) => {

	var legendRow = legend.append("g").attr("transform", "translate(0,"+i*20+")");
		 
	   legendRow.append("rect")
				.attr("width", 10 )
				.attr("height", 10 )
				.attr("fill", continentColor(continent) );
		legendRow.append("text")
				.attr("x", -10)
				.attr("y", 10)
				.attr("text-anchor", "end")
				.style("text-tranform", "capitalise")
				.text(continent);

} );



d3.json("data/data.json").then(function(data){
	
	console.log(data);
// filter null data

var formattedData  = data.map(year => { return year["countries"].filter(country => {

var data_n= (country.income && country.life_exp);
	return data_n;
})}).map(d => { d.income = + d.income;
				d.life_exp = +d.life_exp;
				return d;
   })

	
	//console.log(data.countries[0]);

// x axis
  var bottom_axis =d3.axisBottom(xScale)
                     .tickValues([400, 4000, 40000])
                       .tickFormat(function(n) { return n +"$"});
// y axis
  var left_axis =d3.axisLeft(yScale).ticks(4);
  
  //var xGroupAxis= 
  g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0,"+height+")")
	.call(bottom_axis)
  //var xGroupAxis= 
  g.append("g")
	.attr("class", "y axis")
	.call(left_axis)

$("#play-button")
                .on("click", function(){
				var button =$(this);
				if(button.text() == "Play") { 
					button.text("Pause");
					interval = setInterval(step, 100);
				}
				else {
					button.text("Play");
					clearInterval(interval);
				}
                
				});


$("#reset-button").on("click", function(){
	                  time =0;
	                  update(formattedData[0]);
					 });

$("#continent-select").on("change", function(){
	                   update(formattedData[time]);
						 });
						 
 $("#date-slider").slider({
							max: 2014,
							min: 1800,
							step: 1,
							slide: function(event, ui){
								time = ui.value - 1800;
								update(formattedData[time]);
							}
						});


// First run of the visualization
update(formattedData[0]);

function step(){
	// At the end of our data, loop back
	time = (time < 214) ? time+1 : 0
	update(formattedData[time]);            
};


function update(data) {	

// Standard transition time for the visualization
var t = d3.transition()
		  .duration(100);
		  
var continentData = $("#continent-select").val();
 data = data.filter( function(d){
	if (continentData == "all") return true;
	else  { 
           return d.continent == continentData;
	}

 });


// JOIN new data with old elements.
 var circles = g.selectAll("circle").data(data, function(d){
	 return d.country;
 });

// EXIT old elements not present in new data.
    circles.exit()
           .attr("class", "exit")
           .remove();		   

// ENTER new elements present in new data.
circles.enter()
.append("circle")
.attr("class", "enter")
.on("mouseover", tip.show)
.on("mouseleave", tip.hide)
.merge(circles)
.transition(t)
.attr("cx", d => { return xScale(d.income);})
.attr("cy", d => { return yScale(d.life_exp);})
.attr("r", d => { return Math.sqrt(area(d.population)/ Math.PI);})
.attr("fill",d => { return continentColor(d.continent);})

// Update the time label
  timeLabel.text(+(time + 1800))
  $("#date-slider").slider("value", +(time + 1800))
};
    
}).catch( error => {console.log(error); });