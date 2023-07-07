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
      { id: 7, pegColor: "#0e7c8c", pegTextColor: "#d7ced9" },
    ];

    // new Game();

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

    document.addEventListener("keypress", this.handleKeyboardInput());
  }

  handleKeyboardInput() {
    return async (e) => {
      let num = parseInt(e.key);

      if (num >= 1 && num <= 7 && !this.guesses.has(num)) {
        this.guesses.add(num);
        let codePegRow = this.board.codePegRow[this.curRow];
        let rowDiv = this.board.rowsDiv[this.curRow];
        let cell = codePegRow[this.curCol];

        let attributes = {
          style:
            "background: " +
            this.pegColors_[num - 1].pegColor +
            "; color: " +
            this.pegColors_[num - 1].pegTextColor,
        };
        this.decorateCodePeg(cell.peg, num, attributes);
        cell.num = num;

        if (this.curCol === this.cols - 1) {
          // send to server and check
          let res = await checkNumbers(codePegRow.map((x) => x.num));

          this.updateHints(res.res, rowDiv);
          if (res.state === 1) {
            this.makeBanner("Weener weener cheekun dinner!!", res);
          } else if (res.state === 2) {
            this.makeBanner("You have lost!@!", res);
            // this.showSolution(res.solution);
          }
          this.curRow++;
          this.guesses.clear();
        }
        this.curCol = (this.curCol + 1) % this.cols;
        console.log("this.curCol", this.curCol, "row", this.curRow);
      }
    };
  }

  showSolution(solution) {}

  makeBanner(message, res) {
    const banner = createDom("div");
    const solutionDiv = document.getElementById("solution");
    solutionDiv.removeAttribute("hidden");
    const text = createDom("p", { class: "banner-text" }, message);
    banner.appendChild(text);
    solutionDiv.style.display = "flex";

    if (res.solution !== undefined) {
      for (let i = 0; i < res.solution.length; i++) {
        const re = res[i];
        const color = this.pegColors_[res.solution[i] - 1];
        const peg = createDom("div", { class: "code-peg" });
        const attributes = {
          style:
            "background: " + color.pegColor + "; color: " + color.pegTextColor,
        };

        this.decorateCodePeg(peg, res.solution[i], attributes);
        solutionDiv.appendChild(peg);
      }
    } else {
      solutionDiv.appendChild(banner);
    }
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
    let codePegRow = [];
    let rowsDiv = [];

    let inputDiv = document.getElementById("input-div");
    for (let i = 0; i < this.rows; i++) {
      let rowDiv = createDom("div", { class: "row-div" });
      let pegDiv = createDom("div", { class: "code-peg-div" });
      let row = [];

      codePegRow.push(row);

      for (let j = 0; j < this.cols; j++) {
        let peg = createDom("div", { class: "code-peg" });
        pegDiv.appendChild(peg);
        row.push({ peg, value: null });
      }

      rowDiv.appendChild(pegDiv);
      rowDiv.appendChild(this.makeControls());
      rowDiv.appendChild(this.makeHints());
      rowsDiv.push({ rowDiv });
      inputDiv.appendChild(rowDiv);
    }

    let grid = document.getElementsByClassName("board")[0];
    grid.appendChild(this.makeCodePegs(this.pegColors_.length));

    let generateNewBtn = createDom("button", {}, "New Game");

    generateNewBtn.addEventListener("click", async () => {
      let data = {
        type: "create",
      };
      new Game();
      let res = await startNewGame();
      if (res.state === 3) {
        console.log("new game xx", res);
        this.removeStyles();
      }
    });

    let boardWrapper = document.getElementsByTagName("footer")[0];
    boardWrapper.appendChild(generateNewBtn);

    return { codePegRow, rowsDiv };
  }

  removeStyles() {
    const codePegDiv = document.getElementsByClassName("code-peg-div");

    for (const div in codePegDiv) {
      for (const peg in codePegDiv[div].childNodes) {
        const pegDiv = codePegDiv[div].childNodes[peg];
        if (pegDiv.style !== undefined) {
          pegDiv.removeAttribute("style");
          pegDiv.innerHTML = "";
        }
      }
    }
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

      let pegBtn = createDom("div", { class: "code-peg" });
      const attributes = {
        "data-key": num,
        value: num,
        style:
          "background: " + color.pegColor + "; color: " + color.pegTextColor,
      };

      this.decorateCodePeg(pegBtn, num, attributes);

      codePegs.appendChild(pegBtn);
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
