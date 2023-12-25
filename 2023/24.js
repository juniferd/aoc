const { readFile, writeFile } = require('../utils.js')

const XY_MIN = 200000000000000
const XY_MAX = 400000000000000
// const XY_MIN = 7
// const XY_MAX = 27

const HAILSTONES = {}
const HAILSTONES_ARR = []

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createHailstones(lines)
  // console.log(HAILSTONES)
  console.log(lines.length, Object.keys(HAILSTONES).length)
  // part one
  // const ints = findAllIntersections()
  // console.log(Object.values(ints))
  // console.log(Object.keys(ints).length)

  // part two
  // createHailstoneSegments()
  // const points = simulate(1025811887564)
  // const points = simulate(1025600000000)
  // getNClosestPairs(points)

  // create new hailstones relative to brute forced rock velocity
  // const rockVel = [-3, 1, 2]
  // const paths = createHailstonesRelativeRock(rockVel)
  const maybe = bruteForceAllRockVelocities(-300, 300)
  console.log('>', maybe)
  // yet another approach from reddit
  // getSets()
  // velocities 209, -180, 112
  // 765636044333842
}

function getSets() {
  let xSet = {}
  let ySet = {}
  let zSet = {}
  for (let i = 0; i < HAILSTONES_ARR.length; i++) {
    for (let j = i + 1; j < HAILSTONES_ARR.length; j++) {
      const a = HAILSTONES_ARR[i]
      const b = HAILSTONES_ARR[j]
      
      const potX = generateSet(a, b, 0)
      const potY = generateSet(a, b, 1)
      const potZ = generateSet(a, b, 2)
      if (Object.keys(potX).length > 0) {
        xSet = Object.keys(xSet).length > 0 ? getSetIntersection(xSet, potX) : potX
      }
      if (Object.keys(potY).length > 0) {
        ySet = Object.keys(ySet).length > 0 ? getSetIntersection(ySet, potY) : potY
      }
      if (Object.keys(potZ).length > 0) {
        zSet = Object.keys(zSet).length > 0 ? getSetIntersection(zSet, potZ) : potZ
      }
    }
  }

  console.log(xSet)
  console.log(ySet)
  console.log(zSet)
}

function getSetIntersection(a, b) {
  const set = {}
  Object.keys(a).forEach((aKey) => {
    if (aKey in b) {
      set[aKey] = a[aKey]
    }
  })
  return set;
}
function generateSet(a, b, i) {
  const set = {}
  if (a.vel[i] === b.vel[i] && Math.abs(a.vel[i]) > 100) {
    const diff = b.pos[i] - a.pos[i]
    for (let v = -1000; v < 1000; v++) {
      if (v === a.vel[i]) { continue }
      if (diff % (v - a.vel[i]) === 0) {
        set[v] = v
      }
    }
  }
  return set
}

function getAllCombos(n = 3) {
  const combos = []
  for (let i = 0; i < n + 1; i++) {
    for (let j = 0; j < n - i; j++) {
      const k = n - i - j;
      combos.push([i, j, k])
      combos.push([-i, j, k])
      combos.push([i, -j, k])
      combos.push([i, j, -k])
      combos.push([-i, -j, k])
      combos.push([-i, j, -k])
      combos.push([i, -j, -k])
      combos.push([-i, -j, -k])
    }
  }
  return combos
}
function bruteForceAllRockVelocities(lo = -3, hi = 3) {
  // failed at 184 so restarting there

  function testNode(rockVel) {
    const paths = createHailstonesRelativeRock(rockVel)

    const intsXY = findAllIntersections2(false, 'xy', paths)
    console.log(intsXY)
    if (intsXY.length == 0) {
      return
    }
    const intsYZ = findAllIntersections2(false, 'yz', paths)
    if (intsYZ.length == 0) {
      return
    }
    const intsXZ = findAllIntersections2(false, 'xz', paths)
    if (intsXZ.length == 0) {
      return
    }
  
    console.log('INTS', intsXY, intsYZ, intsXZ)
    console.log('FOUND ALL!', rockVel)
    return true
  }

  const seen = {}
  function enqueue(node) {
    if (node in seen) {
      return
    }
    seen[node] = 1
    q.push(node)
  }

  testNode([209, -180, 112])
  return
  for (let i = 500; i < 800; i++) {
    let q = getAllCombos(i)
    console.log("TESTING MAGNITUDE", i)
    while (q.length) {
      curr = q.pop()
      const [a, b, c] = curr
      if (testNode(curr)) {
        return
      }
    }
  }
}

function createHailstonesRelativeRock(rockVel = [0, 0, 0]) {
  const hailstones = []
  let M = Math.min(10, HAILSTONES_ARR.length)
  for (let i = 0; i < M; i++) {
    let hailstone = HAILSTONES_ARR[i];  
    const newVel = [
      hailstone.vel[0] - rockVel[0],
      hailstone.vel[1] - rockVel[1],
      hailstone.vel[2] - rockVel[2],
    ]

    const path = createPath({ pos: hailstone.pos, vel: newVel })
    const pathYZ = createPath({ pos: hailstone.pos, vel: newVel }, 'yz')
    const pathXZ = createPath({ pos: hailstone.pos, vel: newVel }, 'xz')
    hailstones.push({
      ...hailstone,
      vel: newVel,
      ...path,
      ...pathYZ,
      ...pathXZ,
    })
  }
  return hailstones
}

function getNClosestPairs(points, n = 3) {
  const res = {}

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i].newPos
      const b = points[j].newPos
      const key = `${points[i].pos}-${points[j].pos}`
      const distance = distance3D(a, b)
      console.log('a, b', distance)
      if (distance === 0) {
        console.log('orig a', points[i].pos, 'orig b', points[j].pos)
      }
      res[key] = distance
    }
  }

  const closestPairs = Object.entries(res).sort((a, b) => a[1] - b[1])
  console.log(
    closestPairs
      .slice(0, n)
      .map(([pos, dist]) => [pos, Math.round(dist / 10 ** 11)])
  )
}

function distance3D(a = [0, 0, 0], b = [1, 1, 1]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function simulate(t = 10000) {
  return Object.values(HAILSTONES).map(({ pos, vel }, i) => {
    const newPos = [
      pos[0] + vel[0] * t,
      pos[1] + vel[1] * t,
      pos[2] + vel[2] * t,
    ]
    console.log(i, ':', newPos)
    return { pos, newPos }
  })
}

function getParallels() {
  const xy = []
  const yz = []
  const xz = []

  const keys = Object.keys(HAILSTONES)
  const hLength = keys.length
  for (let i = 0; i < hLength; i++) {
    for (let j = i + 1; j < hLength; j++) {
      const a = HAILSTONES[keys[i]]
      const b = HAILSTONES[keys[j]]
      if (a.m_xy - b.m_xy < 0.01 && a.m_xy - b.m_xy > -0.01) {
        xy.push([a, b])
      }
      if (a.m_yz - b.m_yz < 0.01 && a.m_yz - b.m_yz > -0.01) {
        yz.push([a, b])
      }
      if (a.m_xz - b.m_xz < 0.01 && a.m_xz - b.m_xz > -0.01) {
        xz.push([a, b])
      }
    }
  }
  console.log('xy', xy.length)
  console.log('yz', yz.length)
  console.log('xz', xz.length)
}

function getMatchingVelocities() {
  const x = {}
  const y = {}
  const z = {}

  Object.values(HAILSTONES).forEach(({ pos, vel }) => {
    let x_vel = vel[0]
    let y_vel = vel[1]
    let z_vel = vel[2]
    if (x_vel in x) {
      x[x_vel].push(pos)
    } else {
      x[x_vel] = [pos]
    }
    if (y_vel in y) {
      y[y_vel].push(pos)
    } else {
      y[y_vel] = [pos]
    }
    if (z_vel in z) {
      z[z_vel].push(pos)
    } else {
      z[z_vel] = [pos]
    }
  })

  const dupeX = Object.entries(x).filter(([_, points]) => points.length > 1)
  dupeX.forEach(([vel, points]) => console.log('x velocities:', vel, points))
  const dupeY = Object.entries(y).filter(([_, points]) => points.length > 1)
  dupeY.forEach(([vel, points]) => console.log('y velocities:', vel, points))
  const dupeZ = Object.entries(z).filter(([_, points]) => points.length > 1)
  dupeZ.forEach(([vel, points]) => console.log('z velocities:', vel, points))
  return { dupeX, dupeY, dupeZ }
}

function getTimesForIntersections(intersections, plane = 'xy') {
  let minTimeDiff = Infinity
  let maxTimeDiff = -Infinity
  let pointsMinTime
  Object.entries(intersections).forEach(([originPoints, intersection]) => {
    let [pointA, pointB] = originPoints.split('-')
    pointA = pointA.split(',').map((n) => Number(n))
    pointB = pointB.split(',').map((n) => Number(n))
    const a = HAILSTONES[pointA]
    const b = HAILSTONES[pointB]
    let timeA, timeB
    let timeDiff = 0
    // find the time for point A
    // time = (intersection - origin) / velocity
    if (plane === 'xy') {
      timeA = (intersection[0] - a.pos[0]) / a.vel[0]
      // timeA_1 = (intersection[1] - a.pos[1]) / a.vel[1]
      timeB = (intersection[0] - b.pos[0]) / b.vel[0]
      // timeB_1 = (intersection[1] - b.pos[1]) / b.vel[1]
    } else if (plane === 'yz') {
      timeA = (intersection[0] - a.pos[1]) / a.vel[1]
      timeB = (intersection[0] - b.pos[1]) / b.vel[1]
    } else if (plane === 'xz') {
      timeA = (intersection[1] - a.pos[2]) / a.vel[2]
      timeB = (intersection[1] - b.pos[2]) / b.vel[2]
    }
    timeDiff = Math.abs(timeA - timeB)
    if (timeDiff > maxTimeDiff) {
      maxTimeDiff = timeDiff
    }
    if (timeDiff < minTimeDiff) {
      minTimeDiff = timeDiff
      pointsMinTime = [
        { point: pointA, time: timeA },
        { point: pointB, time: timeB },
      ]
    }
    // console.log('A', timeA, 'B', timeB, 'A-B', timeDiff)
  })
  console.log(plane, 'min time diff', minTimeDiff)
  console.log(plane, 'max time diff', maxTimeDiff)
  pointsMinTime.forEach(({ point, time }) =>
    console.log('time', time, 'hail', HAILSTONES[point])
  )
}

function createHailstoneSegments() {
  const time = 10 ** 15
  const multiplier = 10 ** 12
  const data = {
    lineSegments: [],
    originPoints: { x: [], y: [], z: [], mode: 'markers', type: 'scatter3d' },
  }
  Object.values(HAILSTONES).forEach(({ pos, vel }) => {
    const x = []
    const y = []
    const z = []
    // origin
    x.push(pos[0] / multiplier)
    y.push(pos[1] / multiplier)
    z.push(pos[2] / multiplier)
    data.originPoints.x.push(pos[0] / multiplier)
    data.originPoints.y.push(pos[1] / multiplier)
    data.originPoints.z.push(pos[2] / multiplier)
    // next values at time * vel
    x.push((pos[0] + time * vel[0]) / multiplier)
    y.push((pos[1] + time * vel[1]) / multiplier)
    z.push((pos[2] + time * vel[2]) / multiplier)
    data.lineSegments.push({ x, y, z, mode: 'lines', type: 'scatter3d' })
  })

  const dataStr = JSON.stringify(data)
  writeFile('output24.json', dataStr)
}

function findAllIntersections(
  useMinMax = true,
  plane = 'xy',
  hailstones = Object.values(HAILSTONES)
) {
  const countHailstones = hailstones.length
  const INTERSECTIONS = {}
  for (let i = 0; i < countHailstones; i++) {
    for (let j = i + 1; j < countHailstones; j++) {
      const a = hailstones[i]
      const b = hailstones[j]
      let x, y, slopeA, slopeB
      if (plane === 'xy') {
        ;[x, y] = getIntersection(a, b)
        // console.log('intersection xy', x, y, a.m_xy, b.m_xy)
        slopeA = checkSlope(a.pos[0], a.pos[1], x, y, a.vel[0], a.vel[1])
        slopeB = checkSlope(b.pos[0], b.pos[1], x, y, b.vel[0], b.vel[1])
      } else if (plane === 'yz') {
        ;[x, y] = getIntersection(a, b, 'yz')
        // console.log('intersection yz', x, y, a.m_yz, b.m_yz)
        slopeA = checkSlope(a.pos[1], a.pos[2], x, y, a.vel[1], a.vel[2])
        slopeB = checkSlope(b.pos[1], b.pos[2], x, y, b.vel[1], b.vel[2])
      } else if (plane === 'xz') {
        ;[x, y] = getIntersection(a, b, 'xz')
        // console.log('intersection yz', x, y, a.m_xz, b.m_xz)
        slopeA = checkSlope(a.pos[0], a.pos[2], x, y, a.vel[0], a.vel[2])
        slopeB = checkSlope(b.pos[0], b.pos[2], x, y, b.vel[0], b.vel[2])
      }
      const inBounds = useMinMax
        ? x >= XY_MIN && x <= XY_MAX && y >= XY_MIN && y <= XY_MAX
        : true
      if (inBounds && slopeA && slopeB) {
        const key = `${a.pos}-${b.pos}`
        INTERSECTIONS[key] = [x, y]
      }
    }
  }
  return INTERSECTIONS
}

function findAllIntersections2(
  useMinMax = true,
  plane = 'xy',
  hailstones = Object.values(HAILSTONES)
) {
  const countHailstones = hailstones.length
  const INTERSECTIONS = {}
  for (let i = 0; i < countHailstones; i++) {
    for (let j = i + 1; j < countHailstones; j++) {
      const a = hailstones[i]
      const b = hailstones[j]
      let x, y, slopeA, slopeB
      if (plane === 'xy') {
        ;[x, y] = getIntersection(a, b)
        // console.log('intersection xy', x, y, a.m_xy, b.m_xy)
        slopeA = checkSlope(a.pos[0], a.pos[1], x, y, a.vel[0], a.vel[1])
        slopeB = checkSlope(b.pos[0], b.pos[1], x, y, b.vel[0], b.vel[1])
      } else if (plane === 'yz') {
        ;[x, y] = getIntersection(a, b, 'yz')
        // console.log('intersection yz', x, y, a.m_yz, b.m_yz)
        slopeA = checkSlope(a.pos[1], a.pos[2], x, y, a.vel[1], a.vel[2])
        slopeB = checkSlope(b.pos[1], b.pos[2], x, y, b.vel[1], b.vel[2])
      } else if (plane === 'xz') {
        ;[x, y] = getIntersection(a, b, 'xz')
        // console.log('intersection yz', x, y, a.m_xz, b.m_xz)
        slopeA = checkSlope(a.pos[0], a.pos[2], x, y, a.vel[0], a.vel[2])
        slopeB = checkSlope(b.pos[0], b.pos[2], x, y, b.vel[0], b.vel[2])
      }
      const inBounds = useMinMax
        ? x >= XY_MIN && x <= XY_MAX && y >= XY_MIN && y <= XY_MAX
        : true
      if (inBounds && slopeA && slopeB) {
        x = Math.round(x)
        y = Math.round(y)

        console.log(x, y)
        INTERSECTIONS[[x, y]] = 1
        // diff of 1
        if (Object.keys(INTERSECTIONS).length > 1) {
          return []
        }
      }
    }
  }
  return Object.keys(INTERSECTIONS)
}

function checkSlope(
  xOrigin,
  yOrigin,
  xIntersection,
  yIntersection,
  velX,
  velY
) {
  const newXVel = xIntersection - xOrigin
  const newYVel = yIntersection - yOrigin
  // all dirs need to match
  const xDirMatch =
    Math.floor(newXVel) / Math.abs(Math.floor(newXVel)) ===
    Math.floor(velX) / Math.abs(Math.floor(velX))
  const yDirMatch =
    Math.floor(newYVel) / Math.abs(Math.floor(newYVel)) ===
    Math.floor(velY) / Math.abs(Math.floor(velY))
  return xDirMatch && yDirMatch
}

function getIntersection(pathA, pathB, plane = 'xy') {
  if (plane === 'xy') {
    const x = (pathB.b_xy - pathA.b_xy) / (pathA.m_xy - pathB.m_xy)
    const y = pathA.m_xy * x + pathA.b_xy
    return [x, y]
  }
  if (plane === 'yz') {
    const y = (pathB.b_yz - pathA.b_yz) / (pathA.m_yz - pathB.m_yz)
    const z = pathA.m_yz * y + pathA.b_yz
    return [y, z]
  }
  if (plane === 'xz') {
    const x = (pathB.b_xz - pathA.b_xz) / (pathA.m_xz - pathB.m_xz)
    const z = pathA.m_xz * x + pathA.b_xz
    return [x, z]
  }
}

function createPath({ pos, vel }, plane = 'xy') {
  // {m: dy/dx, b: y - (vy / vx) * x}
  if (plane === 'xy')
    return { m_xy: vel[1] / vel[0], b_xy: pos[1] - (vel[1] / vel[0]) * pos[0] }
  if (plane === 'yz')
    return { m_yz: vel[2] / vel[1], b_yz: pos[2] - (vel[2] / vel[1]) * pos[1] }
  if (plane === 'xz')
    return { m_xz: vel[2] / vel[0], b_xz: pos[2] - (vel[2] / vel[0]) * pos[0] }
}

function createHailstones(lines, delta = [0, 0, 0]) {
  lines.forEach((line) => {
    let [pos, vel] = line.split('@')
    pos = pos
      .trim()
      .split(',')
      .map((n) => Number(n))
    vel = vel
      .trim()
      .split(',')
      .map((n) => Number(n))
    const path = createPath({ pos, vel })
    const pathYZ = createPath({ pos, vel }, 'yz')
    const pathXZ = createPath({ pos, vel }, 'xz')
    HAILSTONES[pos] = { pos, vel, ...path, ...pathYZ, ...pathXZ }
    HAILSTONES_ARR.push(HAILSTONES[pos])
  })
}

module.exports = getAnswer
