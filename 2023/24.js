const { count } = require('yargs')
const { readFile, writeFile } = require('../utils.js')

const XY_MIN = 200000000000000
const XY_MAX = 400000000000000
// const XY_MIN = 7
// const XY_MAX = 27

const HAILSTONES = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createHailstones(lines)
  // console.log(HAILSTONES)
  console.log(lines.length, Object.keys(HAILSTONES).length)
  // part one
  // const inbounds = findAllIntersections()
  // console.log(Object.keys(inbounds).length)

  // part two
  // createHailstoneSegments()
}

function createHailstoneSegments() {
  const time = 10 ** 15
  const multiplier = 10 ** 12
  const data = []
  Object.values(HAILSTONES).forEach(({pos, vel}) => {
    const x = []
    const y = []
    const z = []
    // origin
    x.push(pos[0] / multiplier)
    y.push(pos[1] / multiplier)
    z.push(pos[2] / multiplier)
    // next values at time * vel
    x.push((pos[0] + (time * vel[0]))/ multiplier)
    y.push((pos[1] + (time * vel[1]))/multiplier)
    z.push((pos[2] + (time * vel[2]))/multiplier)
    data.push({x, y, z, mode: 'lines', type: 'scatter3d'})
  })

  let dataStr = '['
  let innerData = []
  data.forEach(d => {
    innerData.push(`${JSON.stringify(d)}`)
  })
  dataStr += innerData.join(',\n')
  dataStr += ']'
  writeFile('output24.json', dataStr)
}

function findAllIntersections() {
  const hailstones = Object.values(HAILSTONES)
  const countHailstones = hailstones.length
  const IN_BOUNDS = {}
  for (let i = 0; i < countHailstones; i++) {
    for (let j = i + 1; j < countHailstones; j++) {
      const a = hailstones[i]
      const b = hailstones[j]
      const { x, y } = getXYIntersection(a, b)
      console.log('intersection', x, y, a.m, b.m)
      if (x >= XY_MIN && x <= XY_MAX && y >= XY_MIN && y <= XY_MAX) {
        if (
          checkSlope(a.pos[0], a.pos[1], x, y, a.vel[0], a.vel[1]) &&
          checkSlope(b.pos[0], b.pos[1], x, y, b.vel[0], b.vel[1])
        ) {
          const key = `${a.pos}-${b.pos}`
          IN_BOUNDS[key] = [x, y]
        }
      }
    }
  }
  return IN_BOUNDS
}

function checkSlope(xOrigin, yOrigin, xIntersection, yIntersection, velX, velY) {
  const newXVel = (xIntersection - xOrigin)
  const newYVel = (yIntersection - yOrigin)
  // all dirs need to match
  const xDirMatch = Math.floor(newXVel) / Math.abs(Math.floor(newXVel)) === Math.floor(velX) / Math.abs(Math.floor(velX))
  const yDirMatch = Math.floor(newYVel) / Math.abs(Math.floor(newYVel)) === Math.floor(velY) / Math.abs(Math.floor(velY))
  return xDirMatch && yDirMatch
}

function getXYIntersection(pathA, pathB) {
  const x = (pathB.b - pathA.b) / (pathA.m - pathB.m)
  const y = pathA.m * x + pathA.b
  return { x, y }
}

function createXYPath({ pos, vel }) {
  // {m: dy/dx, b: y - (vy / vx) * x}
  return { m: vel[1] / vel[0], b: pos[1] - (vel[1] / vel[0]) * pos[0] }
}

function createHailstones(lines) {
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
    const path = createXYPath({ pos, vel })
    HAILSTONES[pos] = { pos, vel, ...path }
  })
}

module.exports = getAnswer
