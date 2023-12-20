const { readFile } = require('../utils.js')

const MODULES = {}
const FLIPFLOPS = {}
const CONJUNCTIONS = {}
let LOWS = 0, HIGHS = 0;
let foundCycle = false;
let foundModule;

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createModules(lines)
  createConjunctionState()
  //console.log(MODULES)
  // createGraph()
  //console.log(FLIPFLOPS)
  //console.log(CONJUNCTIONS)
  // partOne()
  partTwo()
}

// put this into graphviz
function createGraph() {
  console.log("digraph moduleGraph {")
  console.log('  node [shape=box];')
    
  Object.entries(MODULES).forEach(([module, {type, destinations}]) => {
    console.log(`  "${module}" [color=${type === '%' ? "blue" : "red"}]`)
    destinations.forEach(dest => {
      console.log(`  "${module}" -> "${dest}"`)
    })
  })
  console.log("}")
}

function sendPulse(
  prevModule = '',
  currModule = 'broadcaster',
  pulse = 'LOW'
) {

  let q = [[prevModule, currModule, pulse]];
  for (let i = 0; i < q.length; i++) {
    [prevModule, currModule, pulse] = q[i];
    // console.log(prevModule, `${pulse} ->`, currModule, i, q.length)
    // for part one
    countPulseType(pulse)

    if (!(currModule in MODULES)) {
      // console.log("module missing", currModule)
      continue
    }

    const { type, destinations } = MODULES[currModule]
    let nextPulse = pulse
    if (type === '%') {
      nextPulse = handleFlipFlop(currModule, pulse)
      // console.log("  handling flip flop", nextPulse)
    } else if (type === '&') {
      nextPulse = handleConjunction(prevModule, currModule, pulse)
    }

    // for part two
    if (['qx','jg','pn','zt'].includes(currModule) && nextPulse === 'LOW') {
      foundCycle = true;
      foundModule = currModule;
    }

    if (!!nextPulse) {
      // console.log("  sending to destinations", destinations)
      destinations.forEach((dest) => {
        q.push([currModule, dest, nextPulse])
      })
    }
  }
}

function countPulseType(pulse) {
  if (pulse === 'LOW') {
    LOWS += 1
  } else {
    HIGHS += 1
  }
}

function partTwo() {
  // &jz -> rx so jz needs to emit low
  // jf, mk, dh, rn connect to jz and are all conjunction modules so all need to emit high
  // qx, jg, pn zt connect to jf, mk, dh, zt and are all conjunctio modules so all need to emit low
  let qx = Infinity;
  let jg = Infinity;
  let pn = Infinity;
  let zt = Infinity;
  for (let i = 0; i < 10000; i++) {
    sendPulse()
    if (foundCycle && foundModule === 'qx' && i < qx) {
      qx = i
    }
    if (foundCycle && foundModule === 'jg' && i < jg) {
      jg = i
    }
    if (foundCycle && foundModule === 'pn' && i < pn) {
      pn = i
    }
    if (foundCycle && foundModule === 'zt' && i < zt) {
      zt = i
    }
    foundCycle = false;
    foundModule = undefined;
  }
  console.log(qx + 1)
  console.log(jg + 1)
  console.log(pn + 1)
  console.log(zt + 1)
  // do LCM for qx, jg, pn, zt and tada

}

function partOne() {
  for (let i = 0; i < 1000; i++) {
    // console.log("SENDING PULSE", i)
    sendPulse()
  }
  console.log(LOWS, HIGHS)
  console.log(LOWS * HIGHS)

}

function handleConjunction(prevModule, currModule, pulse) {
  // first update memory for the pulse
  CONJUNCTIONS[currModule][prevModule] = pulse
  const allHighs = Object.values(CONJUNCTIONS[currModule]).every(
    (n) => n === 'HIGH'
  )
  if (allHighs) return 'LOW'
  return 'HIGH'
}

function handleFlipFlop(module, pulse) {
  if (pulse === 'HIGH') return
  FLIPFLOPS[module] = FLIPFLOPS[module] === 'ON' ? 'OFF' : 'ON'

  if (FLIPFLOPS[module] === 'ON') return 'HIGH'
  if (FLIPFLOPS[module] === 'OFF') return 'LOW'
}

function createConjunctionState() {
  // go through each of the conjunction modules, find every input into that module
  Object.keys(CONJUNCTIONS).forEach((conj) => {
    const inputs = Object.entries(MODULES)
      .filter(([_, { destinations }]) => {
        return destinations.includes(conj)
      })
      .map(([module]) => module)
    // initially all pulses are remembered 'low'
    inputs.forEach((input) => {
      CONJUNCTIONS[conj][input] = 'LOW'
    })
  })
}
function createModules(lines) {
  lines.forEach((line) => {
    let [module, dests] = line.split(' -> ')
    const res = {}

    if (module[0] === '%') {
      res.type = module[0]
      module = module.slice(1)
      FLIPFLOPS[module] = 'OFF'
    }

    if (module[0] === '&') {
      res.type = module[0]
      module = module.slice(1)
      CONJUNCTIONS[module] = {}
    }
    res.destinations = dests.split(/\,\s+/)

    MODULES[module] = res
  })
}

module.exports = getAnswer
