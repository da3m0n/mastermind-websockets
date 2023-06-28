function createDom(type, props, ...cells) {
  let row = document.createElement(type);

  if (props) {
    for (let p in props) {
      row.setAttribute(p, props[p]);
    }
  }

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if (cell === undefined) {
      cell = document.createTextNode("undefined");
    } else if (typeof cell !== "object") {
      cell = document.createTextNode(cell.toString());
    }
    row.appendChild(cell);
  }
  return row;
}
