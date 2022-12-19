const { readFile } = require('../utils.js')

const TIME = 32

function createBlueprints(lines) {
  const blueprints = {}

  lines.forEach((line) => {
    let [id, rest] = line.split(':')
    id = id.slice(10)

    const costs = rest.split('. ').map((l) => {
      const robot = l.split('robot')[0].slice(5).trim()
      const regexp = /\d+ (ore|clay|obsidian)/g
      const currCosts = l.match(regexp).reduce((acc, c) => {
        const [currCost, currType] = c.split(' ')
        return { ...acc, [currType]: Number(currCost) }
      }, {})
      return [
        currCosts.ore ?? 0,
        currCosts.clay ?? 0,
        currCosts.obsidian ?? 0,
        currCosts.geode ?? 0,
      ]
    })
    blueprints[id] = costs
  })

  return blueprints
}

function canCreateRobot(costs, ores) {
  for (let i = 0; i < costs.length; i++) {
    if (costs[i] > ores[i]) {
      return false
    }
  }
  return true
}
function subtract(costs, ores) {
  for (let i = 0; i < costs.length; i++) {
    ores[i] -= costs[i]
  }
}

function add(costs, ores) {
  for (let i = 0; i < costs.length; i++) {
    ores[i] += costs[i]
  }
}
function getMaxGeodes(
  currRobots,
  timeLeft,
  oreCounts,
  index,
  robotCosts,
  cache
) {
  const key = `${currRobots}-${timeLeft}-${oreCounts}`
  // console.log(key, currRobots, oreCounts)
  if (timeLeft <= 0) return oreCounts[3]

  if (key in cache) return cache[key]

  let couldntBuy = true
  let right = 0
  let left = []

  let maxBuyableRobot = 0
  for (let i = robotCosts.length - 1; i > index; i--) {
    const costs = robotCosts[i]
    if (canCreateRobot(costs, oreCounts)) {
      maxBuyableRobot = i - 1
      break
    }
  }
  index = maxBuyableRobot

  for (let i = index; i < robotCosts.length; i++) {
    let currLeft = 0
    let costs = robotCosts[i]

    subtract(currRobots, oreCounts)
    const canCreateLast = canCreateRobot(costs, oreCounts)
    add(currRobots, oreCounts)
    const canCreate = canCreateRobot(costs, oreCounts)
    add(currRobots, oreCounts)

    if (canCreate && !canCreateLast) {
      // create robot
      currRobots[i] += 1
      subtract(costs, oreCounts)
      currLeft = getMaxGeodes(
        currRobots,
        timeLeft - 1,
        oreCounts,
        index,
        robotCosts,
        cache
      )

      add(costs, oreCounts)
      currRobots[i] -= 1
      couldntBuy = false
    }
    subtract(currRobots, oreCounts)

    left.push(currLeft)
  }

  // once you're able to buy the obsidian robot you don't want to not buy it

  // if (couldntBuy) {
  add(currRobots, oreCounts)
  right = getMaxGeodes(
    currRobots,
    timeLeft - 1,
    oreCounts,
    index,
    robotCosts,
    cache
  )
  subtract(currRobots, oreCounts)
  // }

  const res = Math.max(right, ...left)
  cache[key] = res

  return res
}

async function getQualityLevel(file = '../input.txt') {
  const lines = await readFile(file)
  const blueprints = createBlueprints(lines.slice(0, 3))

  const res = []
  Object.entries(blueprints).forEach(([blueprintID, robots]) => {
    const cache = {}
    // currRobots is an array [ore, clay, obsidian, geode]
    const maxGeodes = getMaxGeodes(
      [1, 0, 0, 0],
      TIME,
      [0, 0, 0, 0],
      0,
      robots,
      cache
    )
    res.push(maxGeodes)
    console.log(maxGeodes)
  })
  console.log(res.reduce((acc, r) => acc * r, 1))
}

module.exports = getQualityLevel
