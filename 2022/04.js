const { readFile } = require('../utils.js')

function hasOverlap(line='') {
  const [first, second] = line.split(',')
  const firstRange = first.split('-').map(n => +n)
  const secondRange = second.split('-').map(n => +n)
  if (firstRange[0] >= secondRange[0] && firstRange[1] <= secondRange[1]) {
    return true;
  }
  if (secondRange[0] >= firstRange[0] && secondRange[1] <= firstRange[1]) {
    return true;
  }
  return false;
}

async function findFullyContains(file='../input.txt') {
  const lines = await readFile(file);
  let overlaps = 0;
  lines.forEach((line) => {
    if (hasOverlap(line)) {
      overlaps += 1
    }
  })
  console.log(overlaps)
  return overlaps
}

function hasAnyOverlap(line='') {
  const [first, second] = line.split(',')
  const firstRange = first.split('-').map(n => +n)
  const secondRange = second.split('-').map(n => +n)
  if (firstRange[0] < secondRange[0] && firstRange[1] < secondRange[0]) {
    return false;
  }
  if (secondRange[0] < firstRange[0] && secondRange[1] < firstRange[0]) {
    return false;
  }

  return true;
}

async function findContains(file='../input.txt') {
  const lines = await readFile(file);
  let overlaps = 0;
  lines.forEach((line) => {
    if (hasAnyOverlap(line)) {
      overlaps += 1
    }
  })
  console.log(overlaps)
  return overlaps
}

module.exports = findContains;
