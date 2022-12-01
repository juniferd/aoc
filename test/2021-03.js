const {readFile, binaryToDecimal} = require('../utils.js');

function getBitRate(nums) {
  const res = Array(nums[0].length).fill(0);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let j = 0; j < num.length; j++) {
      const curr = +num[j];
      if (curr > 0) {
        res[j] += 1;
      } else {
        res[j] -= 1;
      }
    }
  }

  return res;
}

// least common bit at each place
function getEpisilonRate(nums) {
  const res = getBitRate(nums);
  return res.reduce((acc, num) => acc.concat(num > 0 ? '0' : '1'), '');

}

// most common bit at each place
function getGammaRate(nums) {
  const res = getBitRate(nums);
  return res.reduce((acc, num) => acc.concat(num > 0 ? '1' : '0'), '');
}

function getTotal(nums) {
  return binaryToDecimal(getEpisilonRate(nums)) * binaryToDecimal(getGammaRate(nums));
}

async function getRates() {
  const nums = await readFile('./input.txt', String);
  
  const res = getTotal(nums);
  console.log(res);

  return res;
}

function getBitRateAtPosition(nums, position) {
  let res = 0;
  nums.forEach(num => {
    const curr = +num[position];
    if (curr > 0) {
      res += 1;
    } else {
      res -= 1;
    }
  });
  return res;
}
// filter down most common bit criteria until you reach a single value (if equal choose 1)
function getOxygenGenRating(nums) {
  let res;  
  let filteredNums = nums;

  for (let i = 0; i < nums[0].split('').length; i++) {
    const moreCommonBit = getBitRateAtPosition(filteredNums, i) >= 0 ? 1 : 0;
    filteredNums = filteredNums.filter(num => +num[i] === moreCommonBit);
    if (filteredNums.length === 1) {
      res = filteredNums[0];
      break;
    }
  }

  return res;
}

// least common, if equal choose 0
function getCarbonScrubberRating(nums) {
  let res;  
  let filteredNums = nums;

  for (let i = 0; i < nums[0].split('').length; i++) {
    const lessCommonBit = getBitRateAtPosition(filteredNums, i) >= 0 ? 0 : 1;
    filteredNums = filteredNums.filter(num => +num[i] === lessCommonBit);
    if (filteredNums.length === 1) {
      res = filteredNums[0];
      break;
    }
  }

  return res;

}

async function getLifeSupportRating() {
  const nums = await readFile('./input.txt', String);
  const res = binaryToDecimal(getOxygenGenRating(nums)) * binaryToDecimal(getCarbonScrubberRating(nums));
  console.log(res)
  return res;
}

module.exports = {
  getRates,
  getLifeSupportRating,
}
