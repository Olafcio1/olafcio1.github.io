import "./string_extensions.js";

const options = {
  corsfix: {
    headers: {
      "Referer": "https://fontawesome.com/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
    }
  }
};

function appendCSS(url) {
  let el = document.createElement("link");

  el.rel = "stylesheet";
  el.href = url;

  document.head.append(el);
}

async function blobify(data) {
  let out = "";
  let split = data.split("url(");

  out += split.shift();

  for (let part of split) {
    let [ url, sep, rest ] = part.partition(")");

    url = "https://site-assets.fontawesome.com/releases/v7.3.1/css/" + url;

    out += "url(";
    out += URL.createObjectURL(await (await corsfix.fetch(url, options)).blob());
    out += sep;

    out += rest;
  }

  return out;
}

function appendStyle(data) {
  let el = document.createElement("style");

  el.textContent = data;

  document.head.append(el);
}

function addStyle(url) {
  if (location.hostname === "localhost") {
    appendCSS("./fontawesome/" + url.split("/releases/")[1].partition("/")[2]);
    return;
  }

  corsfix
    .fetch(url, options)
    .then((response) => response.text())
    .then(async (data) => {

      appendStyle(await blobify(data));

    });
}

addStyle("https://site-assets.fontawesome.com/releases/v7.3.1/css/fontawesome.css");
addStyle("https://site-assets.fontawesome.com/releases/v7.3.1/css/slab-press-regular.css");
addStyle("https://site-assets.fontawesome.com/releases/v7.3.1/css/slab-press-duo-regular.css");
addStyle("https://site-assets.fontawesome.com/releases/v7.3.1/css/regular.css");
addStyle("https://site-assets.fontawesome.com/releases/v7.3.1/css/brands.css");
