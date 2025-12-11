const { readFile } = require('../utils.js')
const {init} = require('z3-solver')
const PriorityQueue = require('../priorityQueue.js')

const MACHINES = []

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  readInput(lines)
  // let tot = 0
  // MACHINES.forEach(({goal, buttons, joltage}) => {
  //   console.log('----')
  //   console.log('goal', goal)
  //   const flips = countFlips(goal, buttons)
  //   console.log('num flips', flips)
  //   tot += flips
  // })
  // console.log(tot)
  //
  // part two
  const {Context} = await init();
  const ctx = new Context('main')
  const {Solver, Int, Optimize} = ctx;
  let tot = 0
  //MACHINES.forEach(({buttons, joltage}) => {
  for (let i = 0; i < MACHINES.length; i++) {
    const {buttons, joltage} = MACHINES[i]
    const solver = new Optimize();
    //console.log(solver.model())
    // const joltageBtnIndexTotals = joltage.map((_, i) => (
    //   buttons.reduce((acc, currButtons) => currButtons.includes(i) ? acc + 1 : acc,0)
    // ))
    const variables = Array(buttons.length).fill('').map((_,index) => Int.const('x' + index))
    variables.forEach(variable => {
      solver.add(variable.ge(0))
    })
    const btnTranslated = buttons.map((btns) => {
      const arr = new Array(joltage.length).fill(0)
      btns.forEach(btn => arr[btn] = 1)
      return arr;
    })
    console.log(btnTranslated)
    joltage.forEach((jolt, index) => {
      solver.add(btnTranslated.reduce((acc, btnArr, j) => {
        if (btnArr[index] === 1) {
          if (acc === null) return variables[j]
          return acc.add(variables[j])
        }
        return acc
      }, null).eq(jolt))
    })

    const sum = variables.reduce((acc, variable) => {
      if (acc === null) return variable
      return acc.add(variable)
    }, null)
    solver.minimize(sum)
    
    const check = (await solver.check())
    console.log(check)
    if (check === 'sat') {
      const model = solver.model()
      const strModel = model.toString()
      // parse this crap
      console.log(model.toString())
      const regex = /\(\s*define-fun\s+x\d+\s*\(\)\s*Int\s+(\d+)\s*\)/g;
      const currTot = [...strModel.matchAll(regex).map(m => +m[1])].reduce((acc, cur) => acc + cur, 0)
      tot += currTot
    }
      
    console.log(buttons)
    console.log(joltage)
    //tot += presses
  }
  //})
  console.log(tot)
}

function countJoltagePresses(buttons=[], joltage=[]) {
  console.log('buttons', buttons)
  console.log('joltage', joltage)
  // const cache = {}
  // let found = false
  // let count = 0
  // const q = PriorityQueue();
  // q.push({joltage}, 0)
  // while (!found) {
  //   const curr = q.pop()
  //   const {joltage} = curr[0]
  //   const key = `${joltage}`
  //   console.log('curr', key)
  //   if (key in cache) {

  //   } else if (isJoltageTarget(joltage)) {
  //     //found
  //     found = true;
  //     count = curr[1]
  //   } else if (joltage.includes(-1)) {

  //   } else {
  //     cache[key] = curr[1]
  //     buttons.forEach(btnArray => {
  //       const newJoltageState = joltage.map((j, index) => btnArray.includes(index) ? j - 1 : j )
  //       q.push({joltage: newJoltageState}, curr[1] + 1)
  //     })
  //   }
  // }
  // return count 
}


function traverse(currJoltage=[], buttons=[], presses=0, cache={}) {
  const key = `${currJoltage}`
  console.log(key)
  if (key in cache) return cache[key]
  if (isJoltageTarget(currJoltage)) return 0;
  if (currJoltage.includes(-1)) return Infinity;

  const nextPresses = buttons.map((btnArr) => {
    const nextJoltage = [...currJoltage]
    btnArr.forEach((index) => nextJoltage[index] -= 1)
    return traverse(nextJoltage, buttons, presses + 1, cache) + 1
  })
  const minRes = Math.min(...nextPresses)
  cache[key] = minRes
  return minRes;
}

function isJoltageTarget(joltage=[]) {
  for (let i=0; i < joltage.length; i++) {
    const j = joltage[i]
    if (j > 0) return false;
  }
  return true;
}

function countFlips(switches=[], buttons=[]) {
  // starts with all off [., ., .]
  // go backwards start with goal
  let found = false
  let count = 0
  const visited = {}
  const q = PriorityQueue();
  q.push({switches}, 0)

  while (!found) {
    const curr = q.pop();
    const {switches} = curr[0]
    const key = `${switches}-${curr[1]}`
    //console.log('curr', key)
    if (key in visited) {
      console.log('skip')
    } else if(switches.includes('#')) {
      visited[key] = curr[1]
      buttons.forEach(btnArray => {
        const newSwitchState = flipSwitches(btnArray, [...switches])
        q.push({switches: newSwitchState}, curr[1] + 1)
      })
    } else {
      console.log('found')
      found = true;
      count = curr[1]
    }
  }
  return count
}

function flipSwitches(buttons=[], switches=[]) {
  buttons.forEach((btn) => {
    switches[btn] = switches[btn] === '#' ? '.' : '#'
  })
  return switches
}

//unused
function getBestMatch(buttons=[], indices=[]) {
  let matchNum = 0;
  let buttonIndex = -1;
  buttons.forEach((btnArr, i) => {
    const num = btnArr.reduce((acc, curr) => {
      if (indices.includes(curr)) {
        acc++
      } 
      return acc;
    }, 0) 
    if (num > matchNum) {
      matchNum = num;
      buttonIndex = i;
    }
  })
  return buttons[buttonIndex]
}

function readInput(lines=[]) {
  lines.forEach((line) => {
    const goalRegexp = /\[(.*?)\]/

    const goal = line.split(goalRegexp)[1].split('')
    const buttons = line.match(/\(([^)]*)\)/g).map(chr => chr.slice(1,-1).split(',').map(d => +d));
    const joltage = line.match(/\{([^}]*)\}\s*$/)?.[1].split(',').map(d => +d);

    MACHINES.push({goal, buttons, joltage})
  })
}

module.exports = getAnswer;
