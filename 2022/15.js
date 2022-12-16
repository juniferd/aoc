const { readFile } = require('../utils.js')

function getMinMaxRanges(range1, range2) {
  return [Math.min(range1[0], range2[0]), Math.max(range1[1], range2[1])]
}

function getSensorBeacon(sensorBeacons) {
  const regexp = /-?\d+/g
  const sensor = sensorBeacons[0].match(regexp).map((d) => +d)
  const beacon = sensorBeacons[1].match(regexp).map((d) => +d)
  return { sensor, beacon }
}

function createBeacons(lines) {
  const sensors = {}
  let xRange = [0, 0]
  let yRange = [0, 0]

  lines.forEach((line) => {
    const { sensor, beacon } = getSensorBeacon(line.split(':'))
    sensors[sensor] = beacon
    xRange = getMinMaxRanges(xRange, [beacon[0], beacon[0]])
    xRange = getMinMaxRanges(xRange, [sensor[0], sensor[0]])
    yRange = getMinMaxRanges(yRange, [beacon[1], beacon[1]])
    yRange = getMinMaxRanges(yRange, [sensor[1], sensor[1]])
  })
  return { sensors, xRange, yRange }
}

function getXYMinMax(signals) {
  let xRange = [0,0]
  let yRange = [0,0]
  Object.keys(signals).forEach(key => {
    let [x,y] = key.split(',')
    x = Number(x)
    y = Number(y)
    if (x <= xRange[0]) {
      xRange[0] = x
    }
    if (x >= xRange[1]) {
      xRange[1] = x
    }
    if (y <= yRange[0]) {
      yRange[0] = y
    }
    if (y >= yRange[1]) {
      yRange[1] = y
    }
  })
  return {xRange, yRange}
}

function createMap(signals) {
  const {xRange, yRange} = getXYMinMax(signals)
  const signalMap = Array(yRange[1] - yRange[0] + 1)
    .fill('')
    .map((_) => Array(xRange[1] - xRange[0] + 1).fill('.'))

  Object.entries(signals).forEach(([key, value]) => {
    // console.log(key, value, xRange, yRange)
    const [xKey, yKey] = key.split(',')
    const rowSignal = Number(yKey) - yRange[0]
    const colSignal = Number(xKey) - xRange[0]
    signalMap[rowSignal][colSignal] = value
  })
  return signalMap
}

function drawMap(signalMap) {
  signalMap.forEach((row, i) => {
    console.log(('00' + i).slice(-2), row.join(' '))
  })
}

function getManhattanDistance(pos1, pos2) {
  const diffX = Math.abs(pos1[0] - pos2[0])
  const diffY = Math.abs(pos1[1] - pos2[1])
  return diffX + diffY
}

function inBounds(pos, xRange, yRange) {
  return (
    pos[0] >= xRange[0] &&
    pos[0] <= xRange[1] &&
    pos[1] >= yRange[0] &&
    pos[1] <= yRange[1]
  )
}

function addNoPossibleBeacon(
  allSignals,
  sensor,
  manhattanDistance
) {
  const [sensorX, sensorY] = sensor.split(',')
  console.log(sensorX, sensorY)
  for (let y = -manhattanDistance; y <= manhattanDistance; y++) {
    const normalizedY = Number(sensorY) + y;
    if (normalizedY < 0 || normalizedY > 4000000) continue;
    for (let x = -manhattanDistance; x <= manhattanDistance; x++) {
      const normalizedX = Number(sensorX) + x;
      if (normalizedX < 0 || normalizedX > 4000000) continue;
      if (Math.abs(x) + Math.abs(y) <= manhattanDistance) {
        const key = [normalizedX, normalizedY].join(',')
        if (!(key in allSignals)) {
          allSignals[key] = '#'
        }
      }
    }
  }
}

function checkBorderPositionInBounds(manhattans, x, y) {
  for (let i = 0; i < manhattans.length; i++) {
    const [signalX, signalY] = manhattans[i][0]
    const diffX = Math.abs(signalX - x);
    const diffY = Math.abs(signalY - y);
    if (diffX + diffY <= manhattans[i][1]) return false;
  }
  return true;
}

function addBorders(signalManhattans, sensor, manhattanDistance) {
  const [sensorX, sensorY] = sensor.split(',').map(Number);
  console.log(sensorX, sensorY, manhattanDistance)
  const manhattans = Object.entries(signalManhattans).map(([key, val]) => ([key.split(','), val]))

  let startY = -manhattanDistance;
  startY = Math.max(-sensorY, startY);
  startY = Math.max(-sensorX, startY);

  for (let y = startY; y <= manhattanDistance; y++) {
    const normalizedY = sensorY + y;
    if (normalizedY > 4000000) break;

    const xPos = manhattanDistance - Math.abs(y);
    const xNeg = -manhattanDistance + Math.abs(y);

    const normalizedXPos = sensorX + xPos;
    const normalizedXNeg = sensorX + xNeg;
    if (normalizedXPos >= 0 && normalizedXPos <= 4000000) {
      // check against all other sensors
      if (checkBorderPositionInBounds(manhattans, normalizedXPos, normalizedY))
        return [normalizedXPos, normalizedY]
    }
    if (normalizedXNeg >= 0 && normalizedXNeg <= 4000000) {
      // check against all other sensors
      if (checkBorderPositionInBounds(manhattans, normalizedXNeg, normalizedY))
        return [normalizedXNeg, normalizedY]

    }
  }
}

function getKeys(allSignals, yTarget) {
  let res = 0;
  Object.entries(allSignals).forEach(([key, val]) => {
    let [x,y] = key.split(',');
    if (Number(y) === yTarget && val === '#') {
      res +=1
    }
  })
  return res;
}
function getSignalBorders(allSignals, sensors, xRange, yRange) {
  // loop through sensors and get manhattan distances + 1
  const signalManhattans = Object.entries(sensors).reduce((acc, [sensor, beacon]) => {
    const manhattanDistance = getManhattanDistance(sensor.split(','), beacon)
    return {
      ...acc,
      [sensor]: manhattanDistance,
    }
  }, {});
  console.log(signalManhattans)

  let res;

  Object.entries(sensors).forEach(([sensor, beacon]) => {
    console.log('sensor', sensor, 'beacon', beacon)
    const manhattanDistance = getManhattanDistance(sensor.split(','), beacon) + 1
    let start = +new Date();
    const res2 = addBorders(signalManhattans, sensor, manhattanDistance)
    let end = +new Date();
    console.log('>>>', res2, end - start);
  });
}

function getNoBeacons(allSignals, sensors, xRange, yRange) {
  // loop through sensors and get manhattan distances
  Object.entries(sensors).forEach(([sensor, beacon]) => {
    console.log('sensor', sensor, 'beacon', beacon)
    const manhattanDistance = getManhattanDistance(sensor.split(','), beacon)
    addNoPossibleBeacon(allSignals, sensor, manhattanDistance)
  });
}

async function findPositions(file = '../input.txt') {
  const lines = await readFile(file)

  let { sensors, xRange, yRange } = createBeacons(lines)

  const allSignals = Object.entries(sensors).reduce((acc, [sensor, beacon]) => {
    return {
      ...acc,
      [sensor]: 'S',
      [beacon.join(',')]: 'B',
    }
  }, {})

  // const signalMap = createMap(allSignals)

  // drawMap(signalMap)

  let size = Object.keys(allSignals).length;
  getNoBeacons(allSignals, sensors, xRange, yRange)

  // console.log(allSignals)
  // for (let i = 0; i < 21; i++) {
  //   for (let j = 0; j < 21; j++) {
  //     const key = [i, j].join(',')
  //     if (!(key in allSignals)) {
  //       console.log(key)
  //     }
  //   }
  // }
  const signalMap2 = createMap(allSignals)
  drawMap(signalMap2)
  // console.log(Object.keys(allSignals).length - size)
  /// console.log(allSignals)
}

async function findBeacon(file = '../input.txt') {
  let start = +new Date();
  const lines = await readFile(file)

  let { sensors, xRange, yRange } = createBeacons(lines)

  const allSignals = Object.entries(sensors).reduce((acc, [sensor, beacon]) => {
    return {
      ...acc,
      [sensor]: 'S',
      [beacon.join(',')]: 'B',
    }
  }, {})
  // const signalMap = createMap(allSignals)
  // drawMap(signalMap)

  getSignalBorders(allSignals, sensors, xRange, yRange)

  let end = +new Date();
  console.log("TOOK", (end - start))

  // const signalMap2 = createMap(allSignals)
  // drawMap(signalMap2)
}

module.exports = findBeacon
