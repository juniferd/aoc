const { readFile } = require('../utils.js')

/*
async function findSum2020(file='../input.txt') {
  const lines = await readFile(file, Number);
  const dict = {};

  // lines.forEach(num => {
  //   const res = 2020 - num;
  //   if (String(res) in dict) {
  //     console.log('found')
  //     console.log(res * num)
  //   } else {
  //     dict[num] = res;
  //   }
  // })
    //

  for (let i = 0; i < lines.length; i++) {
    const num = lines[i];
    dict[num] = num;
    for (let j = i+1; j < lines.length; j++) {
      const diff = 2020 - num - lines[j];
      if (diff in dict) {
        console.log(num * diff * lines[j])
        break;
      }
    }
  }
}
*/

const NUMWORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  const nums = []

  lines.forEach((line, index) => {
    let min = Infinity
    let max = -1
    let first = 0
    let second = 0
    Object.keys(NUMWORDS).forEach((word) => {
      const i = line.indexOf(word)
      const j = line.lastIndexOf(word)
      if (i > -1 && i < min) {
        first = NUMWORDS[word]
        min = i
      }
      if (j > -1 && j > max) {
        second = NUMWORDS[word]
        max = j
      }
    })
    // go through each character
    line.split('').forEach((chr, i) => {
      if (Number(chr) && i < min) {
        first = chr
        min = i
      }
      if (Number(chr) && i > max) {
        second = chr
        max = i
      }
    })
    nums.push(Number([first, second].join('')))
    // console.log(index + 1, Number([first, second].join('')))
  })

  const res = nums.reduce((prev, curr) => prev + curr, 0)

  console.log('----')
  console.log(res)
}

function partOne(lines) {
  lines.forEach((line) => {
    const num = []
    line.split('').forEach((l) => {
      if (Number(l)) {
        num.push(l)
      }
    })
    const first = num.shift()
    const second = num.pop()
    let curr = first
    if (!second) {
      curr += first
      nums.push(Number(curr))
    } else if (!first && !second) {
      nums.push(0)
    } else {
      curr += second
      nums.push(Number(curr))
    }
  })
  const res = nums.reduce((prev, curr) => prev + curr, 0)

  console.log(res)
}

module.exports = getAnswer
