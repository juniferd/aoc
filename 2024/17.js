const { readFile } = require('../utils.js')
const PriorityQueue = require('../priorityQueue.js')

const REGISTERS = {}
let PROGRAM = []
function testCase(a=0n) {
  const ret = ((a % 8n) ^ (a / 2n**((a % 8n) ^ 7n))) % 8n
  return ret;
}

function printBinary(v) {
  return v.toString(2);
}

function runProgram(pointer, a) {
  const outs = [];
  REGISTERS.A = a
  while (pointer < PROGRAM.length) {
    const opcode = PROGRAM[pointer]
    const operand = PROGRAM[pointer + 1]
    // console.log('pointer',pointer,'opcode', opcode, 'operand', operand)
    const {pointer: newPointer, mode, value} = run(opcode, operand, pointer, REGISTERS)
    // console.log('a', REGISTERS.A, 'b', REGISTERS.B, 'c', REGISTERS.C, 'value', value)
    pointer = newPointer;
    if (value !== undefined) {
      outs.push(value)
    }
  }

  return outs;

}

function countCommon(a, b) {
  let common = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[a.length - i - 1] == b[b.length - i - 1]) {
      common++
    } else {
      break;
    }
  }
  return common;
}

function solve(value, index) {
  // console.log("VISITING", value, value.toString(2), index)
  if (index == 16) {
    console.log("VALUE", value);
    return;
  }

  for (let i = 0; i < 8; i++) {
    let v = (BigInt(value) * 8n) + BigInt(i);
    const inCommon = countCommon(PROGRAM, runProgram(0, v));
    if (inCommon <= index) { continue; }
    solve(BigInt(v), index + 1)
  }
}

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  console.log("RUNNING");
  parse(lines);
  solve(0, 0);
  parse(lines)

 // const stack = [{p: 15, targetA: 0n, start: 1, end: 7}];
  const q = PriorityQueue();
  q.push({p: 15, targetA: 0n, start: 1, end: 7}, 0)
//  const stack = [{p: 5, targetA: 1019688991n, start: 8157511928, end: 9177200919}];
  while (q.length) {
    let {p, targetA, start, end} = q.pop()[0];
    console.log('curr', p, targetA, start, end, 'queue len', q.length)

    targetA = BigInt(targetA)

    for (let i = start; i <= end; i++) {
      const testA = BigInt(i)
      const testValue = ((testA % 8n) ^ (testA / 2n ** (testA % 8n ^ 7n))) % 8n
      // console.log('testValue', testValue, i, PROGRAM[p])
      // const testC = (i / (2n ** ((i % 8n) ^ 7n)))
      if (Number(testValue) === PROGRAM[p] && validateSteps(testA, targetA)) {
        if (p === 0) {
          console.log('FOUND', testA)
          break;
        }
        const next = {p: p - 1, targetA: testA, start: Number(testA * 8n), end: Number(testA * 8n + 8n)} 
        q.push(next, p - Number(targetA))
      }
    }
  }

  function validateSteps(a=0, targetA=0) {
    a = BigInt(a)
    targetA = BigInt(targetA)
    let b = a % 8n;
    b = b ^ 7n;
    let c = a / 2n**b;
    a = a / 8n;
    b = b ^ 7n;
    b = b ^ c;
    return a === targetA;
  }
  return;
  console.log(REGISTERS)
  console.log(PROGRAM)

  // registers 2**48 - (10**2) to 2**48 - (10**2) + 100  - last 13 outputs = 0
  // registers 2**48 - (10**10) to 2**48 - (10**10) + 100 - last 13 = 1,4,7,2,0,1,0,5,1,0...0
  // registers 2**48
  // registers 2**47 to 2**47 + 100 - last 13 outputs are 0..0,2,0,4

  // 267112606072832 - 267731081363456
  // for (let i = 2**45 + (3375 * (2**36)) + (15 * (2**32)); i < 2**45 + (3384 * (2**36)) + 2**36; i+=(2**32)) {
  // for (let i = 267705311559680; i < 267705311559680 + 100; i+=(2**4)) {

  // for (let i = 2**45; i < 2**48; i+= 2**36) {
  //   REGISTERS.A = i
  //   REGISTERS.B = 0;
  //   REGISTERS.C = 0;
  //   const outs = []
  //   let pointer = 0;
  //   console.log('----', REGISTERS)
  //   while (pointer < PROGRAM.length) {
  //     const opcode = PROGRAM[pointer]
  //     const operand = PROGRAM[pointer + 1]
  //     // console.log('pointer',pointer,'opcode', opcode, 'operand', operand)
  //     const {pointer: newPointer, mode, value} = run(opcode, operand, pointer, REGISTERS)
  //     // console.log('a', REGISTERS.A, 'b', REGISTERS.B, 'c', REGISTERS.C, 'value', value)
  //     pointer = newPointer;
  //     if (value !== undefined) {
  //       outs.push(value)
  //     }
  //   }
  //   console.log('regs', REGISTERS)
  //   console.log('outs', outs.join(','), outs.length)
  // }

  // const res = findMatch(2**32, 2**45, 2**48, PROGRAM, 13)
  // console.log('newStart', res[0], 'newEnd', res[1])
  // const res2 = findMatch(2**16, res[0], res[1], PROGRAM, 12)
  // console.log('newStart', res2[0], 'newEnd', res2[1])
  // const res3 = findMatch(2**8, res2[0], res2[1], PROGRAM, 11)
  // console.log('newStart', res3[0], 'newEnd', res3[1])
  // console.log(PROGRAM.join(','))
  let pointer = 13;
  let start = 2**45; // only finds pointer 11+
  // let start = 258384964091904;
  // let start = 258934988341248; // finds pointer 9+ when inc 2**24
  // let start = 264982301245440; // finds pointer 9+ when inc 2**20
  // let start = 266081813921792; // finds pointer 10+
  // let start = 267181308772352; // finds pointer 7+ when inc 2**24
  // let start = 267181324500992; // finds poitner 5+ when inc 2**20
  // let start = 267181325287424; // find pointer 5+ when inc 2**18
  // let start = 267304812412928; // find pointer 5+ when inc 2**18
  // let start = 267304812150784; find pointer 5+ when inc 2**18
  // let start= 267304811888640;
  // let start = 267304812412928; // find pointer 5+ when inc 2**17
  // let start = 267731081363456; // doesn't find any matches
  let visited = {};
  let end = 2**48;
  const START_INC = 2**18
  let inc = START_INC
  let lastGoodEnd = null;
  while (pointer >= 0) {
    const [newStart, newEnd, found, registerA, outs] = findMatch(inc, start, end, PROGRAM, pointer);
    if (found) {
      start = newStart;
      // end = newEnd;
      lastGoodEnd = newEnd;
      pointer -= 1;
      inc = START_INC;
      console.log('FOUND', start, end, pointer, registerA, outs.join(','))
      continue;
    }
    start = newStart;
    // end = newEnd;
    inc = inc / 2;
    console.log('NOT FOUND', pointer, inc)

    if (inc < 1) {
      console.log(visited)
      if (lastGoodEnd.toString() in visited) break;
      console.log('TOO SMALL INCREMENT, SET NEW START', start, '->', lastGoodEnd)
      visited[lastGoodEnd] = true
      pointer = 13;
      start = lastGoodEnd;
      lastGoodEnd = null;
      // end = 2**48;
      inc = START_INC
      if (start > end || start === null) {
        console.log('STOP HERE', start > end, start)
        break;
      }
    }
  }
}

// sets the position bits to value
// e.g. setValue(a, i, v) sets the ith position to v in a
// setValue(0, 0, 1) => , 001
// setValue(0, 1, 1) => 001 , 000
function setValue(a, position, value) {
  const shiftLeft = BigInt(position*3);
  value = BigInt(value) & 7n;

  const clearBitMask = ~(7n << shiftLeft);
  a = BigInt(a) & clearBitMask;

  value = BigInt(value) << BigInt(shiftLeft);
  a = a | value;

  return a;
}

function findMatch(inc=2**36, start=2**45, end=2**48, program=[], sl=13) {
  let newStart = null;
  let newEnd = null;
  let tmpNewStart = null;
  let tmpNewEnd = null;
  for (let i = start; i < end; i+=inc) {

    REGISTERS.A = i
    REGISTERS.B = 0;
    REGISTERS.C = 0;
    let outs = []
    let pointer = 0;
    // console.log('----', REGISTERS)
    while (pointer < PROGRAM.length) {
      const opcode = PROGRAM[pointer]
      const operand = PROGRAM[pointer + 1]
      // console.log('pointer',pointer,'opcode', opcode, 'operand', operand)
      const {pointer: newPointer, mode, value} = run(opcode, operand, pointer, REGISTERS)
      // console.log('a', REGISTERS.A, 'b', REGISTERS.B, 'c', REGISTERS.C, 'value', value)
      pointer = newPointer;
      if (value !== undefined) {
        outs.push(value)
      }
    }
    // console.log('regs', REGISTERS)
    // console.log('outs', outs.join(','), outs.length)
    // check last three
    if (program.slice(sl).join(',') === outs.slice(sl).join(',') && newStart === null) {
      // mark previous
      newStart = i - inc;
    }
    if (program.slice(sl - 1).join(',') === outs.slice(sl - 1).join(',') && tmpNewStart === null) {
      tmpNewStart = i - inc;
    }
    if (program.slice(sl - 1).join(',') === outs.slice(sl - 1).join(',') && tmpNewStart !== null) {
      tmpNewEnd = i;
    }
    if (program.slice(sl).join(',') !== outs.slice(sl).join(',') && newStart !== null) {
      newEnd = i + inc;
      return [newStart, newEnd, true, i, outs]
    }
  }
  return [tmpNewStart, tmpNewEnd, false]
}

function adv(operand=0, registers={}) {
  const num = BigInt(registers.A);
  const den = BigInt(2 ** combo(Number(operand), registers))
  return Number(num / den)
}

function combo(operand=0, registers={}) {
  if (operand >= 0 && operand <= 3) return operand;
  if (operand === 4) return registers.A;
  if (operand === 5) return registers.B;
  if (operand === 6) return registers.C;
}
function run(opcode=0, operand=0, pointer=0, registers={}) {
  operand = BigInt(operand)

  if (opcode === 0) {
    // console.log('DIVISION')
    registers.A = adv(operand, registers)
    return {pointer: pointer + 2};
  }

  if (opcode === 1) {
    registers.B = Number(BigInt(registers.B) ^ operand)
    return {pointer: pointer + 2};
  }

  if (opcode === 2) {
    registers.B = Number(modulo(combo(Number(operand), registers), 8))
    return {pointer: pointer + 2};
  }

  if (opcode === 3) {
    if (registers.A !== 0) {
      // also does not increase instruction ipointer after this
      return {pointer: Number(operand)};
    }
    return {pointer: pointer + 2}
  }

  if (opcode === 4) {
    registers.B = registers.B ^ registers.C
    return {pointer: pointer + 2};
  }

  if (opcode === 5) {
    // console.log('COMBO MODULO 8 + VALUE')
    const value = Number(modulo(combo(Number(operand), registers), 8));
    return {pointer: pointer + 2, value}
  }

  if (opcode === 6) {
    registers.B = adv(operand, registers)
    return {pointer: pointer + 2};
  }

  if (opcode === 7) {
    registers.C = adv(operand, registers)
    return {pointer: pointer + 2};
  }
}

function modulo(a,b) {
  return (BigInt(a) % BigInt(b) + BigInt(b)) % BigInt(b)
}

function parse(lines = []) {
  let mode = 'R';
  lines.forEach(line => {
    if (mode === 'R') {
      if (line === '') {
        mode = 'P'
        return;
      }
      const reg = /Register\s(\w)\:\s(\d*)/
      const [_, register, value] = line.match(reg)
      REGISTERS[register] = Number(value)
    } else {
      const prog = /Program\:\s(.*$)/
      const [_, program] = line.match(prog)
      program.split(',').forEach(n => PROGRAM.push(Number(n)))
    }
  })
}

module.exports = getAnswer;
