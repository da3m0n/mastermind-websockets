class Board {
  constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;
    this._colors = [
      { id: 1, pegColor: "#18e7e7", pegTextColor: "#0aabab" },
      { id: 2, pegColor: "#07f007", pegTextColor: "#039c03" },
      { id: 3, pegColor: "#ff0000", pegTextColor: "#a10404" },
      { id: 4, pegColor: "#065798eb", pegTextColor: "#0486ee" },
      { id: 5, pegColor: "#ffff00", pegTextColor: "#b2b230" },
      { id: 6, pegColor: "#9c27b0", pegTextColor: "#d83ef2" },
    ];
  }

  makeBoard() {
    let inputDiv = document.getElementById("input-div");
    for (let i = 0; i < this._rows; i++) {
      let rowDiv = createDom("div", { class: "row-div" });
      for (let j = 0; j < this._cols; j++) {
        let peg = createDom("div", { class: "peg" });
        let pegInput = createDom("input", { class: "peg-input" });
        peg.appendChild(pegInput);
        rowDiv.appendChild(peg);
      }

      rowDiv.appendChild(this.makeControls());
      rowDiv.appendChild(this.makeHints());
      inputDiv.appendChild(rowDiv);
      // <button type="button" onClick="generateNumbers()">Generate New</button>
    }

    let grid = document.getElementsByClassName("board")[0];
    grid.appendChild(this.makeCodePegs());

    let generateNewBtn = createDom("button");
    generateNewBtn.innerHTML = "New Game";
    generateNewBtn.addEventListener("click", () => {
      let data = {
        type: "create",
      };
      wss.send(JSON.stringify(data));
      // console.log("nums: ", generateNumbers(7));
    });
    let boardWrapper = document.getElementsByTagName("footer")[0];
    boardWrapper.appendChild(generateNewBtn);
  }

  makeHints() {
    let hintsDiv = createDom("div", { class: "hints" });

    for (let i = 0; i < this._cols; i++) {
      let name = "hint" + (i + 1);
      let hintPeg = createDom("div", { class: "hint-peg " + name });
      hintsDiv.appendChild(hintPeg);
    }
    return hintsDiv;
  }

  makeControls() {
    let controlsDiv = createDom("div", { class: "controls" });
    let checkButton = createDom("button", { value: "check" });
    checkButton.innerHTML = "Check";

    let undoButton = createDom("button", { value: "undo" });
    undoButton.innerHTML = "Undo";

    checkButton.addEventListener("click", (e) => {
      console.log("check clicked", e);
      let data = { type: "check", data: "message from check button" };
      // wss.send(JSON.stringify(data));
      checkNumbers();
    });

    undoButton.addEventListener("click", (e) => {
      console.log("undo clicked", e);
      let data = { type: "undo", data: "message from undo button" };
      wss.send(JSON.stringify(data));
    });

    controlsDiv.appendChild(undoButton);
    controlsDiv.appendChild(checkButton);

    return controlsDiv;
  }

  makeCodePegs() {
    let codePegs = createDom("div", { class: "code-pegs" });

    for (let i = 0; i < this._colors.length; i++) {
      const color = this._colors[i];
      let pegBtn = createDom("button", {
        class: "code-peg",
        style: "background: " + color.pegColor,
      });
      let text = createDom("span", {
        class: "peg-text",
        style: "color: " + color.pegTextColor,
      });
      text.innerHTML = i + 1;
      pegBtn.appendChild(text);
      codePegs.appendChild(pegBtn);
    }
    return codePegs;
  }
}
