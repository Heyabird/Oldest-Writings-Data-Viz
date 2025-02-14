// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// console.log('btn:',btn)
// When the user clicks on the button, open the modal
// btn.onclick = function() {
//     openModal()
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    console.log('span clicked')
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function openModal() {
    console.log("openModal called!")
    modal.style.display = "block";


}

var closeModal = function() {
    console.log("HELLO")
    modal = document.getElementsByClassName("description")[0];
    console.log('modal:',modal)
    modal.style.display = "none";

}





const timelineWidth = 1500
var svgHeight = 670
var imageWidth = 50

// filter first, then svg
var filters = d3.select("body")
    .append("div")
    .attr("id", "filters")
        
        d3.csv("./early_writings.csv").then(function(data){
            
            var yFilterColumns = ["empire_or_republic","found_region_modern_large","found_region_modern","current_country","distance_from_origin_km",
            "writing_material",
            "media_material",
            "form",
            "script_type",
            "script_direction",
            "subject_topic"
        ]

            d3.select("body")
            .selectAll("button")
            .data(yFilterColumns)
            .join("button")
            .text(d => d)
            .on("click", function(e,col) {

                d3.selectAll("button").style("background-color", "#cccbcb")
                console.log(col)
                
                // updateYLabel("media_material")
                updateYLabel(`${col}`)
                console.log('this:', d3.select(this))
                d3.select(this).style("background-color", "#c98a4f")
                // svg.selectAll("circle")
                //     .transition()
                //     .attr("r", function(d) {return d[col] * 20})
            })


            // var modalDiv = d3.select("body")
            //     .append("div")
            //     .data(data)
            //     .attr('pointer-events', 'none')
            //     .attr("class", "description")
            //     .style("opacity", 1)
            //     .html(
            //         d=> `<div class='modal-content'><span class='close' onclick='closeModal()'>&times;</span><p><img style='max-width:800px;' src='${image_names[data.indexOf(d)]}' height='400'/> <br/> ${d.name} <br/> ${d.date} <br/>  ${d.empire_or_republic} <br/> ${d.period} <br/> ${d.found_region_origin} <br/><br/> ${d.description} <br/></p></div>`
            //         )
            //     .style("left", (d=> (d.x + 50 + "px")))
            //     .style("top", (d=> (d.y +"px")))
            //     //modal-making...
            //     .classed('modal', true)
            //     .style('display','none')

                            
            var svg = d3.select("body").append("svg")
            .attr("width",timelineWidth)
            .attr("height",svgHeight + 50)
            // .style('margin','0 10')
        

            var allDates = data.map(function(row){ return +row.date_estimate})
            var timeScale = d3.scaleLinear(d3.extent(allDates), [50,timelineWidth - imageWidth - 40])
            console.log('data.length: ', data.length)

            let materialToY = createFilterObject("media_material")
            let empireToY = createFilterObject("empire_or_republic")
            let scriptToY = createFilterObject("script_type")
            let currentCountryToY = createFilterObject("current_country")
            let distanceFromOriginToY = createFilterObject("distance_from_origin_km",true)
            let foundRegionModernToY = createFilterObject("found_region_modern")
            let foundRegionToY = createFilterObject("found_region_modern_large")
            let scriptDirectionToY = createFilterObject("script_direction")
            let subjectTopicToY = createFilterObject("subject_topic")
            let writingMaterialToY = createFilterObject("writing_material")
            let formToY = createFilterObject("form")

            function createFilterObject(col, numbers = false) {
                // FILTER - y axis

                // only get the unique items

                if (numbers === true) {
                    colArr = data.map(d=>+d[col])
                    colArr = colArr.sort(function(a, b) {
                        return a - b;
                    });
                } else {
                    colArr = data.map(d=>d[col])
                }
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
                'distance_from_origin_km': distanceFromOriginToY,
                'found_region_modern': foundRegionModernToY,
                'found_region_modern_large': foundRegionToY,
                'script_direction': scriptDirectionToY,
                'subject_topic': subjectTopicToY,
                'writing_material': writingMaterialToY,
                'form': formToY
            }
            

            // ROW LABELS (MATERIAL)
            function updateYLabel(filter) {
                var obj = rowNameToObject[filter]
                console.log('obj: ', obj)

                if(filter == "distance_from_origin_km") {
                    console.log('Hi')
                    obj["unknown"] = obj["-10"]; 
                    delete obj["-10"];  
                }
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
                        let moveRight
                        if (d.date_estimate < 0) {
                            moveRight = 88
                        } else {
                            moveRight = -308
                        }
                        svg.append("foreignObject")
                        .attr("width", 350)
                        .attr("height", 500)
                        .attr("x",timeScale(d.date_estimate) + moveRight)
                        .attr("y",svgHeight - (obj[d[filter]]) - (imageWidth) - 8)
                        .append("xhtml:body")
                            .style("font", "14px 'Helvetica Neue'")
                            .style("padding","3px")
                            .style("background-color","#c98a4f")
                            .html(`<b>${d.name}</b> (${d.date}) <br/> ${d.found_region_origin} → ${d.current_country} (distance: ${d.distance_from_origin_km}) <br/>topic: ${d.subject} // <i>${d.writing_material}</i> on <i>${d.media_material2}</i>`)
                        d3.select(this).attr("stroke", "pink")
                    })
                    .on('mouseout', function(e,d) {
                        d3.select("div").remove()
                        d3.select(this).attr("stroke", "black")
                        svg.select('.preview').remove()
                        svg.select("foreignObject").remove()
                    })
                    .on("click", function(e,d) {
                        console.log('on click e:', e)
                        var modalDiv = d3.select("body").append("div")
                            .attr('pointer-events', 'none')
                            .attr("class", "description")
                            .style("opacity", 1)
                            .html(
                                `<div class='modal-content'><span class='close' onclick='closeModal()'>&times;</span><p><img style='max-width:800px;' src='${image_names[data.indexOf(d)]}' height='400'/> <br/> ${d.name} <br/> ${d.date} <br/>  ${d.empire_or_republic} <br/> ${d.period} <br/> ${d.found_region_origin} <br/><br/> ${d.description} <br/></p></div>`
                                )
                            .style("left", (d.x + 50 + "px"))
                            .style("top", (d.y - 50 +"px"))
                            //modal-making...
                            .classed('modal', true)
                            .style('display','block')
                            console.log('on click d:', d)

                        //                         .attr("width", 230)
                        // .attr("height", 500)
                        // .attr("x",timeScale(d.date_estimate) + 90)
                        // .attr("y",svgHeight - (obj[d[filter]]) - (imageWidth))
                        // .append("xhtml:body")
                        //     .style("font", "14px 'Helvetica Neue'")
                        //     .html(`<b>${d.name}</b> <br/> ${d.date} <br/> ${d.empire_or_republic} <br/> ${d.media_material2}`)

                        d3.select("span")
                            .on("click",function(e,d){
                                console.log('test!')
                        })
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

            