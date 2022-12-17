const { readFile } = require('../utils.js')

let ROCKS
let JETSTREAM
const TURNS = 100000
const GOTO_TURN=1000000 * 1000000
const MAP_HEIGHT = TURNS * 2
// for each rock turn, [the current minY]

const counts = {}

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

  // console.log(rocks)
  return rocks
}

/**
function rockAtRest(
  direction,
  bottomRockRow,
  bottomLeft,
  rockMap,
  prevRockIndex
) {
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
**/

function dropRock(rockIndex, jetstreamIndex, rockStartIndex, rockMap) {
  const rock = ROCKS[rockIndex]

  let moving = true
  // [x, y] coordinate of the bottom left of the rock
  let bottomLeft = [2, rockStartIndex]
  let newBottomLeft

  while (moving) {
    const jetstream = JETSTREAM[jetstreamIndex]
    if (jetstream === '<') {
      newBottomLeft = [bottomLeft[0] - 1, bottomLeft[1]]
    } else {
      newBottomLeft = [bottomLeft[0] + 1, bottomLeft[1]]
    }

    if (!isTouching(newBottomLeft, rock, rockMap)) {
      bottomLeft = newBottomLeft
    }
    jetstreamIndex =
      jetstreamIndex === JETSTREAM.length - 1 ? 0 : jetstreamIndex + 1

    newBottomLeft = [bottomLeft[0], bottomLeft[1] + 1]
    if (!isTouching(newBottomLeft, rock, rockMap)) {
      bottomLeft = newBottomLeft
    } else {
      break
    }
  }

  rockIndex = rockIndex === ROCKS.length - 1 ? 0 : rockIndex + 1

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

function simulate(rockMap) {
  let rockStartIndex = rockMap.length - 4
  let rockIndex = 0
  let jetstreamIndex = 0
  let minY = rockMap.length - 1
  let rockTotal = 0
  let prevIndex = 0
  const lineTurns = {}
  const minHeights = {}

  while (rockTotal < TURNS) {
    const rock = ROCKS[rockIndex]

    const {
      rockIndex: newRockIndex,
      jetstreamIndex: newJetstreamIndex,
      bottomLeft,
    } = dropRock(rockIndex, jetstreamIndex, rockStartIndex, rockMap)

    // add rock to rockMap
    const normalizedRock = rock
      .map(([x, y]) => {
        return [x + bottomLeft[0], y + bottomLeft[1]]
      })
      .forEach(([x, y]) => {
        rockMap[y][x] = '#'
        if (y < minY) {
          minY = y
        }

        lineTurns[MAP_HEIGHT - y] = rockTotal
        minHeights[rockTotal] = minY
      })

    const ratio = (MAP_HEIGHT - minY) / (rockTotal + 1)
    // const normalizedRatio = Math.round(ratio * TURNS * 10) / 10

    // totRatio = totRatio + ratio

    // if (!(normalizedRatio in RATIO_COUNTS)) {
    //   RATIO_COUNTS[normalizedRatio] = 1
    // } else {
    //   RATIO_COUNTS[normalizedRatio] += 1
    // }

    if (!counts[ratio]) {
      counts[ratio] = 0
    }
    counts[ratio]++

    // if (ratio == 1.5662650602409639) {
    //  console.log(rockTotal, rockTotal - prevIndex, ratio)
    //  prevIndex = rockTotal
    // }

    // tuple minY, rock row? but that will change with next drop
    // rockMap.slice(minY, minY + 26).forEach((r) => console.log(r.join('')))
    rockIndex = newRockIndex
    jetstreamIndex = newJetstreamIndex
    rockStartIndex = minY - 4
    rockTotal += 1
  }

  return { minY, lineTurns, minHeights }
}

function toInt(row) {
  let sum = 0
  for (let i = 0; i < row.length; i++) {
    if (row[i] == '#') {
      sum |= 1 << i
    }
  }
  return sum
}

function findCycleLength(ints, lineTurns, minHeights) {
  let cycle = []

  ints.splice(0, 10)

  for (let i = 5; i < ints.length; i++) {
    // console.log(ints.slice(0, i).join('') === ints.slice(i, 2*i ).join(''))
    if (ints.slice(0, i).join('') === ints.slice(i, i + i).join('')) {
      cycle = ints.slice(0, i)
      break
    }
  }
  return cycle.length
  /**
  // console.log(cycle, cycle.length)
  // should only be one but just in case
  let nonCyclesIndex = 0;
  for (let i = 0; i < Math.ceil(rockMap.length / cycle.length); i++) {
    const currInts = ints.slice(i * cycle.length, i * cycle.length + cycle.length).join('')
    if (currInts !== cycle.join('')) nonCyclesIndex = (i + 1) *cycle.length;
  }
  
  let nonCycle = ints.slice(nonCyclesIndex)
  // find actual noncycle - first part could be part of cycle overlap

  let realNonCycleIndex = 0
  for (let i = 0; i < nonCycle.length; i++) {
    if (cycle[i] !== nonCycle[i]) {
      realNonCycleIndex = i;
      break;
    }
  }

  const firstPartCycle = cycle.slice(0, realNonCycleIndex)
  const secondPartCycle = cycle.slice(realNonCycleIndex)

  cycle = [...secondPartCycle, ...firstPartCycle]
  nonCycle = nonCycle.slice(realNonCycleIndex)
  // console.log(cycle, nonCycle)
  // console.log("LAST NON CYCLE", nonCycle.length, lineTurns[nonCyclesIndex])
  const firstCycleTurn = lineTurns[nonCyclesIndex - 1];
  const lastCycleTurn = lineTurns[nonCyclesIndex - 1 - cycle.length];

  console.log('firstycleturn', firstCycleTurn)
  console.log('lastCycleTurn', lastCycleTurn)

  console.log("MIN Y AT FIRST CYCLE TURN", MAP_HEIGHT - minHeights[firstCycleTurn]);
  console.log("MIN Y AT LAST CYCLE TURN", MAP_HEIGHT - minHeights[lastCycleTurn]);
  console.log("MIN Y DELTA", (MAP_HEIGHT - minHeights[lastCycleTurn]) - (MAP_HEIGHT - minHeights[firstCycleTurn]))
  console.log("TURNS TO RUN A CYCLE", lastCycleTurn - firstCycleTurn)
  console.log("CYCLE HEIGHT", cycle.length)


  return {cycle, nonCycle, nonCycleIndex: nonCyclesIndex[0]}
 **/
}

function findNonCycleLength(ints, cycleLength) {
  for (let i = 0; i < ints.length; i++) {
    if (
      ints.slice(i, i + cycleLength).join('') ===
      ints.slice(i + cycleLength, i + 2 * cycleLength).join('')
    ) {
      return i
    }
  }
  return
}
// get height after 2022 rocks fallen

async function playRockTetris(file = '../input.txt') {
  const lines = await readFile(file)
  const rawRocks = await readFile('./rocks.txt')
  ROCKS = makeRocks(rawRocks)
  JETSTREAM = lines[0].split('')

  const rockMap = Array(MAP_HEIGHT)
    .fill('')
    .map((_) => Array(7).fill('.'))

  const { minY, lineTurns, minHeights } = simulate(rockMap)

  console.log("SIMULATION DONE");

  const ints = rockMap.slice(minY).map((r) => toInt(r))
  const cycleHeight = findCycleLength(ints, lineTurns, minHeights)
  console.log("CYCLE LENGTH", cycleHeight)

  const nonCycleHeight = findNonCycleLength(ints.reverse(), cycleHeight)

  const nonCycle = ints.slice(0, nonCycleHeight).reverse()
  const cycle = ints
    .slice(nonCycleHeight, nonCycleHeight + cycleHeight)

  const rocksInNonCycle = lineTurns[nonCycleHeight]
  const rocksInCycle = lineTurns[nonCycleHeight + cycleHeight] - rocksInNonCycle
  console.log("NON CYCLE INFO", rocksInNonCycle, nonCycleHeight)
  console.log("CYCLE INFO", rocksInCycle, cycleHeight)

  const numCycles = Math.floor((GOTO_TURN - rocksInNonCycle) / rocksInCycle)
  const remainder = (GOTO_TURN - rocksInNonCycle) % rocksInCycle

  
  // rockMap.forEach((row, i) => console.log(toInt(row)))

  // Object.entries(RATIO_COUNTS)
  //   .map((entry) => entry)
  //   .sort(([a1, a2], [b1, b2]) => a2 - b2)
  //   .forEach((ent) => console.log(ent))
  const lastLine = MAP_HEIGHT - minY
  const startHeight = minHeights[rocksInNonCycle]
  const endHeight = minHeights[rocksInNonCycle + remainder]

  const expectedHeight = nonCycleHeight + (numCycles * cycleHeight) + (startHeight - endHeight)
  console.log("GREW", startHeight - endHeight);
  console.log("NUM CYCLES", numCycles, "REMAINDER", remainder);
  console.log("ESTIMATED", expectedHeight);


}


module.exports = playRockTetris
