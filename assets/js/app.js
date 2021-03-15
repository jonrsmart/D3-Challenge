var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";
   
    d3.csv("assets/data/data.csv").then(function(data) {
        data.forEach(function(data) {
            data.poverty = +data.poverty;
            data.obesity = +data.obesity;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.smokes = +data.smokes;
            data.age = +data.age;
        });
// scale x with function
    var xLinearScale = xScale(data, chosenXAxis);
// scale y to chart height
    var yLinearScale = yScale(data, chosenYAxis);
        
            

// create axes
    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("g circle")
            .data(data)
            .enter()
            .append("g");
    var circlesLoc = circlesGroup.append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);

    var circlesText =  circlesGroup.append("text")
            .text(d => d.abbr)
            .attr("dx", d => xLinearScale(d[chosenXAxis]))
            .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
            .classed("stateText", true);

      // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .text("Poverty (%)")
        .classed("active", true);
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age of Participants");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Income (Household)");

    var yLabelsGroup = chartGroup.append("g");
    
    var healthLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", -20)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("% Without Healthcare");
    var smokingLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", -40)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("% of People Who Smoke");
    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", -60)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity % of Population");

    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

   // x axis labels event listener
   xLabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       console.log(chosenXAxis);

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(data, chosenXAxis);

       // updates x axis with transition
       xAxis = renderXAxes(xLinearScale, xAxis);

       // updates circlesGroup with new x values
       circlesLoc = renderXCircles(circlesLoc, xLinearScale, chosenXAxis);
       circlesText = renderXCircles(circlesText, xLinearScale, chosenXAxis)
       

       // updates tooltips with new info
       circlesGroup = updateToolTip(circlesGroup, chosenYAxis, chosenXAxis);

       // changes classes to change bold text
       if (chosenXAxis === "age") {
            povertyLabel
           .classed("active", false)
           .classed("inactive", true);
            ageLabel
           .classed("active", true)
           .classed("inactive", false);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
       }
       else if (chosenXAxis === "income"){
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
       }
       else {
        povertyLabel
        .classed("inactive", false)
        .classed("active", true);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
   }
     }
   });

   // y axis labels event listener
   yLabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenYAxis) {

       // replaces chosenXAxis with value
       chosenYAxis = value;

       console.log(chosenYAxis);

       // functions here found above csv import
       // updates x scale for new data
       yLinearScale = yScale(data, chosenYAxis);

       // updates x axis with transition
       yAxis = renderYAxes(yLinearScale, yAxis);

       // updates circlesGroup with new x values
       circlesLoc = renderYCircles(circlesLoc, yLinearScale, chosenYAxis);
       circlesText = renderYCircles(circlesText, yLinearScale, chosenYAxis)
       

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenYAxis === "smokes") {
            smokingLabel
           .classed("active", true)
           .classed("inactive", false);
            healthLabel
           .classed("active", false)
           .classed("inactive", true);
            obesityLabel
            .classed("active", false)
            .classed("inactive", true);
       }
       else if (chosenXAxis === "obesity"){
            smokingLabel
            .classed("active", false)
            .classed("inactive", true);
            healthLabel
            .classed("active", false)
            .classed("inactive", true);
            obesityLabel
            .classed("active", true)
            .classed("inactive", false);
       }
       else {
        smokingLabel
            .classed("active", false)
            .classed("inactive", true);
            healthLabel
            .classed("active", true)
            .classed("inactive", false);
            obesityLabel
            .classed("active", false)
            .classed("inactive", true);
   }
     }
   });
    });



