import * as d3 from "d3";

function createTooltip(layer) {

    var tooltip = layer.append("g");

    var tooltipHeight = 18;
    var tooltipWidth = 40;
    var tooltipTipSize = 7;
    var tooltipBackgroundPos = [
        [0, 0],
        [tooltipWidth, 0],
        [tooltipWidth, tooltipHeight],
        [tooltipWidth/2+tooltipTipSize, tooltipHeight],
        [tooltipWidth/2, tooltipHeight+tooltipTipSize],
        [tooltipWidth/2-tooltipTipSize, tooltipHeight],
        [0, tooltipHeight]
    ];
    var tooltipLine = d3.line()
        .x(function(d){ return d[0] - tooltipWidth/2 })
        .y(function(d){ return d[1] - tooltipHeight - tooltipTipSize });

    tooltip.append("path")
        .attr("d", tooltipLine(tooltipBackgroundPos))
        .attr("fill", "orange");

    var tooltipText = tooltip.append("text")
        .text("hello")
        .attr("x", 0)
        .attr("y", - tooltipHeight - tooltipTipSize + 12 )
        .style("z-index", 2)
        .style("font-family", "verdana")
        .style("font-size", "10px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        ;

    var showTooltip = function(text, x, y){
        tooltip
            .attr("transform", "translate(" + x + "," + ( y - 10) + ")")
            .style("display", "block");
        tooltipText.text(text);
    };

    var hideTooltip = function(){
        tooltip.style("display", "none");
    };

    return {
        show: showTooltip,
        hide: hideTooltip
    }

}

function findClosestValue(data, field, valueToFind) {
    var i;
    var find = -1;
    for (i = 0; i < data.length; i++) {
        if (data[i][field] <= valueToFind) {
            find = i;
        }
    }
    if (find >= 0) {
        return data[find];
    }
    return null;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRandomData(numberOfData, min, max) {
    var result = [], i;
    for (i = 1; i <= numberOfData; i++) {
        result.push({"DateParsed": new Date("2017-01-" + i), "Adj Close": getRandomIntInclusive(min, max)});
    }
    return result;
}

function createChart(config) {

    const fieldX = config.fieldX;
    const fieldY = config.fieldY;
    const data = config.data ? config.data : [];

    var w = config.svg.attr("width");
    var h = config.svg.attr("height");

    var svg = config.svg;

    var padding = 50;

    var valueFormat = d3.format(",.1f");
    var keyFormat = d3.timeFormat("%b-%y");

    var xMin = d3.min(data, function (d) {
        return d[fieldX];
    });
    var xMax = d3.max(data, function (d) {
        return d[fieldX];
    });
    var xWidth = (w - 2 * padding) / data.length;
    var xScale = d3.scaleTime()
        .domain([xMin, xMax])
        .range([padding, w - xWidth - padding]);

    console.log("xMin", xMin);
    console.log("xMax", xMax);

    var yMin = d3.min(data, function (d) {
            return d[fieldY];
        }) * 0.9;
    var yMax = d3.max(data, function (d) {
        return d[fieldY];
    });
    var yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([h - padding, padding]);
    var heightScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([0, h - 2 * padding]);

    var chartLayer = svg.append("g");
    var tooltipLayer = svg.append("g");

    var tooltip = createTooltip(tooltipLayer);

    var input = data;

    tooltipLayer.append("g")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .style("opacity", 0)
        .on("mousemove", function (d) {
            var x = xScale.invert(d3.event.offsetX);
            var xMin = xScale.domain()[0];
            var xMax = xScale.domain()[1];

            var y = yScale.invert(d3.event.offsetY);
            var yMin = yScale.domain()[0];
            var yMax = yScale.domain()[1];
            if (y > yMax || y < yMin) {
                tooltip.hide();
                return;
            }

            if (xMin <= x && x <= xMax) {
                // console.log(d3.event.offsetX, d3.event.offsetY);
                var closestItem = findClosestValue(input, fieldX, x);
                if (closestItem) {
                    tooltip.show(valueFormat(closestItem[fieldY]), xScale(closestItem[fieldX]), yScale(closestItem[fieldY]))
                    return;
                }
            }

            tooltip.hide();

        });

    var lineFn = d3.line()
        .x(function (d) {
            return xScale(d[fieldX]);
        })
        .y(function (d) {
            return yScale(d[fieldY]);
        });

    var line = chartLayer
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", lineFn([]));

    var xAxisGen = d3
        .axisBottom()
        .scale(xScale)
        .ticks(6)
        .tickFormat(keyFormat);

    var yAxisGen = d3
        .axisLeft()
        .scale(yScale)
        .ticks(5);

    var yAxis = svg.append("g").call(yAxisGen)
        .attr("class", "y axis")
        .attr("transform", "translate(" + (xScale(xMin) - xWidth / 2) + ", 0)");

    var xAxis = svg.append("g").call(xAxisGen)
        .attr("class", "x axis")
        .attr("transform", "translate(0," + yScale(yMin) + ")");

    updateChart(data);

    function updateChart(data) {

        input = data;

        var xMin = d3.min(data, function (d) {
            return d[fieldX];
        });
        var xMax = d3.max(data, function (d) {
            return d[fieldX];
        });
        var xWidth = (w - 2 * padding) / data.length;
        xScale
            .domain([xMin, xMax])
            .range([padding, w - xWidth - padding]);

        var yMin = d3.min(data, function (d) {
                return d[fieldY];
            }) * 0.9;
        var yMax = d3.max(data, function (d) {
            return d[fieldY];
        });
        yScale
            .domain([yMin, yMax])
            .range([h - padding, padding]);
        heightScale
            .domain([yMin, yMax])
            .range([0, h - 2 * padding]);

//        var xAxisGen = d3
//                .axisBottom().scale(xScale).ticks(10);
//
//        var yAxisGen = d3
//                .axisLeft().scale(yScale).ticks(5);


        var t = d3.transition()
            .duration(750)
            .ease(d3.easeElastic);

        svg.selectAll(".y.axis")
            .call(yAxisGen)
            .transition(t)
            .attr("transform", "translate(" + (xScale(xMin) - xWidth / 2) + ", 0)");

        svg.selectAll(".x.axis")
            .call(xAxisGen)
            .transition(t)
            .attr("transform", "translate(0," + yScale(yMin) + ")");

        line
            .transition(t)
            .attr("d", lineFn(data));

    }

    return {
        update: updateChart

    };

}


export {createChart, getRandomData}