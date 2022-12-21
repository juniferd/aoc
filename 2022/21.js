const { readFile } = require('../utils.js')
let MONKEYS = {}
let MONKEYS_HUMN = {}

// class Monkey() {
//   constructor(monkey, action, number) {
//     thi
//   }
// }

function constructMonkeys(lines) {
  const monkeys = {}

  lines.forEach((line) => {
    const [monkey, rest] = line.split(': ')
    const vals = rest.split(' ')
    monkeys[monkey] = vals
  })

  return monkeys
}

function traverse(monkey) {
  const next = MONKEYS[monkey]

  if (next.length > 1) {
    const [m1, operator, m2] = next
    if (operator === '-') {
      return traverse(m1) - traverse(m2)
    } else if (operator === '+') {
      return traverse(m1) + traverse(m2)
    } else if (operator === '*') {
      return traverse(m1) * traverse(m2)
    } else {
      return traverse(m1) / traverse(m2)
    }
  } else {
    return Number(next[0])
  }
}

async function getFinalMonkey(file = '../input.txt') {
  const lines = await readFile(file)
  MONKEYS = constructMonkeys(lines)

  const result = traverse('root', 0)
  console.log(result)
}

async function getHuman(file = '../input.txt') {
  const lines = await readFile(file)
  MONKEYS = constructMonkeys(lines)

  const [b1, _, b2] = MONKEYS.root
  const result1 = traverse(b1)
  const result2 = traverse(b2)

  MONKEYS.humn = [100]

  const result1a = traverse(b1)
  const result2a = traverse(b2)

  let answer
  let humanBranch
  if (result1 === result1a) {
    answer = result1
    humanBranch = b2
  } else {
    answer = result2
    humanBranch = b1
  }

  console.log(answer)

  console.log('-----')

  let monkeyMin = -1e12
  let monkeyMax = 1e13
  let curr
  MONKEYS.humn = [monkeyMin]
  const resMonkeyMin = traverse(humanBranch)
  MONKEYS.humn = [monkeyMax]
  const resMonkeyMax = traverse(humanBranch)

  let shouldIncrease = resMonkeyMax > resMonkeyMin

  found = false
  // binary search between min and max
  while (!found) {
    curr = Math.floor((monkeyMin + monkeyMax) / 2)
    MONKEYS.humn = [curr]
    const res = traverse(humanBranch)

    console.log('CURR', curr, 'RESULT', res)
    if (curr === monkeyMax) break
    if (res === answer) break
    if (res < answer) {
      if (shouldIncrease) {
        monkeyMin = curr
      } else {
        monkeyMax = curr
      }
    } else {
      if (shouldIncrease) {
        monkeyMax = curr
      } else {
        monkeyMin = curr
      }
    }
  }

  console.log(curr, answer)
  // console.log(MONKEYS.humn)
}

module.exports = getHuman
