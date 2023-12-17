const { readFile } = require('../utils.js')
const priorityQueue = require('../priorityQueue');

const MAP = {}
let ROW_MAX = 0
let COL_MAX = 0

const DIRS = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
}

const LEFT_TURNS = {
  N: 'W',
  W: 'S',
  S: 'E',
  E: 'N',
}

const RIGHT_TURNS = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  buildMap(lines)
  findMinimumHeatLossPath()
}

function findMinimumHeatLossPath() {
  // const queue = [{row: 0, col: 0, dir: 'E', straightCount: 0, path: '', heatLoss: 0}];
  const queue = new priorityQueue()
  queue.push({row: 0, col: 0, dir: 'S', straightCount: 0, path: '', heatLoss: 0}, 0)
  queue.push({row: 0, col: 0, dir: 'E', straightCount: 0, path: '', heatLoss: 0}, 0)

  const visited = {};

  while (queue.length) {
    // sort queue by heatLoss
    //queue.sort((a, b) => {
    //  return b.heatLoss - a.heatLoss
    //});
    const curr = queue.pop()[0];

    const currPos = [curr.row, curr.col]
    if (curr.row !== 0 || curr.col !== 0) {
      curr.heatLoss += MAP[currPos]
      // console.log('>>>>', curr.heatLoss, MAP[currPos], currPos)
    }
    curr.path += `${curr.row},${curr.col} (${curr.heatLoss}) -> `
    const key = `${curr.row},${curr.col}-${curr.dir}-${curr.straightCount}`
    if (curr.row === ROW_MAX -1 && curr.col === COL_MAX - 1 && curr.straightCount >= 4) {
      console.log('>FOUND TARGET', curr.heatLoss)
      //drawPath(curr.path)
      break;
    }
    // if (queue.length> 4) break;
    if (key in visited) continue;
    visited[key] = curr.straightCount;
    // console.log('CURR', curr, MAP[currPos], queue.length)
    const nexts = getNext(curr)
    nexts.forEach(next => {
      queue.push(next, next.heatLoss)
    })
  }

  function drawPath(path) {
    const nodes = path.split('->').map((nodeStr) => {
      const [posStr, totHLStr] = nodeStr.trim().split(' ')
      const pos = posStr.split(',').map(n => Number(n))
      const heatLoss = !!totHLStr ? Number(totHLStr.split(/(\(|\))/)[2]) : 0
      return {pos, heatLoss}
    })
    const pathMap = Array(ROW_MAX).fill('').map(_ => Array(COL_MAX).fill('.'))
    for (let i = 0; i < ROW_MAX; i++) {
      const row = []
      for (let j = 0; j < COL_MAX; j++) {
        row.push(pathMap[i][j])
      }
      console.log(row.join(''))
    }
  }


  function getNext({row, col, dir, straightCount, path, heatLoss}) {
    const nexts = [];
    const pos = [row, col]
    if (straightCount < 10) {
      const [straightRow, straightCol] = move(pos, dir)
      const straightInBounds = inBounds(straightRow, straightCol)
      if (straightInBounds) {
        nexts.push({row: straightRow, col: straightCol, dir, straightCount: straightCount + 1, path, heatLoss})
      }
    }
    // prune left/right turns if row/col > row_max - 4
    if (straightCount > 3) {
      const [leftRow, leftCol] = move(pos, LEFT_TURNS[dir])
      const leftInBounds = inBounds(leftRow, leftCol);
      if (leftInBounds) {
        nexts.push({row: leftRow, col: leftCol, dir: LEFT_TURNS[dir], straightCount: 1, path, heatLoss})
      }

      const [rightRow, rightCol] = move(pos, RIGHT_TURNS[dir])
      const rightInBounds = inBounds(rightRow, rightCol);
      if (rightInBounds) {
        nexts.push({row: rightRow, col: rightCol, dir: RIGHT_TURNS[dir], straightCount: 1, path, heatLoss})
      }
    }

    return nexts;
  }
}

function nvmignorethisone() {
  const START = [0, 0]
  const END = [ROW_MAX - 1, COL_MAX - 1]
  const STRAIGHT_MAX = 3
  const VISITED = {}
  const CACHE = {}

  const res = traverse(0, 0, 'N', 0)
  console.log('res', res)

  function traverse(row, col, dir, numStraightLine, path = '') {
    const pos = [row, col]
    console.log('CURR', pos, dir, numStraightLine, path)
    const key = `${row}-${col}-${dir}-${numStraightLine}`
    if (key in CACHE) {
      return CACHE[key]
    }
    if (row === END[0] && col === END[1]) {
      return 0
    }

    const isValid = inBounds(row, col)
    if (!isValid) return Infinity

    path += `${row},${col}->`
    VISITED[pos] = true

    // can go straight, turn left, turn right CANNOT REVERSE
    const newLeft = move(pos, LEFT_TURNS[dir])
    let left = Infinity
    if (!(newLeft in VISITED)) {
      // console.log(
      //   'ORIG',
      //   pos,
      //   'ORIG_DIR',
      //   dir,
      //   'LEFT',
      //   newLeft,
      //   'NEW_DIR',
      //   LEFT_TURNS[dir]
      // )
      left = traverse(newLeft[0], newLeft[1], LEFT_TURNS[dir], 1, path) + MAP[pos]
    }

    const newRight = move(pos, RIGHT_TURNS[dir])
    let right = Infinity
    if (!(newRight in VISITED)) {
      // console.log(
      //   'ORIG',
      //   pos,
      //   'ORIG_DIR',
      //   dir,
      //   'RIGHT',
      //   newRight,
      //   'NEW_DIR',
      //   RIGHT_TURNS[dir]
      // )
      right = traverse(newRight[0], newRight[1], RIGHT_TURNS[dir], 1, path) + MAP[pos]
    }
    const newStraight = move(pos, dir)
    let straight = Infinity
    if (numStraightLine <= STRAIGHT_MAX && !(newStraight in VISITED)) {
      straight =
        traverse(newStraight[0], newStraight[1], dir, numStraightLine + 1, path) + MAP[pos]
      // console.log(
      //   'ORIG',
      //   pos,
      //   'ORIG_DIR',
      //   dir,
      //   'STRAIGHT',
      //   newStraight,
      //   'STRAIGHT NUM',
      //   numStraightLine + 1
      // )
    }

    const res = Math.min(left, right, straight)
    CACHE[key] = res

    return res
  }
}

// returns next position
function move(pos, dir) {
  const newPos = DIRS[dir].map((coord, index) => coord + pos[index])
  return newPos
}

function inBounds(row, col) {
  return row >= 0 && row < ROW_MAX && col >= 0 && col < COL_MAX
}

function buildMap(lines) {
  lines.forEach((line, row) => {
    if (row > ROW_MAX) {
      ROW_MAX = row
    }
    line.split('').forEach((hl, col) => {
      const pos = [row, col]
      const heatLoss = Number(hl)
      MAP[pos] = heatLoss
      if (col > COL_MAX) {
        COL_MAX = col
      }
    })
  })
  ROW_MAX += 1
  COL_MAX += 1
}

module.exports = getAnswer
