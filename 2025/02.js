const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const products = readInput(lines)
  console.log(products)
  let tot = 0;
  products.forEach(([firstId, lastId]) => {
    const curInvalids = getInvalids(parseInt(firstId), parseInt(lastId))
    tot += curInvalids.reduce((prev,curr) => prev + curr, 0)
  })
  console.log("tot", tot)
  // count ranges
  let sumRange= 0;
  products.forEach(([first, last]) => {
    sumRange += parseInt(last) - parseInt(first)
  })
  console.log('sum range', sumRange)
}

function getInvalids(first=0, second=0) {
  const invalids = []

  for (let num = first; num < second + 1; num++) {
    const strNum = num.toString();
    //console.log('test', strNum)
    if (isInvalid(strNum)) {
      invalids.push(num)
    }
  }
  return invalids;
}

function isInvalid(strNum="") {
  const len = strNum.length  
  for (let i = 1; i < Math.floor(len / 2) + 1; i++) {
    if (len % i > 0) continue;
    const subStr = strNum.slice(0, i)
    let found = true;
    for (let j = i; j < len; j += i) {
      const subStr2 = strNum.slice(j, j + i)
      if (subStr !== subStr2) {
        found = false;
        break;
      }
    }
    if (found) {
      console.log('found?',found, subStr, strNum)
      return true;
    }
  }
}

function getInvalidPartOne(first=0,second=0) {
  const invalids = []
  for (let i = first; i < second + 1; i++) {
    //console.log('TEST', i)
    const strNum = i.toString();
    if (strNum.length % 2 > 0) continue;
    const half = strNum.length / 2;
    //console.log('halves', strNum.slice(0, half), strNum.slice(half))
    if (strNum.slice(0, half) === strNum.slice(half)) {
      console.log('invalid found', i)
      invalids.push(i)
    }
  }
  return invalids;
}
function readInput(lines=[]) {
  const products = [];
  lines.forEach(line => {
    console.log('line', line)
    line.split(',').forEach(prod => {
      const ids = prod.split('-')
      if (ids.length === 2) {
        products.push(ids)
      }
    })
  })
  return products;
}

module.exports = getAnswer;
