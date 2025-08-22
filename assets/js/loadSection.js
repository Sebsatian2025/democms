function loadSection(sectionName, mapping) {
    fetch(`content/${sectionName}.md`)
      .then(response => response.text())
      .then(text => {
        const data = parseFrontMatter(text);
        for (const key in mapping) {
          const elementId = mapping[key];
          const el = document.getElementById(elementId);
          if (el && data[key]) {
            if (el.tagName === "IMG") {
              el.src = data[key];
            } else if (el.tagName === "A") {
              el.href = data[key];
            } else {
              el.innerHTML = data[key];
            }
          }
        }
      });
  }
  
  function parseFrontMatter(text) {
    const match = text.match(/---\n([\s\S]*?)\n---/);
    const yaml = match ? match[1] : "";
    const lines = yaml.split("\n");
    const data = {};
    lines.forEach(line => {
      const [key, ...rest] = line.split(":");
      if (key && rest.length) {
        data[key.trim()] = rest.join(":").trim();
      }
    });
    return data;
  }
  