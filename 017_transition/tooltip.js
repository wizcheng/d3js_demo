function createTooltip(layer) {

    var tooltip = layer.append("g");

    var tooltipHeight = 18;
    var tooltipWidth = 34;
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
            .attr("transform", "translate(" + x + "," + ( y - 5) + ")")
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