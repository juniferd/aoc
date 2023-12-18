const { readFile } = require('../utils.js')

const MAP = {}
const CORNERS = [] 

const DIRS = {
  'R': [0, 1],
  'D': [1, 0],
  'L': [0, -1],
  'U': [-1, 0],
}
let ROW_MAX = 0;
let COL_MAX = 0;

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  // const INSTRUCTIONS = assembleInstructions(lines)
  const INSTRUCTIONS = assembleInstructions(lines, true)
  // const INSTRUCTIONS = [
  //   {dir: 'R', count: 3},
  //   {dir: 'D', count: 3},
  //   {dir: 'L', count: 3},
  //   {dir: 'U', count: 3},
  // ]
  console.log(INSTRUCTIONS)
  createCorners([...INSTRUCTIONS])
  console.log(CORNERS)
  const area = polygonArea()
  const adjustment = perimeter(INSTRUCTIONS) / 2 + 1
  console.log(area + adjustment)


  // createMap(INSTRUCTIONS)
  // console.log(ROW_MAX, COL_MAX)
  // draw()
  // countInterior()
}

function perimeter(instructions) {
  return instructions.reduce((acc, {count}) => acc + count, 0);
}
function polygonArea() {
  let area = 0;
  let j = CORNERS.length - 1;
  const rows = CORNERS.map(([row]) => row)
  const cols = CORNERS.map(([_, col]) => col)
  CORNERS.forEach((_, i) => {
    area += (rows[j] + rows[i]) * (cols[j] - cols[i])
    j = i
  })
  return area / 2;
}

function countInterior() {
  const VISITED = {}
  const ret = flood([1,1])
  console.log('ret', ret + Object.keys(MAP).length)


  function flood(pos) {
    const queue = [pos]
    let count = 0;
    while (queue.length) {
      const curr = queue.pop()
      if (curr in VISITED) continue;
      // hit edge
      if (curr in MAP) continue;

      VISITED[curr] = true

      count += 1;
      Object.values(DIRS).forEach(([rowDiff, colDiff]) => {
        queue.push([curr[0] + rowDiff, curr[1] + colDiff])
      })
    }
    return count;
  }
}

function createCorners(instructions) {
  instructions.reverse();

  let row = 0
  let col = 0

  while (instructions.length) {
    const {dir, count} = instructions.pop()
    const corner = getNextCorner(row, col, dir, count);
    CORNERS.push(corner);
    row = corner[0]
    col = corner[1]
  }
}

function createMap(instructions) {
  instructions.reverse();

  let row = 0
  let col = 0
  while (instructions.length) {
    const {dir, count, color} = instructions.pop()
    const positions = getPositions(row, col, dir, count);
    positions.forEach((pos) => {
      MAP[pos] = color;
    });
    const newPos = positions.pop();
    row = newPos[0]
    col = newPos[1]
    if (row > ROW_MAX) {
      ROW_MAX = row
    }
    if (col > COL_MAX) {
      COL_MAX = col
    }
  }
}

function draw() {
  for (let i = 0; i < ROW_MAX + 1; i++) {
    const row = []
    for (let j = 0; j < COL_MAX + 1; j++) {
      const pos = [i, j]
      if (pos in MAP) {
        row.push('#')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function getNextCorner(row, col, dir, count) {
  const [rowDiff, colDiff] = DIRS[dir];
  return [count * rowDiff + row, count * colDiff + col]
}
function getPositions(row, col, dir, count) {
  const [rowDiff, colDiff] = DIRS[dir]
  const positions = []
  for (let i = 1; i <= count; i++) {
    const newRow = i * rowDiff + row;
    const newCol = i * colDiff + col;
    positions.push([newRow, newCol])
  }
  return positions
}

const ENCODED_DIR = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U',
}

function convertFromHex(hex) {
  const numStrs = hex.split('')  
  let i = 0;
  let tot = 0;
  while (numStrs.length) {
    const hex = numStrs.pop();
    let num = Number(hex)
    if (isNaN(num)) {
      num = hex.toUpperCase().charCodeAt(0) - 55
    }
    tot += 16 ** i * num
    i += 1
  }
  return tot
}
function assembleInstructions(lines, fromHex = false) {
  return lines.map((line) => {
    const ret = {}
    line.split(' ').forEach((content, index) => {
      if (!fromHex) {
        if (index === 0) {
          ret.dir = content
        } else if (index === 1) {
          ret.count = Number(content)
        } else {
          ret.color = content.split(/(\(|\))/)[2]
        }
      } else {
        if (index === 2) {
          const orig = content.split(/(\(|\))/)[2]
          ret.dir = ENCODED_DIR[orig[6]];
          ret.count = convertFromHex(orig.slice(1, 6))
        } 
      }
    })
    return ret
  })
}

module.exports = getAnswer;
