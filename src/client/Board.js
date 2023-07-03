class Board {
  constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;
    this._pegColors = [
      { id: 1, pegColor: "#18e7e7", pegTextColor: "#0aabab" },
      { id: 2, pegColor: "#07f007", pegTextColor: "#039c03" },
      { id: 3, pegColor: "#ff0000", pegTextColor: "#a10404" },
      { id: 4, pegColor: "#065798eb", pegTextColor: "#0486ee" },
      { id: 5, pegColor: "#ffff00", pegTextColor: "#b2b230" },
      { id: 6, pegColor: "#9c27b0", pegTextColor: "#d83ef2" },
    ];
    this.playerGuess = [];
    this.enableBtn = false;

    document.addEventListener("keypress", async (e) => {
      let el = document.querySelector(`[data-key="${e.key}"`);
      // ?.dispatchEvent(new MouseEvent("click", { cancelable: true }));

      let num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        let row = this.board_[this.curRow_];
        let cell = row[this.curCol_];

        let attributes = {
          style:
            "background: " +
            this._pegColors[num - 1].pegColor +
            "; color: " +
            this._pegColors[num - 1].pegTextColor,
        };
        this.decorateCodePeg(cell.peg, num, attributes);
        cell.num = num;

        if (this.curCol_ == 3) {
          // send to server and check
          let res = await checkNumbers(row.map((x) => x.num));
          console.log(
            "checking result", res);
          this.curRow_++;
        }
        this.curCol_ = (this.curCol_ + 1) % 4;
      }
      console.log("clicked", e.key);
    });
    this.board_ = this.makeBoard();
    this.curRow_ = 0;
    this.curCol_ = 0;
  }

  makeBoard() {
    let rows = [];
    let inputDiv = document.getElementById("input-div");
    for (let i = 0; i < this._rows; i++) {
      let rowDiv = createDom("div", { class: "row-div" });
      let row = [];
      rows.push(row);

      for (let j = 0; j < this._cols; j++) {
        let peg = createDom("div", { class: "code-peg" });

        // const attributes = {
        // style:
        //   "background: " +
        //   this._pegColors[e.key - 1].pegColor +
        //   "; color: " +
        //   this._pegColors[e.key - 1].pegTextColor,
        // };
        // this.decorateCodePeg(peg, e.key, attributes);

        // peg.appendChild(pegInput);
        rowDiv.appendChild(peg);
        row.push({ peg, value: null });
      }

      rowDiv.appendChild(this.makeControls());
      rowDiv.appendChild(this.makeHints());
      inputDiv.appendChild(rowDiv);
    }

    let grid = document.getElementsByClassName("board")[0];
    grid.appendChild(this.makeCodePegs());

    let generateNewBtn = createDom("button");
    generateNewBtn.innerHTML = "New Game";
    generateNewBtn.addEventListener("click", () => {
      let data = {
        type: "create",
      };
      // wss.send(JSON.stringify(data));
      new Game();
    });
    let boardWrapper = document.getElementsByTagName("footer")[0];
    boardWrapper.appendChild(generateNewBtn);

    return rows;
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
    let checkButton = createDom("button", {
      id: "checkCodeBtn",
      value: "check",
      // disabled: this.enableBtn,
    });

    // checkButton.addEventListener("change", (e) => {
    //   console.log("xxxx");
    //   if (this.playerGuess === 4) {
    //     console.log("chANGE BTN");
    //   }
    // });
    checkButton.innerHTML = "Check";

    let undoButton = createDom("button", { value: "undo", disabled: true });
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
      // wss.send(JSON.stringify(data));
    });

    controlsDiv.appendChild(undoButton);
    controlsDiv.appendChild(checkButton);

    return controlsDiv;
  }

  makeCodePegs() {
    let codePegs = createDom("div", { class: "code-pegs" });

    for (let i = 0; i < this._pegColors.length; i++) {
      const num = i + 1;
      const color = this._pegColors[i];
      let pegBtn = createDom("button", {
        class: "code-peg",
        style:
          "background: " + color.pegColor + "; color: " + color.pegTextColor,
        "data-key": num,
        value: num,
      });
      pegBtn.innerHTML = num;

      let pegBtn2 = createDom("div", { class: "code-peg" });
      const attributes = {
        "data-key": num,
        value: num,
        style:
          "background: " + color.pegColor + "; color: " + color.pegTextColor,
      };

      this.decorateCodePeg(pegBtn2, num, attributes);

      codePegs.appendChild(pegBtn2);
      // codePegs.appendChild(pegBtn);
    }
    return codePegs;
  }

  decorateCodePeg(el, num, attributes) {
    return Object.keys(attributes).forEach((attr) => {
      el.setAttribute(attr, attributes[attr]);
      el.innerHTML = num;
    });
  }
}
