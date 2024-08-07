addEventListener("load", _ => {
    document.body.classList.add("loaded");

    let ysliders = document.querySelectorAll(".yslider");
    setInterval(() => {
        ysliders.forEach(el => {
            el.scrollBy({ y: 2 });
        });
    }, 50);
}, { once: true });
