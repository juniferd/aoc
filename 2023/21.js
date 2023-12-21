const { readFile } = require('../utils.js')

const MAP = {}
let START
let ROW_MAX = -Infinity
let COL_MAX = -Infinity
const DIRS = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
]

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  assembleMap(lines)
  // partOne()
  const {evenCount, evenCornerCount, oddCount, oddCornerCount} = partTwo()
  countTiles({evenCount, evenCornerCount, oddCount, oddCornerCount})
}
function countTiles({evenCount, evenCornerCount, oddCount, oddCornerCount}) {
  // const tiles = [1]
  // let currTot = 1
  // for (let n = 1; n < 202301; n++) {
  //   const border = n * 4
  //   tiles.push(border)
  //   currTot += border
  // }
  // console.log(tiles)
  // console.log(currTot)
  // too low 619,933,228,487,174
  // too low 619,939,357,367,974
  // too high 10,665,467,561,914,681,000
  // not right 621,494,526,082,948
  // not right 1,242,976,655,806,375
  // not right 1,242,988,944,317,042
  // not right 621,494,463,763,126
  // right >> 621494544278648

  let n = Math.floor(26501365 / 131)
  console.log(n)
  // let evenFull = 7612
  // let oddFull = 7574
  // let evenCorners = 3854
  // let oddCorners = 3726
  let tot =
    (n + 1) ** 2 * oddCount +
    n * n * evenCount -
    (n + 1) * oddCornerCount +
    n * evenCornerCount
  console.log('tot', tot)
}

function partTwo() {
  target = 131
  const VISITED = doStep2([{ row: START[0], col: START[1], dist: 0 }], target)
  console.log('target', target)
  const evenCount = Object.entries(VISITED).filter(
    ([_, dist]) => dist % 2 === 0
  ).length
  const evenCornerCount = Object.entries(VISITED).filter(
    ([_, dist]) => dist % 2 === 0 && dist > 65
  ).length
  console.log('even count', evenCount)
  console.log('even corner count', evenCornerCount)
  const oddCount = Object.entries(VISITED).filter(
    ([_, dist]) => dist % 2 === 1
  ).length
  const oddCornerCount = Object.entries(VISITED).filter(
    ([_, dist]) => dist % 2 === 1 && dist > 65
  ).length
  console.log('odd count', oddCount)
  console.log('odd corner count', oddCornerCount)
  return {evenCount, evenCornerCount, oddCount, oddCornerCount}
}

function partOne() {
  const { POSITIONS } = doStep(
    [{ row: START[0], col: START[1], dist: 0 }],
    64
  )
  draw(POSITIONS)
  console.log('----')
  console.log(Object.keys(POSITIONS).length)
}

function doStep2(start, target) {
  const queue = [...start]
  const VISITED = {}

  for (i = 0; i < queue.length; i++) {
    const { row, col, dist } = queue[i]
    /// console.log('CURR', row, col, 'steps', dist)
    if (dist === target) continue

    DIRS.forEach(([rowDelta, colDelta]) => {
      const newRow = row + rowDelta
      const newCol = col + colDelta
      const newPos = [newRow, newCol]
      if (
        inBounds(newRow, newCol) &&
        !(newPos in MAP) &&
        !(newPos in VISITED)
      ) {
        queue.push({ row: newRow, col: newCol, dist: dist + 1 })
        VISITED[newPos] = dist + 1
      }
    })
  }

  return VISITED
}
function doStep(start, target) {
  const queue = [...start]
  const POSITIONS = {}
  const VISITED = {}

  for (i = 0; i < queue.length; i++) {
    const { row, col, dist } = queue[i]
    // console.log('CURR', row, col, 'steps', dist)
    const key = `${row},${col},${dist}`
    const pos = [row, col]
    if (key in VISITED) continue
    if (dist === target && inBounds(row, col) && !(pos in MAP)) {
      POSITIONS[pos] = 1
      continue
    }
    if (!inBounds(row, col)) {
      continue
    }
    if (MAP[pos] === '#') {
      continue
    }
    VISITED[key] = true

    DIRS.forEach(([rowDelta, colDelta]) => {
      const newRow = row + rowDelta
      const newCol = col + colDelta
      queue.push({ row: newRow, col: newCol, dist: dist + 1 })
    })
  }

  return { POSITIONS, VISITED }
}

function draw(positions) {
  for (let i = 0; i < ROW_MAX + 1; i++) {
    const row = []
    for (let j = 0; j < COL_MAX + 1; j++) {
      const pos = [i, j]
      if (pos in MAP) {
        row.push('#')
      } else if (pos in positions) {
        row.push('O')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}
function inBounds(row, col) {
  return row > -1 && row <= ROW_MAX && col > -1 && col <= COL_MAX
}

function assembleMap(lines) {
  lines.forEach((line, row) => {
    if (row > ROW_MAX) {
      ROW_MAX = row
    }
    line.split('').forEach((square, col) => {
      const pos = [row, col]
      if (square === 'S') {
        START = pos
      } else if (square === '#') {
        MAP[pos] = square
      }
      if (col > COL_MAX) {
        COL_MAX = col
      }
    })
  })
}

module.exports = getAnswer
