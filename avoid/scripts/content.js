import "./string_extensions.js";

const body = document.querySelector("body > .child");

function esc(data) {
  return data.replaceAll('&', '&amp;')
             .replaceAll('<', '&lt;')
             .replaceAll('>', '&gt;')
             .replaceAll('"', '&quot;');
}

function latex(data) {
  if (!data.includes("\\color"))
    data = `<span style="font-family: math">${data}</span>`;

  return data.replaceAll(/\\text\{(.+?)\}/g, "$1")
             .replaceAll(/\\color\{(.+?)\}\{(.+?)\}/g, '<font color="$1">$2</font>');
}

function md(data) {
  data = data.replaceAll(/<\!--([\s\S]*?)-->/gm, "");

  data = data.replaceAll(/```(.*?)\n([\s\S]*?)```/gm, (_, lang, text) => {
    let firstline = text.split("\n")[0];
    let triml = firstline.length - firstline.trimLeft().length;

    text = text.substring(triml)
               .replaceAll("\n" + firstline.substring(0, triml), "\n");

    return `<code><pre>${text}</pre></code>`;
  });

  let html = [];
  let lines = data.split("\n");

  let inOrderedList = [];
  let deep = 0;

  let nests = [], nestlist = "", closetags = [];
  let index = 0;

  function getnest() {
    return nests[nests.length - 1] ?? "";
  }

  function pushnest(add) {
    nests.push(getnest() + add);
  }

  for (let line of lines) {
    let nest;

    while (nest = getnest()) {
      let nest = nests[nests.length - 1];
      let closetag = closetags[nests.length - 1];

      if (line.startsWith(nest) && line[nest.length + 1] != " ") {
        let prevline = html[index - 1];
        let taglength = prevline.length - closetag.length;

        html[index - 1] = prevline.substring(0, taglength);
        line += prevline.substring(taglength);

        console.log(html[index-1],"|Line:|",line, "\n  ---PrevLine:"+prevline, "\n  ---TagLength:"+taglength);

        break;
      } else {
        nests.pop();

        if (nestlist)
          nestlist = nestlist.substring(0, nestlist.length - 2);
      }
    }

    if (line.startsWith("|")) {
      line = `<table><tr><td>${line.split("<")[0].replace(' | ', '</td><td>')}</td></tr></table>` + (!line.includes("<") ? "" : ("<" + line.partition("<")[2]));
    } else if (!line.startsWith("<")) {
      let trim = line.trimLeft();
      let untrim = " ".repeat(line.length - trim.length);

      for (let i = 1; i <= 6; i++) {
        if (trim.startsWith("#".repeat(i) + " ")) {
          line = `${untrim}<h${i}>${trim.substring(i + 1)}</h${i}>`;
          trim = line.trimLeft();

          break;
        }
      }

      let temp = 0;
      let startedOrderedList = false;

      while (true) {
        if (trim.startsWith("> ")) {
          deep++;
          temp++;

          line = untrim + '<blockquote>' + trim.substring(2) + "</blockquote>";
          startedOrderedList = false;
        } else if (trim.startsWith("- ")) {
          deep++;
          temp++;

          line = untrim + "<ul><li>" + trim.substring(2) + "</li></ul>";

          if (nestlist) {
            nestlist = nestlist.substring(0, nestlist.length - 2);
            nests.pop();
          }

          pushnest("  ");
          nestlist += "  ";

          closetags.push("</li></ul>");

          startedOrderedList = false;
        } else if (!startedOrderedList && inOrderedList.includes(deep)) {
          if (/^[0-9]+\. /.test(trim)) {
            line = untrim + "<li>" + trim.partition(". ")[2] + "</li>";

            pushnest(" ".repeat(trim.partition(". ")[0].length + 2));
            closetags.push("</li>");

            startedOrderedList = true;
          } else {
            line = "</ol>" + line;
            nests.pop();

            inOrderedList = inOrderedList.filter(v => v != deep);
            deep--;

            break;
          }
        } else if (trim.startsWith("1. ")) {
          line = untrim + "<ol><li>" + trim.substring(3) + "</li>";

          pushnest("   ");
          closetags.push("</li>");

          deep++;

          startedOrderedList = true;
          inOrderedList.push(deep);
        } else {
          break;
        }

        trim = line.trimLeft();
      }

      if ((!trim.startsWith("<") || trim.startsWith("</ol>")) && trim) {
        line = "<span>" + line + "</span>";
      }

      deep -= temp;

      line = line.replaceAll(/\`(.+?)\`/g, (_, text) => {
        return `<code>${esc(text)}</code>`;
      });

      line = line.replaceAll(/\$(.+?)\$/g, (_, ltx) => {
        return latex(ltx);
      });

      line = line.replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      line = line.replaceAll(/\*(.+?)\*/g, "<i>$1</i>");
      line = line.replaceAll(/~~(.+?)~~/g, "<strikethrough>$1</strikethrough>");
      line = line.replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    }

    html.push(line);
    index++;
  }

  let inCode = false;

  return html.join("\n").replaceAll(/(<(|\/)code>)|((|<\/h{1,6}>|<(hr|br)(|\/)>)\n( *)\n)/gm, (...args) => {
    const [ ___, codeTag, ____, $1, $2, $3, $4, $5, __, _ ] = args;

    if (/*["<code>", "</code>"].includes(*/codeTag/*)*/) {
      inCode = !inCode;
      return codeTag;
    }

    if (inCode)
      return $1 + $5;

    if ($3)
      return $1 + "<br/>" + $5;
    else
      return $1 + "<br/>" + $5 + "<br/>";
  });
}

export function renderMarkdown(data, link, title) {
  var isPost = true;

  try {
    title = data.split("**<u>")[1].split("</u")[0];
  } catch {
    title = title.partition(". ")[2];
    isPost = false;
  }

  body.innerHTML = `

    <section id="page">
      <div class="header">
        <p>${title}</p>
        <div class="sep"></div>
        <a href="${link}"><i class="fab fa-github"></i></a>
      </div>
      <div class="content">
        ${md(!isPost ? data : data.partition("<hr/>")[2].partition("<hr/>")[2])}
      </div>
    </section>

  `;

  let page = body.querySelector("#page");
  let header = body.querySelector("#page > .header");

  page.addEventListener("scroll", () => {
    header.classList.toggle(
      "fixed",
      page.scrollTop > header.getBoundingClientRect().y + header.getBoundingClientRect().height
    );
  });
}
