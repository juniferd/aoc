const { readFile } = require('../utils.js')

const MAP = {}
let ROW_MAX = 0
let COL_MAX = 0
const SPIN_CYCLE = ['N', 'W', 'S', 'E']

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  assembleMap(lines)
  console.log(MAP)
  draw()

  const loads = []
  for (let i = 0; i < 1000; i++) {
    spin()
    // draw()
    const res = findLoad()
    console.log('load:', res, 'i:', i)
    loads.push(res)
  }
  loads.forEach((l, i) => console.log('turn',i+1,':', l))
  // cycles between 953 - 979
  // manually found (1000000000 - 979) % 26 -> index 21 in cycle
}

function spin() {
  SPIN_CYCLE.forEach(dir => {
    simulateRolling(getRollingRocks(dir), dir)
  })
}

function getRollingRocks(dir = 'N') {
  const rollingRocks = Object.entries(MAP).filter(([pos, rock]) => rock === 'O')

  return rollingRocks
    .sort((a, b) => {
      const posA = a[0].split(',').map((n) => Number(n))
      const posB = b[0].split(',').map((n) => Number(n))
      if (dir === 'N') {
        return posB[0] - posA[0]
      }
      if (dir === 'W') {
        return posB[1] - posA[1]
      }
      if (dir === 'S') {
        return posA[0] - posB[0]
      }
      if (dir === 'E') {
        return posA[1] - posB[1]
      }
    })
    .map((p) => p[0].split(',').map((n) => Number(n)))
}

function findLoad() {
  let tot = 0
  for (let i = 0; i < ROW_MAX; i++) {
    const load = ROW_MAX - i
    let count = 0
    for (let j = 0; j < COL_MAX; j++) {
      const pos = [i, j]
      if (MAP[pos] === 'O') {
        count += 1
      }
    }
    tot += load * count
  }
  return tot
}

function simulateRolling(rocks, dir = 'N') {
  while (rocks.length) {
    const rock = rocks.pop()
    //console.log('-----')
    //console.log('rock', rock)
    let newPos
    if (dir === 'N') {
      newPos = rollRockNorth(rock)
    } else if (dir === 'W') {
      newPos = rollRockWest(rock)
    } else if (dir === 'S') {
      newPos = rollRockSouth(rock)
    } else {
      newPos = rollRockEast(rock)
    }
    //console.log('new pos', newPos)
    delete MAP[rock]
    MAP[newPos] = 'O'
    // draw(MAP)
  }
}

function rollRockEast(rockPos) {
  let [row, col] = rockPos

  let found = false
  let prev = rockPos
  while (!found) {
    const pos = [row, col]
    if (pos in MAP && (row !== prev[0] || col !== prev[1])) {
      found = true
      col -= 1
      break
    }
    if (col === COL_MAX - 1) {
      found = true
      break
    }
    prev = pos
    col += 1
  }
  return [row, col]
}
function rollRockSouth(rockPos) {
  let [row, col] = rockPos

  let found = false
  let prev = rockPos
  while (!found) {
    const pos = [row, col]
    if (pos in MAP && (row !== prev[0] || col !== prev[1])) {
      found = true
      row -= 1
      break
    }
    if (row === ROW_MAX - 1) {
      found = true
      break
    }
    prev = pos
    row += 1
  }
  return [row, col]
}
function rollRockWest(rockPos) {
  let [row, col] = rockPos

  let found = false
  let prev = rockPos
  while (!found) {
    const pos = [row, col]
    if (pos in MAP && (row !== prev[0] || col !== prev[1])) {
      found = true
      col += 1
      break
    }
    if (col === 0) {
      found = true
      break
    }
    prev = pos
    col -= 1
  }
  return [row, col]
}

function rollRockNorth(rockPos) {
  let [row, col] = rockPos
  // decrement row until hitting edge or immobile rock
  let found = false
  let prev = rockPos
  while (!found) {
    const pos = [row, col]
    if (pos in MAP && (row !== prev[0] || col !== prev[1])) {
      found = true
      row += 1
      break
    }
    if (row === 0) {
      found = true
      break
    }
    prev = pos
    row -= 1
  }
  return [row, col]
}

function inBounds(row, rowMax = ROW_MAX) {
  return row >= 0 && row < rowMax
}

function draw(rockMap = MAP, rowMax = ROW_MAX, colMax = COL_MAX) {
  for (let i = 0; i < rowMax; i++) {
    const row = []
    for (let j = 0; j < colMax; j++) {
      const pos = [i, j]
      if (pos in rockMap) {
        row.push(rockMap[pos])
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function assembleMap(lines) {
  let rowMax = 0
  let colMax = 0
  lines.forEach((line, i) => {
    line.split('').forEach((rock, j) => {
      if (i > rowMax) {
        rowMax = i
      }
      if (j > colMax) {
        colMax = j
      }
      const pos = [i, j]
      if (['#', 'O'].includes(rock)) {
        MAP[pos] = rock
      }
    })
  })
  ROW_MAX = rowMax + 1
  COL_MAX = colMax + 1
}

module.exports = getAnswer
