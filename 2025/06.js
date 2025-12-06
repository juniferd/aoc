const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  // part one
  // const cols = readInput(lines)
  // let tot = 0;
  // Object.values(cols).forEach((arr) => {
  //   let operator = arr.pop();
  //   let currTot = arr.pop();
  //   while (arr.length > 0) {
  //     const curr = arr.pop();
  //     if (operator === '+') {
  //       currTot += curr;
  //     } else {
  //       currTot *= curr;
  //     }
  //   }
  //   tot += currTot
  // })
  // console.log(tot)

  // part two
  const [operators, cols] = readInput2(lines)
  console.log(cols)
  console.log(operators)
  let tot = 0;
  let index = 0
  let currOperator = null;
  let currTot = null;
  while (index < operators.length) {
    const arr = cols[index];
    console.log('currTot', currTot)
    if (arr.every(x => x === ' ')) {
      // done with that column
      tot += currTot;
      currOperator = null;
      currTot = null;
      index += 1;
      continue;
    }
    if (currOperator === null) {
      currOperator = operators[index];
      currTot = currOperator === '+' ? 0 : 1;
    }
    const num = +arr.join('')
    if (currOperator === '+') {
      currTot += num
    } else {
      currTot *= num
    }
    index += 1;
  }
  tot += currTot
  console.log(tot)
}

function readInput2(lines = []) {
  const lastLine = lines.pop().split('');
  const cols = {}
  lines.forEach((line) => {
    line.split('').forEach((chr, col) => {
      chr = chr === ' ' ? chr : Number(chr)
      if (col in cols) {
        cols[col].push(chr)
      } else {
        cols[col] = [chr]
      }
    })
  })
  return [lastLine, cols]
}

function readInput(lines = []) {
  const regex = /[ ]+/
  const cols = {}
  lines.forEach((line, row) => {
    line.trim().split(regex).forEach((chr, col) => {
      if (!['+', '*'].includes(chr)) {
        chr = Number(chr)
      }
      if (col in cols) {
        cols[col].push(chr)
      } else {
        cols[col] = [chr]
      }
    })
  })
  return cols
}

module.exports = getAnswer;
