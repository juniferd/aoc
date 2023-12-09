const { readFile } = require('../utils.js')

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)

  const sequences = createSequences(lines)

  let res = 0;
  sequences.forEach((sequence) => {
    const history = getHistory(sequence)
    // const val = getNextValue(history)
    const val = getPrevValue(history)
    console.log('history', history)
    res += val
  })

  console.log('res:', res)
}

function getPrevValue(history) {
  for (let i = history.length - 1; i > 0; i--) {
    const curr = history.pop()
    const prev = history[i - 1]
    const prevFirst = prev[0]
    const currFirst = curr[0]
    prev.unshift(prevFirst - currFirst)
    curr.unshift(currFirst)
  }
  return history[0][0]

}

function getNextValue(history) {
  for (let i = history.length - 1; i > 0; i--) {
    const curr = history.pop()
    const prev = history[i - 1]
    const prevFinal = prev.pop()
    const currFinal = curr.pop()
    console.log('prev', prev, 'prevFinal', prevFinal, 'currFinal', currFinal)
    prev.push(prevFinal)
    prev.push(prevFinal + currFinal)
    curr.push(currFinal)
  }
  return history[0].pop()
}

function getHistory(sequence) {
  const res = [[...sequence]]
  let row = 0
  let foundZeros = false

  while (!foundZeros) {
    const currSequence = res[row]
    if (currSequence.every((n) => n === 0)) {
      foundZeros = true
      break
    }
    // loop through the first sequence
    const diffs = []
    for (let i = 1; i < currSequence.length; i++) {
      const prev = currSequence[i - 1]
      const curr = currSequence[i]
      diffs.push(curr - prev)
    }
    console.log('row', row, 'diffs', diffs)
    res.push(diffs)
    row += 1
  }

  return res
}

function createSequences(lines) {
  return lines.map((line) => line.split(/\s+/).map((l) => Number(l)))
}

module.exports = getAnswer
