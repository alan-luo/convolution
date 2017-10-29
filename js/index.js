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
    .domain([0, 35])
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


function makeSvg(weights_obj) {
	let weights = weights_obj[0];
	let desc = weights_obj[1];

	let topys=[0,0,0];
	let toph = [0,0,0];
	let bottomh = [0,0,0];
	for(let i=0; i<weights.length; i++) {
		let height = weights[i]*47;
		if(height<0) {
			bottomh[i] = -1*height;
			toph[i] = 0;
		} else {
			bottomh[i] = 0;
			toph[i] = height;
			topys[i] = 50-height;
		}
	}

return (`
<div class="commonwindow">
<div class="desc" data-weight0="${weights[0]}" data-weight1="${weights[1]}" data-weight2="${weights[2]}"><p>${desc}</p></div>
<svg version="1.1" x="0px" y="0px" width="100px"
	 height="200px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">

	<rect x="6" y="${topys[0]}" width="27" height="${toph[0]}" stroke="transparent" fill="black" stroke-width="0"/>
	<rect x="36" y="${topys[1]}" width="27" height="${toph[1]}" stroke="transparent" fill="black" stroke-width="0"/>
	<rect x="66" y="${topys[2]}" width="27" height="${toph[2]}" stroke="transparent" fill="black" stroke-width="0"/>

	<rect x="6" y="50" width="27" height="${bottomh[0]}" stroke="transparent" fill="black" stroke-width="0"/>
	<rect x="36" y="50" width="27" height="${bottomh[1]}" stroke="transparent" fill="black" stroke-width="0"/>
	<rect x="66" y="50" width="27" height="${bottomh[2]}" stroke="transparent" fill="black" stroke-width="0"/>

	<rect x="0" y="48" width="100" height="5" stroke="transparent" fill="gray" stroke-width="0"/>
</svg>
</div>
`);
}

let list_weights = [
[[0.33, 0.34, 0.33],"Gaussian Average"],
[[1, 0, 0],"Identity"],
[[-1, 1, 0],"Edge Detection"],
[[-1, 2, -1],"Sharpen"]
];
for(let i=0; i<list_weights.length; i++) {
	$(".commonwindows").append($(makeSvg(list_weights[i])));
}


$(".desc").click(function() { //TODO fix indexing (from 0 or from 1)
	$(".window-val1").val($(this).attr('data-weight0'));
	$(".window-val2").val($(this).attr('data-weight1'));
	$(".window-val3").val($(this).attr('data-weight2'));
});

function getPerlin() {
	let simplex = new SimplexNoise();

	for(var i=0; i<300; i++) {
		// console.log((simplex.noise2D(0, 0.1*i)+1)*10);
		// console.log(Math.random()*10);
		// console.log((simplex.noise2D(0, 0.1*i)+0.5*simplex.noise2D(0, 0.1*i*2)+0.25*simplex.noise2D(0, 0.1*i*4)+1)*10);
		// if(Math.random()>0.2) { console.log((simplex.noise2D(0, 0.1*i)+1)*10); } else {console.log(0);}
		console.log(2*simplex.noise2D(0, 0.1*i*2)+10*(Math.sin(i*0.1)+1.5));
	}
}


function setData(index) {
	if(index == 0) {
		numbers = generic_perlin;
	} else if(index == 1) {
		numbers = edge_detection;
	} else if(index == 2) {
		numbers = erratic_perlin;
	} else if(index == 3) {
		numbers = white_noise;
	} else if(index ==4) {
		numbers = noisy_perlin;
	} else if(index == 5) {
		numbers = peaks;
	}

	update();
}

setData(0);