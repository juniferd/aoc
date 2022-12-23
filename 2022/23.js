const { readFile } = require('../utils.js')

const MAP = {}
const ROUNDS = 30000

function createMap(lines) {
  lines.forEach((line, y) => {
    line.split('').forEach((tile, x) => {
      if (tile === '#') {
        const key = [x, y]
        MAP[key] = '#'
      }
    })
  })
}

function getAdjacent(x, y) {
  return {
    N: [x, y - 1],
    NE: [x + 1, y - 1],
    NW: [x - 1, y - 1],
    S: [x, y + 1],
    SE: [x + 1, y + 1],
    SW: [x - 1, y + 1],
    W: [x - 1, y],
    E: [x + 1, y],
  }
}

const DIRS = ['N', 'S', 'W', 'E']
function proposeMovement(x, y, index) {
  const adjacents = getAdjacent(x, y)
  let hasNeighbors = false;
  Object.values(adjacents).forEach((value) => {
    if (value in MAP) {
      hasNeighbors = true;
    }
  })

  if (!hasNeighbors) {
    return [x, y]
  }
  

  for (let i = index; i < index + 4; i++) {
    let dir = DIRS[i % DIRS.length]
    if (dir == 'N' && !(adjacents.N in MAP) && !(adjacents.NE in MAP) && !(adjacents.NW in MAP))
      return [x, y - 1]
    if (dir == 'S' && !(adjacents.S in MAP) && !(adjacents.SE in MAP) && !(adjacents.SW in MAP))
      return [x, y + 1]
    if (dir == 'W' && !(adjacents.W in MAP) && !(adjacents.NW in MAP) && !(adjacents.SW in MAP))
      return [x - 1, y]
    if (dir == 'E' && !(adjacents.E in MAP) && !(adjacents.NE in MAP) && !(adjacents.SE in MAP))
      return [x + 1, y]
  }
}

function getProposals(index) {
  const proposals = {}
  Object.keys(MAP).forEach((elf) => {
    let [x, y] = elf.split(',')
    x = Number(x)
    y = Number(y)
    const proposal = proposeMovement(x, y, index)
    if (proposal && !(proposal in proposals)) {
      proposals[proposal] = [[x, y]]
    } else if (proposal && proposal in proposals) {
      proposals[proposal].push([x,y])
    }
  })

  return proposals
}

function drawMap() {
  let xRange = [Infinity, -Infinity]
  let yRange = [Infinity, -Infinity]
  Object.keys(MAP).forEach((pos) => {
    let [x, y] = pos.split(',')
    x = Number(x)
    y = Number(y)
    if (x > xRange[1]) {
      xRange[1] = x
    }
    if (x < xRange[0]) {
      xRange[0] = x
    }
    if (y > yRange[1]) {
      yRange[1] = y
    }
    if (y < yRange[0]) {
      yRange[0] = y
    }
  })

  const xSize = Math.abs(xRange[1] - xRange[0]) + 1
  const ySize = Math.abs(yRange[1] - yRange[0]) + 1

  const arr = Array(ySize)
    .fill('.')
    .map((_) => Array(xSize).fill('.'))

  Object.keys(MAP).forEach((pos) => {
    let [x, y] = pos.split(',')
    x = Number(x)
    y = Number(y)
    arr[y - yRange[0]][x - xRange[0]] = '#'
  })

  arr.forEach((l) => console.log(l.join('')))
  return [xSize, ySize]
}

function doProposals(proposals) {
  let changed = false;
  Object.entries(proposals).forEach(([newPos, oldPoss]) => {
    if (oldPoss.length === 1) {
      if (newPos !== oldPoss[0].join(',')) {
        changed = true
      }
      delete MAP[oldPoss[0]]
      MAP[newPos] = '#'
    }
  })
  return changed;
}

async function getEmptyTiles(file = '../input.txt') {
  const lines = await readFile(file)
  createMap(lines)

  drawMap()
  for (let i = 0; i < ROUNDS; i++) {
    // first half - keyed on new proposed tile
    const proposals = getProposals(i)
    // second half
    const changed = doProposals(proposals)
    console.log('ROUND', i + 1)
    if (!changed) break;

  }
  const [xSize, ySize] = drawMap()
  console.log(xSize * ySize - Object.keys(MAP).length)

}

module.exports = getEmptyTiles
