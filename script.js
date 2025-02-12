

const timelineWidth = 1350

// d3.json('custom.geo.json').then(function(bb) {
//     let projection = d3.geoEqualEarth();
//     let width = 1350, height = 500;
//     projection.fitSize([width, height], bb);
//     let geoGenerator = d3.geoPath()
//     .projection(projection)
//     let svg = d3.select("body").append('svg')
//     .style("width", width).style("height", height);
//     svg.append('g').selectAll('path')
//     .data(bb.features)
//     .join('path')
//     .attr('d', geoGenerator)
//     .attr('fill', '#088')
//     .attr('stroke', '#000');
// });

// d3.json('map.geojson').then(function(bb) {
//     let projection = d3.geoEqualEarth();
//     let width = 1350, height = 500;
//     projection.fitSize([width, height], bb);
//     let geoGenerator = d3.geoPath()
//     .projection(projection)
//     let svg = d3.select("body").append('svg')
//     .style("width", width).style("height", height);
//     svg.append('g').selectAll('path')
//     .data(bb.features)
//     .join('path')
//     .attr('d', geoGenerator)
//     .attr('fill', '#088')
//     .attr('stroke', '#000');
// });

// filter first, then svg
var filters = d3.select("body")
    .append("div")
    .attr("id", "filters")
        
        d3.csv("./early_writings.csv").then(function(data){
            console.log(data)
            
            
            var checkBox = filters
                .append("input")
                .attr("type", "checkbox")
                // .attr("min", extFat[0])
                // .attr("max", extFat[1])
                .on("input", e => {
                    let fatLimit = e.target.value
                    console.log(fatLimit)
                    // fat needs to be smaller than fatLimit
                    let filteredData = data.filter(d=>+d.Fat <= fatLimit)
                    console.log(filteredData)
                    updateChart(filteredData)
                })
                
                var svg = d3.select("body").append("svg")
                .attr("width",timelineWidth)
                .attr("height",100)
                
            //     var palette = {'Asia':"#a7ccc8", 'Africa':"#167c55", 'Europe':"#EEA49C", 'Oceania':"#7e8ecd", 'Americas':"#A4BDC4"}
                
                var allDates = data.map(function(row){ return +row.date_estimate})
                console.log(allDates)
                var timeScale = d3.scaleLinear(d3.extent(allDates), [20,1300])
                console.log('data.length: ', data.length)
                // var xScale = d3.scaleLinear([0,data.length], [20,880])
                // console.log("timeScale(-3000): ", timeScale)

                var image_names = [
                    "assets/1_Kish_Tablet.png",
                    "assets/2_Narmer_Palette.jpeg",
                    "assets/4_Diary_of_Merer.png",
                    "assets/3_Palermo_Stone.png",
                    "assets/5_Istanbul_2461.jpeg",
                    "assets/Code_of_Hammurabi.png",
                    "assets/6_Complaint_tablet_to_Ea-nāṣir.png",
                    "assets/Gilgamesh_Dream_Tablet.jpg",
                    "assets/7_Akkadian_Cuneiform_in_Jerusalem.png",
                    "assets/8_Ox_Scapula_Oracle_Bone_by_Zhēng_爭.png",
                    "assets/9_Bronze_Fāng_Zūn_Ritual_Wine_Container.png",
                    "assets/Dipylon_Inscription.JPG",
                    "assets/Glyph_Block_8_from_San_Bartolo.jpeg",
                    "assets/Rosetta_Stone.jpeg",
                    "assets/10_Great_Psalms_Scroll.png",
                    "assets/11_ Gandhāran_Buddhist_Birchbark_Scroll.jpg",
                    "assets/Svingerud_Runestone.jpg",
                    "assets/Diamond_Sutra_from_Tang_dynasty.jpg",
                    "assets/Missal_of_Silos.jpg",
                    "assets/Jikji_pages.jpg"
                ]

                var icon_names = [
                    "icons/1_Kish_Tablet.png",
                    "icons/2_Narmer_Palette.jpeg",
                    "icons/4_Diary_of_Merer.jpeg",
                    "icons/3_Palermo_Stone.jpeg",
                    "icons/5_Istanbul_2461.jpeg",
                    "icons/Code_of_Hammurabi.png",
                    "icons/6_Complaint_tablet_to_Ea-nāṣir.jpeg",
                    "icons/Gilgamesh_Dream_Tablet.jpg",
                    "icons/7_Akkadian_Cuneiform_in_Jerusalem.jpeg",
                    "icons/8_Ox_Scapula_Oracle_Bone_by_Zhēng_爭.jpeg",
                    "icons/9_Bronze_Fāng_Zūn_Ritual_Wine_Container.jpeg",
                    "icons/Dipylon_Inscription.JPG",
                    "icons/Glyph_Block_8_from_San_Bartolo.jpeg",
                    "icons/Rosetta_Stone.jpeg",
                    "icons/10_Great_Psalms_Scroll.jpeg",
                    "icons/11_ Gandhāran_Buddhist_Birchbark_Scroll.jpg",
                    "icons/Svingerud_Runestone.jpg",
                    "icons/Diamond_Sutra_from_Tang_dynasty.jpg",
                    "icons/Missal_of_Silos.jpg",
                    "icons/Jikji_pages.jpg"
                ]
                

                // svg.selectAll("defs")
                // .join("defs")
                // .attr()
                var width = 80
                var sightings = svg.selectAll("image")
                .data(data)
                .join('svg:image')
                .attr("xlink:href", (d,i) => icon_names[i])
                .attr("width", width)
                .attr("height", width)
                .attr("x",function(d){ 
                    return timeScale(d.date_estimate) - 20
                })
                .attr("y",0)
                .on('mouseover', function(e,d){
                    console.log(d.name,d)
                    d3.select("body").append("div")
                        .attr('pointer-events', 'none')
                        .attr("class", "tooltip")
                        .style("opacity", 1)
                        .html(
                            `<img src='${image_names[data.indexOf(d)]}' height='400'/>` + "<br/>"
                            + d.name + "<br/>" + d.date + "<br/>"  + d.empire 
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

                // var imageIcons = svg.append('svg:image')
                // .attr("xlink:href", "./assets/1_Kish_tablet.png")
                // .attr("width", 200)
                // .attr("height", 200)
                // .attr("x", 100)
                // .attr("y",100);
                
                // white vertical line
                svg.append("line")
                .attr("x1",function(d){return timeScale(0)})
                .attr("y1",0)
                .attr("x2",function(d){return timeScale(0)})
                .attr("y2",900)
                .attr("stroke","white")
                .attr("stroke-width","2")
                .attr("stroke-dasharray","0 6")
                .attr("stroke-linecap","round")

            })

            