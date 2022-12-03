const { readFile } = require('../utils.js')

const LEFT_BRACES = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}
const RIGHT_BRACES = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}
const SCORE = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const AUTOCOMPLETE_POINT = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

function isValid(braces) {
  const stack = [];
  for (let i = 0; i < braces.length; i++) {
    const brace = braces[i]; 
    if (Object.keys(LEFT_BRACES).includes(brace)) {
      stack.push(brace);
    } else {
      const lastBrace = stack.pop();
      if (RIGHT_BRACES[brace] !== lastBrace) return {valid: false, brace};
    }
  }
  return {valid: true, stack};
}

async function getErrorScore(file = './input.txt') {
  const lines = await readFile(file)

  let score = 0

  lines.forEach((line) => {
    const brackets = line.trim().split('')
    const {valid, brace} = isValid(brackets)
    if (!valid) {
      score += SCORE[brace]
    }
  })
  console.log(score)
}

function scoreAutocomplete(brace, total) {
  return (total * 5) + AUTOCOMPLETE_POINT[LEFT_BRACES[brace]];
}

async function getAutocompleteScore(file = './input.txt') {
  const lines = await readFile(file)
  let scores = [];

  lines.forEach((line) => {
    const brackets = line.trim().split('');
    let {valid, stack} = isValid(brackets)
    if (valid) {
      console.log('stack', stack)
      let currScore = 0;
      while(stack.length) {
        const curr = stack.pop();
        currScore = scoreAutocomplete(curr, currScore)
      }
      scores.push(currScore)
    }
  });

  // sort and get middle
  scores.sort((a, b) => a-b);
  const mid = scores.slice(scores.length / 2)
  console.log(mid[0])
  return mid[0]
}

module.exports = {
  getErrorScore,
  getAutocompleteScore,
}
