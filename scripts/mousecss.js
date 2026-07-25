let mx,my;
let all=[...document.querySelectorAll(".listening")];

addEventListener("mousemove",ev=>{
	document.documentElement.style.setProperty("--gmouseX",mx=ev.pageX);
	document.documentElement.style.setProperty("--gmouseY",my=ev.pageY);
	bad.forEach(([el,rx,ry])=>{
		el.style.setProperty("--mouseX",mx+rx);
		el.style.setProperty("--mouseY",my+ry);
	});
	all.forEach((el,index)=>{
		let rx=el.getBoundingClientRect().left+el.offsetWidth/2;
		let ry=el.getBoundingClientRect().top+el.offsetHeight/2;

		document.documentElement.style.setProperty("--rmouseX"+index,mx+rx);
		document.documentElement.style.setProperty("--rmouseY"+index,my+ry);
	});
});

var bad= [];

addEventListener("mousedown",ev=>{
	document.querySelectorAll(".listening:active").forEach(el=>{
		let ex = el.getBoundingClientRect().left;
		let ey = el.getBoundingClientRect().top;

		bad.push([el, ex-ev.pageX, ey-ev.pageY]);

		el.style.setProperty("--x",ex);
		el.style.setProperty("--y",ey);
	});
});

addEventListener("mouseup",ev=>{
	bad.forEach(([el])=>{
		el.style.setProperty("--x",0);
		el.style.setProperty("--y",0);
	});
	bad=[];
});
