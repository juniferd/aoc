const { readFile } = require('../utils.js')

const MAP = {}
let ROW_MAX = -Infinity
let COL_MAX = -Infinity
let START = []
let TARGET = []
let MR = 0

const DIRS = {
  v: [1, 0],
  '>': [0, 1],
  '^': [-1, 0],
  '<': [0, -1],
}
async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  assembleMap(lines)
  // const res = traverse(START[0], START[1], [])
  // console.log('target', res)
  // findLongestPath()
  let branchTot = 0
  branches = []
  for (let i = 0; i < ROW_MAX + 1; i++) {
    for (let j = 0; j < COL_MAX + 1; j++) {
      const pos = [i, j]
      if (MAP[pos] !== '#') {
        const nexts = getValidNexts(i, j, '', true)
        if (nexts.length > 2) {
          console.log('BRANCH FOUND', pos)
          branches.push(pos)
          branchTot += 1
        }
      }
    }
  }
  console.log('num branches', branchTot)
  // drawPath(branches)
  // start to first branch
  console.log('START', START, 'END', branches[0])
  // findLongestPath(START, branches[0], true)
  createGraph(branches)
}

function createGraph(branches) {
  function isBranchNode(pos) {
    return (
      branches.findIndex(
        ([branchRow, branchCol]) => pos[0] === branchRow && pos[1] === branchCol
      ) > -1
    )
  }

  let ID = 0
  const visited = {}
  const q = [{ node: [0, 1], id: ++ID }]

  const neighbors = {}

  function addNeighbor(a, b) {
    if (!neighbors[a]) {
      neighbors[a] = []
    }
    if (!neighbors[a].includes(b) && Number(a) !== b) {
      neighbors[a].push(b)
    }
  }

  // TODO: wtf
  for (let i = 0; i < q.length; i++) {
    cur = q[i]
    if (cur.node in visited) {
      addNeighbor(cur.id, visited[cur.node])
      addNeighbor(visited[cur.node], cur.id)
      continue
    }
    visited[cur.node] = cur.id

    const [row, col] = cur.node
    const nexts = getValidNexts(row, col)
    if (isBranchNode(cur.node)) {
      visited[cur.node] = ++ID
      const parent = ID
      addNeighbor(cur.id, parent)
      addNeighbor(parent, cur.id)
      nexts.forEach((n) => {
        addNeighbor(ID, parent)
        addNeighbor(parent, ID)
        q.push({ node: n, id: ++ID })
      })
    } else {
      nexts.forEach((n) => {
        q.push({ node: n, id: cur.id })
      })
    }
  }

  const ID_STEPS = {}
  Object.entries(visited).forEach(([pos, id]) => {
    if (id in ID_STEPS) {
      ID_STEPS[id] += 1
    } else {
      ID_STEPS[id] = 1
    }
  })
  drawPath(Object.entries(visited), true)
  console.log(ID_STEPS)
  console.log(
    'id steps total',
    Object.values(ID_STEPS).reduce((acc, cur) => acc + cur, 0)
  )
  console.log('neighbors', neighbors)
  console.log('target node', visited[TARGET])

  const res = traverse(visited[START], visited[TARGET], ID_STEPS, neighbors, {})
  console.log('res', res)

  function traverse(id, target, steps, neighbors, visited, count = 0) {
    if (id === target) {
      if (MR < count + steps[id]) {
        MR = count + steps[id]
      }
      console.log('VISITED', Object.keys(visited).length, count + steps[id], MR)
      return count + steps[id]
    }

    const validNexts = getNexts(id, visited, neighbors)

    if (validNexts.length === 0) return -1e9
    if (id in visited) return -1e9
    if (!(id in steps)) return -1e9

    const res = Math.max(
      ...validNexts.map((next) => {
        visited[id] = steps[id]
        const r = traverse(
          next,
          target,
          steps,
          neighbors,
          visited,
          count + steps[id]
        )
        delete visited[id]
        return r || 0
      })
    )
    return res
  }

  function getNexts(id, prev, neighbors) {
    return neighbors[id].filter((n) => {
      return !(n in prev)
    })
  }
}

function findLongestPath(start = START, target = TARGET, ignoreSteep = false) {
  const stack = [{ row: start[0], col: start[1], visited: `${start}->` }]
  const targets = []

  while (stack.length) {
    const { row, col, visited } = stack.pop()

    const pos = [row, col]

    if (row === target[0] && col === target[1]) {
      targets.push({ row, col, visited })
      continue
    }

    const nexts = getValidNexts(row, col, visited, ignoreSteep)
    if (nexts.length > 0) {
      nexts.forEach((next) => {
        stack.push({
          row: next[0],
          col: next[1],
          visited: visited.concat(`${pos}->`),
        })
      })
    }
  }

  let maxTarget = 0
  targets.forEach((target) => {
    const targetLength = target.visited.split('->').length - 2
    if (targetLength > maxTarget) {
      maxTarget = targetLength
    }
    console.log('target length', targetLength)
  })
  console.log('max', maxTarget)
}

function inVisited(pos = [], visitedStr = '') {
  const visited = visitedStr.split('->')
  return visited.includes(pos.join(','))
}

function getValidNexts(row, col, visited, ignoreSteep = false) {
  const pos = [row, col]
  if (!ignoreSteep) {
    if (Object.keys(DIRS).includes(MAP[pos]))
      return getNextSteep(row, col, visited)
  }
  const validNexts = []
  Object.values(DIRS).forEach(([rowDiff, colDiff]) => {
    const next = [row + rowDiff, col + colDiff]
    if (
      inBounds(next[0], next[1]) &&
      MAP[next] !== '#' &&
      !inVisited(next, visited)
    ) {
      validNexts.push(next)
    }
  })
  return validNexts
}

function getNextSteep(row, col, visited) {
  const pos = [row, col]
  const [rowDiff, colDiff] = DIRS[MAP[pos]]
  const next = [row + rowDiff, col + colDiff]
  if (
    inBounds(next[0], next[1]) &&
    MAP[next] !== '#' &&
    !inVisited(next, visited)
  ) {
    return [next]
  }
  return []
}

function drawPath(path, showNode) {
  const arr = []
  for (let i = 0; i < ROW_MAX + 1; i++) {
    const row = []
    for (let j = 0; j < COL_MAX + 1; j++) {
      const pos = [i, j]
      if (pos in MAP) {
        row.push(MAP[pos])
      } else {
        row.push('.')
      }
    }
    arr.push(row)
  }

  if (showNode) {
    path.forEach(([coord, id]) => {
      let [row, col] = coord.split(',')
      row = Number(row)
      col = Number(col)
      arr[row][col] = String.fromCharCode(64 + id)
    })
    arr.forEach((row) => console.log(row.join('')))
    return
  }

  path.forEach((coord) => {
    let row, col
    if (typeof coord === 'string') {
      ;[row, col] = coord.split(',')
    } else {
      ;[row, col] = coord
    }
    row = Number(row)
    col = Number(col)
    arr[row][col] = 'O'
  })

  arr.forEach((row) => {
    console.log(row.join(''))
  })
}

function inBounds(row, col) {
  return row >= 0 && row <= ROW_MAX && col >= 0 && col <= COL_MAX
}

function assembleMap(lines) {
  lines.forEach((line, row) => {
    if (row > ROW_MAX) {
      ROW_MAX = row
    }
    line.split('').forEach((tile, col) => {
      const pos = [row, col]
      if (['#', '>', '<', '^', 'v'].includes(tile)) {
        MAP[pos] = tile
      }
      if (col > COL_MAX) {
        COL_MAX = col
      }
    })
  })

  // get the start
  lines[0].split('').forEach((tile, col) => {
    if (tile === '.') {
      START = [0, col]
    }
  })

  // get the target
  lines[ROW_MAX].split('').forEach((tile, col) => {
    if (tile === '.') {
      TARGET = [ROW_MAX, col]
    }
  })
}

module.exports = getAnswer
