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

  instructions.forEach(({ cmd, xRanges, yRanges, zRanges }) => {
    if (inRange(pos, xRanges, yRanges, zRanges)) {
      res = cmd
    }
  })
  return res
}

function toCube(xRange, yRange, zRange) {
  return {
    x1: xRange[0],
    x2: xRange[1],
    y1: yRange[0],
    y2: yRange[1],
    z1: zRange[0],
    z2: zRange[1],
  }
}

function calculateOverlap(cube1, cube2) {
  if (cube1.x1 > cube2.x2 || cube1.x2 < cube2.x1) {
    return false
  }
  if (cube1.y1 > cube2.y2 || cube1.y2 < cube2.y1) {
    return false
  }
  if (cube1.z1 > cube2.z2 || cube1.z2 < cube2.z1) {
    return false
  }

  let xmin = Math.max(cube1.x1, cube2.x1)
  let xmax = Math.min(cube1.x2, cube2.x2)
  let ymin = Math.max(cube1.y1, cube2.y1)
  let ymax = Math.min(cube1.y2, cube2.y2)
  let zmin = Math.max(cube1.z1, cube2.z1)
  let zmax = Math.min(cube1.z2, cube2.z2)

  return { x1: xmin, x2: xmax, y1: ymin, y2: ymax, z1: zmin, z2: zmax }
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
    res.push({ cmd, xRanges, yRanges, zRanges })
  })
  return res
}

function findOverlaps(cubes) {

  let overlaps = []
  cubes.forEach((cube, i) => {
    let this_overlaps = []
    if (cube.cmd) {
      this_overlaps.push({
        cube: cube,
        cubes: [i]
      })
    }


    overlaps.forEach((overlap) => {
      let overlapping = calculateOverlap(overlap.cube, cube)
      if (overlapping) {
        overlaps.push({
          cubes: [...overlap.cubes, i],
          cube: overlapping
        })
      }
    })

    overlaps.push(...this_overlaps)

  })


  return overlaps
}

function findOverlapSets(instructions) {
  let cubes = instructions.map((in1) => {
    return {cmd: in1.cmd, ...toCube(in1.xRanges, in1.yRanges, in1.zRanges)}
  })

  let overlaps = findOverlaps(cubes, true)
  console.log("OVERLAPS", overlaps.length)

  let sum = 0

  function calculateVolume(cube) {
    return (cube.x2 - cube.x1 + 1) * (cube.y2 - cube.y1 + 1) * (cube.z2 - cube.z1 + 1)
  }

  overlaps.forEach((overlap) => {
    if (overlap.cubes.length % 2) {
      sum += calculateVolume(overlap.cube)

    } else {
      sum -= calculateVolume(overlap.cube)

    }
  })

  console.log('VOLUME IS', sum)
}

async function countCubes(file = '../input.txt') {
  const lines = await readFile(file)
  const instructions = makeInstructions(lines)
  findOverlapSets(instructions)

  return
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
