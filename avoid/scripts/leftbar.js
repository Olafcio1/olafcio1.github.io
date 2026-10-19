export class Leftbar {
  static #element = document.querySelector(".leftbar");
  static #transitionsActive = false;

  constructor() {
    throw new Error("Leftbar cannot be constructed");
  }

  static #getElements(items) {
    let elements = [];

    for (let item of items) {
      if (Object.keys(item).length == 0) {
        elements.push(document.createElement("br"));
      } else if (item instanceof Array) {
        let sub = document.createElement("div");

        sub.className = "sub";
        sub.replaceChildren(...this.#getElements(item));

        elements.push(sub);
      } else {
        let a = document.createElement("a");

        a.href = "#";
        a.innerHTML = `

          <i class="fa-slab-press-duo ${item.icon??''}">${item.iconRaw??''}</i>
          <span class="sep"></span>
          <span>${item.text}</span>

        `;

        if (typeof item.click !== 'undefined') {
          a.addEventListener("click", ev => item.click(ev));
        }

        elements.push(a);
      }
    }

    return elements;
  }

  static replace(items, { transitions = false, active = false } = {}) {
    let elements = this.#getElements(items);

    let prevActive = this.#element.classList.contains("active");
    let prevWidth = this.#element.offsetWidth;

    this.#element.classList.toggle("active", active);
    this.#element.replaceChildren(...elements);

    if (transitions && active != prevActive) {
      this.#element.animate([
        { width: prevWidth                 + "px" },
        { width: this.#element.offsetWidth + "px" }
      ], { duration: 300, easing: "ease-in", fill: "forwards" });
    }

    this.#transitionsActive = transitions ? true : (active ? "" : false);

    this.#registerHandlers();
  }

  static #pages;
  static #target;

  static #registerHandlers() {
    this.#pages = document.querySelectorAll(".leftbar > a, .leftbar .sub > a");

    this.#pages.forEach(link => {
      link.addEventListener("mousedown", () => {
        if (this.#transitionsActive !== false)
          this.#target = link;

        let event = new Event("link");
        event.name = link.children[2].innerText.toLowerCase();
        dispatchEvent(event);
      });
    });
  }

  static {
    const leftbar = this.#element;

    document.addEventListener("mouseup", () => {
      if (this.#transitionsActive === false)
        return;

      let prevWidth = leftbar.offsetWidth;

      this.#pages.forEach(page => page.classList.toggle("active", page === this.#target));

      if (leftbar.classList.contains("active"))
        return;

      leftbar.classList.toggle("active", !!this.#target);

      if (!this.#transitionsActive)
        return;

      if (prevWidth != leftbar.offsetWidth)
        leftbar.animate([
          { width: prevWidth           + "px" },
          { width: leftbar.offsetWidth + "px" }
        ], { duration: 300, easing: "ease-in", fill: "forwards" });
    });
  }
}
