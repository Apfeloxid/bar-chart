const h = 550;
const w = 1000;
const padding = 40;
const barWidth = 3.4;

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(data => {

        const datesAsDate = data.data.map(data => new Date(data[0]))

        const minYearValue = d3.min(datesAsDate)
        let maxYearValue = new Date(d3.max(datesAsDate));
        maxYearValue.setMonth(maxYearValue.getMonth() +  3);


        const xScale = d3.scaleTime()
                            .domain([minYearValue, maxYearValue])
                            .range([padding, w - padding]);

        const yScale = d3.scaleLinear() 
                            .domain([0, d3.max(data.data, d => d[1])])
                            .range([h - padding, padding]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const tooltip = d3.select("main")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        const svg = d3.select("main")
            .append("svg")
            .attr("height", h)
            .attr("width", w);
        
        svg.selectAll("rect")
            .data(data.data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(datesAsDate[i]))
            .attr("y", d => yScale(d[1]))
            .attr("width", barWidth + "px")
            .attr("height", (d) => h - padding - yScale(d[1]))
            .attr("fill", "black")
            .attr("class", "bar")
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on("mouseover", (d, i) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.85)
                tooltip.html(`${convertDateToString(d[0])}<br>\$${d[1]} Billion`)
                    .attr("data-date", d[0])
                    .style("left", padding + (i * barWidth) + "px")
                    .style("top", (h - 100) + "px")
                    .style('transform', 'translateX(100px)')
            })
            .on("mouseout", d => {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            })

        svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")") 
            .attr("id", "x-axis")   
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + padding + ", 0)")    
            .attr("id", "y-axis")
            .call(yAxis);
    });

function convertDateToString(date) {
    let year = date.split("-")[0];
    let month = parseInt(date.split("-")[1]);

    return year + " Q" + (getQuarterFromMonth(month));
}

function getQuarterFromMonth(month) {
    if (month < 4) {
        return 1;
    } else if (month < 7) {
        return 2;
    } else if (month < 10) {
        return 3;
    } else {
        return 4;
    }
}