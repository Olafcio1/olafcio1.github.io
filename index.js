(() => {
    document.querySelector(".discord").addEventListener("click", ev => {
        ev.preventDefault();
        open('https://discord.gg/4dmqcVfQjA', '_blank');
        location.assign('https://discord.gg/7rDreSNetN');
    });

    const main = document.querySelector("#main");
    const html = document.documentElement;
    addEventListener("scroll", () => {
        main.style.top = html.scrollTop + "px";
    });

    dispatchEvent(new Event("scroll"));
})();
