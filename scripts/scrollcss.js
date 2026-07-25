document.addEventListener("scroll", () => {
	document.documentElement.style.setProperty("--scrollY", document.documentElement.scrollTop);
	document.querySelectorAll(".animable").forEach(el => {
		el.classList.toggle("visible", !(((
			el.getBoundingClientRect().y +
			el.getBoundingClientRect().height/3
		)) >= document.documentElement.scrollTop));
	});
});
