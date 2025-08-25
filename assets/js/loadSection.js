// assets/js/loadSection.js

function loadSection(sectionName, mapping) {
  fetch(`content/${sectionName}.md`)
    .then(response => response.text())
    .then(text => {
      const data = parseFrontMatter(text);

      for (const key in mapping) {
        const handler = mapping[key];
        const value   = data[key];

        if (!value) continue;

        // Si el mapping es una función, la ejecutamos
        if (typeof handler === "function") {
          handler(value, data);
          continue;
        }

        // Si es un string, buscamos el elemento por ID
        const el = document.getElementById(handler);
        if (!el) continue;

        // Lógica existente: IMG → src, A → href, resto → innerHTML
        if (el.tagName === "IMG") {
          el.src = value;
        } else if (el.tagName === "A") {
          el.href = value;
        } else {
          el.innerHTML = value;
        }
      }
    });
}

function parseFrontMatter(text) {
  const match = text.match(/---\n([\s\S]*?)\n---/);
  const yaml  = match ? match[1] : "";
  const lines = yaml.split("\n");
  const data  = {};

  lines.forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      data[key.trim()] = rest.join(":").trim();
    }
  });

  return data;
}
