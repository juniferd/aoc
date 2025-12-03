const {readFile} = require('../utils.js')
async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  const instructions = readLines(lines)
  const res = doInstructions(instructions, 50)
  console.log('result', res)
}

function doInstructions(instructions=[], cur=50) {
  let zeros = 0;
  instructions.forEach(([dir, steps]) => {
    let prevCur = cur;
    if (dir === 'L') {
      const [newCur, numZeros] = turnLeft(steps, cur)
      zeros += numZeros;
      cur = newCur;
    } else {
      const [newCur, numZeros] = turnRight(steps, cur)
      zeros += numZeros;
      cur = newCur;
    }
    // if (dir === 'L') {
    //   cur -= steps
    // } else {
    //   cur += steps
    // }
    // let newStart = cur;
    // if (cur > 99) {
    //   newStart = cur % 100;
    //   zeros += Math.floor(cur / 100)
    // } else if (cur <= 0) {
    //   newStart = 100 + (cur % 100);
    //   zeros += Math.ceil(Math.abs(cur) / 100)
    // } 
    // cur = newStart;
    // if (cur === 0 || cur === 100) {
    //   zeros += 1
    // }
    console.log(dir,steps, 'prev', prevCur, 'cur', cur, zeros)
  })
  return zeros
}

function turnRight(steps, cur) {
  let zeros = 0;
  while (steps > 0) {
    cur += 1;
    steps -= 1;
    if (cur === 100) {
      zeros += 1;
      cur = 0;
    }
  }

  return [cur, zeros]
}
function turnLeft(steps, cur) {
  let zeros = 0;
  if (cur === 0) {
    cur = 100
  }
  while(steps > 0) {
    cur -= 1;
    steps -= 1;
    if (cur === 0) {
      zeros += 1;
      cur = 100;
    }
  }
  return [cur % 100, zeros];
}

function readLines(lines=[]) {
  return lines.map((line) => {
    const dir = line[0]
    const steps = parseInt(line.slice(1))
    console.log('dir', dir, 'steps', steps)
    return [dir, steps]
  })
}
module.exports = getAnswer
