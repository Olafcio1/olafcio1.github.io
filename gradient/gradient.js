export function supplyGradient({ text, method, color1, color2, element }) {
  //const text = "all your issues";
  //const method = "latex";  // 'html' or 'latex' or 'latex_md' or 'minecraft'

  //const color1 = "hsl(273, 61%, 53%)"
  //const color2 = "hsl(303, 54%, 60%)"

  let canvas = document.createElement("canvas");

  document.body.appendChild(canvas);
  element.replaceChildren();

  let ctx = canvas.getContext('2d');

  let i = 0;
  let out = '';

       if (method=='latex') out += "$";
  else if (method=='latex_md') out += `<img style="height: 30px" src="https://latex.codecogs.com/svg.latex?`;

  let parts = [...text];
  let space = 0;

  parts.forEach((part, index) => {
    if (part == ' ') {
      space++;

      parts[index] = '';
      parts[index - space] += ' ';
    } else {
      space = 0;
    }
  });

  parts = parts.filter(v => v);

  for (let ch of parts) {
      let sub = document.createElement("font");
      sub.style.color = `color-mix(in srgb, ${color1} ${~~((i++ / text.length) * 100)}%, ${color2})`;
      sub.innerText = ch;
      element.append(sub);

      let color = getComputedStyle(sub).color;
      let [ r, g, b ] = color.substring(11, color.length - 1).split(" ");

      if (method == 'html')
          out += `<font color="#${hex(r)}${hex(g)}${hex(b)}">${ch}</font>`;
      else if (method == 'latex')
          out += `\\color{#${hex(r)}${hex(g)}${hex(b)}}{\\text{${ch}}}`;
      else if (method == 'latex_md')
          out += `\\color{%23${hex(r)}${hex(g)}${hex(b)}}{\\text{${encodeURIComponent(ch)}}}`;
      else if (method == 'minecraft')
          out += `&#${hex(r)}${hex(g)}${hex(b)}`;
      else
          throw new Error("Expected method to be 'html' or 'latex' or 'latex_md' or 'minecraft'");
  }

       if (method=='latex') out += "$";
  else if (method=='latex_md') out += `">`;

  canvas.remove();

  return out;
}

function hex(num) {
    let str = Math.floor(num * 255).toString(16);
    return "0".repeat(2 - str.length) + str;
}
