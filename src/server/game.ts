export class ServerGame {
  private previousGuesses: number[][];
  private solution: number[];

  constructor() {
    this.previousGuesses = [];
    this.solution = generateRandomNumbers();
  }

  check(playerGuess: number[]) {
    playerGuess = [5, 4, 6, 1];
    // let code = [1, 3, 6, 2];
    console.log("solution", this.solution);

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
    console.log("res", res);
    return res;
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
