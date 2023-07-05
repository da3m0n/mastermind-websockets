export class ServerGame {
  private previousGuesses: number[][];
  private solution: number[];

  constructor() {
    this.previousGuesses = [];
    this.solution = generateRandomNumbers();
  }

  check(playerGuess: number[]): { res: string[]; message: string } {
    // this.solution = [1, 3, 6, 2];
    this.previousGuesses.push(playerGuess);

    if (this.previousGuesses.length === 2) {
      console.log("game over");
    }
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
    const message = "Weeener Weener Chicken Dinner!!!";
    // console.log("res", res);
    // return res;
    return { res, message };
  }

  getHints() {}
}

function generateRandomNumbers(): number[] {
  let arr: number[] = [1, 2, 3, 4, 5, 6];
  let res = new Set<number>();

  while (res.size < 4) {
    let randomNum: number = Math.floor(Math.random() * arr.length + 1);
    res.add(randomNum);
  }
  return Array.from(res);
}
