const { readFile } = require('../utils.js')

function insertPolymer(original, rules) {
  const originalPairs = original
    .map((letter, i) => {
      return letter + original[i + 1]
    })
    .slice(0, -1)

  let final = ''

  originalPairs.forEach((pair) => {
    final += pair[0] + rules[pair]
  })
  final += original.slice(-1)

  return final
}

function getRules(lines = []) {
  const rules = {}

  lines.forEach(([pair, insertion]) => {
    rules[pair] = insertion
  })

  return rules
}

function getDiff(letters = []) {
  const count = {}
  letters.forEach((letter) => {
    if (letter in count) {
      count[letter] += 1
    } else {
      count[letter] = 1
    }
  })

  return Math.max(...Object.values(count)) - Math.min(...Object.values(count))
}

async function getPolymerDiff(file = '../input.txt') {
  const lines = await readFile(file)
  const start = lines[0]
  const rules = getRules(lines.slice(2).map((line) => line.split(' -> ')))
  // console.log(start);
  // console.log(rules);
  let curr = start
  for (i = 0; i < 10; i++) {
    const updatedPolymerTemplate = insertPolymer(curr.split(''), rules)
    // console.log(updatedPolymerTemplate)
    curr = updatedPolymerTemplate
  }

  const res = getDiff(curr.split(''))
  console.log(res)
}

function assignCountPair(pair = '', count = {}, num=1) {
  if (pair in count) {
    count[pair] += num 
  } else {
    count[pair] = num
  }
}
function getPairCount(origCount, rules) {
  const count = {}
  Object.entries(origCount).forEach(([pair, num]) => {
    const insertionLetter = rules[pair];
    const pair1 = `${pair[0]}${insertionLetter}`;
    const pair2 = `${insertionLetter}${pair[1]}`;
    assignCountPair(pair1, count, num)
    assignCountPair(pair2, count, num)
  })

  return count;
}
function getPairs(letters=[]) {
  const count = {};
  let startLetter;
  let endLetter;

  letters.forEach((letter, i) => {
    if (i === 0) {
      startLetter = letter;
    }
    if (i === letters.length - 1) {
      endLetter = letter;
    }
    const nextLetter = letters[i + 1];
    if (nextLetter) {
      const pair = `${letter}${nextLetter}`
      if (pair in count) {
        count[pair] += 1
      } else {
        count[pair] = 1
      }
    }
  })
  return {count, startLetter, endLetter};
}

function getFinalDiff(count, startLetter, endLetter) {
  const letters = {}
  Object.entries(count).forEach(([pair, num]) => {
    const letter1 = pair[0]
    const letter2 = pair[1]
    assignCountPair(letter1, letters, num)
    assignCountPair(letter2, letters, num)
  })
  // get max and min
  let maxCount = 0;
  let minCount = Infinity;

  Object.entries(letters).forEach(([letter, num]) => {
    let currCount;
    if (letter === startLetter || letter === endLetter) {
      currCount = Math.ceil(num / 2)
    } else {
      currCount = num / 2
    }
    
    if (currCount > maxCount) {
      maxCount = currCount
    }
    if (currCount < minCount) {
      minCount = currCount
    }
  })
  return maxCount - minCount
}

async function getPolymerDiffBig(file = '../input.txt') {
  const lines = await readFile(file)
  const start = lines[0]
  const rules = getRules(lines.slice(2).map((line) => line.split(' -> ')))
  console.log(start)
  console.log(rules)
  const {count: firstPairs, startLetter, endLetter}= getPairs(start.split(''))

  let count = firstPairs
  for (let i = 0; i < 40; i++) {
    count = getPairCount(count, rules)
  }

  console.log(getFinalDiff(count, startLetter, endLetter))
}

module.exports = getPolymerDiffBig
