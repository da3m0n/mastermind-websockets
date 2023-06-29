import { log } from "console";
import { isTypedArray } from "util/types";

export class ServerGame {
  constructor() {}

  check(numbers: number[]) {
    numbers = [2, 4, 6, 1];
    let code = [2, 2, 3, 4];
    let res = [];

    for (let i =8 0; i < numbers.length; i++) {
      const num = numbers[i];
      console.log;
      if (num === code[i]) {
        res.push("x");
      } else {
        res.push("_");
      }
    }

    console.log("res", res);
    return [true, false, true, false];
  }
}

// function generateRandomNumbers(n: number): number[] {
//   const array = [];
//   for (let i = 0; i < n; i++) {
//     array.push(Math.floor(Math.random() * n) + 1);
//   }
//   return array;
// }

// if (module.exports) {
//   module.exports = generateRandomNumbers;
// }
