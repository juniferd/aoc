const { binaryToDecimal, readFile } = require('../utils.js')

const TURNS = 1
let INPUT = {}
let IMAGE_EN = ''

function readInputs(lines) {
  let input = []
  lines.forEach((line, i) => {
    if (i === 0) {
      IMAGE_EN = line
    } else if (line !== '') {
      input.push(line.split(''))
    }
  })

  input.forEach((row, y) => {
    row.forEach((pixel, x) => {
      const pos = [x,y];
      INPUT[pos] = pixel
    })
  })
}

function inBounds(range1, range2) {
  return (
    range1[0] >= range2[0] &&
    range1[0] <= range2[1] &&
    range1[1] >= range2[0] &&
    range1[1] <= range2[1]
  )
}

function getInputBinary(x, y) {
  const minX = x - 1
  const maxX = x + 1
  const minY = y - 1
  const maxY = y + 1

  let res = ''
  for (let i = minY; i < maxY + 1; i++) {
    for (let j = minX; j < maxX + 1; j++) {
      const pos = [i, j];
      res += INPUT[pos] === '#' ? '1' : '0'
    }
  }
  return res
}

function enhance(borderPixel = '.') {
  const output = {}
  Object.keys(INPUT).forEach(pos => {
    let [x,y] = pos.split(',')
    x = Number(x)
    y = Number(y)

    const inputBinary = getInputBinary(x, y)
    const outputPixel = IMAGE_EN[binaryToDecimal(inputBinary)]
    output[pos] = outputPixel
  })
  console.log('output', output)

  // update INPUT with output
  INPUT = {}
  Object.entries(output).forEach(([pos, pixel]) => {
    INPUT[pos] = pixel
  })
}

function getMinMax(index) {
  let min = Infinity;
  let max = -Infinity;
  Object.keys(INPUT).forEach((pos) => {
    const posArr = pos.split(',')
    const curr = posArr[index];
    if (curr < min) {
      min = curr
    }
    if (curr > max) {
      max = curr
    }
  });
  return [min, max]
}

function draw() {
  // get min and max for INPUT
  let xRange = getMinMax(0)
  let yRange = getMinMax(1)
  for (let y = yRange[0]; y <= yRange[1]; y++) {
    let row = ''
    for (let x = xRange[0]; x <= xRange[1]; x++) {
      const curr = [x,y]; 
      if (curr in INPUT) {
        row += INPUT[curr]
      } else {
        row += '.'
      }
    }
    console.log(row)
  }
}

function countPixels(output) {
  let tot = 0
  output.forEach((row) => {
    row.forEach((pixel) => {
      if (pixel === '#') tot += 1
    })
  })
  return tot
}

async function getLightPixels(file = '../input.txt') {
  const lines = await readFile(file)
  readInputs(lines)

  let output

  for (let i = 0; i < TURNS; i++) {
    // let xMax = input[0].length + 6
    // let yMax = input.length + 6
    // create output's array based on input
    // output = Array(yMax)
    //   .fill(borderPixel)
    //   .map((_) => Array(xMax).fill(borderPixel))

    enhance()
    console.log('enhanced', INPUT)

    draw()

  }

  // console.log(countPixels(output))
}

module.exports = getLightPixels
