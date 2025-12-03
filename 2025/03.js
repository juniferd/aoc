const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const jolts = readInput(lines)
  console.log('jolts', jolts)
  let tot = 0;
  jolts.forEach((digits) => {
    const maxJolts = getMax2(digits)
    tot += maxJolts
  })
  console.log('tot', tot)
}

function getMax(digits = []) {
  // let max = traverse(digits, 0, digits[0])
  let max = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    for (let j = i+1; j< digits.length; j++) {
      const digit = parseInt(`${digits[i]}${digits[j]}`)
      if (digit > max) {
        max = digit
      }
    }
  }
  console.log('DIGITS', digits, 'MAX', max)
  return max;
}

function getMax2(digits = []) {
  const cache = {}
  let max = traverse(digits, 0, 12, cache)

  console.log('max', max, digits)
  return max;
}

function traverse(digits, index=0, n=12, cache={}) {
  const key = `${index}-${n}`
  if (n === 0 || index >= digits.length) {
    return '';
  }
  if (key in cache) return cache[key]

  // take
  const left = `${digits[index]}` + traverse(digits, index + 1, n - 1, cache)
  // skip
  const right = traverse(digits, index + 1, n, cache)
  if (right === '') return left;

  console.log('left', left, 'right', right)

  const res = Math.max(parseInt(left), parseInt(right))
  cache[key] = res;
  return res;
}

function readInput(lines=[]) {
  const res = []
  lines.forEach(line => {
    // console.log('LINE', line)
    res.push(line.split('').map(n => parseInt(n)))
  })
  return res;
}

module.exports = getAnswer;
