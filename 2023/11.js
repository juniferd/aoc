const { readFile } = require('../utils.js')

const ORIG_GALAXIES = {}
const GALAXIES = {}
let ROW_MAX = 0
let COL_MAX = 0

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  console.log(lines)

  assembleOriginalGalaxyPositions(lines)

  // assembleMap(lines)

  // getShortestPathBetweenAllPairs()
}

function assembleOriginalGalaxyPositions(lines) {
  const universe2DArray = lines.map((line) => line.split(''))

  getGalaxyCoords(universe2DArray, ORIG_GALAXIES)
  console.log(ORIG_GALAXIES)
  const emptyRowIndices = findEmptyRows(universe2DArray)
  const emptyColIndices = findEmptyCols(universe2DArray)
  console.log('empty rows', emptyRowIndices)
  console.log('empty cols', emptyColIndices)

  const pairs = createAllPairs(ORIG_GALAXIES)
  let sum = 0
  Object.values(pairs).forEach(([posA, posB]) => {
    const dist = distanceBetweenPairs(
      posA,
      posB,
      emptyRowIndices,
      emptyColIndices
    )
    sum += dist
  })
  console.log(sum)
}

function distanceBetweenPairs(posA, posB, emptyRowIndices, emptyColIndices) {
  const multiplier = 1000000 - 1;
  // const multiplier = 2 - 1
  console.log(posA, posB)
  const numEmptyRowsBetween = emptyRowIndices.filter((rowIndex) => {
    return (rowIndex > posA[0] || rowIndex > posB[0]) && (rowIndex < posB[0] || rowIndex < posA[0])
  }).length
  console.log('num empty rows', numEmptyRowsBetween)
  const numEmptyColsBetween = emptyColIndices.filter((colIndex) => {
    return (colIndex > posA[1] || colIndex > posB[1]) && (colIndex < posB[1] || colIndex < posA[1])
  }).length
  console.log('num empty cols', numEmptyColsBetween)
  const dist =
    Math.abs(posA[0] - posB[0]) +
    multiplier * numEmptyRowsBetween +
    Math.abs(posA[1] - posB[1]) +
    multiplier * numEmptyColsBetween

  console.log(dist)
  console.log('----')
  return dist
}

function getShortestPathBetweenAllPairs() {
  const pairs = createAllPairs()

  let sum = 0
  Object.values(pairs).forEach(([posA, posB]) => {
    const dist = Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])
    sum += dist
  })
  console.log(sum)
}

// wait no not yet
function floydWarshall() {
  const galaxies = Object.values(GALAXIES)
  // construct 2d array
  const dist = []
  galaxies.forEach((_) => {
    const row = Array(galaxies.length).fill(Infinity)
    dist.push(row)
  })

  for (let k = 0; k < dist.length; k++) {
    for (let i = 0; i < dist.length; i++) {
      for (let j = 0; j < dist.length; j++) {
        if (
          dist[i][j] > dist[i][k] + dist[k][j] &&
          dist[k][j] !== Infinity &&
          dist[i][k] !== Infinity
        ) {
          dist[i][j] = dist[i][k] + dist[k][j]
        }
      }
    }
  }
}

function createAllPairs(galaxiesMap = GALAXIES) {
  const galaxies = Object.values(galaxiesMap)
  const pairs = {}
  for (let i = 0; i < galaxies.length; i++) {
    const galaxyA = galaxies[i]
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyB = galaxies[j]
      pairs[[galaxyA, galaxyB]] = [galaxyA, galaxyB]
    }
  }
  return pairs
}

function assembleMap(lines) {
  const universe2DArray = lines.map((line) => line.split(''))
  console.log(universe2DArray)
  expand(universe2DArray)

  getGalaxyCoords(universe2DArray)
  console.log(GALAXIES)
}

function getGalaxyCoords(universe2DArray, galaxyMap = GALAXIES) {
  universe2DArray.forEach((row, rIndex) => {
    row.forEach((col, cIndex) => {
      if (col === '#') {
        const pos = [rIndex, cIndex]
        galaxyMap[pos] = pos
      }
    })
  })
}

function expand(universe2DArray) {
  // find empty rows
  const emptyRowIndices = findEmptyRows(universe2DArray)
  const emptyColIndices = findEmptyCols(universe2DArray)

  // insert empty rows
  draw2DArray(universe2DArray)
  const emptyRow = Array(universe2DArray[0].length).fill('.')
  emptyRowIndices.forEach((index, diff) => {
    universe2DArray.splice(index + diff, 0, [...emptyRow])
  })
  draw2DArray(universe2DArray)

  // insert empty cols
  universe2DArray.forEach((row) => {
    emptyColIndices.forEach((index, diff) => {
      row.splice(index + diff, 0, '.')
    })
  })
  draw2DArray(universe2DArray)
}

function draw2DArray(lines) {
  lines.forEach((line) => {
    console.log(line.join(' '))
  })
  console.log('----')
}

function findEmptyRows(arr) {
  const emptyRowIndices = []
  arr.forEach((spaces, row) => {
    if (spaces.every((space) => space === '.')) {
      emptyRowIndices.push(row)
    }
  })
  return emptyRowIndices
}

function findEmptyCols(arr) {
  const emptyColIndices = Array(arr[0].length).fill(true)
  arr.forEach((spaces, row) => {
    spaces.forEach((space, col) => {
      if (emptyColIndices[col]) {
        if (space !== '.') {
          emptyColIndices[col] = false
        }
      }
    })
  })
  return emptyColIndices
    .map((val, index) => (val ? index : undefined))
    .filter((val) => val !== undefined)
}

function insertBlankRow(indexToInsert, sizeOfArray) {
  const arr = Array(sizeOfArray).fill((_) => '.')
  arr.forEach((content, index) => {
    const pos = []
  })
}

module.exports = getAnswer
