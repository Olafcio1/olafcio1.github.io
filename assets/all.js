addEventListener("load", _ => {
    document.body.classList.add("loaded");

    let ysliders = document.querySelectorAll(".yslider");
    let ye = {};
    let yi = {};
    setInterval(() => {
        ysliders.forEach((el, i) => {
            if (!ye[i])
                ye[i] = [...el.querySelectorAll("p")];
            if (typeof yi[i] === 'undefined')
                return yi[i] = 0;
            let ei = yi[i]++;
            if (ei == ye[i].length-2) {
                yi[i] = 0;
                ye[i].forEach(e => e.getAnimations().forEach(an => an.reverse() && setTimeout(() => an.cancel(), 500)));
            } else {
                let animopts = {duration:500,fill:"forwards",direction:"alternate",easing:"ease"};
                ye[i][ei].animate([
                    {scale:"1 1"},
                    {scale:"1 0",marginTop:"-30px"}
                ], animopts);
            }
        });
    }, 650);
}, { once: true });
