function generateRandomNumbers(n: number): number[] {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(Math.floor(Math.random() * n) + 1);
  }
  return array;
}

if (module.exports) {
  module.exports = generateRandomNumbers;
}
