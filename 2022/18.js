const { readFile } = require('../utils.js')

class Cubes {
  constructor(cubes) {
    this.all = []
    cubes.forEach((pos) => {
      const [x, y, z] = pos.split(',')
      this.all.push(new Cube(x, y, z))
    })
  }

  getSurfaceArea() {
    let surfaceArea = 0

    this.all.forEach((cube) => {})
  }
}

class Cube {
  constructor(x, y, z) {
    this.x = Number(x)
    this.y = Number(y)
    this.z = Number(z)
  }

  isAdjacent(x, y, z) {}
}

function getMinMaxRanges(range1, range2) {
  return [Math.min(range1[0], range2[0]), Math.max(range1[1], range2[1])]
}

async function foo(file = '../input.txt') {
  const lines = await readFile(file)
  const cubes = lines.map((line) => line.split(',').map((l) => Number(l)))
  const adjacents = {}

  console.log(cubes)

  let surfaceArea = 6 * cubes.length

  let xRange = [Infinity, 0]
  let yRange = [Infinity, 0]
  let zRange = [Infinity, 0]

  cubes.forEach(([x1, y1, z1], i) => {
    cubes.forEach(([x2, y2, z2], j) => {
      // ignore same cube
      if (i == j) return

      const manhattanDistance =
        Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)

      // sides are touching
      if (manhattanDistance === 1) {
        surfaceArea -= 1
        if ([x1, y1, z1] in adjacents) {
          adjacents[[x1, y1, z1]].push([x2, y2, z2])
        } else {
          adjacents[[x1, y1, z1]] = [[x2, y2, z2]]
        }
      }
    })
    xRange = getMinMaxRanges(xRange, [x1, x1])
    yRange = getMinMaxRanges(yRange, [y1, y1])
    zRange = getMinMaxRanges(zRange, [z1, z1])
  })

  console.log(adjacents)
  console.log(xRange, yRange, zRange)

  console.log(surfaceArea)
}

async function getExteriorSurfaceArea(file = '../input.txt') {
  const lines = await readFile(file)
  const cubes = lines.map((line) => line.split(',').map((l) => Number(l)))
  const cubeDict = {}

  let xRange = [Infinity, 0]
  let yRange = [Infinity, 0]
  let zRange = [Infinity, 0]

  cubes.forEach(([x1, y1, z1]) => {
    cubeDict[[x1, y1, z1]] = [x1, y1, z1]
    xRange = getMinMaxRanges(xRange, [x1, x1])
    yRange = getMinMaxRanges(yRange, [y1, y1])
    zRange = getMinMaxRanges(zRange, [z1, z1])
  })

  console.log(xRange, yRange, zRange)

  const { surfaceCount } = floodFill(xRange, yRange, zRange, cubeDict)

  console.log(surfaceCount)
}

function inBounds(curr, xMax, yMax, zMax) {
  const [x, y, z] = curr
  return (
    x > -1 &&
    x <= xMax + 1 &&
    y > -1 &&
    y <= yMax + 1 &&
    z > -1 &&
    z <= zMax + 1
  )
}
function floodFill(xRange, yRange, zRange, cubeDict) {
  const queue = [[0, 0, 0]]

  const seen = {}
  let surfaceCount = 0

  while (queue.length) {
    const curr = queue.pop()
    if (!inBounds(curr, xRange[1], yRange[1], zRange[1])) continue
    if (curr in cubeDict) {
      surfaceCount += 1
      continue
    }
    if (curr in seen) continue

    seen[curr] = true

    // 6 different sides

    const [x, y, z] = curr
    queue.push([x - 1, y, z])
    queue.push([x, y - 1, z])
    queue.push([x, y, z - 1])
    queue.push([x + 1, y, z])
    queue.push([x, y + 1, z])
    queue.push([x, y, z + 1])
  }
  return { surfaceCount }
}

module.exports = getExteriorSurfaceArea
