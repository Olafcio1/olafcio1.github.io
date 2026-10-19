import { activateCursor } from "./cursor.js";
import { renderMarkdown } from "./content.js";
import { Leftbar } from "./leftbar.js";

activateCursor();

Leftbar.replace([
  { icon: "fa-book-open", text: "Wiki" }
]);

let sidebar = fetch("https://raw.githubusercontent.com/wiki/AvoidLib/Avoid/_Sidebar.md");
let sidebarText;

let pages = {};

addEventListener("link", async ev => {
  if (ev.name == "wiki") {
    sidebarText ??= await (await sidebar).text();

    let icons = {
      "Avoid Framework": "fa-book",
      "Migrations": "fa-plane",

      "🏚️": "fa-house",
      "📽️": "fa-video",
      "🌄": "fa-image",
      "🧊": "fa-snowflake",
      "💧": "fa-droplet",
      "✏️": "fa-pencil",
      "🎯": "fa-at",
      "🤖": "fa-code",
      //"⌨️": "fa-piano-keyboard"
      "🐺": "fa-paw",
      "🌫️": "fa-eye-slash",
      "🔩": "fa-wrench",
      //"🔮": "fa-crystal-ball"
      "📚": "fa-folders",
      "🚩": "fa-flag",
      "⏳": "fa-play",
      "🔀": "fa-add",
      //"🌀": "fa-galaxy",
      "⚙️": "fa-gear",
      "🧳": "fa-paper-plane"
    };

    let menu = sidebarText.split("***")
                          .filter(v => v.trim())
                          .flatMap(v => [
                            {
                              icon: icons[v.split("<b>")[1].split("<")[0]],
                              text: v.split("<b>")[1].split("<")[0],
                              click() {
                                renderMarkdown("Hey! This wiki is in beta. To see the stable wiki, click [here.](https://github.com/AvoidLib/Avoid/wiki)", "#", "0. " + v.split("<b>")[1].split("<")[0]);
                              }
                            },
                            v.split("<hr/>")[1]
                             .split("<span>")
                             .filter(v => v.trim())
                             .map(v => {
                               let stuff = v.split("&nbsp;").reverse()[0];
                               let icon = stuff.split("<")[0].trim();
                               let title = stuff.substring(stuff.indexOf(">") + 1).split("<")[0].trim();

                               return {
                                 icon: icons[icon] ?? undefined,
                                 iconRaw: icons[icon] ? undefined : icon,
                                 text: title,
                                 async click() {
                                   let href = stuff.split('href="')[1].split('"')[0];
                                   let href_raw = href.replace(/github\.com\/(.+?)\/(.+?)\/wiki/, "raw.githubusercontent.com/wiki/$1/$2");

                                   if (href_raw == "https://raw.githubusercontent.com/wiki/AvoidLib/Avoid") {
                                     href_raw += "/Home.md";
                                   } else {
                                     href_raw += ".md";
                                   }

                                   console.log(href_raw);

                                   renderMarkdown(
                                     pages[href_raw] ??= await (await fetch(href_raw)).text(),
                                     href,
                                     title
                                   );
                                 }
                               };
                             })
                          ]);

    /*[
      { icon: "fa-gear", text: "Creating a configuration" }
    ]*/

    Leftbar.replace(menu, { transitions: true, active: true });
  }
});

let child = document.querySelector("body > .child");

child.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach(section => {
    section.classList.toggle("on-screen", child.scrollTop >= (section.getBoundingClientRect().y + section.getBoundingClientRect().height/2));
  });
});
