const { readFile } = require('../utils.js')

function generateXY(xStart, yStart, xEnd, yEnd, rockPaths) {
  let xRange = [Infinity, 0]
  let yRange = [Infinity, 0]
  // console.log('xStart', xStart, 'xEnd', xEnd, 'yStart', yStart, 'yEnd', yEnd)
  let iStart = xStart - xEnd === 0 ? yStart : xStart
  let iEnd = xStart - xEnd === 0 ? yEnd : xEnd
  for (let i = iStart; i < iEnd + 1; i++) {
    if (xStart - xEnd === 0) {
      // vertical line
      rockPaths[`${xStart},${i}`] = '#'
      if (i < yRange[0]) {
        yRange[0] = i
      }
      if (i > yRange[1]) {
        yRange[1] = i
      }
    } else {
      // horizontal line
      rockPaths[`${i},${yStart}`] = '#'
      if (i < xRange[0]) {
        xRange[0] = i
      }
      if (i > xRange[1]) {
        xRange[1] = i
      }
    }
  }
  return { xRange, yRange }
}

function getMinMaxRanges(range1, range2) {
  return [Math.min(range1[0], range2[0]), Math.max(range1[1], range2[1])]
}

function createPath(paths, rockPaths, xRange, yRange) {
  let xStart = null
  let yStart = null
  // console.log('paths', paths)
  paths.forEach((path, i) => {
    // console.log('path', path)
    let [x, y] = path.split(',')
    x = +x
    y = +y
    if (i === 0) {
      xStart = x
      yStart = y
      xRange = [x, x]
      yRange = [y, y]
    } else {
      const { xRange: currXRange, yRange: currYRange } = generateXY(
        Math.min(xStart, x),
        Math.min(yStart, y),
        Math.max(xStart, x),
        Math.max(yStart, y),
        rockPaths
      )
      xStart = x
      yStart = y
      xRange = getMinMaxRanges(xRange, currXRange)
      yRange = getMinMaxRanges(yRange, currYRange)

      // console.log('new xRange', xRange)
      // console.log('new yRange', yRange)
      // console.log(rockPaths)
    }
  })
  return { xRange, yRange }
}

function createRockPaths(lines) {
  const rockPaths = {}
  let xRange = [500, 500]
  let yRange = [0, 0]
  lines.forEach((line) => {
    const { xRange: currXRange, yRange: currYRange } = createPath(
      line.split('->'),
      rockPaths,
      xRange,
      yRange
    )
    xRange = getMinMaxRanges(xRange, currXRange)
    yRange = getMinMaxRanges(yRange, currYRange)
  })
  // for part 2
  yRange = [yRange[0], yRange[1] + 2]
  xRange = [xRange[0] - (yRange[1] - yRange[0]), xRange[1] + yRange[1] - yRange[0]]
  return { rockPaths, xRange, yRange }
}

function createMap(rockPaths, xRange, yRange) {
  const rockMap = Array(yRange[1] - yRange[0] + 1)
    .fill('')
    .map((_) => Array(xRange[1] - xRange[0] + 1).fill('.'))
  Object.keys(rockPaths).forEach((key) => {
    const [x, y] = key.split(',')
    const row = y - yRange[0]
    const col = x - xRange[0]
    rockMap[row][col] = '#'
  })
  // drawMap(rockMap)
  return rockMap
}

function drawMap(rockMap) {
  rockMap.forEach((row, i) => {
    console.log(i, row.join(' '))
  })
}

function inBounds(pos, xRange, yRange) {
  return (
    pos[0] >= xRange[0] &&
    pos[0] <= xRange[1] &&
    pos[1] >= yRange[0] &&
    pos[1] <= yRange[1]
  )
}

function dropSand(rockMap, rockPaths, xRange, yRange, sandPos) {
  if (!inBounds(sandPos, xRange, yRange)) return false
  // try to go down
  // if down blocked go down and left
  // if down and left blocked go down and right
  // draw o if blocked
  // console.log(sandPos)
  const down = [sandPos[0], sandPos[1] + 1]
  const downLeft = [sandPos[0] - 1, sandPos[1] + 1]
  const downRight = [sandPos[0] + 1, sandPos[1] + 1]

  const downBlocked = down.join(',') in rockPaths || down[1] === yRange[1]
  const downLeftBlocked = downLeft.join(',') in rockPaths || downLeft[1] === yRange[1]
  const downRightBlocked = downRight.join(',') in rockPaths || downRight[1] === yRange[1]

  if (downBlocked && downLeftBlocked && downRightBlocked) {
    rockPaths[sandPos.join(',')] = 'o'
    const row = sandPos[1] - yRange[0]
    const col = sandPos[0] - xRange[0]
    rockMap[row][col] = 'o'
    return true
  } else if (!downBlocked) {
    return dropSand(rockMap, rockPaths, xRange, yRange, down)
  } else if (!downLeftBlocked) {
    return dropSand(rockMap, rockPaths, xRange, yRange, downLeft)
  } else if (!downRightBlocked) {
    return dropSand(rockMap, rockPaths, xRange, yRange, downRight)
  }
}

async function getSandUnits(file = '../input.txt') {
  const lines = await readFile(file)
  const { rockPaths, xRange, yRange } = createRockPaths(lines)

  const rockMap = createMap(rockPaths, xRange, yRange)
  while (dropSand(rockMap, rockPaths, xRange, yRange, [500, 0])) {
    if ([500,0].join(',') in rockPaths) {
      break;
    }  
    // drawMap(rockMap)
  }
  // drawMap(rockMap)
  console.log(
    Object.values(rockPaths)
      .filter((f) => f === 'o')
      .reduce((acc, c) => acc + 1, 0)
  )
}

module.exports = getSandUnits
