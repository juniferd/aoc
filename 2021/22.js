const { readFile } = require('../utils.js')

function inRange([x, y, z], xRanges, yRanges, zRanges) {
  return (
    x >= xRanges[0] &&
    x <= xRanges[1] &&
    y >= yRanges[0] &&
    y <= yRanges[1] &&
    z >= zRanges[0] &&
    z <= zRanges[1]
  )
}

function turnCubesOnOff(line, cubes) {
  const cmd = line.indexOf('on') === 0 ? true : false
  const regexp = /-?\d+/g
  const ranges = line.match(regexp)
  const xRanges = [Number(ranges[0]), Number(ranges[1])]
  const yRanges = [Number(ranges[2]), Number(ranges[3])]
  const zRanges = [Number(ranges[4]), Number(ranges[5])]
  Object.keys(cubes).forEach((pos) => {
    pos = pos.split(',').map((p) => Number(p))
    if (inRange(pos, xRanges, yRanges, zRanges)) {
      cubes[pos] = cmd
    }
  })

  // const count = (xRanges[1] - xRanges[0] + 1) * (yRanges[1] - yRanges[0] + 1) * (zRanges[1] - zRanges[0] + 1)

  // for (let x = xRanges[0]; x <= xRanges[1]; x++) {
  //   for (let y = yRanges[0]; y <= yRanges[1]; y++) {
  //     for (let z = zRanges[0]; z <= zRanges[1]; z++) {
  //       const key = [x,y,z];
  //       if (cmd === 'on') {
  //         cubes[key] = true;
  //       } else {
  //         delete cubes[key]
  //       }
  //     }
  //   }
  // }
  // console.log('cubes:', cubes)
}

function getCubeRegion(min, max) {
  const cube = {}
  for (let x = min; x <= max; x++) {
    for (let y = min; y <= max; y++) {
      for (let z = min; z <= max; z++) {
        const pos = [x, y, z]
        cube[pos] = false
      }
    }
  }
  return cube
}

function isCubeOn(pos, instructions) {
  let res = false

  instructions.forEach(({cmd, xRanges, yRanges, zRanges}) => {
    if (inRange(pos, xRanges, yRanges, zRanges)) {
      res = cmd
    }
  })
  return res
}

function makeInstructions(lines) {
  const res = []
  lines.forEach((line) => {
    const cmd = line.indexOf('on') === 0 ? true : false
    const regexp = /-?\d+/g
    const ranges = line.match(regexp)
    const xRanges = [Number(ranges[0]), Number(ranges[1])]
    const yRanges = [Number(ranges[2]), Number(ranges[3])]
    const zRanges = [Number(ranges[4]), Number(ranges[5])]
    res.push({cmd, xRanges, yRanges, zRanges}) 
  })
  return res;
}

async function countCubes(file = '../input.txt') {
  const lines = await readFile(file)
  const instructions = makeInstructions(lines)
  const min = -50
  const max = 50
  let count = 0

  for (let x = min; x <= max; x++) {
    for (let y = min; y <= max; y++) {
      for (let z = min; z <= max; z++) {
        const pos = [x, y, z]
        if (isCubeOn(pos, instructions)) {
          count += 1
        }
      }
    }
  }

  console.log(count)
}

module.exports = countCubes
