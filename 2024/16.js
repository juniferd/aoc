const { readFile } = require('../utils.js')
const PriorityQueue = require('../priorityQueue.js')

const WALLS = {}
const SQUARES = {};
const NEIGHBORS = {};
let X_MAX = 0;
let Y_MAX = 0;
let START = [];
let END = [];
const DIRS = {
  'N': [0, -1],
  'E': [1, 0],
  'S': [0, 1],
  'W': [-1, 0],
}

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  Object.values(SQUARES).forEach((coord) => {
    // form neighbors
    Object.values(DIRS).forEach(([dx, dy]) => {
      const neighbor = [coord[0] + dx, coord[1] + dy];
      if (neighbor.join(',') in SQUARES) {
        if (coord.join(',') in NEIGHBORS) {
          NEIGHBORS[coord].push(neighbor)
        } else {
          NEIGHBORS[coord] = [neighbor]
        }
      }
    })
  })
  const [points, path] = doPartOne()
  const turns = Math.floor(points / 1000)
  const steps = points - (turns * 1000);
  console.log('STEPS:', steps, 'TURNS:', turns, 'POINTS:', points)
  // doPartTwo(steps, turns)
  doPartTwo(points, path);
}

function doPartTwo(origPoints=0, origPath=[]) {
  const all = {}
  Object.values(SQUARES).forEach((square,i) => {
    console.log('i', i, i / Object.keys(SQUARES).length)
    const neighbors = NEIGHBORS[square];
    neighbors.forEach(neighbor => {
      if (square in all) return;
      const [pointsFromStart, pathFromStart] = doPartOne(START, neighbor, [1,0], origPoints)
      if (pointsFromStart > origPoints) return;
      console.log('POINTS START', pointsFromStart)
      const delta = [neighbor[0]-square[0], neighbor[1]-square[1]]
      const [pointsToEnd, pathToEnd] = doPartOne(square, END, delta, origPoints - pointsFromStart)
      console.log('POINTS END', pointsToEnd)
      if (origPoints === pointsFromStart + pointsToEnd +1) {
        console.log('FOUND')
        pathFromStart.forEach(sq => all[sq] = sq)
        pathToEnd.forEach(sq => all[sq] = sq)
      }
    })
  })
  console.log(Object.keys(all).length)
}

function doPartTwoB(steps=0, turns=0) {
  const targetPoints = 1000 * turns + steps;
  const stack = [{node: START, delta:[1,0], steps: 0, turns: 0, visited: {}}]
  let allVisited = {}
  while (stack.length > 0) {
    console.log('---', stack.length)
    const {node, delta, steps, turns, visited} = stack.pop()
    // console.log('testing', node, delta, steps, turns)
    const [x,y] = node;
    const points = 1000 * turns + steps;
    if (x === END[0] && y === END[1] && targetPoints === points) {
      console.log('end', x,y, visited)
      allVisited = {...allVisited, ...visited}
      continue;
    }
    if (points > targetPoints) continue;

    const key = node.join(',')
    if (key in visited) {
      // console.log('visited', node)
      continue;
    }

    visited[key] = points;
    
    const adjacents = NEIGHBORS[node]
    adjacents.forEach((adj) => {
      const [dx,dy] = [adj[0] - node[0], adj[1] - node[1]]
      const adjKey = adj.join(',')
      if (adjKey in visited) {
        // skip 
        // console.log('SKIP')
      } else {
        stack.push({
          node: adj,
          delta: [dx, dy],
          steps: steps + 1,
          turns: dx === delta[0] && dy === delta[1] ? turns : turns + 1,
          visited: {...visited},
        })
      }
    })
  }
  console.log(Object.keys(allVisited).length + 1)
}

function traversePath(curr=[], delta=[], stepsLeft=0, turnsLeft=0, paths=[], squares={}, cache={}) {
  // console.log('testing', curr, 'delta', delta, 'steps', stepsLeft, 'turns', turnsLeft)
  const cacheKey = `${curr}-${delta}-${stepsLeft}-${turnsLeft}`
  const [x,y] = curr;
  if (x === END[0] && y === END[1] && stepsLeft === 0 && turnsLeft === 0 ) {
    console.log('FOUND END', paths.join('->'))
    paths.forEach(sq => squares[sq] = sq)
    return;
  }

  if (cacheKey in cache) {
    console.log('VISITED')
    return;
  }
  
  if (stepsLeft === 0) return;
  if (turnsLeft === -1) return;

  cache[cacheKey] = paths;

  const prev = paths.pop();
  const nexts = NEIGHBORS[curr].filter(coord => {
    if (prev !== undefined) {
      return coord[0] !== prev[0] || coord[1] !== prev[1]
    }
    return true
  })

  if (prev !== undefined) {
    paths.push(prev)
  }
  paths.push(curr)
  nexts.forEach(next => {
    const nextDelta = next.map((n,i) => n - curr[i])
    const turned = nextDelta[0] !== delta[0] || nextDelta[1] !== delta[1]
    traversePath(next, nextDelta, stepsLeft - 1, turned ? turnsLeft - 1 : turnsLeft, paths, squares, cache)
  })
  paths.pop()
}

function doPartOne(start = START, end = END, deltaStart=[1,0], cap=Infinity) {
  // draw()
  // is this dijktras? 🦋

  const points = {}
  const prev = {}
  Object.values(SQUARES).forEach((coord) => {
    points[coord] = Infinity;
    prev[coord] = undefined;
  })
  points[start] = 0;

  const q = PriorityQueue();
  q.push({node: start, delta: deltaStart}, 0)

  while(q.length) {
    const curr = q.pop();
    const {node, delta} = curr[0]
    const nexts = NEIGHBORS[node]
    if (node[0] === end[0] && node[1] === end[1]) break;
    if (curr[1] > cap) {
      console.log('curr', curr[1], cap)
      return [Infinity, []];
    }
    nexts.forEach((next) => {
      // console.log('nexts', next)
      const nextDelta = [next[0] - node[0], next[1] - node[1]];
      const isSameDir = delta[0] === nextDelta[0] && delta[1] === nextDelta[1]
      const alt = points[node] + 1 + (isSameDir ? 0 : 1000);
      if (alt < points[next]) {
        // console.log('hey alt', alt, points[node], isSameDir)
        prev[next] = node;
        points[next] = alt;
        q.push({node: next, delta: nextDelta}, alt)
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
  return [points[end], path]
}

function draw(path='') {
  for (let y = 0; y <= Y_MAX; y++) {
    const row = [];
    for (let x = 0; x <= X_MAX; x++) {
      const coord = [x,y]
      const coordKey =coord.join(',')
      if (coordKey in WALLS) {
        row.push('#')
      } else if (x === START[0] && y === START[1]) {
        row.push('S')
      } else if (x === END[0] && y === END[1]) {
        row.push('E')
      } else if (path.includes(`-${coordKey}-`)) {
        row.push('O')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function traverseOld(curr=[], dir='E', steps=0, turns=0, cache={}, visited={}) {
  const key = `${curr}-${dir}-${steps}-${turns}`
  console.log('testing', key)
  if (curr[0] === END[0] && curr[1] === END[1]) {
    console.log('end', steps, turns)
    return getPoints(steps, turns)
  }
  if (key in cache) return cache[key]
  
  visited[curr] = steps;

  let nexts = getNexts(curr, dir, visited, steps)
  let inc = 1;

  // go forward until branch
  if (nexts.length === 1) {
    console.log('ONLY ONE DIRECTION', dir, nexts)
    const nextBranch = moveForward([...curr], dir)
    console.log('next branch', nextBranch)
    // let next = [curr[0], curr[1]]
    // let foundBranch = false;
    // while (!foundBranch) {
    //   if (next[0] === END[0] && next[1] === END[1]) {
    //     foundBranch = true;
    //     break;
    //   }
    //   next = [next[0] + nexts[0][1][0], next[1] + nexts[0][1][1]]
    //   nexts = getNexts(next, dir);
    //   inc += 1;
    //   if (nexts.length !== 1) {
    //     foundBranch = true;
    //   }
    // }
    // console.log('done')
  }

  const scores = nexts.map(([newDir, delta]) => 
    traverse(curr.map((c,i) => c + delta[i]), newDir, steps + inc, dir === newDir ? turns : turns + 1, cache, visited));
  console.log('scores', scores)
  const res = Math.min(...scores)
  cache[key] = res;

  return res;
}

function moveForward(curr=[], dir='E') {
  let steps = 0;

  let found = false;

  while (!found) {
    // check to see if more than 1 square open 
    // check if all walls
    // move forward
    const nexts = Object.values(DIRS).filter(delta => {
      const next = curr.map((c, i) => c + delta[i])
      const nextKey = next.join(',')
      if (nextKey in WALLS) return false;
      return true;
    })
    console.log('mf nexts', nexts)
    if (nexts.length === 1) {
      found = true;
      steps = Infinity;
    }
    if (nexts.length > 2) {
      found = true;
      curr = [curr[0] + DIRS[dir][0], curr[1] + DIRS[dir][1]]
    }
    if (nexts.length === 2) {
      steps += 1;
      curr = [curr[0] + DIRS[dir][0], curr[1] + DIRS[dir][1]]
    }
  }

  return [curr, steps]
}

function getNexts(curr=[], dir='E', visited={}, steps=0) {
  const nexts = Object.entries(DIRS).filter(([_, delta]) => {
    const next = curr.map((c,i) => c + delta[i]);
    const nextKey = next.join(',')
    if (nextKey in WALLS) return false;
    if (delta[0] * -1 === DIRS[dir][0] && delta[1] * -1 === DIRS[dir][1]) return false;
    if (nextKey in visited && visited[next] < steps) return false;
    return true;
  })
  
  console.log('nexts', nexts)
  return nexts;
}

function getPoints(steps=0, turns=0) {
  return turns * 1000 + steps
}

function parse(lines = []) {
  lines.forEach((line,y) => {
    line.split('').forEach((char, x) => {
      const coord = [x,y]
      if (char === '#') {
        WALLS[coord] = coord
      } else if (char === 'S') {
        START = coord
        SQUARES[coord] = coord
      } else if (char === 'E') {
        END = coord
        SQUARES[coord] = coord
      } else if (char === '.') {
        SQUARES[coord] = coord
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
