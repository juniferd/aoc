const { readFile } = require('../utils.js')

const NUMS = {};
const SYMBOLS_0 = {};
const SYMBOLS = {};
let ROW_BOUND = 0;
let COL_BOUND = 0;
const VISITED ={};

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  lines.forEach(line => console.log(line))
  createCoordMap(lines);
  let res = 0;
  // go through symbols and get coords around
  Object.keys(SYMBOLS).forEach((coord) => {
    const coordsAround = getCoordsAround(coord.split(','));
    // do the coordinates around that contain numbers
    const coordsWithNums = [];
    coordsAround.forEach((cd) => {
      if (cd.join(',') in NUMS) {
        coordsWithNums.push(cd)
      }
    })
    console.log('coords with nums', coordsWithNums)
    const nums = [];
    coordsWithNums.forEach((cd) => {
      const fullCoords = assembleNumberCoords(cd);
      if (!fullCoords) {
        console.log('SKIP')
      } else {
        console.log(fullCoords)
        // get the nums
        nums.push(assembleNumbers(fullCoords))
      }
    });
    // gears have exactly 2 numbers
    if (nums.length === 2) {
      // gear ratios are product
      const gearRatio = nums.reduce((prod, num) => prod * num, 1);
      res += gearRatio;
    }
  });
  console.log(res)
}

function assembleNumbers(coords) {
  const res = [];
  coords.forEach((coord) => {
    res.push(NUMS[coord])
  })
  return Number(res.join(''))
}

function assembleNumberCoords([row, col]) {
  const coord = [row,col].join(',');
  if (coord in VISITED) return;

  // console.log('testing coord', coord)
  const res = [];
  let currIndex = col;
  let foundEnd = false;
  // increment colIndex until no numbers/out of bounds
  while (currIndex !== undefined) {
    const currCoord = [row, currIndex].join(',')
    // console.log('testing', currCoord)
    if (currCoord in NUMS) {
      VISITED[currCoord] = true;
      if (!foundEnd) {
        res.push(currCoord)
        currIndex += 1;
      } else {
        res.unshift(currCoord)
        currIndex -= 1;
      }
    } else {
      if (!foundEnd) {
        foundEnd = true;
        currIndex = col - 1;
      } else {
        currIndex = undefined;
      }
    }
  }
  
  return res;
}

function getCoordsAround([row, col]) {
  row = Number(row);
  col = Number(col);

  const diff = [-1, 0, 1];

  const res = [];
  diff.forEach(rowDiff => {
    diff.forEach(colDiff => {
      if (rowDiff !== 0 || colDiff !== 0) {
        const rowIndex = row + rowDiff;
        const colIndex = col + colDiff;
        if (inBounds(rowIndex, ROW_BOUND) && inBounds(colIndex, COL_BOUND)) {
          res.push([rowIndex, colIndex])
        }
      }
    })
  })
  return res;
}

function inBounds(coord, bound) {
  return coord > -1 && coord <= bound;
}

function createCoordMap(lines) {
  lines.forEach((row, rowIndex) => {
    row.split('').forEach((col, colIndex) => {
      // digit
      const digit = /\d/g;
      const coord = `${rowIndex},${colIndex}`;
      if (col.match(digit)) {
        NUMS[coord] = col;
      } else if (col !== '.') {
        // part 2 intro
        if (col === '*') {
          SYMBOLS[coord] = col;
        }
        SYMBOLS_0[coord] = col;
      }

      if (colIndex > COL_BOUND) COL_BOUND = colIndex;
    });
    if (rowIndex > ROW_BOUND) ROW_BOUND = rowIndex;
  });
}

module.exports = getAnswer;
