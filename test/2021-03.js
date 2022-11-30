const {readFile, binaryToDecimal} = require('./utils.js');

function getBitRate(nums) {
  const res = Array(nums[0].length).fill(0);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let j = 0; j < num.length; j++) {
      const curr = num[j];
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

module.exports = {
  getRates,
}
