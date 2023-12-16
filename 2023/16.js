const { readFile } = require('../utils.js')

const CONTRAPTION = {}

// mirrors are / \ and turn 90 degs
// splitters are | - and can split into 2 beams 90 deg or have beam pass through
// need to keep directional diffs down [0, 1] up [0, -1] right [1, 0] left [-1, 0]

const BEAM_DIRS = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
}

let ROW_MAX = 0
let COL_MAX = 0

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  assembleContraption(lines)

  // simulateBeam()
  // console.log(Object.values(ACTIVATED).length)

  getMostEnergizedBeam()
}

function draw() {
  const MAP = Array(ROW_MAX)
    .fill('')
    .map((_) => Array(COL_MAX).fill('.'))
  Object.values(ACTIVATED).forEach((pos) => {
    MAP[pos[0]][pos[1]] = '#'
  })

  MAP.forEach((line) => console.log(line.join('')))
  console.log('------')
}

function getMostEnergizedBeam() {
  // get all edges
  const leftEdge = Array(ROW_MAX)
    .fill('.')
    .map((_, row) => ({ dir: 'R', pos: [row, 0] }))
  const rightEdge = Array(ROW_MAX)
    .fill('.')
    .map((_, row) => ({ dir: 'L', pos: [row, ROW_MAX - 1] }))
  const topEdge = Array(COL_MAX)
    .fill('.')
    .map((_, col) => ({ dir: 'D', pos: [0, col] }))
  const bottomEdge = Array(COL_MAX)
    .fill('.')
    .map((_, col) => ({ dir: 'U', pos: [COL_MAX - 1, col] }))
  
  let largest = 0;
  leftEdge.forEach(({dir, pos}) => {
    const ret = simulateBeam(dir, pos)
    console.log('ret:', ret)
    if (ret > largest) {
      largest = ret;
    }
  });
  rightEdge.forEach(({dir, pos}) => {
    const ret = simulateBeam(dir, pos)
    console.log('ret:', ret)
    if (ret > largest) {
      largest = ret;
    }
  })
  topEdge.forEach(({dir, pos}) => {
    const ret = simulateBeam(dir, pos)
    console.log('ret:', ret)
    if (ret > largest) {
      largest = ret;
    }
  })
  bottomEdge.forEach(({dir, pos}) => {
    const ret = simulateBeam(dir, pos)
    console.log('ret:', ret)
    if (ret > largest) {
      largest = ret;
    }
  })
  console.log('largest:', largest)
}

function simulateBeam(initDir, initPos) {
  // const queue = [init]
  const ACTIVATED = {}
  const VISITED = {}
  traverse(initDir, initPos)

  // why did i spend all this time re-writing this - should have just stuck with the while loop
  function traverse(dir, pos) {
    const isValid = inBounds(pos)
    if (!isValid) {
      // console.log('OUT OF BOUNDS')
      return
    }
    const key = `${pos}-${dir}`
    if (key in VISITED) {
      // console.log('ALREADY VISITED', key)
      return
    }
    VISITED[key] = true
    ACTIVATED[pos] = pos

    const space = CONTRAPTION[pos]
    if (space === '|' || space === '-') {
      const [nextA, nextB] = evaluateSplitter({ dir, pos }, space)
      // console.log('evaluate splitter', nextA, nextB)
      traverse(nextA.dir, nextA.pos)
      if (!!nextB) {
        traverse(nextB.dir, nextB.pos)
      }
    } else if (space === '/' || space === '\\') {
      const next = evaluateMirrors({ dir, pos }, space)
      traverse(next.dir, next.pos)
    } else {
      const next = move({ dir, pos })
      traverse(next.dir, next.pos)
    }
  }
  // while (queue.length > 0) {
  //   // draw()
  //   const curr = queue.pop()
  //   const isValid = inBounds(curr.pos)
  //   if (!isValid) {
  //     console.log('OUT OF BOUNDS')
  //     continue
  //   }

  //   const key = `${curr.pos}-${curr.dir}`
  //   if (key in VISITED) {
  //     console.log('ALREADY VISITED')
  //     continue
  //   }

  //   VISITED[key] = true
  //   ACTIVATED[curr.pos] = curr.pos

  //   // evaluate square for mirrors/splitters
  //   const space = CONTRAPTION[curr.pos]
  //   if (space === '|' || space === '-') {
  //     const nexts = evaluateSplitter(curr, space)
  //     nexts.forEach((next) => queue.push(next))
  //   } else if (space === '/' || space === '\\') {
  //     const next = evaluateMirrors(curr, space)
  //     queue.push(next)
  //   } else {
  //     const next = move(curr)
  //     queue.push(next)
  //   }
  // }

  function evaluateMirrors(curr, mirror) {
    if (mirror === '/' && curr.dir === 'U')
      return move({ dir: 'R', pos: curr.pos })
    if (mirror === '/' && curr.dir === 'D') {
      return move({ dir: 'L', pos: curr.pos })
    }
    if (mirror === '/' && curr.dir === 'R') {
      return move({ dir: 'U', pos: curr.pos })
    }
    if (mirror === '/' && curr.dir === 'L') {
      return move({ dir: 'D', pos: curr.pos })
    }
    if (mirror === '\\' && curr.dir === 'U') {
      return move({ dir: 'L', pos: curr.pos })
    }
    if (mirror === '\\' && curr.dir === 'D') {
      return move({ dir: 'R', pos: curr.pos })
    }
    if (mirror === '\\' && curr.dir === 'L') {
      return move({ dir: 'U', pos: curr.pos })
    }
    if (mirror === '\\' && curr.dir === 'R') {
      return move({ dir: 'D', pos: curr.pos })
    }
  }
  function evaluateSplitter(curr, splitter) {
    if (splitter === '|' && (curr.dir === 'U' || curr.dir === 'D'))
      return [move(curr)]
    if (splitter === '|' && (curr.dir === 'R' || curr.dir === 'L')) {
      return [
        move({ dir: 'U', pos: curr.pos }),
        move({ dir: 'D', pos: curr.pos }),
      ]
    }
    if (splitter === '-' && (curr.dir === 'U' || curr.dir === 'D')) {
      return [
        move({ dir: 'L', pos: curr.pos }),
        move({ dir: 'R', pos: curr.pos }),
      ]
    }
    if (splitter === '-' && (curr.dir === 'R' || curr.dir === 'L')) {
      return [move(curr)]
    }
  }

  function move({ dir = 'R', pos = [0, 0] }) {
    const diff = BEAM_DIRS[dir]
    return { dir, pos: [diff[0] + pos[0], diff[1] + pos[1]] }
  }

  return Object.values(ACTIVATED).length
}

function inBounds([row, col]) {
  return row >= 0 && row < ROW_MAX && col >= 0 && col < COL_MAX
}

function assembleContraption(lines) {
  lines.forEach((line, i) => {
    line.split('').forEach((content, j) => {
      if (j > COL_MAX) {
        COL_MAX = j
      }
      const pos = [i, j]
      if (content !== '.') {
        CONTRAPTION[pos] = content
      }
    })
    if (i > ROW_MAX) {
      ROW_MAX = i
    }
  })
  ROW_MAX += 1
  COL_MAX += 1
}

module.exports = getAnswer
