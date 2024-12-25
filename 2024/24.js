const { readFile,binaryToDecimal, writeFile } = require('../utils.js')

const WIRES = {}
const GATES = []

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // partOne([...GATES], {...WIRES});
  // partTwo(GATES, WIRES);
  generateGraphViz(GATES, '0')
}

function generateGraphViz(gates, inputFile='./input.txt') {
  let data = 'digraph G {'
  gates.forEach((gate, i) => {
    data += `\n  subgraph cluster_gate${i} {`
    data += `\n    ${gate.gates[0]} -> ${gate.result} [label=${gate.logic}];`
    data += `\n    ${gate.gates[1]} -> ${gate.result} [label=${gate.logic}];`
    data += `\n    ${gate.result.startsWith('z') ? gate.result + '[style=filled, color=lightgrey]' : ''}`
    // data += `\n    label="${gate.logic}";`
    data += `\n    color=grey;`
    data += '\n  }'
  })
  // Object.keys(wires).forEach(wire => {
  //   data += `\n  ${wire} -- ${wires[wire]}`
  // })
  data += '\n}'
  let inputNum = inputFile.match(/\d+/);
  inputNum = inputNum === null ? '0' : inputNum[0]
  writeFile(`./24-output-${inputNum}.txt`, data)

}

function partTwo(gates = [], wires={}) {
  // swap z05 with vtn
  // swap(gates, 'z05', 'vtn')
  // fun with graphviz
  swap(gates, 'z05', 'tst')
  swap(gates, 'z11', 'sps')
  swap(gates, 'z23', 'frt')
  swap(gates, 'pmd', 'cgh')

  //cgh,frt,pmd,sps,tst,z05,z11,z23

  const initialX = Object.keys(wires).filter(key => key.startsWith('x')).sort();
  const initialY = Object.keys(wires).filter(key => key.startsWith('y')).sort();
  const initBinValX = initialX.map(key => WIRES[key]).reverse().join('')
  const initBinValY = initialY.map(key => WIRES[key]).reverse().join('')
  
  const initValX = binaryToDecimal(initBinValX)
  const initValY = binaryToDecimal(initBinValY)
  // console.log(initValX, initValY, initValX + initValY)
  const initBinTarget = (initValX + initValY).toString(2)
  const res = partOne([...gates], {...wires})
  console.log('target', initBinTarget)
  console.log('result', res)
  const diffs = markDifference(initBinTarget, res)
  console.log(diffs)
  generateGraphViz(gates, '3')
}

function swap(gates=[], gateA='', gateB='' ) {
  const a = gates.findIndex(gate => gate.result === gateA)
  const b = gates.findIndex(gate => gate.result === gateB)
  gates[a].result = gateB;
  gates[b].result = gateA;
  return gates;
}

function partTwob(gates=[], wires={}) {
  const initialX = Object.keys(wires).filter(key => key.startsWith('x')).sort();
  const initialY = Object.keys(wires).filter(key => key.startsWith('y')).sort();
  const initBinValX = initialX.map(key => WIRES[key]).reverse().join('')
  const initBinValY = initialY.map(key => WIRES[key]).reverse().join('')
  
  // console.log(initialX, initialY)
  // console.log(initBinValX, initBinValY, (13).toString(2), (31).toString(2))
  const initValX = binaryToDecimal(initBinValX)
  const initValY = binaryToDecimal(initBinValY)
  // console.log(initValX, initValY, initValX + initValY)
  const initBinTarget = (initValX + initValY).toString(2)
  // check initial instructions
  const res = partOne([...gates], {...wires})
  console.log('target', initBinTarget)
  console.log('result', res)
  const diffs = markDifference(initBinTarget, res)
  console.log(diffs)
  console.log(GATES.filter(gate => diffs.includes(gate.result)))
  // start with x05, y05 since that stores immediately in z05, which is the first wrong bit
  // console.log(WIRES.x05, WIRES.y05)
  // console.log(GATES.filter(gate => {
  //   const {gates} = gate;
  //   const [a,b] = gates;
  //   return a.startsWith('x') || a.startsWith('y') || b.startsWith('x') || b.startsWith('y')
  // }).filter(gate => WIRES[gate.gates[0]] === 1 && WIRES[gate.gates[1]] === 1))
  const newTargets= findPossibleFixes(['x05', 'y05'], 'AND', wires)
  const stack=[];
  newTargets.forEach(([valA, valB]) => {
    const tryNext = gates.filter(({gates: [a,b]}) => {
      const testWire = ((a.startsWith('x') && b.startsWith('y')) || (a.startsWith('y') && b.startsWith('x')))
      const testVal = wires[a] === valA && wires[b] === valB
      return testWire && testVal
    })
    
    console.log('nexts', tryNext)
    tryNext.forEach(next => stack.push(next))
  })

  let currSwap = ['x05', 'y05']

  let found = false;
  while (!found) {
    return;
  }
}


function findPossibleFixes(gates=[], logic='OR', wires=WIRES) {
  const curr = doLogic(gates, logic, wires)
  // whatever curr is we need the opposite
  const target = curr === 1 ? 0 : 1;

  // possible values
  switch(logic) {
    case 'AND':
      if (target === 1) return [[1,1]]
      return [[0,0]]
    case 'OR':
      if (target === 1) return [[1,1], [1,0], [0,1]]
      return [[0,0]]
    case 'XOR':
      if (target === 1) return [[1,0], [0,1]]
      return [[0,0], [1,1]]
    default:
      console.log('ERROR FINDING POSSIBLE FIXES')
      return [];
  }
}

function markDifference(a='', b='') {
  a = a.split('').reverse()
  b = b.split('').reverse()

  const diffs = [];
  a.forEach((aVal, i) => {
    if (aVal !== b[i]) {
      diffs.push(`z${i.toString().length === 1 ? '0' : ''}${i}`)
    }
  })
  return diffs
}

function partOne(instructions=[], wires={}) {
  while (instructions.length) {
    const {gates, logic, result} = instructions.shift();
    if (!(gates[0] in wires && gates[1] in wires)) {
      instructions.push({gates, logic, result})
      continue;
    }
    
    const res = doLogic(gates, logic, wires)
    wires[result] = res;

  }
  // console.log(wires)

  const zs = Object.keys(wires).filter(key => key.startsWith('z')).sort().reverse()

  const vals = zs.map(key => wires[key]).join('')
  // console.log('bin', vals)
  console.log(binaryToDecimal(vals))
  return vals;
}

function doLogic(gates=[], logic='', wires={}) {
  const [a,b] = gates;
  switch (logic) {
    case 'OR':
      return wires[a] || wires[b]
    case 'AND':
      return wires[a] && wires[b]
    case 'XOR':
      return wires[a] ^ wires[b]
    default:
      console.log('ERROR')
      return null
  }
}

function parse(lines = []) {
  let mode = 'W'
  lines.forEach(line => {
    if (line === '' || line === '\n') {
      mode = 'G'
    } else if (mode === 'W') {
      const [wire, strVal] = line.split(': ')
      WIRES[wire] = Number(strVal)
    } else if (mode === 'G') {
      const [gatesLogic, result] = line.split(' -> ') 
      const [a, logic, b] = gatesLogic.split(' ')
      GATES.push({gates: [a, b], logic, result})
    }
  })
}

module.exports = getAnswer;
