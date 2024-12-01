const { readFile } = require('../utils.js')

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  console.log('lines', lines)
}

// 2020 day 2 - warmup
function solve2020Day2Part2(lines) {
  let valid = 0
  lines.forEach((line) => {
    const [positions, policy, password] = line.split(' ')
    let [firstP, secondP] = positions.split('-')
    firstP = Number(firstP)
    secondP = Number(secondP)
    const policyLetter = policy.split(':')[0]
    const ret = validatePosition(firstP, secondP, policyLetter, password)
    if (ret) {
      valid += 1
    }
  })
  console.log('valid', valid)
}

function validatePosition(first, second, policy, password) {
  // exactly one position must contain policy
  // starts with index 1
  let valid = (
    (password[first - 1] === policy && password[second - 1] !== policy) ||
    (password[first - 1] !== policy && password[second - 1] === policy)
  )
  console.log('first', first, 'second', second, 'policy', policy, 'password', password, 'valid', valid)
  
  return valid
}

function solve2020Day2Part1(lines) {
  let valid = 0
  lines.forEach((line) => {
    const [minMax, policy, password] = line.split(' ')
    let [minP, maxP] = minMax.split('-')
    minP = Number(minP)
    maxP = Number(maxP)
    const policyLetter = policy.split(':')[0]
    const ret = validate(minP, maxP, policyLetter, password)
    if (ret) {
      valid += 1
    }
  })
  console.log('valid', valid)
}

function validate(minCount, maxCount, policy, password) {
  let count = 0
  for (let i = 0; i < password.length; i++) {
    const curr = password[i]
    if (curr === policy) {
      count += 1
    }
    if (count > maxCount) return false
  }
  if (count < minCount) return false
  return true
}

module.exports = getAnswer
