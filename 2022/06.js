const { readFile } = require('../utils.js')

// really should be doing a sliding window but whatever
function isUnique(letters) {
  const dict = {}
  letters.split('').forEach((l) => {
    if (l in dict) {
      dict[l] += 1
    } else {
      dict[l] = 1
    }
  })
  return Object.keys(dict).length === letters.length
}

async function foo(file = '../input.txt') {
  const lines = await readFile(file)
  const routine = lines[0]
  let res
  for (let i = 14; i < routine.length + 1; i++) {
    const win = routine.slice(i - 14, i)
    console.log(win)
    if (isUnique(win)) {
      res = i
      break
    }
  }
  console.log(res)
}

module.exports = foo
