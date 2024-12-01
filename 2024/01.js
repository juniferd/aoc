const { readFile } = require('../utils.js')

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  console.log('lines', lines)
  const [firsts, seconds] = parse(lines)
  // const tot = getDiffs(firsts, seconds)
  // console.log(tot)
  const tot = getSimilarity(firsts, seconds)
  console.log(tot)
}

function getSimilarity(firsts, seconds) {
  let total = 0
  firsts.forEach((firstNum) => {
    console.log('---')
    console.log('firstnum', firstNum)
    // go down seconds until you find match
    const index = seconds.findIndex((second) => second === firstNum)
    let count = 0
    if (index >= 0) {
      for (let i = index; i < seconds.length; i++) {
        const secondNum = seconds[i]
        console.log(secondNum)
        if (secondNum === firstNum) {
          count += 1
        } else {
          break
        }
      }
    }
    total += firstNum * count
    console.log('total', total)
  })
  return total
}

function getDiffs(firsts, seconds) {
  let tot = 0
  firsts.forEach((firstNum, i) => {
    const secondNum = seconds[i]
    tot += Math.abs(firstNum - secondNum)
  })
  return tot
}
function parse(lines) {
  let firsts = []
  let seconds = []
  lines.forEach((line) => {
    let [first, second] = line.split('  ')
    first = Number(first)
    second = Number(second)
    console.log(first, second)
    firsts.push(first)
    seconds.push(second)
  })

  // firsts.sort();
  seconds.sort()

  return [firsts, seconds]
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
  let valid =
    (password[first - 1] === policy && password[second - 1] !== policy) ||
    (password[first - 1] !== policy && password[second - 1] === policy)
  console.log(
    'first',
    first,
    'second',
    second,
    'policy',
    policy,
    'password',
    password,
    'valid',
    valid
  )

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
