const { readFile } = require('../utils.js')

const COORDS = {}

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  readInput(lines)
  createJunctions();
}

function createJunctions() {
  const JUNCTIONS = {}
  getShortest(Object.values(COORDS))
}

function getShortest(coords=[]) {
  let shortest = Infinity;
  let shortestPair = [];
  const DISTS = {}
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const a = coords[i]
      const b = coords[j]
      const dist = Math.floor(distance(a, b) * 1000) / 1000
      DISTS[dist] = [a,b]
      if (dist < shortest) {
        shortestPair = [a,b]
        shortest = dist
      }
    }
  }

  const JUNCTIONS = []

  const sorted = Object.entries(DISTS).sort((a,b) => +a[0] - +b[0])
  let allConnected = false;
  let i = 0;
  let lastPair = [];
  //for (let i = 0; i < 1000; i++) {

  while (!allConnected) {
    const [_, [a,b]] = sorted[i]
    const junctionAIndex = JUNCTIONS.findIndex(coords => coords.includes(a))
    const junctionBIndex = JUNCTIONS.findIndex(coords => coords.includes(b))
    if (junctionAIndex > -1 && junctionBIndex > -1 && junctionAIndex === junctionBIndex) {
      console.log('SKIP')
    } else if (junctionAIndex > -1 && junctionBIndex > -1) {
      console.log('MERGE', JUNCTIONS[junctionAIndex], JUNCTIONS[junctionBIndex])
      JUNCTIONS[junctionAIndex] = JUNCTIONS[junctionAIndex].concat(JUNCTIONS[junctionBIndex])
      JUNCTIONS.splice(junctionBIndex, 1)
    } else if (junctionAIndex > -1) {
      JUNCTIONS[junctionAIndex].push(b)
    } else if (junctionBIndex > -1) {
      JUNCTIONS[junctionBIndex].push(a)
    } else {
      JUNCTIONS.push([a,b])
    }
    delete COORDS[a]
    delete COORDS[b]
    if (JUNCTIONS.length === 1 && Object.keys(COORDS).length === 0) {
      allConnected = true;
      lastPair = [a,b]
      console.log('last pair', a, b)
    }
    i++
    console.log(JUNCTIONS)
    console.log('----')
  }
  // JUNCTIONS.sort((a,b) => b.length - a.length)
  // console.log(JUNCTIONS)
  // let tot = 1;
  // for (let i = 0; i < 3; i++) {
  //   tot *= JUNCTIONS[i].length
  // }
  // console.log('tot', tot)

  console.log(lastPair[0][0] * lastPair[1][0])
}

function distance(a=[], b=[]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function readInput(lines=[]) {
  lines.forEach(line => {
    const coords = line.split(',').map(d => +d)
    COORDS[coords] = coords
  })
}

module.exports = getAnswer;
