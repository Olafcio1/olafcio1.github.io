import { getMinecraftVersion } from "./logutil.js";

try {
  var resp = await (await fetch("https://backend.ianhon.com/hastebin/paste/fetch/" + parseInt(location.search.substring(1), 16))).json();
} catch (e) {
  document.querySelector("main").innerText = "Have you provided a correct URL address?";
  throw e;
}

let files = JSON.parse(resp['paste']['content']);
let log = files[0];

let mcver = getMinecraftVersion(log['content']);

function htmlesc(text) {
  return text.replaceAll("&", "&amp;")
             .replaceAll("<", "&lt;")
             .replaceAll(">", "&gt;")
             .replaceAll('"', "&quot;");
}

function fancify(text) {
  return text.replaceAll(/([ \t]at )(.+?\/\/|)(.+\.)(.+?)\((.+?)(:(.+?)|)\)/g, '$1<font color="#ab5454">$2</font><font color="#b3843b">$3</font><font color="#b39a3b">$4</font><font color="#84b33b">{$5<font color="#41b33b">$6</font>}</font>')
             .replaceAll(/([ \t])((com|pl|net|org|eu|ru)\/[a-zA-Z0-9$_\/]+)/g, '$1<font style="font-style: italic">$2</font>')
             .replaceAll(/\[(.+?)\]/g, '<font color="#c5cf49">[$1]</font>')
             .replaceAll(/\((.+?)\)/g, '<font color="#cfc549">($1)</font>')
             .replaceAll(/%(.+?)%/g, '<font color="#cf49c5" class="env">%$1%</font>')
             .replaceAll(/([a-zA-Z-_0-9\.]+.mixins.json)/g, '<font color="#599ddf" class="mixinconfig">$1</font>');
}

document.querySelector("main").innerHTML = `
    <div class="nav">
      <p>NoCrash Log <span class="code">${htmlesc(log['filename'])}</span> for <span class="brand">Minecraft ${htmlesc(mcver)}</span></p>
      <a href="https://modrinth.com/mod/nocrash">
        <i class="fab fa-modrinth"></i>
      </a>
    </div>
    <div class="log">
      <code><line>${fancify(htmlesc(log['content'])).replaceAll('\n', '</line>\n<line>')}</line></code>
    </div>
`;
