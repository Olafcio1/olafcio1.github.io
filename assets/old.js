(async () => {
    await new Promise(rsv => addEventListener("load", rsv, { once: true }));

    /** @type {HTMLCanvasElement} */
    const bg = document.querySelector("#bg");
    addEventListener("resize", (function R() {
        bg.width = document.body.offsetWidth;
        bg.height = document.body.offsetHeight;
        return R;
    })(), true);
    const ctx = bg.getContext('2d');
    const DROPLETS = [
        [16, 7, "#888"],
        [50, -5, "#fff"],
        [74, -30, "#888", 0.7]
    ];
    const TIME = new Date().getTime();
    var rem = 0;
    var modnum = 200;
    requestAnimationFrame(function F() {
        var current = new Date().getTime();
        ctx.clearRect(0, 0, bg.width, bg.height);
        for (let e of DROPLETS) {
            var speed = e[3] || 1;
            var mod = (current - TIME) / (70 / speed);
            ctx.beginPath();
            ctx.strokeStyle = e[2];
            let x = e[0] + mod;
            let y = e[1] + mod;
            ctx.moveTo(x, y);
            if (mod % modnum > 100) {
                rem += modnum / 4 / 40;
            } else if (rem > 0) {
                rem = Math.min(0, rem / modnum / 10);
            } else {
                modnum = mod * 1.75;
            }
            ctx.lineTo(x + mod - rem, y + mod - rem);
            ctx.stroke();
        }
        requestAnimationFrame(F);
    });
})();
