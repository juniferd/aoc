const { readFile } = require('../utils.js')

const MAP = {};
const DIRS = [-1, 0, 1];
const XS = {};
const AS = {};
const DELTA_TO_DIR = {
  '-1,-1': 'NW',
  '-1,0': 'W',
  '-1,1': 'SW',
  '0,-1': 'N',
  '0,1': 'S',
  '1,-1': 'NE',
  '1,0': 'E',
  '1,1': 'SE',
}

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines);
  // countXMAS();
  countX_MAS();
}

function countX_MAS() {
  let total = 0;
  const X_0 = [[-1,-1],[0,0], [1,1]]
  const X_1 = [[1,-1],[0,0], [-1,1]]
  Object.keys(AS).forEach((key) => {
    let val0 = '';
    let val1 = '';
    let [x,y] = getXY(key)
    X_0.forEach(([dx,dy]) => {
      val0 += getValue(x,y,dx,dy)
    })
    X_1.forEach(([dx,dy]) => {
      val1 += getValue(x,y,dx,dy)
    })
    if ((val0 === 'MAS' || val0 === 'SAM') && (val1 === 'MAS' || val1 === 'SAM')) {
      total += 1
    }
  })
  console.log(total)
}

function countXMAS() {
  let total = 0;
  Object.keys(XS).forEach((key) => {
    DIRS.forEach((dx) => {
      DIRS.forEach((dy) => {
        let [x,y] = getXY(key);
        const dir = DELTA_TO_DIR[`${dx},${dy}`]
        if (dir) {
          total += countValidRow(x, y, dx, dy, 'XMAS')
        }
      })
    })
  })
  console.log('total:', total)
}

function countValidRow(x = 0, y = 0, dx = 0, dy = 0, strMatch = 'XMAS') {
  let start = MAP[`${x}-${y}`]
  let count = 1;
  while (count < strMatch.length) {
    const nextLetter = getValue(x, y, dx, dy);
    start += nextLetter;
    if (strMatch.slice(0, count+1) !== start) break;
    x = x + dx;
    y = y + dy;
    count += 1;
  }
  return start === strMatch ? 1 : 0;
}

function getValue(x = 0, y = 0, dx = -1, dy = -1) {
  const key = `${x + dx}-${y + dy}`
  return MAP[key]
}

function getXY(key = '0-0') {
  return key.split('-').map(n => Number(n))
}

function parse(lines = []) {
  lines.forEach((line, y) => {
    line.split('').forEach((letter, x) => {
      console.log(x, y, letter)
      const key = `${x}-${y}`;
      MAP[key] = letter
      if (letter === 'X') {
        XS[key] = letter;
      }
      if (letter === 'A') {
        AS[key] = letter;
      }
    })
  })
}

module.exports = getAnswer;
