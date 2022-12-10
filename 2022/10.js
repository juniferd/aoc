const { readFile } = require('../utils.js')

function increment(type, cycle, register, value) {
  if (type === 'CYCLE') {
    return { cycle: cycle + 1, register }
  } else if (type === 'VALUE') {
    return { cycle: cycle + 1, register: register + value }
  }
}

const CYCLES = [20, 60, 100, 140, 180, 220]

function update(cycle, newCycle, register, newRegister, vals) {
  if (CYCLES.includes(newCycle)) {
    vals += register * newCycle
  }
  cycle = newCycle
  register = newRegister
  return { vals, cycle, register }
}

async function foo(file = '../input.txt') {
  const lines = await readFile(file)
  let register = 1
  let cycle = 0
  let vals = 0
  lines.forEach((line) => {
    const [instr, val] = line.split(' ')
    let res
    if (instr === 'noop') {
      const { cycle: newCycle, register: newRegister } = increment(
        'CYCLE',
        cycle,
        register
      )
      res = update(cycle, newCycle, register, newRegister, vals)
      vals = res.vals
      cycle = res.cycle
      register = res.register
    } else if (instr === 'addx') {
      for (let i = 0; i < 2; i++) {
        if (i === 0) {
          const { cycle: newCycle, register: newRegister } = increment(
            'CYCLE',
            cycle,
            register
          )
          res = update(cycle, newCycle, register, newRegister, vals)
        } else {
          const { cycle: newCycle, register: newRegister } = increment(
            'VALUE',
            cycle,
            register,
            +val
          )
          res = update(cycle, newCycle, register, newRegister, vals)
        }
        vals = res.vals
        cycle = res.cycle
        register = res.register
      }
    }
  })
  console.log(vals)
}

function draw(curr, cycle, register) {
  if ([0, 1].includes(Math.abs(register - cycle))) {
    curr += '#'
  } else {
    curr += '.'
  }
  return curr
}

function createInstructions(lines) {
  const instructions = []
  lines.forEach((line) => {
    const [instr, val] = line.split(' ');
    if (instr === 'noop') {
      instructions.push(['CYCLE', val])
    } else if (instr === 'addx') {
      for (let i = 0; i < 2; i++) {
        if (i === 0) {
          instructions.push(['CYCLE', val])
        } else {
          instructions.push(['VALUE', +val])
        }
      }
    }
  });
  return instructions;
}


async function drawCRT(file = '../input.txt') {
  const lines = await readFile(file)
  let output = []
  let curr = ''
  let cycle = 0;
  let register = 1;
  const instructions = createInstructions(lines)
  instructions.forEach(([typ, val]) => {
    // console.log('cycle', cycle, 'register', register)
    curr = draw(curr, cycle, register)
    // console.log('curr', curr)
    const {cycle: newCycle, register: newRegister} = increment(typ, cycle, register, val)

    if (curr.length % 40 === 0) {
      output.push(curr)
      curr = ''
    }
    cycle = newCycle % 40 === 0 ? 0 : newCycle;
    register = newRegister
  });

  console.log(output.join('\n'))
}

module.exports = drawCRT
