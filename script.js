// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

console.log('btn:',btn)
// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}








const timelineWidth = 1600
var svgHeight = 500
var imageWidth = 40

// filter first, then svg
var filters = d3.select("body")
    .append("div")
    .attr("id", "filters")
        
        d3.csv("./early_writings.csv").then(function(data){
            
            var yFilterColumns = ["empire_or_republic","found_region_modern_large","current_country","distance_from_origin(km)","writing_material","media_material","form","script_type","script_direction","subject_topic"]

            d3.select("body")
            .selectAll("button")
            .data(yFilterColumns)
            .join("button")
            .text(d => d)
            .on("click", function(e,col) {
                console.log(col)
                
                // updateYLabel("media_material")
                updateYLabel(`${col}`)
                
                svg.selectAll("circle")
                    .transition()
                    .attr("r", function(d) {return d[col] * 20})
            })
                            
                var svg = d3.select("body").append("svg")
                .attr("width",timelineWidth)
                .attr("height",svgHeight + 50)
            

                var allDates = data.map(function(row){ return +row.date_estimate})
                var timeScale = d3.scaleLinear(d3.extent(allDates), [50,timelineWidth - imageWidth - 40])
                console.log('data.length: ', data.length)

                let materialToY = createFilterObject("media_material")
                let empireToY = createFilterObject("empire_or_republic")
                let scriptToY = createFilterObject("script_type")
                let currentCountryToY = createFilterObject("current_country")
                let distanceFromOriginToY = createFilterObject("distance_from_origin(km)")
                let foundRegionToY = createFilterObject("found_region_modern_large")

                function createFilterObject(col) {
                    // FILTER - y axis
                    colArr = data.map(d=>d[col])

                    // only get the unique items
                    colArr = colArr.filter((element,index,array) => array.indexOf(element) == index)
                    // turn array into object
                    let test = {}
                    var yHeight = Math.floor((svgHeight / colArr.length))

                    for (let i = 0; i < colArr.length; i++) {
                        test[colArr[i]] = yHeight * i;
                    }
                    return test
                }


                // FILTER TIME for x axis (time)
                let first_year =-3200
                let last_year = 1200
                let num_years = Math.abs(first_year - last_year)
                let year_sub_range = Math.floor(num_years / 10)
                let year_full_range = [first_year,last_year]
                var years_array = []
                let yearToX = {}
                for (let i = -3200; i <= 1200; i+=year_sub_range) {
                    years_array.push(i)
                }
                console.log("years_array: ", years_array)
                console.log("timeScale(years_array[1]): ", timeScale(years_array[2]))

                const rowNameToObject = {
                    'media_material': materialToY,
                    'empire_or_republic': empireToY,
                    'script_type': scriptToY,
                    'current_country': currentCountryToY,
                    'distance_from_origin(km)': distanceFromOriginToY,
                    'found_region_modern_large': foundRegionToY,
                }
               

                // ROW LABELS (MATERIAL)
                function updateYLabel(filter) {
                    var obj = rowNameToObject[filter]
                    console.log('obj: ', obj)

                    var sightings = svg.selectAll("image")
                        .data(data)
                        .join('svg:image')
                        .attr("xlink:href", (d,i) => icon_names[i])
                        .attr("width", imageWidth)
                        .attr("height", imageWidth)
                        .attr("x",function(d){ 
                            return timeScale(d.date_estimate) + 40
                        })
                        .attr("y",(d) => svgHeight - (obj[d[filter]]) - (imageWidth))

                    // HOVER EFFECTS
                    .on('mouseover', function(e,d){
                        console.log(d.name,d)
                        d3.select("body").append("div")
                            .attr('pointer-events', 'none')
                            .attr("class", "tooltip")
                            .style("opacity", 1)
                            .html(
                                `<img src='${image_names[data.indexOf(d)]}' height='400'/>` + "<br/>"
                                + d.name + "<br/>" + d.date + "<br/>"  + d.empire_or_republic 
                                + "<br/>" + d.period + "<br/>" + d.found_region_origin 
                                + "<br/>" + "<br/>" + d.description + "<br/>"
                                )
                            .style("left", (d.x + 50 + "px"))
                            .style("top", (d.y +"px"))
                            .style("width", timelineWidth)
                            // .attr('x',xScale(data.indexOf(d)))
                            .attr('x',timeScale(d.date_estimate))
                            .attr('y',100)
                        console.log(this)
                        // console.log('index: ', xScale(data.indexOf(d)))
                        d3.select(this).attr("stroke", "pink")
                    })
                    .on('mouseout', function(e,d,){
                        d3.select("div").remove()
                        d3.select(this).attr("stroke", "black")
                    })
                    .on("click", function(e,col) {
                        console.log('e:',e)
                        console.log('col:', col)
                        var preview = svg
                            .append('g')
                            .attr("class", "preview")
                        preview
                            .append('text')
                            .text('test')
                            .attr('x', 10)
                            .attr('y', 10)

                    })

                    svg.select(".row_label").remove()

                        svg.selectAll(".row_label")
                        .data(data)
                        .join("text")
                        .text(d => d[filter])
                        .attr('x',20)
                        .attr('y',(d)=>svgHeight - (obj[d[filter]]) - (imageWidth/2))
                        .attr('class','row_label')

                    
                }
                updateYLabel("media_material")

                // // COLUMN LABELS (TIME)
                svg.selectAll(".time_label")
                    .data(data)
                    .join("text")
                    .text((d,i) => years_array[i])
                    .attr('x',(d,i) => timeScale(years_array[i]) + 40)
                    .attr('y',svgHeight + 40)
                
                // white vertical line
                svg.append("line")
                .attr("x1",function(d){return timeScale(150)})
                .attr("y1",0)
                .attr("x2",function(d){return timeScale(150)})
                .attr("y2",900)
                .attr("stroke","white")
                .attr("stroke-width","2")
                .attr("stroke-dasharray","0 6")
                .attr("stroke-linecap","round")

            })

            