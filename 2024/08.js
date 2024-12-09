const { readFile } = require('../utils.js')

const ANTENNAS_MAP = {}
const ANTENNAS = {}
let X_MAX = 0;
let Y_MAX = 0;
const ANTINODES = {}

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(X_MAX, Y_MAX)
  console.log(ANTENNAS)
  // countAntinodes();
  countAllAntinodes();
  // Object.keys(ANTINODES).forEach(n => console.log(n))
  draw(ANTENNAS_MAP, ANTINODES)
  // this is dumb - idk why this works
  Object.keys(ANTENNAS_MAP).forEach(node => ANTINODES[node] = node)
  console.log('tot', Object.keys(ANTINODES).length)
}

function draw(antennas, antinodes) {
  console.log(antennas)
  for (let y = 0; y <= Y_MAX; y++) {
    const row = [];
    for (let x = 0; x <= X_MAX; x++) {
      const key = `${x},${y}`;
      if (key in antennas) {
        row.push(antennas[key])
      } else if (key in antinodes) {
        row.push('#')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function countAllAntinodes(antennas = ANTENNAS) {
  Object.entries(ANTENNAS).forEach(([antenna, coords]) => {
    // make all pairs
    console.log('ANTENNA', antenna)
    for (let i = 0; i < coords.length; i++) {
      for (let j = i+1; j < coords.length; j++) {
        const nodes = getAllAntinodes(coords[i], coords[j])
        nodes.forEach(node => ANTINODES[node.join(',')] = node)
      }
    }
  })
}

function getAllAntinodes(a = [], b = []) {
  // get slope
  const [dx, dy] = [a[0] - b[0], a[1] - b[1]];
  // do slope in either direction until out of bounds
  const nodes = [];
  let curr = [a[0] + dx, a[1] + dy]
  while (inBounds(curr)) {
    nodes.push(curr)
    curr = [curr[0] + dx, curr[1] + dy]
  }

  curr = [b[0] - dx, b[1] - dy]
  while (inBounds(curr)) {
    nodes.push(curr)
    curr = [curr[0] - dx, curr[1] - dy]
  }
  console.log(nodes)
  return nodes;
}

function countAntinodes(antennas = ANTENNAS) {
  Object.entries(ANTENNAS).forEach(([antenna, coords]) => {
    // make all pairs
    console.log('ANTENNA', antenna)
    for (let i = 0; i < coords.length; i++) {
      for (let j = i+1; j < coords.length; j++) {
        const [node0, node1] = getAntinodes(coords[i], coords[j])
        // check if in bounds
        if (inBounds(node0)) {
          ANTINODES[node0.join(',')] = node0
        }
        if (inBounds(node1)) {
          ANTINODES[node1.join(',')] = node1
        }
      }
    }

  })
}

function inBounds(coord = []) {
  const [x,y] = coord;
  return x >= 0 && y >= 0 && x <= X_MAX && y <= Y_MAX;
}

function getAntinodes(a = [], b = []) {
  // get manhattan distance
  const [dx, dy] = [a[0] - b[0], a[1] - b[1]];
  // do manhattan distance in either direction
  const node0 = [a[0] + dx, a[1] + dy]
  const node1 = [b[0] - dx, b[1] - dy]
  return [node0, node1]
}

function parse(lines = []) {
  lines.forEach((line, y) => {
    y = Number(y)
    line.split('').forEach((node, x) => {
      x = Number(x)
      if (node !== '.') {
        if (node in ANTENNAS) {
          ANTENNAS[node].push([x,y])
        } else {
          ANTENNAS[node] = [[x,y]]
        }
        ANTENNAS_MAP[`${x},${y}`] = node
      }
      if (x > X_MAX) {
        X_MAX = x
      }
    })
    if (y > Y_MAX) {
      Y_MAX = y
    }
  })
}

module.exports = getAnswer;
