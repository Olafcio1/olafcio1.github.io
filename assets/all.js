addEventListener("load", _ => {
    Object.defineProperty(window, 'notify', {value:function(msg) {
        let el = document.createElement("div");
        el.className = "notif";
        el.innerHTML = `<i class="fas fa-checkmark"></i><p></p>`;
        el.querySelector("p").innerText = msg;
        document.body.append(el);
        async function remove() {
            el.animate([
                {marginTop:0,scale:"1 1",opacity:1},
                {marginTop:"-100%",scale:"1 0",opacity:0}
            ], {duration: 400, direction: "alternate", easing: "ease", fill: "forwards"});
            await new Promise(rsv => el.addEventListener("animationend", rsv, {once: true}));
            el.remove();
        }
        let timeout = setTimeout(remove, 2000);
        el.addEventListener("click", () => {
            clearTimeout(timeout);
            remove();
        }, {once: true});
    },writable:false});
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
