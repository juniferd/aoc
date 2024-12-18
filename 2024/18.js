const { readFile } = require('../utils.js')
const PriorityQueue = require('../priorityQueue.js')

const ORDERED = []
const MAP = {}
let X_MAX = 70;
let Y_MAX = 70;
const DELTAS = [[1,0], [-1,0], [0, 1], [0, -1]]

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // partOne();
  partTwo();
}

function partTwo() {
  for (let i = 1; i < ORDERED.length; i++) {
    const blocks = {};
    const ordered = ORDERED.slice(0,i+1);
    ordered.forEach(coord => blocks[coord] = coord)

    const squares = [];

    for (let i = 0; i <= X_MAX; i++) {
      for (let j = 0; j <= Y_MAX; j++) {
        const coord = [i, j];
        if (!(coord in blocks)) {
          squares.push(coord)
        }
      }
    }
    const [steps, path] = shortestPath(squares, [0,0], [70,70], blocks)
    console.log(ORDERED[i], steps)
    draw(path, blocks, 7)
    if (steps === Infinity) break;
  }
}

function partOne() {
  const squares = [];
  for (let i = 0; i <= X_MAX; i++) {
    for (let j = 0; j <= Y_MAX; j++) {
      const coord = [i, j];
      if (!(coord in MAP)) {
        squares.push(coord)
      }
    }
  }
  const [steps, path] = shortestPath(squares, [0,0], [70,70])
  console.log(steps)
  draw(path)

}

function draw(path=[], blocks=MAP, size=X_MAX) {
  const PATH = {}
  path.forEach(sq => PATH[sq] = sq)
  for (let y = 0; y <= size; y++) {
    const row = []
    for (let x = 0; x <= size; x++) {
      const coord = [x,y]
      if (coord in blocks) {
        row.push('#')
      } else if (coord in PATH) {
        row.push('O')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function shortestPath(squares = [], start=[0,0], end=[6,6], blocks=MAP) {
  const steps = {}
  const prev = {}
  squares.forEach((coord) => {
    steps[coord] = Infinity;
    prev[coord] = undefined;
  })
  steps[start] = 0;

  const q = PriorityQueue();
  q.push({node: start}, 0)

  while(q.length) {
    const curr = q.pop();
    const {node} = curr[0]
    if (node[0] === end[0] && node[1] === end[1]) break;
    // if (curr[1] > cap) {
    //   console.log('curr', curr[1], cap)
    //   return [Infinity, []];
    // }
    const nexts = getNeighbors(node, blocks)
    nexts.forEach((next) => {
      // console.log('nexts', next)
      const alt = steps[node] + 1;
      if (alt < steps[next]) {
        prev[next] = node;
        steps[next] = alt;
        q.push({node: next}, alt)
      }
    })
  }
  // console.log(points[end])

  // make path
  const path = [];
  let u = end;
  while (u !== undefined) {
    path.unshift(u)
    u = prev[u]
  }
  // draw(path.join('-'))
  return [steps[end], path]
}

function parse(lines = []) {
  // const max = 1024;
  lines.forEach((line,i) => {
    // if (i < max) {
      const coord = line.split(',')
      MAP[coord] = coord.map(c => Number(c))
    // }
    ORDERED.push(coord)
  });
}

function getNeighbors(coord=[], blocks={}) {
  const neighbors = []
  DELTAS.forEach(delta => {
    const neighbor = delta.map((d, i) => d + coord[i])
    if (!(neighbor in blocks) && inBounds(neighbor)) {
      neighbors.push(neighbor)
    }
  }) 
  return neighbors;
}

function inBounds(coord=[]) {
  const[x,y] = coord;
  return x >= 0 && x<=X_MAX && y >= 0 && x <=Y_MAX;
}

module.exports = getAnswer;
