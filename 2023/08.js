const { readFile } = require('../utils.js')

let INSTRUCTIONS = []
let TREE = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  const [instructions, tree] = constructTree(lines)
  INSTRUCTIONS = instructions
  TREE = tree
  // countSteps2()
  countGhostSteps()
}

function countGhostSteps() {
  // get all ghost nodes
  const startNodes = getAllGhostStartNodes()
  const endNodes = getAllGhostEndNodes()
  console.log(startNodes, startNodes.length)
  console.log(endNodes, endNodes.length)

  const nodes = {}
  startNodes.forEach((start) => {
    endNodes.forEach((end) => {
      const [steps] = countSteps(start, end, 0)
      if (!!steps) {
        console.log('start', start, 'end', end, 'steps', steps)
        nodes[start] = { end, steps, i: steps % INSTRUCTIONS.length }
      }
    })
  })
  console.log('nodes', nodes)
  // now find cycles
  Object.keys(nodes).forEach((start) => {
    const { end, i } = nodes[start]
    const instruction = INSTRUCTIONS[i]
    const [cycleSteps] = countSteps(TREE[end][instruction], end, i+1, 1)
    nodes[start]['cycleSteps'] = cycleSteps
  })
  console.log(nodes)


  const nodeCycleSteps = Object.values(nodes).map(({ steps, cycleSteps }) => ({
    steps,
    cycleSteps,
  }))

  nodeCycleSteps.sort((a, b) => a.steps - b.steps);

  let maxCycle = nodeCycleSteps[nodeCycleSteps.length - 1];

  function doStep(i, nodeCycleSteps) {
    notFound = false;
    nodeCycleSteps.forEach((s) => {
      s.steps += maxCycle.cycleSteps
      s.steps = s.steps % s.cycleSteps;
      if (s.steps != 0) {
        notFound = true;
      }
      if (s.steps == 0 && s.cycleSteps != maxCycle.cycleSteps) {
        console.log(i, s)
      }

    })

    if (!notFound) {
      console.log("FOUND ALL AT I", i);
      system.exit();
    }
  }

  // TODO: actually write out the function to find LCM
  // LCM: 43, 53, 59, 61, 71
  // LCM: 42, 52, 58, 60, 70

  // maxCycle.steps = 0;
  // console.log("AFTER", nodeCycleSteps)
  
  // for (let i = 0; i < 10000000; i++) { doStep(i, nodeCycleSteps); }

  console.log("NC", nodeCycleSteps)
  const seen = {};
  for (let i = 582350590; i < 582350592; i++) {
    const currStep = maxCycle.steps + (maxCycle.cycleSteps * i);
    console.log(currStep)

    const isMatch = nodeCycleSteps.map(({steps, cycleSteps}) => {
      const mod = (currStep - steps) % cycleSteps;
      if (mod === 0 && (seen[cycleSteps] || 0) < 5) {
        console.log(i, 'mod', mod, cycleSteps)
        seen[cycleSteps] = (seen[cycleSteps]||0)+1
      }
      return mod === 0;
    });
    // if (isMatch) {
    //   console.log('match', currStep)
    // }
  }
  console.log('no match')

  
  // steps + (cycleSteps * x) = steps2 + (cycleSteps2 * x2)
  // steps - steps2 = -(cycleSteps * x) + (cycleSteps2 * x2)
  // steps2 - steps3 = -(cycleSteps2 * x2) + (cycleSteps3 * x3)

  // console.log(Object.values(nodes).reduce((acc, curr) => { return acc * curr[0] }, 1))

  // get all the steps for each combination

  // this is nonoptimal - should try to find cycles and then do mathy math
  /*
  // let found = false;
  let steps = 0
  let currNodes = startNodes
  let i = 0
  while (!found) {
    console.log(currNodes, steps)
    if (currNodes.every((node) => isGhostEndNode(node))) {
      found = true
      break
    }

    if (i >= INSTRUCTIONS.length) {
      i = 0
    }
    const instruction = INSTRUCTIONS[i]

    currNodes = currNodes.map((node) => TREE[node][instruction])
    i += 1
    steps += 1
  }

  console.log(steps)
  */
}

function getAllGhostEndNodes() {
  return Object.keys(TREE).filter((f) => f[2] === 'Z')
}

function getAllGhostStartNodes() {
  return Object.keys(TREE).filter((f) => f[2] === 'A')
}

function isGhostEndNode(node) {
  return node[2] === 'Z'
}

function countSteps(start = 'AAA', end = 'ZZZ', i = 0, steps=0, ignoreCycles = true) {
  const VISITED = {}
  let found = false
  let curr = start
  let foundZ = [];
  while (!found) {
    const key = `${curr}-${i}`
    // console.log('curr', curr, i, steps)
    if (curr === end) {
      found = true
      break
    }

    if (key in VISITED && ignoreCycles) {
      found = true
      steps = undefined
      break
    }
    if (curr.endsWith('Z')) {
      foundZ.push(curr);
    }

    if (i >= INSTRUCTIONS.length) {
      i = 0
    }
    const instruction = INSTRUCTIONS[i]
    // console.log(curr, instruction, i, steps)
    VISITED[key] = true

    curr = TREE[curr][instruction]
    i += 1
    steps += 1
  }
  
  return [steps]
}

// function countSteps(index, curr) {
//   console.log(curr)
//   if (curr === "ZZZ") return 0;
//
//   if (index >= INSTRUCTIONS.length) {
//     index = 0;
//   }
//   const instruction = INSTRUCTIONS[index];
//   return countSteps(index + 1, TREE[curr][instruction]) + 1
// }

function constructTree(lines) {
  let instructions
  const tree = {}
  lines.forEach((line, i) => {
    if (i === 0) {
      instructions = line.split('')
    }
    if (i > 1) {
      let [head, lr] = line.split('=')
      head = head.trim()
      const [_, L, R] = lr.split(/\)|\s+\(|\,\s+/)
      tree[head] = { L, R }
    }
  })
  return [instructions, tree]
}

module.exports = getAnswer
