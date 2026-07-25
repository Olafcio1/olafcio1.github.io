document.querySelectorAll("div[href]").forEach(div => {
	div.addEventListener("click", () => {
		location.href = div.getAttribute('href');
	});
});
