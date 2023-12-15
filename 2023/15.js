const { readFile } = require('../utils.js')

const BOXES = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  // part one
  // const steps = getSteps(lines[0].split(','))
  // let tot = 0
  // steps.forEach((chars) => {
  //   let sum = 0
  //   chars.forEach((char) => {
  //     sum = getHASH(char, sum)
  //   })
  //   tot += sum
  // })
  // console.log('tot', tot)

  // part two
  const steps = getSteps(lines[0].split(','), false)
  steps.forEach((step) => {
    const { box, label, operation, focalLength } = getParts(step)
    if (operation === '=') {
      addToBox(box, label, focalLength)
    } else if (operation === '-') {
      removeFromBox(box, label)
    }
  })

  let totalFocusing = 0
  Object.entries(BOXES).forEach(([boxStr, lenses]) => {
    const box = Number(boxStr);
    lenses.forEach(([label, focalLength], index) => {
      totalFocusing += (label, getFocusingPower(box, index, focalLength))
    })
  })
  console.log('totalFocusing', totalFocusing)
}

function getFocusingPower(box, lensIndex, focalLength) {
  return (1 + box) * (1 + lensIndex) * focalLength
}

function addToBox(box, label, focalLength) {
  const lens = [label, focalLength]
  if (box in BOXES) {
    // find if label exists
    const lenses = BOXES[box]
    const labelIndex = lenses.findIndex(([l]) => l === label)
    if (labelIndex > -1) {
      lenses[labelIndex] = lens
    } else {
      lenses.push(lens)
    }
  } else {
    BOXES[box] = [lens]
  }
}

function removeFromBox(box, label) {
  if (box in BOXES) {
    const lenses = BOXES[box]
    const labelIndex = lenses.findIndex(([l]) => l === label)
    if (labelIndex > -1) {
      lenses.splice(labelIndex, 1)
    }
  }
}

function getParts(step) {
  const [label, operation, focalLength] = step.split(/(\=|\-)/)
  const box = label.split('').reduce((acc, char) => getHASH(char, acc), 0)
  return { box, label, operation, focalLength: Number(focalLength) }
}

function getHASH(char, init = 0, multiplier = 17, divisor = 256) {
  let code = init + char.charCodeAt(0)
  code = code * multiplier
  code = code % divisor
  return code
}

function getSteps(lines, splitIntoArray = true) {
  return lines.map((line) => {
    return splitIntoArray
      ? line.split('').map((l) => {
          return l
        })
      : line
  })
}

module.exports = getAnswer
