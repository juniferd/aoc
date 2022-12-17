const { readFile } = require('../utils.js')

let ROCKS
let JETSTREAM
const MAP_HEIGHT = 2022 * 4

function getRockPos(rock) {
  const rockHeight = rock.length - 1
  const coords = []
  for (let i = rockHeight; i > -1; i--) {
    const row = rock[i]
    row.forEach((r, j) => {
      if (r === '#') {
        coords.push([j, -rockHeight + i])
      }
    })
  }
  return coords
}
function makeRocks(lines) {
  const rocks = []
  let rock = []

  lines.forEach((line) => {
    if (line === '') {
      const rockPos = getRockPos(rock)
      rocks.push(rockPos)
      rock = []
      endReached = false
    } else {
      rock.push(line.split(''))
    }
  })

  rocks.push(getRockPos(rock))

  console.log(rocks)
  return rocks
}

function rockAtRest(
  direction,
  bottomRockRow,
  bottomLeft,
  rockMap,
  prevRockIndex
) {
  console.log(prevRockIndex)
  if (direction === 'LR') return false
  if (prevRockIndex === rockMap.length) return true

  const prevRockRow = rockMap[prevRockIndex].slice(
    bottomLeft[0],
    bottomLeft[0] + bottomRockRow.length
  )

  const atRest = bottomRockRow.reduce((acc, r, i) => {
    return acc && ((r === '#' && prevRockRow[i] === '#') || r === '.')
  }, true)
  return atRest
}

function dropRock(rockIndex, jetstreamIndex, rockStartIndex, rockMap) {
  const rock = ROCKS[rockIndex]

  let moving = true
  let direction = 'LR'
  // [x, y] coordinate of the bottom left of the rock
  let bottomLeft = [2, rockStartIndex]
  let newBottomLeft
  console.log('bottomLeft', bottomLeft)

  while (moving) {
    const jetstream = JETSTREAM[jetstreamIndex]
    console.log(jetstream)
    if (jetstream === '<') {
      newBottomLeft = [bottomLeft[0] - 1, bottomLeft[1]]
    } else {
      newBottomLeft = [bottomLeft[0] + 1, bottomLeft[1]]
    }

    if (!isTouching(newBottomLeft, rock, rockMap)) {
      bottomLeft = newBottomLeft
    }
    jetstreamIndex = jetstreamIndex === JETSTREAM.length - 1 ? 0 : jetstreamIndex + 1;

    console.log('moved to', bottomLeft)
    newBottomLeft = [bottomLeft[0], bottomLeft[1] + 1]
    if (!isTouching(newBottomLeft, rock, rockMap)) {
      bottomLeft = newBottomLeft
    } else {
      break
    }
    console.log('moved to', bottomLeft)
  }

  rockIndex = rockIndex === ROCKS.length - 1 ? 0 : rockIndex + 1

  console.log('rockIndex', rockIndex, 'jetstreamIndex', jetstreamIndex)
  return {
    rockIndex,
    jetstreamIndex,
    bottomLeft,
  }
}

function inBounds(pos, xRange, yRange) {
  return (
    pos[0] >= xRange[0] &&
    pos[0] <= xRange[1] &&
    pos[1] >= yRange[0] &&
    pos[1] <= yRange[1]
  )
}

function isTouching(bottomLeft, rock, rockMap) {
  const normalizedRock = rock.map(([x, y]) => {
    return [bottomLeft[0] + x, bottomLeft[1] + y]
  })

  for (let i = 0; i < normalizedRock.length; i++) {
    const [x, y] = normalizedRock[i]
    if (!inBounds([x, y], [0, 6], [0, MAP_HEIGHT - 1])) return true
    if (rockMap[y][x] === '#') return true
    if (rockMap[y][x] === '#') return true
    if (rockMap[y][x] === '#') return true
  }

  return false
}

// get height after 2022 rocks fallen
async function playRockTetris(file = '../input.txt') {
  const lines = await readFile(file)
  const rawRocks = await readFile('./rocks.txt')
  ROCKS = makeRocks(rawRocks)
  JETSTREAM = lines[0].split('')
  let rockIndex = 0
  let jetstreamIndex = 0
  let height = 0

  const rockMap = Array(MAP_HEIGHT)
    .fill('')
    .map((_) => Array(7).fill('.'))
  let rockStartIndex = MAP_HEIGHT - 4

  let minY = Infinity
  let rockTotal = 0
  while (rockTotal < 2022) {
    const rock = ROCKS[rockIndex]

    console.log(rockStartIndex)
    // rockMap.slice(-6).forEach((r) => console.log(r.join('')))

    const {
      rockIndex: newRockIndex,
      jetstreamIndex: newJetstreamIndex,
      bottomLeft,
    } = dropRock(rockIndex, jetstreamIndex, rockStartIndex, rockMap)

    console.log(newJetstreamIndex, bottomLeft)
    // add rock to rockMap
    const normalizedRock = rock.map(([x, y]) => {
      return [x + bottomLeft[0], y + bottomLeft[1]] 
    }).forEach(([x, y]) => {
      rockMap[y][x] = '#'
      if (y < minY) {
        minY = y
      } 
    })

    rockMap.slice(-26).forEach((r) => console.log(r.join('')))
    rockIndex = newRockIndex

    jetstreamIndex = newJetstreamIndex
    rockStartIndex = minY - 4;
    rockTotal += 1
   
    //   // add to the height somehow
  }
  console.log(MAP_HEIGHT - minY)
}


module.exports = playRockTetris
