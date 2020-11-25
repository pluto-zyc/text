export const keduFun=(svg)=>{

	// x轴刻度
    svg.append("line")
    .attr("x1",0)
    .attr("y1",30)
    .attr("x2",935)
    .attr("y2",30)
    .attr("stroke","white")
    .attr("stroke-width","2")

// y刻度
for(var i=1;i<=24;i++){
    // svg.append('text')
    //  .attr("x",40*i)
    //  .attr("y",20)
    //  .attr("fill","white")
    //  .attr("style","font-size: 12px;font-family: 'Arial';cursor: pointer;")
    //  .text(i-1+'点')

    svg.append("line")
    .attr("x1",38*i)
    .attr("y1",30)
    .attr("x2",38*i)
    .attr("y2",37)
    .attr("stroke","white")
    .attr("stroke-width","2")
}

   
}