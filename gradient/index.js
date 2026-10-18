import { supplyGradient } from "./gradient.js";

function addColor(value) {
  let el = document.createElement("div");

  el.className = "color";
  el.innerHTML = `
    <input placeholder="#ff0000" value="${value}">
  `;

  el.style.setProperty("--color", value);

  let colorInput = el.querySelector("input");

  colorInput.addEventListener("input", () => {
    el.style.setProperty("--color", colorInput.value);
  });

  document.querySelector(".menu > .left > .colors").append(el);

  return new class Color {
    get() {
      return colorInput.value;
    }
  };
}

const preview = document.querySelector(".menu > .right > .preview");
const input = document.querySelector(".menu > .right > .input > input");
const code = document.querySelector(".menu > .right > .output > code");

function refresh() {
  code.innerText = supplyGradient({
    text: input.value,
    method: mode,
    color1: color1.get(),
    color2: color2.get(),
    element: preview
  });
}

var mode;

function chooseMode(value) {
  mode = value;
  preview.className = "preview " + value;
  refresh();
}

const color1 = addColor("hsl(273, 61%, 53%)");
const color2 = addColor("hsl(303, 54%, 60%)");

chooseMode("html");

code.addEventListener("mousedown", () => {
  let i = document.createElement("input");

  i.value = code.innerText;

  document.body.appendChild(i);

  i.focus();
  i.select();

  document.execCommand('copy');

  i.remove();
});

input.addEventListener("input", () => {
  refresh();
});

document.querySelectorAll(".menu > .left > .modes > .mode").forEach(mode => {
  mode.addEventListener("click", () => {
    chooseMode(mode.dataset.target);
  }, { passive: false });
});

let recentlyActive;
let state = 0;

document.addEventListener("click", ev => {
  if (ev.target?.tagName === 'INPUT') {
    recentlyActive = ev.target;
    recentlyActive.classList.add("recentlyActive");

    state = 2;
  } else if (state && --state == 0) {
    recentlyActive.classList.remove("recentlyActive");
  }
});
