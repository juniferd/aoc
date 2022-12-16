const { readFile } = require('../utils.js')

const VALVES = {}
const DISTANCES = {}

function makeValves(lines) {
  lines.forEach((line) => {
    const valve = line.slice(6, 8)
    const regexp = /\d+/g
    const rate = Number(line.match(regexp)[0])
    const tunnels = line
      .split(';')[1]
      .slice(23)
      .split(',')
      .map((t) => t.trimStart())
    VALVES[valve] = { rate, tunnels }
    DISTANCES[valve] = {}
  })
}

function runBFS(start, curr, dist, visited) {
  queue = [[start, 0]]

  let i = 0
  while (i < queue.length) {
    let [curr, dist] = queue[i++]
    if (visited[curr] != undefined) {
      continue
    }
    visited[curr] = dist
    DISTANCES[start][curr] = dist++
    VALVES[curr].tunnels.forEach((neighbor) => {
      queue.push([neighbor, dist])
    })
  }
}

function findShortestPaths() {
  Object.keys(VALVES).forEach((curr) => {
    runBFS(curr, curr, 0, {})
  })
}

function trimGraph() {
  Object.keys(VALVES).forEach((curr) => {
    if (curr != 'AA' && VALVES[curr].rate == 0) {
      delete VALVES[curr]
    }
  })
}

function getMostPressure2(curr, timeLeft, pathsLeft, opened, cache) {
  // return when timeLeft zero
  // either open valve or go to neighbors
  // go through all the tunnels
  if (timeLeft <= 0 && pathsLeft === 0) return 0
  if (timeLeft <= 0 && pathsLeft > 0) return getMostPressure2('AA', 26, 0, opened, cache)

  const cacheKey = `${curr}-${timeLeft}-${pathsLeft}-${Array(...opened.keys()).sort()}`
  if (cacheKey in cache) return cache[cacheKey]

  const neighbors = VALVES[curr].tunnels
  const rate = VALVES[curr].rate

  const left = Math.max(
    ...neighbors.map((neighbor) => {
      return getMostPressure2(neighbor, timeLeft - 1,pathsLeft, opened, cache)
      // opening valve
    })
  )
  let right = 0
  if (!opened.has(curr) && rate > 0) {
    opened.add(curr)
    right =
      getMostPressure2(curr, timeLeft - 1, pathsLeft, opened, cache) +
      (timeLeft - 1) * rate
    opened.delete(curr)
  }
  res = Math.max(left, right)

  cache[cacheKey] = res

  return res
}
function getMostPressure(curr, timeLeft, opened, cache) {
  // return when timeLeft zero
  // either open valve or go to neighbors
  // go through all the tunnels
  if (timeLeft <= 0) return 0

  const cacheKey = `${curr}-${timeLeft}-${Array(...opened.keys()).sort()}`
  if (cacheKey in cache) return cache[cacheKey]

  const neighbors = VALVES[curr].tunnels
  const rate = VALVES[curr].rate

  const res = Math.max(
    ...neighbors.map((neighbor) => {
      return getMostPressure(neighbor, timeLeft - 1, opened, cache)
      // opening valve
    })
  )
  let right = 0
  if (!opened.has(curr) && rate > 0) {
    opened.add(curr)
    right =
      getMostPressure(neighbor, timeLeft - 2, opened, cache) +
      (timeLeft - 1) * rate
    opened.delete(curr)
  }
  return Math.max(left, right)

  cache[cacheKey] = res

  return res
}

function getMostPressureElephant(
  curr,
  elephant,
  timeLeft,
  eTimeLeft,
  opened,
  cache
) {
  // return when timeLeft zero
  // either open valve or go to neighbors
  // go through all the tunnels
  if (timeLeft <= 0) return 0

  if (eTimeLeft > timeLeft) {
    return getMostPressureElephant(
      elephant,
      curr,
      eTimeLeft,
      timeLeft,
      opened,
      cache
    )
  }

  const seen = Array(...opened.keys()).sort()
  const cacheKey = `${curr}-${elephant}-${timeLeft}-${eTimeLeft}-${seen}`
  if (cacheKey in cache) return cache[cacheKey]
  const otherCacheKey = `${elephant}-${curr}-${eTimeLeft}-${timeLeft}-${seen}`
  if (otherCacheKey in cache) {
    return cache[otherCacheKey]
  }

  const neighbors = VALVES[curr].tunnels
  const rate = VALVES[curr].rate

  const left = Math.max(
    ...Object.keys(VALVES).map((neighbor) => {
      if (neighbor == elephant || neighbor == curr || neighbor == 'AA') {
        return 0
      }
      if (opened.has(neighbor)) {
        return 0
      }
      let distance = DISTANCES[curr][neighbor]
      return getMostPressureElephant(
        neighbor,
        elephant,
        timeLeft - distance,
        eTimeLeft,
        opened,
        cache
      )
    })
  )

  let right = 0
  if (!opened.has(curr) && rate > 0) {
    opened.add(curr)
    right =
      getMostPressureElephant(
        curr,
        elephant,
        timeLeft - 1,
        eTimeLeft,
        opened,
        cache
      ) +
      (timeLeft - 1) * rate
    opened.delete(curr)
  }
  const res = Math.max(left, right)

  cache[cacheKey] = res

  return res
}

const NODE_IDS = {}

function markOpened(node, opened) {
  const id = getNodeID(node)
  const bit = 1 << id;  
  return opened | bit;
}

function getNodeID(nodeID) {
  if (!(nodeID in NODE_IDS)) {
    NODE_IDS[nodeID] = Object.keys(NODE_IDS).length
  }

  return NODE_IDS[nodeID]  
}

function isOpened(node='', opened=1) {
  const id = getNodeID(node);
  const bit = 1 << id;
  return opened & bit;
}

function unmarkOpened(node, opened) {
  const id = getNodeID(node);
  const bit = 1 << id;
  return (~bit) & opened;
}

function getMostPressureEB(curr, timeLeft, pathsLeft, opened, cache) {
  if (timeLeft <= 0 && pathsLeft === 0) return 0
  if (timeLeft <= 0 && pathsLeft > 0)
    return getMostPressureEB('AA', 26, pathsLeft - 1, opened, cache)

  const cacheKey = `${curr}-${timeLeft}-${pathsLeft}-${opened}`

  if (cacheKey in cache) return cache[cacheKey]

  const rate = VALVES[curr].rate

  const left = Math.max(
    ...Object.keys(VALVES).map((neighbor) => {
      if (neighbor == curr || neighbor == 'AA') {
        return 0
      }
      if (isOpened(neighbor, opened)) {
        return 0
      }
      let distance = DISTANCES[curr][neighbor]
      return getMostPressureEB(
        neighbor,
        timeLeft - distance,
        pathsLeft,
        opened,
        cache
      )
    })
  )

  let right = 0
  if (!isOpened(curr, opened) && rate > 0) {
    opened = markOpened(curr, opened)
    right =
      getMostPressureEB(curr, timeLeft - 1, pathsLeft, opened, cache) +
      (timeLeft - 1) * rate
    opened = unmarkOpened(curr, opened)
  }

  const res = Math.max(left, right)

  cache[cacheKey] = res

  return res
}
function getMostPressureE(curr, timeLeft, pathsLeft, opened, cache) {
  if (timeLeft <= 0 && pathsLeft === 0) return 0
  if (timeLeft <= 0 && pathsLeft > 0)
    return getMostPressureE('AA', 26, pathsLeft - 1, opened, cache)

  const cacheKey = `${curr}-${timeLeft}-${pathsLeft}-${Array(
    ...opened.keys()
  ).sort()}`

  if (cacheKey in cache) return cache[cacheKey]

  const rate = VALVES[curr].rate

  const left = Math.max(
    ...Object.keys(VALVES).map((neighbor) => {
      if (neighbor == curr || neighbor == 'AA') {
        return 0
      }
      if (opened.has(neighbor)) {
        return 0
      }
      let distance = DISTANCES[curr][neighbor]
      return getMostPressureE(
        neighbor,
        timeLeft - distance,
        pathsLeft,
        opened,
        cache
      )
    })
  )

  let right = 0
  if (!opened.has(curr) && rate > 0) {
    opened.add(curr)
    right =
      getMostPressureE(curr, timeLeft - 1, pathsLeft, opened, cache) +
      (timeLeft - 1) * rate
    opened.delete(curr)
  }

  const res = Math.max(left, right)

  cache[cacheKey] = res

  return res
}

async function getMaxRelease(file = '../input.txt') {
  const lines = await readFile(file)
  makeValves(lines)
  findShortestPaths()
  trimGraph()
  console.log(VALVES)

  console.log(Object.keys(VALVES))
  const opened = new Set()
  const cache = {}
  const cache2 = {}
  const start = +new Date()
  // const res = getMostPressureElephant('AA', 'AA', 26, 26, opened, cache)

  const res = getMostPressureEB('AA', 26, 1, 0, cache)

  const end = +new Date()
  console.log('TOOK', end - start)
  console.log(res)
}

module.exports = getMaxRelease
