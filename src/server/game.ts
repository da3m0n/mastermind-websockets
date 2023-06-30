import { log } from "console";
import { isTypedArray } from "util/types";

export class ServerGame {
  constructor() {}

  check(playerGuesses: number[]) {
    playerGuesses = [5, 4, 6, 1];
    let code = [1, 3, 6, 2];
    let res = Array<string>(4).fill("_");
    let notExactMatch = new Set<number>();

    for (let i = 0; i < playerGuesses.length; i++) {
      const num = playerGuesses[i];
      if (num === code[i]) {
        res[i] = "x";
      } else {
        notExactMatch.add(code[i]);
      }
    }

    for (let i = 0; i < playerGuesses.length; i++) {
      let num = playerGuesses[i];

      if (res[i] != "x") {
        res[i] = notExactMatch.has(num) ? "c" : "_";
      }
    }

    console.log("nums", generateRandomNumbers());
    return res;
  }
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
