// visual constants for graph construction
const dims = {
    width: 2400,
    height: 500
}
const margins = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 20
}
// create d3 objects for graph construction
const xRange = [margins.left, dims.width - margins.right];
const yRange = [dims.height - margins.top, margins.bottom];

let xScale = d3.scaleLinear()
    .domain([0, 300])
    .range(xRange);
let yScale = d3.scaleLinear()
    .domain([0, 40])
    .range(yRange);
let getX = (i) => xScale(i)+margins.left;
let getY = (d) => yScale(d)-margins.bottom;

let mySvg = d3.select('#svg');


// SET UP AXIS
var xAxis = d3.axisBottom(xScale);

mySvg.append("g")
	.attr('transform',`translate(0, ${dims.height-margins.bottom})`)
	.call(xAxis);

function update() {
	// DATA JOIN
	let points = mySvg.selectAll("circle")
    .data(numbers);

    // UPDATE
    points.classed('update',true)
    .attr('cy', (d, i) => getY(d))
    .attr('cx', (d, i) => getX(i))
	
    // ENTER + UPDATE
    points.enter().append("circle")
    .attr('cy', (d, i) => getY(d))
    .attr('cx', (d, i) => getX(i))
    .attr('r', (d) => 3)
    .attr('fill','black');

    // EXIT
	points.exit().remove();
}
update();



$(".convolve").click(function() {
	let val1 = parseFloat($(".window-val1").val());
	let val2 = parseFloat($(".window-val2").val());
	let val3 = parseFloat($(".window-val3").val());

	let weights = [val1, val2, val3];
	console.log(weights);

	let numbers2 = [];
	for(let i=0; i<numbers.length-weights.length; i++) {
		let newval = 0;
		for(let j=0; j<weights.length; j++) {
			// console.log(weights[j], numbers[i+j])
			newval += weights[j]*numbers[i+j];
		}
		// console.log(newval);
		numbers2.push(newval);
	}
	numbers = numbers2;
	update();
});