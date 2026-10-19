class Context {
  #ctx;

  constructor(ctx, { padX, padY }) {
    this.#ctx = ctx;
    this.#padX = padX;
    this.#padY = padY;
  }

  beginPath() {
    this.#ctx.beginPath();
  }

  fill() {
    this.#ctx.fill();
  }

  stroke() {
    this.#ctx.stroke();
  }

  moveTo(x, y) {
    if (x != Math.floor(x) || x == 1) x *= this.#ctx.canvas.width - (this.padX*2);
    if (y != Math.floor(y) || y == 1) y *= this.#ctx.canvas.height - (this.padY*2);

    x += this.padX;
    y += this.padY;

    this.#ctx.moveTo(x, y);
  }

  #padX;
  #padY;

  get padX() { return this.#padX }
  get padY() { return this.#padY }

  lineTo(x, y) {
    if (x != Math.floor(x) || x == 1) x *= this.#ctx.canvas.width - (this.padX*2);
    if (y != Math.floor(y) || y == 1) y *= this.#ctx.canvas.height - (this.padY*2);

    x += this.padX;
    y += this.padY;

    this.#ctx.lineTo(x, y);
  }
}

function getMask(drawer) {
  let cnv = document.createElement("canvas");

  const padX = 5,
        padY = 5;

  cnv.id = "cursor";
  cnv.width = 20 + padX*2;
  cnv.height = 30 + padY*2;

  document.body.append(cnv);

  let ctx = cnv.getContext('2d');

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  //ctx.shadowBlur = 3;
  //ctx.shadowColor = "#fff6";
  //ctx.shadowOffsetX = 1;
  //ctx.shadowOffsetY = 1;
  ctx.lineCap = "round";

  ctx = new Context(ctx, { padX, padY });

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, .8);
  ctx.lineTo(.4, .6);
  ctx.lineTo(1, .6);
  ctx.lineTo(0, 0);
  ctx[drawer]();

  let png = cnv.toDataURL('image/png');

  cnv.remove();

  return png;
}

function disableDragging() {
  addEventListener("dragstart", ev => {
    ev.preventDefault();
  });
}

export async function activateCursor() {
  let mask      = getMask("stroke");
  let mask_fill = getMask("fill");

  appendStyles();
  disableDragging();

  let el = document.createElement("div");

  el.id = "cursor";
  el.innerHTML = `

    <div class="child"></div>

  `;

  el.style.setProperty("--mask", "url(" + URL.createObjectURL(new Blob([await (await fetch(mask)).arrayBuffer()], { type:"image/png" })) + ")");

  el.style.setProperty("--mask-fill", "url(" + URL.createObjectURL(new Blob([await (await fetch(mask_fill)).arrayBuffer()], { type:"image/png" })) + ")");

  document.body.append(el);

  document.addEventListener("mousemove", ev => {
    el.style.left = ev.pageX + "px";
    el.style.top = ev.pageY + "px";
  });
}

function appendStyles() {
  if (!document.querySelector('#avoid-cursor-css')) {
    let css = document.createElement("style");

    css.id = "avoid-cursor-css";
    css.textContent = `

*:not(.a) {
  cursor: none!important;
}

#cursor {
  position: fixed;
  z-index: 99;
  width: 30px;
  height: 40px;
  pointer-events: none;

  &::before, &::after, > .child, > .child::after {
    content: '';
    display: block;
    inset: 0;
    position: absolute;
  }

  &::before, > .child::after {
    /* background: conic-gradient(#5600ff, #8500ff); */
    /* background: linear-gradient(#41a597aa, #225c5c); */

    background: conic-gradient(#00a1ff, #8500ff);
    mask-image: var(--mask);
  }

  &::after {
    background: #fff0;
    backdrop-filter: blur(8px) saturate(2);
    mask-image: var(--mask-fill);
  }

  > .child {
    z-index: 1;
    filter: blur(7px) brightness(.8);
  }
}

    `;

    document.head.append(css);
  }
}
