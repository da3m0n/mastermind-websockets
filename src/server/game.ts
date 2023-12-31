export class ServerGame {
  private previousGuesses: string[][];
  private solution: number[];
  private STATE = {
    playing: 0,
    won: 1,
    lost: 2,
    new: 3,
  };

  constructor() {
    this.previousGuesses = [];
    this.solution = generateRandomNumbers();
  }

  check(playerGuess: number[]): {
    res: string[];
    state: number;
    solution?: number[];
  } {
    // this.solution = [1, 3, 6, 2];
    // this.previousGuesses.push(playerGuess);

    let message = "";

    let res = Array<string>(4).fill("_");
    let notExactMatch = new Set<number>();

    for (let i = 0; i < playerGuess.length; i++) {
      const num = playerGuess[i];
      if (num === this.solution[i]) {
        res[i] = "x";
      } else {
        notExactMatch.add(this.solution[i]);
      }
    }

    for (let i = 0; i < playerGuess.length; i++) {
      let num = playerGuess[i];

      if (res[i] != "x") {
        res[i] = notExactMatch.has(num) ? "c" : "_";
      }
    }
    this.previousGuesses.push(res);

    if (res.join("").toString() === "xxxx") {
      return {
        res,
        state: this.STATE.won,
      };
    }

    if (this.previousGuesses.length === 6) {
      const obj = {
        res,
        state: this.STATE.lost,
        solution: this.solution,
      };
      console.log("solution", obj);
      return obj;
    }
    return { res, state: this.STATE.playing };
  }

  getHints() {
    console.log("get hints");
  }

  newGame(): { state: number } {
    console.log("new Game in game.ts");
    new ServerGame();
    return {
      state: this.STATE.new,
    };
  }
}

function generateRandomNumbers(): number[] {
  let arr: number[] = [1, 2, 3, 4, 5, 6, 7];
  let res = new Set<number>();

  while (res.size < 4) {
    let randomNum: number = Math.floor(Math.random() * arr.length + 1);
    res.add(randomNum);
  }
  return Array.from(res);
}
