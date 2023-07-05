class Board {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.pegColors_ = [
      { id: 1, pegColor: "#18e7e7", pegTextColor: "#0aabab" },
      { id: 2, pegColor: "#07f007", pegTextColor: "#039c03" },
      { id: 3, pegColor: "#ff0000", pegTextColor: "#a10404" },
      { id: 4, pegColor: "#065798eb", pegTextColor: "#0486ee" },
      { id: 5, pegColor: "#ffff00", pegTextColor: "#b2b230" },
      { id: 6, pegColor: "#9c27b0", pegTextColor: "#d83ef2" },
    ];

    this.hintClasses = [
      {
        x: "exact",
        c: "close",
        _: "missing",
      },
    ];
    this.board = this.makeBoard();

    this.playerGuess = [];
    this.enableBtn = false;
    // this.selectedRow = 0;
    this.curRow = 0;
    this.curCol = 0;
    this.guesses = new Set();

    // this.updateActiveRow(this.curRow);

    document.addEventListener("keypress", async (e) => {
      let num = parseInt(e.key);

      if (num >= 1 && num <= 6 && !this.guesses.has(num)) {
        this.guesses.add(num);
        let row = this.board.rows[this.curRow];
        let rowDiv = this.board.rowsDiv[this.curRow];
        let cell = row[this.curCol];

        let attributes = {
          style:
            "background: " +
            this.pegColors_[num - 1].pegColor +
            "; color: " +
            this.pegColors_[num - 1].pegTextColor,
        };
        this.decorateCodePeg(cell.peg, num, attributes);
        cell.num = num;

        if (this.curCol === 3) {
          // send to server and check
          let res = await checkNumbers(row.map((x) => x.num));
          this.updateHints(res, rowDiv);
          this.curRow++;
          this.guesses.clear();
        }
        this.curCol = (this.curCol + 1) % 4;
        console.log("this.curCol", this.curCol, "row", this.curRow);
      }
    });
  }

  updateHints(hints, currRow) {
    const row = currRow.rowDiv.querySelectorAll("div[id]");
    console.log("row", row);
    row.forEach((r, i) => {
      let hint = hints[i];
      if (hint === "x") {
        // peg.setAttribute("class", "exact");
        r.classList.add("exact");
      } else if (hint === "c") {
        // peg.setAttribute("class", "close");
        r.classList.add("close");
      }
    });
  }

  makeBoard() {
    let rows = [];
    let rowsDiv = [];

    let inputDiv = document.getElementById("input-div");
    for (let i = 0; i < this.rows; i++) {
      let rowDiv = createDom("div", { class: "row-div" });

      let row2 = [];
      let row = [];
      rows.push(row);

      for (let j = 0; j < this.cols; j++) {
        let peg = createDom("div", { class: "code-peg" });
        rowDiv.appendChild(peg);
        row.push({ peg, value: null });
      }

      rowDiv.appendChild(this.makeControls());
      rowDiv.appendChild(this.makeHints());
      // this.row.push([{ rowDiv }]);
      rowsDiv.push({ rowDiv });
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
      new Game();
    });

    let boardWrapper = document.getElementsByTagName("footer")[0];
    boardWrapper.appendChild(generateNewBtn);

    // return rows;
    return { rows, rowsDiv };
  }

  makeHints() {
    let hintsDiv = createDom("div", { class: "hints" });

    for (let i = 0; i < this.cols; i++) {
      let name = "hint" + (i + 1);
      let hintPeg = createDom("div", {
        id: "hint-peg-" + (i + 1),
        class: "hint-peg " + name,
      });
      // const attributes = {
      //   style:
      //     "background: " + color.pegColor + "; color: " + color.pegTextColor,
      // };
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

    for (let i = 0; i < this.pegColors_.length; i++) {
      const num = i + 1;
      const color = this.pegColors_[i];
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
