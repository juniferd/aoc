const { binaryToDecimal, readFile } = require('../utils.js')

const TURNS = 1

function readInputs(lines) {
  let imageEn = ''
  let input = []
  lines.forEach((line, i) => {
    if (i === 0) {
      imageEn = line
    } else if (line !== '') {
      input.push(line.split(''))
    }
  })

  console.log('LENGTH', input[0].length, input.length)

  return { imageEn, input }
}

function inBounds(range1, range2) {
  return (
    range1[0] >= range2[0] &&
    range1[0] <= range2[1] &&
    range1[1] >= range2[0] &&
    range1[1] <= range2[1]
  )
}
function getInputBinary(x, y, input, borderPixel) {
  const minX = x - 1
  const maxX = x + 1
  const minY = y - 1
  const maxY = y + 1
  const inputMaxX = input[0].length - 1
  const inputMaxY = input.length - 1

  let res = ''
  for (let i = minY; i < maxY + 1; i++) {
    for (let j = minX; j < maxX + 1; j++) {
      if (
        inBounds([j, j], [0, inputMaxX]) &&
        inBounds([i, i], [0, inputMaxY])
      ) {
        res += input[i][j] === '#' ? '1' : '0'
      } else {
        res += borderPixel === '#' ? '1' : '0'
      }
    }
  }
  return res
}
function enhance(input, output, imageEn, xMax, yMax, borderPixel) {
  for (let y = -2; y < input.length + 2; y++) {
    for (let x = -2; x < input[0].length + 2; x++) {
      // x,y = center of 3x3
      const inputBinary = getInputBinary(x, y, input, borderPixel)
      const outputPixel = imageEn[binaryToDecimal(inputBinary)]
      const outputX = x + 3
      const outputY = y + 3
      output[outputY][outputX] = outputPixel
    }
  }
  return { output}
}

function draw(output) {
  output.forEach((row) => console.log(row.join('')))
  console.log('')
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
  let { imageEn, input } = readInputs(lines)
  let output
  let borderPixel = '.'

  for (let i = 0; i < TURNS; i++) {
    let xMax = input[0].length + 6
    let yMax = input.length + 6
    // create output's array based on input
    output = Array(yMax)
      .fill(borderPixel)
      .map((_) => Array(xMax).fill(borderPixel))

    enhance(input, output, imageEn, xMax, yMax, borderPixel)

    draw(output)

    input = output
    borderPixel = output[1][1]
  }

  console.log(countPixels(output))
}

module.exports = getLightPixels
