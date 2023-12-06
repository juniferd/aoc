const { readFile } = require('../utils.js')

const TIME = {}
const DISTANCE = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  // partOne(lines)
  const [time, dist] = createRace(lines)
  const res = getWinningRange(time, dist)
  console.log(res)
}

function getWinningRange(targetTime, targetDist) {
  let minTime = Infinity
  let maxTime = -Infinity
  for (let i = 0; i < targetTime; i++) {
    const totalDist = (targetTime - i) * i
    if (totalDist > targetDist) {
      if (i < minTime) {
        minTime = i
      }
      if (i > maxTime) {
        maxTime = i
      }
    }
  }
  console.log(minTime, maxTime)
  // console.log('TARGET DISTANCE TO BEAT', targetDist)
  // console.log(
  //   'minTime distance diff',
  //   (targetTime - minTime) * minTime - targetDist
  // )
  // console.log(
  //   'minTime - 1',
  //   (targetTime - minTime + 1) * (minTime - 1) - targetDist
  // )
  // console.log(
  //   'maxTime distance diff',
  //   (targetTime - maxTime) * maxTime - targetDist
  // )
  // console.log(
  //   'maxTime + 1',
  //   (targetTime - maxTime - 1) * (maxTime + 1) - targetDist
  // )
  return maxTime - minTime + 1
}

function partOne(lines) {
  createTable(lines)
  let mult = 1
  Object.keys(TIME).forEach((race) => {
    const res = getBoatTime(false, 0, 0, TIME[race], DISTANCE[race])
    console.log(res)
    mult *= res
  })
  console.log('final:', mult)
}

// wait, this is unnecessary lol
function getBoatTime(buttonReleased, speed, dist, targetTime, targetDist) {
  let res
  if (targetTime < 0 && dist > targetDist) {
    console.log('FOUND', dist, speed)
    return 1
  }
  if (targetTime < 0 && dist <= targetDist) {
    console.log('SKIP', dist, speed)
    return 0
  }
  if (buttonReleased) {
    if ((targetTime + 1) * speed + dist > targetDist) {
      return 1
    }
    return 0
  }

  // either increment button press or don't
  const l = getBoatTime(false, speed + 1, dist, targetTime - 1, targetDist)
  const r = getBoatTime(true, speed, dist, targetTime - 1, targetDist)
  res = l + r

  return res
}

function createRace(lines) {
  let times = ''
  let dist = ''
  lines.forEach((line) => {
    line.split(/\s+/).forEach((l, i) => {
      if (i === 0) return
      if (line.startsWith('Time')) {
        times += l
      } else {
        dist += l
      }
    })
  })
  return [Number(times), Number(dist)]
}

function createTable(lines) {
  lines.forEach((line) => {
    line.split(/\s+/).forEach((l, i) => {
      if (i === 0) return
      if (line.startsWith('Time')) {
        TIME[i] = Number(l)
      } else {
        DISTANCE[i] = Number(l)
      }
    })
  })
}

module.exports = getAnswer
