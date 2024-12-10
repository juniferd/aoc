const { readFile } = require('../utils.js')

const TRAILHEADS = {}
const SUMMITS = {}
const MAP = {}
let X_MAX = 0;
let Y_MAX = 0;

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  solve()
}

function solve() {
  let tot = 0;
  Object.values(TRAILHEADS).forEach((start) => {
    // move until can't or hit summit
    const visited = {};
    const ret = traverse(start, "", visited)
    console.log('return', ret)
    tot += ret;
  })
  console.log('TOTAL', tot)
}

function traverse(curr=[0,0], path="", visited={}) {
  const currKey = curr.join(',')
  
  path += `->${currKey}`
  if (currKey in SUMMITS) {
    console.log('FOUND',path)
    drawPath(path)
    // uncomment this for part one
    // if (currKey in visited) return 0
    // visited[currKey] = currKey
    return 1
  }
  const nexts = move(curr);
  const res = nexts.reduce((acc,next) => {
    return acc + traverse(next, path, visited)
  },0)
  //console.log('curr',curr,'nexts', nexts)
  return res;
}

function drawPath(path="") {
  const [_,...coords] = path.split('->')
  for (let y = 0; y <= Y_MAX; y++) {
    const row = []
    for (let x = 0; x <= X_MAX; x++) {
      const key = [x,y].join(',')
      if (coords.includes(key)) {
        row.push(MAP[key])
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

const DELTAS = [[-1,0], [1,0], [0, 1], [0, -1]];
function move(curr=[0,0]) {
  const nexts = [];
  DELTAS.forEach(([dx,dy]) => {
    const [x,y] = [curr[0] + dx, curr[1] + dy]
    if (inBounds(x,y) && isGradual(curr, [x,y])) {
      nexts.push([x,y])
    }
  })
  return nexts;
}

function isGradual(curr=[0,0], next=[0,0]) {
  const currKey = curr.join(',')
  const nextKey = next.join(',')
  return MAP[nextKey] - MAP[currKey] === 1;
}

function inBounds(x=0, y=0) {
  return x>=0 && x <=X_MAX && y >=0 && y<=Y_MAX;
}

function parse(lines = []) {
  lines.forEach((line, y) => {
    console.log('line', line)
    line.split('').forEach((height, x) => {
      height = Number(height);
      const coord = [x,y]
      const key = coord.join(',')
      if (height === 0) {
        TRAILHEADS[key] = coord
      } else if (height === 9) {
        SUMMITS[key] = coord
      }
      MAP[key] = height;
      if (x > X_MAX) {
        X_MAX = x
      }
    })
    if (y > Y_MAX) {
      Y_MAX = y
    }
  })
  console.log("----")
  console.log(TRAILHEADS)
  console.log("----")
  console.log(SUMMITS)
  console.log('X', X_MAX, "Y", Y_MAX)
}

module.exports = getAnswer;
