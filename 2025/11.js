const { readFile, writeFile } = require('../utils.js')

const SERVERS = {}
async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parseInput(lines)
  //part one
  const visited = {}
  const count = countPaths('you','out',visited)
  console.log('count', count)
  //
  //part two
  // makeGraphViz()
  const visitedFFT = {}
  const countFFT = countPaths('svr','fft',visitedFFT)
  console.log(countFFT)
  const visitedDAC = {}
  const countDAC = countPaths('fft','dac',visitedDAC)
  console.log(countDAC)
  const visitedOUT = {}
  const countOUT = countPaths('dac','out',visitedOUT)
  console.log(countOUT)
  console.log(countFFT * countDAC * countOUT)
}

function makeGraphViz(output='./11-graph.txt') {
  let str = 'digraph servers {\n'
  str += '  dac [style=filled,color=blue]\n'
  str += '  fft [style=filled,color=green]\n'
  Object.entries(SERVERS).forEach(([start, ends]) => {
    ends.forEach((end) => {
      str += `  ${start} -> ${end};\n`
    })
  })
  str += '}'
  writeFile(output, str)
}

function countPaths(curr='', target='', cache={}) {
  if (curr === target) {
    return 1
  }
  if (!(curr in SERVERS)) return 0
  const key = `${curr}`
  if (key in cache) return cache[key]

  const sum = SERVERS[curr].reduce((acc, next) => {
    return acc + countPaths(next, target, cache)
  }, 0)
  cache[key] = sum
  return sum
}

// do not use
function getPaths(curr='',target='out', pathStr='', paths={}) {
  if (curr === target) {
    paths[pathStr] = pathStr
    return
  }
  if (pathStr in paths) {
    return;
  }
  if (!(SERVERS[curr])) return;
  const outs = SERVERS[curr]
  outs.forEach(out => getPaths(out, target, pathStr+'-'+curr, paths))
}

function parseInput(lines=[]) {
  lines.forEach(line => {
    const [start, nodesStr] = line.split(': ')
    const nodes = nodesStr.split(' ')
    SERVERS[start] = nodes
  })
}

module.exports = getAnswer;
