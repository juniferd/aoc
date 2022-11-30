const {readFile} = require('./utils.js');

// how many increases

async function countIncreases() {
  const nums = await readFile('./input.txt', Number);

  let last = null;
  let count = 0;

  for (let num of nums) {
    if (last && num > last) {
      count++;
    }
    last = num;
  }

  console.log(count)
  return count;
}

// how many sliding windows of 3 increases

async function countWindowIncreases() {
  const nums = await readFile('./input.txt', Number);
  let last = null;
  let count = 0;

  nums.forEach((num, i) => {
    if (i < 2) return;
    const sums = nums.slice(i-2, i+1).reduce((prev, curr) => prev + curr, 0);
    if (last && sums > last) {
      count++;
    }
    last = sums;
  });
  console.log(count);
  return count;
}

module.exports = {
  countIncreases,
  countWindowIncreases,
}
