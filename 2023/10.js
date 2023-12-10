const { readFile } = require('../utils.js')

const TRANSFORM_TILE = {
  L: [
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  F: [
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  J: [
    [0, 1],
    [1, 1],
    [1, 0],
  ],
  7: [
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  '|': [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  '-': [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
}
const MAP = {}
const PIPES = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  7: ['S', 'W'],
  F: ['S', 'E'],
}

const DIRS = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
}

let ROW_MAX = -Infinity
let COL_MAX = -Infinity

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)

  const [start, rowMax, colMax] = assembleMap(lines)
  console.log(MAP, start, rowMax, colMax)
  ROW_MAX = rowMax
  COL_MAX = colMax

  const positions = getPositionsAround(start[0], start[1], true)

  console.log('>>>', positions)
  console.log('start', start)
  let max = 1
  let loop = {}
  positions.forEach((position) => {
    let visited = { [start]: true }
    // const res = move(position, start, visited)
    let found = false
    let prev = start
    let curr = position
    let tot = 1

    // TODO - don't need to check all the positions, that's going through the loop twice - that's dumb
    while (!found) {
      const res = move(curr, prev, visited)
      if (!res) {
        found = true
        tot = -Infinity
        break
      }
      if (res === 1) {
        found = true
        break
      }
      prev = curr
      curr = res[0]
      visited = res[1]
      tot += 1
    }
    console.log('visited', visited, Object.keys(visited).length)
    console.log('tot', tot)
    if (tot > max) {
      loop = visited
      max = tot
    }
  })
  console.log('max', max / 2)

  drawLoop(loop)
  // find start tile type and draw it into the loop map
  const startTileType = identifyStartTile(start)
  MAP[start] = startTileType
  console.log('start tile type', startTileType, 'at', start)
  const transformedMap = transformMap(start, loop)
  // console.log(transformedMap)
  const transformedRowMax = (ROW_MAX + 1) * 3 - 1
  const transformedColMax = (COL_MAX + 1) * 3 - 1
  drawLoop(transformedMap, transformedRowMax, transformedColMax, false)
  // flood fill
  const visited = {}
  // const {marked, inside} = floodFill([0,0], transformedMap, transformedRowMax, transformedColMax)
  // console.log(Object.keys(marked).forEach(key => {
  //   visited[key] = inside ? 'I' : 'O';
  // }))
  // console.log(visited)

  for (let i = 0; i <= transformedRowMax; i++) {
    for (let j = 0; j <= transformedColMax; j++) {
      const pos = [i, j]
      if (pos in visited) continue
      if (pos in transformedMap) continue

      const { marked, inside } = floodFill(
        [i, j],
        transformedMap,
        transformedRowMax,
        transformedColMax
      )
      console.log('is inside?', inside, pos)
      drawLoop(marked, transformedRowMax, transformedColMax, false)
      Object.keys(marked).forEach((key) => {
        visited[key] = inside ? 'I' : 'O'
      })
    }
  }

  const count = countTransformedTilesInside(visited, loop)
  console.log(count)
  // raycasting it is...? JK JK JK
  // testing out new position (1, 2) should be false
  // const res = raycast([1,2], transformedMap, COL_MAX * 3)
  // console.log('res', res)
  // // testing out new position (2, 5) should be true
  // const res2 = raycast([2,6], transformedMap, COL_MAX * 3)
  // console.log('res2', res2)
  // countIntersections(transformedMap)
}

function countIntersections(
  transformedMap,
  rowMax = ROW_MAX * 3,
  colMax = COL_MAX * 3
) {
  let count = 0
  for (let row = 0; row < rowMax + 1; row += 3) {
    for (let col = 0; col < colMax + 1; col += 3) {
      if ([row + 1, col + 1] in transformedMap) continue

      const testPositions = [
        [row, col + 1],
        [row + 1, col + 1],
        [row + 2, col + 1],
      ]
      console.log('test positions', testPositions)
      // every position needs to return true for it to be inside
      const isInside = testPositions.every((pos) =>
        raycast(pos, transformedMap, colMax)
      )
      if (isInside) {
        console.log('is inside', row, col)
        count += 1
      }
    }
  }
  console.log('final count', count)
  return count
}

// TODO: why is this so repetitive
function identifyStartTile(start) {
  const connectors = []
  const arrDiff = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  arrDiff.forEach(([rowDiff, colDiff]) => {
    const row = start[0] + rowDiff
    const col = start[1] + colDiff
    const pos = [row, col]
    console.log('eval', pos, 'is in map', pos in MAP)
    if (pos in MAP) {
      console.log('found', [row, col])
      connectors.push([row, col])
    }
  })
  const connectedTiles = connectors.filter((tilePos) => {
    const diffs = PIPES[MAP[tilePos]].map((dir) => DIRS[dir])
    const isConnected = diffs.find((diff) => {
      return (
        diff[0] + tilePos[0] === start[0] && diff[1] + tilePos[1] === start[1]
      )
    })
    return isConnected
  })

  let tile
  const possibleTiles = Object.entries(PIPES)
  for (let i = 0; i < possibleTiles.length; i++) {
    const [tileType, directions] = possibleTiles[i]
    const matched = directions.every((dir) => {
      const hasTile = connectedTiles.find(
        ([cRow, cCol]) =>
          cRow === DIRS[dir][0] + start[0] && cCol === DIRS[dir][1] + start[1]
      )
      return hasTile
    })
    if (matched) {
      tile = tileType
      break
    }
  }
  return tile
}

function transformMap(start, loop) {
  const transformedMap = {}
  for (let row = 0; row < ROW_MAX + 1; row++) {
    for (let col = 0; col < COL_MAX + 1; col++) {
      const pos = [row, col]
      const newRowStart = row * 3
      const newColStart = col * 3
      if (pos in loop) {
        const tile = MAP[pos]
        // console.log('tile', tile, TRANSFORM_TILE[tile])
        Object.values(TRANSFORM_TILE[tile]).forEach((delta) => {
          const newSubTilePos = [newRowStart + delta[0], newColStart + delta[1]]
          transformedMap[newSubTilePos] = 'X'
        })
      }
    }
  }

  return transformedMap
}

function scan(loop) {
  let visited = {}
  let countInside = 0
  for (let row = 0; row < ROW_MAX + 1; row++) {
    for (let col = 0; col < COL_MAX + 1; col++) {
      const pos = [row, col]
      if (pos in loop) continue
      console.log('evaluating', pos)
      // if (pos in loop || pos in visited) continue;
      // const marked = floodFill(pos, loop)
      // if (!!marked) {
      //   console.log('marked', marked)
      //   visited = {...visited, ...marked}
      //   console.log('inside', pos, visited)
      //   countInside += Object.keys(marked).length
      // }
    }
  }
  console.log('count', countInside)
}

function raycast(position, loop, colMax = COL_MAX) {
  const [row, col] = position
  let numIntersections = 0
  // count number of loop intersections going to the right
  let border = []
  for (let x = col + 1; x < colMax + 1; x++) {
    const next = [row, x]
    // console.log('next', next, 'border', border, 'next in loop?', next in loop)
    if (next in loop && border.length === 0) {
      numIntersections += 1
      border.push(next)
    } else if (next in loop && border.length > 0) {
      border.push(next)
    } else if (!(next in loop) && border.length > 1) {
      // leaving edge so count it
      numIntersections += 1
      border = []
    } else if (!(next in loop) && border.length === 1) {
      border = []
    }
  }
  if (numIntersections % 2 === 1) {
    console.log('inside loop', [row, col])
    return true
  }
  return false
}

function outOfBounds(row, col, rowMax = ROW_MAX, colMax = COL_MAX) {
  return row === -1 || row === rowMax + 1 || col === -1 || col === colMax + 1
}
function floodFill(pos, loop, rowMax = ROW_MAX, colMax = COL_MAX) {
  const queue = [pos]
  const marked = {}
  let inside = true
  while (queue.length) {
    const curr = queue.pop()
    if (curr in loop) {
      //edge found
      continue
    }
    const oob = outOfBounds(curr[0], curr[1], rowMax, colMax)
    if (oob) {
      // everything visited is outside
      inside = false
      continue
    }
    if (curr in marked) continue

    marked[curr] = true
    // count += 1;
    // next
    Object.values(DIRS).forEach(([rowDiff, colDiff]) => {
      queue.push([curr[0] + rowDiff, curr[1] + colDiff])
    })
  }

  return { marked, inside }
}

function drawLoop(loop, rowMax = ROW_MAX, colMax = COL_MAX, drawTile = true) {
  const BETTER_MAP = {
    7: '⎤',
    J: '⎦',
    F: '⎡',
    L: '⎣',
    '|': '|',
    '-': '-',
  }
  for (let row = 0; row < rowMax + 1; row++) {
    const str = []
    for (let col = 0; col < colMax + 1; col++) {
      const pos = [row, col]
      if (pos in loop) {
        if (drawTile) {
          str.push(MAP[pos])
        } else {
          str.push('x')
        }
      } else {
        str.push('.')
      }
    }
    console.log(str.join(''))
  }
}
function countInside(loop) {
  let count = 0
  for (let row = 0; row < ROW_MAX + 1; row++) {
    for (let col = 0; col < COL_MAX + 1; col++) {
      const pos = [row, col]
      if (pos in loop) {
        continue
      }
      let numIntersections = 0
      // count number of loop intersections going to the right
      for (let x = col + 1; x < COL_MAX + 1; x++) {
        const next = [row, x]
        // insides 3,14
        console.log('evaluating', pos, 'next', next, loop[next], MAP[next])
        if (next in loop && MAP[next] !== '-') {
          numIntersections += 1
        }
      }
      if (numIntersections % 2 === 1) {
        console.log('inside loop', row, col)
        count += 1
      }
    }
  }
  return count
}

function getPositionsAround(row, col, isStart = false) {
  row = Number(row)
  col = Number(col)

  const positions = []
  let diffs = []
  if (isStart) {
    diffs = Object.values(DIRS)
  } else {
    // get pipe
    const pipe = MAP[[row, col]]
    const directions = PIPES[pipe]
    diffs = directions.map((dir) => DIRS[dir])
  }
  diffs.forEach(([rowDiff, colDiff]) => {
    const newRow = row + rowDiff
    const newCol = col + colDiff

    if (newRow <= ROW_MAX && newRow > -1 && newCol <= COL_MAX && newCol > -1) {
      positions.push([newRow, newCol])
    }
  })
  return positions
}

function move(currPos, prevPos, visited) {
  // console.log('---')
  // console.log('evaluating', currPos)
  if (MAP[currPos] === 'S') return 1
  if (currPos in visited) return
  if (!(currPos in MAP)) return

  visited[currPos] = true
  const positions = getPositionsAround(currPos[0], currPos[1]).filter((p) => {
    return p[0] !== prevPos[0] || p[1] !== prevPos[1]
  })

  // const res = positions.map((position) => move(position, visited) + 1)
  // return Math.max(...res)
  return [positions[0], visited]
}

function assembleMap(lines) {
  let start
  let rowMax = 0
  let colMax = 0
  lines.forEach((line, row) => {
    if (row > rowMax) {
      rowMax = row
    }
    line.split('').forEach((l, col) => {
      if (col > colMax) {
        colMax = col
      }
      if (l === 'S') {
        MAP[[row, col]] = l
        start = [row, col]
      }
      if (l in PIPES) {
        MAP[[row, col]] = l
      }
    })
  })
  return [start, rowMax, colMax]
}

function countTransformedTilesInside(transformedMap, origLoop) {
  let count = 0;

  Object.entries(transformedMap).forEach(([posString, insideOrOutside]) => {
    let [row, col] = posString.split(',')
    row = Number(row)
    col = Number(col)
    if (insideOrOutside === 'I') {
      // check if is pipe tile
      const origPos = [Math.floor(row / 3), Math.floor(col / 3)];
      if (origPos in origLoop) {
        // pipe, ignore
        console.log('ignore')
      } else {
        count += 1
      }
    }
  })
  return count / 3 / 3;
}

module.exports = getAnswer
