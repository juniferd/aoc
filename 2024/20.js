const { readFile } = require('../utils.js')
const PriorityQueue = require('../priorityQueue.js')

const WALLS = {};
const SQUARES = {};
let X_MAX = 0;
let Y_MAX = 0;
let START = [];
let END = [];
const DELTAS = [[0, -1], [1, 0], [0, 1], [-1, 0]]

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)

  const path = constructPath();
  let dist = 0;
  while (path.length) {
    const curr = path.pop();
    SQUARES[curr] = dist;
    dist++
  }
  const CHEATS = {};
  Object.keys(SQUARES).forEach(square => {
    const VISITED = {};
    square = square.split(',').map(n => Number(n))
    const queue = PriorityQueue();
    queue.push({start: square, end: square}, 0);
    while(queue.length) {
      const [curr, dist] = queue.pop();
      // console.log('curr', curr, 'dist', dist)
      if (curr.end in VISITED) continue;
      VISITED[curr.end] = true;

      if (!(curr.end in WALLS)) {
        const arrKey = [curr.start, curr.end]
        arrKey.sort((a,b) => SQUARES[b] - SQUARES[a])
        const key = arrKey.join('-')
        if (key in CHEATS) continue;
        CHEATS[key] = getManhattanDistance(curr.start, curr.end)
      }

      const nexts = getAround(curr.end);
      nexts.forEach(next => {
        if (dist < 20 && inBounds(next)) {
          queue.push({start: curr.start, end: next}, dist + 1)
        }
      })
    }
  })
  console.log(CHEATS)
  const diffs = {}
  let tot = 0
  Object.entries(CHEATS).forEach(([cheat, len]) => {
    const [start, end] = cheat.split('-').map(coord => coord.split(',').map(n => Number(n)))
    const newTime = SQUARES[START] - SQUARES[start] + SQUARES[end] + len;
    const newDelta = SQUARES[START] - newTime
    if (newDelta in diffs) {
      diffs[newDelta] += 1
    } else {
      diffs[newDelta] = 1
    }
    if (newDelta >= 100) {
      // console.log('FOUND', newTime, start, end)
      tot += 1
    }
  })
  console.log(diffs)
  console.log(tot)
}

function getManhattanDistance(a=[], b=[]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function ugh() {
  const TUNNELS = {};
  Object.keys(SQUARES).forEach(square => {
    const VISITED = {};
    square = square.split(',').map(n => Number(n))
    const queue = PriorityQueue();
    queue.push({start:square, end:square}, 0);
    while (queue.length) {
      const [curr, dist] = queue.pop();
      if (curr.end in VISITED) continue;
      VISITED[curr.end] = true;
      // console.log('curr', curr)
      const nexts = getAround(curr.end)
      nexts.forEach(next => {
        const arrKey = [curr.start, next]
        arrKey.sort((a,b) => {
          return SQUARES[b] - SQUARES[a]
        })
        const key = arrKey.join('-')
        const newDist = dist + 1
        if (newDist > 20) {
          //console.log('too far')
        } else if (next in VISITED || !inBounds(next)) {
          // console.log('visited')
        } else if (key in TUNNELS) {
          // already visited
          // console.log('been here', key)
          if (TUNNELS[key] > newDist) {
            // console.log('replace')
            TUNNELS[key] = newDist
          }
        } else if (next[0] === END[0] && next[1] === END[1]) {
          TUNNELS[key] = newDist
        } else if (next in SQUARES) {
          if (next in SQUARES && newDist > 1) {
            TUNNELS[key] = newDist
          }
          queue.push({start: curr.start, end: next}, newDist)
        } else if(next in WALLS) {
          queue.push({start: curr.start, end: next}, newDist)
        } else {
          console.log('uhoh')
          // hmm
        }
      })
    }
  })
  let tot = 0
  const diffs = {}
  Object.entries(TUNNELS).forEach(([path, origLen]) => {
    const [start,end] = path.split('-').map(coord => coord.split(',').map(n => Number(n)))
    const length = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])
    // if (origLen !== length) {
    //   console.log('DIFF LENGTH', length, origLen, path)
    // }
    let newTime = SQUARES[START] - SQUARES[start] + SQUARES[end] + length;
    if (isEndBetween(start, end)) {
      newTime = SQUARES[START] - SQUARES[start] + SQUARES[end] + length + 2;
      console.log('END BETWEEN', start, end, newTime)
    } else {
      newTime = SQUARES[START] - SQUARES[start] + SQUARES[end] + length;
    }
    const newDelta = SQUARES[START] - newTime
    // if (isEndBetween(start, end)) {
    //   console.log('END BETWEEN', start, end, length, 'diff', newDelta)
    // }
    // if (start.join(',') === "9,7" && end.join(',') === '4,7') {
    //
    //   console.log('START',start,'END',end,'DIST', length, 'NEW TIME', newTime)
    // }
    // if ((newDelta === 52 || newDelta === 54 || newDelta === 60 || newDelta === 62) && origLen !== length) {
    //   console.log('START',start,'END',end,'MANHATTAN DIST', length, 'ORIGINAL DIST', origLen, 'NEW TIME', newTime)
    // }
    if (newDelta in diffs) {
      diffs[newDelta] += 1
    } else {
      diffs[newDelta] = 1
    }
    if (newDelta >= 100) {
      // console.log('FOUND', newTime, start, end)
      tot += 1
    }
  })
  console.log(diffs)
  // console.log(TUNNELS['131,139-133,139'])
  // console.log(TUNNELS['133,139-131,139'])
  // 1455 too low, 113692 too low, 227384 too low
  // 1033717 not right
  console.log('tot', tot)
}
function isEndBetween(a=[], b=[]) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const minX = Math.min(ax, bx)
  const maxX = Math.max(ax, bx)
  const minY = Math.min(ay, by)
  const maxY = Math.max(ay, by)
  const yMatch = minX < END[0] && END[0] < maxX && ay === END[1] && by === END[1]
  const xMatch = minY < END[1] && END[1] < maxY && ax === END[0] && bx === END[0] 
  return xMatch || yMatch
}

function doPartOne() {
  const [origLen, path] = shortestPath(Object.values(SQUARES), START, END, WALLS);
  console.log('ORIG', origLen)
  
  // try removing walls
  let tot = 0;
  const subsetWalls = getWallsToRemove();
  console.log(subsetWalls)
  subsetWalls.forEach(wall => {
    delete WALLS[wall]
    path.push(wall)
    const [len,nextPath] = shortestPath(path, START, END, WALLS)
    // console.log(nextPath)
    // draw(nextPath)
    console.log(wall, origLen - len)
    if (origLen - len >= 100) {
      tot += 1
    }
    WALLS[wall] = wall
    
  })
  console.log('tot', tot)

}

function getWallsToRemove() {
  const walls = {};
  Object.values(WALLS).forEach(coord => {
    const nextBlanks = getAround(coord)
      .map(next => WALLS[next] || !inBounds(next) ? '#' : '')
      .filter(next => next === '')
    if (nextBlanks.length > 1) {
      walls[coord] = coord
    }
  }) 
  return Object.values(walls);
}

function inBounds(coord=[]) {
  return coord[0] > 0 && coord[0] < X_MAX && coord[1] > 0 && coord[1] < Y_MAX
}

function getAround(coord=[]) {
  return DELTAS.map(delta => delta.map((d,i) => d + coord[i]));
}

function constructPath() {
  const path = [START];
  let found = false;

  while (!found) {
    const curr = path[path.length - 1];
    const prev = path[path.length - 2];
    const next = getNext(curr, prev)
    path.push(next)
    if (next[0] === END[0] && next[1] === END[1]) {
      found = true;
    }
  }
  console.log(path, path.length)
  return path
}

function getNext(curr=[], prev=[]) {
  let next = []
  DELTAS.forEach(([dx, dy]) => {
    const coord = [curr[0] + dx, curr[1] + dy];
    if (!(coord in WALLS)) {
      if (prev !== undefined) {
        if ((coord[0] !== prev[0] || coord[1] !== prev[1])) {
          next = coord
        }
      } else {
        next = coord
      }
    }
  })
  return next
}

function draw(path=[], blocks=WALLS, size=[X_MAX, Y_MAX]) {
  const PATH = {}
  path.forEach(sq => PATH[sq] = sq)
  for (let y = 0; y <= size[1]; y++) {
    const row = []
    for (let x = 0; x <= size[0]; x++) {
      const coord = [x,y]
      if (coord in blocks) {
        row.push('#')
      } else if (x === START[0] && y === START[1]) {
        row.push('S')
      } else if (x === END[0] && y === END[1]) {
        row.push('E')
      } else if (coord in PATH) {
        row.push('O')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function shortestPath(squares = [], start=START, end=END, blocks=WALLS) {
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
    // console.log(curr)
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

function getNeighbors(node=[], blocks=WALLS) {
  const nexts = []
  DELTAS.forEach((delta) => {
    const coord = node.map((n, i) => n + delta[i])
    if (!(coord in WALLS)) {
      nexts.push(coord)
    }
  })
  return nexts
}

function parse(lines = []) {
  lines.forEach((line, y) => {
    line.split('').forEach((chr, x) => {
      const coord = [x,y]
      if (chr === '#') {
        WALLS[coord] = coord
      } else if (chr === 'S') {
        START = coord
        SQUARES[coord] = coord
      } else if (chr === 'E') {
        END = coord
        SQUARES[coord] = coord
      } else {
        SQUARES[coord] = coord
      }
      if (x > X_MAX) {
        X_MAX = x;
      }
    })
    if (y > Y_MAX) {
      Y_MAX = y;
    }
  });
}

module.exports = getAnswer;
