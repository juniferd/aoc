const { readFile } = require('../utils.js')
const PriorityQueue = require('../priorityQueue.js')

CODES= []
const NUMPAD = [
  ['7','8','9'],
  ['4','5','6'],
  ['1','2','3'],
  ['', '0','A'],
]
const DIRPAD = [
  ['', '^', 'A'],
  ['<', 'v', '>'],
]
const NUM_POS ={}
const DIR_POS = {}
const DELTAS = [[-1,0], [1,0], [0,1], [0,-1]];

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(NUM_POS)
  console.log(DIR_POS)
  // partOne();
  partTwo();
}

function pruned(dirs=[]) {
  console.log(dirs[0])
  const filtered = dirs.filter(dir => {
    const changeCounts = dir.split('A')
      .map(dirsOnly => countChanges(dirsOnly))
      .filter(changeCount => changeCount > 2);
    return changeCounts.length === 0
  })
  console.log('filtered', filtered[0])
  return filtered
}
function countChanges(dirs='') {
  let changes = 0;
  let last = '';
  dirs.split('').forEach(dir => {
    if (dir !== last) {
      changes += 1;
      last = dir;
    }
  })
  return changes;
}
function partOne() {
  let tot = 0;
  CODES.forEach((code,i) => {
    //if (// i > 0) return;
    // if (code.join('') === '379A') {
    let dirs = getPossibleDirs(code)
    dirs = pruned(dirs)
    // const subProblems = getSubstrings(dirs)
    // console.log('sub problems', subProblems) 
    // const subAnswers = getSubAnswers(subProblems)
    for (let i = 0; i < 2; i++) {
      dirs = getAllPossibleDirs(dirs, true)
      dirs = pruned(dirs)
      console.log('num possible:',i, dirs.length)
    }

    // now validate
    // dirs2.forEach(d2 => {
    //   const d1 = getOutput(d2,[2,0],DIRPAD)
    //   const d0 = getOutput(d1,[2,0],DIRPAD)
    //   const final = getOutput(d0, [2,3], NUMPAD)
    //   if (final !== code.join('')) {
    //     console.log('MISMATCH', final, code)
    //   }
    // })
      const complexity = dirs[0].length * numeric(code.join(''))
      tot += complexity
      console.log(dirs[0].length, numeric(code.join('')), complexity, tot)

    // }
  })
  // 177436 too high
  // 176876 too high
  console.log(tot)
}

function getSubAnswers(subProblems=[]) {
  const answers = {}
  let startCoord = DIR_POS.A
  subProblems.forEach((targets, i) => {
    Object.keys(targets).forEach(target => {
      
    })
  })
  return answers;
}

function partTwo() {
  let tot = 0;
  CODES.forEach((code, j) => {
    
    // if (j > 0) return;
    // if (code.join('') === '379A') {
    console.log('CODE:', code)
    let dirs = getPossibleDirs(code)

    dirs = pruned(dirs)
    // for (let i = 0; i < 10; i++) {
    //   console.log('pruned dirs', dirs[0], dirs[0].length)
    //   dirs = getPossiblePartTwo(dirs)
    // }
    // console.log('pruned dirs', dirs[0], dirs[0].length)

    let minCost = Infinity;
    dirs.forEach(dir => {
      let start = 'A';
      const cache = {}
      let curTot = 0;
      dir.split('').forEach(d => {
        const cost = calculate(start, d, 0, 25, cache)
        start = d
        curTot += cost
      })
      console.log('tot', dir, curTot)
      if (curTot < minCost) {
        minCost = curTot
      }
    })
    const complexity = minCost * numeric(code.join(''))
    tot += complexity
    // console.log(dirs[0].length, numeric(code.join('')), complexity, tot)

    // }
  })
  console.log('TOT:', tot)
}

function calculate(prev='A', target='>',currDepth = 1, totDepth = 2, cache={}) {
  if (currDepth === totDepth) {
    return 1;
  }
  const key = `${prev}-${target}-${currDepth}`
  if (key in cache) return cache[key]

  const paths = getCommands(prev, target)
  
  // paths returns something like ['>^A', '^>A']
  const res = paths.map(path => {
    let prev = 'A'
    let currCost = 0;
    for (let i = 0; i < path.length; i++) {
      let curr = path[i];
      currCost += calculate(prev, curr, currDepth + 1, totDepth, cache)
      prev = curr;
    }
    return currCost;
  })
  cache[key] = Math.min(...res)
  return cache[key]
}
function getPossiblePartTwo(dirs=[]) {
  let allPossibles = [];
  dirs.forEach(dir => {
    const possibles = [];
    const stack = [];
    stack.push({start: 'A', pointer: 0, path: ''})
    while (stack.length) {
      const curr = stack.pop();
      if (curr.pointer === dir.length) {
        possibles.push(curr.path)
        continue;
      }
      const res = getCommands(curr.start, dir[curr.pointer], DIRPAD)
      res.forEach(p => {
        stack.push({start: dir[curr.pointer], pointer: curr.pointer + 1, path: curr.path + p})
      })
    }
    allPossibles = [...allPossibles, ...possibles]
  })
  allPossibles.sort((a, b) => a.length - b.length)
  //allPossibles.forEach(a => console.log(a.length))
  return allPossibles
}

function getDirsN(codes=[]) {
  let possibles = [];

  codes.forEach(code => {
    let currCode = '';
    for (let i = 0; i < code.length; i++) {
      const target = code[i];
      const last = currCode[currCode.length - 1]
      // const [dx, dy] = 
    }
    if (currCode !== '') {
      // generate all possible here
      console.log('TODO')
    }
  })
}

function numeric(code='') {
  console.log(code)
  const d = code.match(/(\d*)/)
  return Number(d[0])
}

function getAllPossibleDirs(dirs=[], shortest=false) {

  let minLen = Infinity;
  let possibles = [];
  dirs.forEach(dir => {
    const visited = {}
    const curPossibles = getPossibleDirs(dir, DIRPAD, 2, 0, visited)
    curPossibles.forEach(cur => {
      const curLen = cur.length;
      if (shortest) {
        if (curLen < minLen) {
          console.log('cur', curLen, cur)
          console.log('original', dir, dir.length)
          minLen = curLen
          possibles = [cur]
        } else if (curLen === minLen) {
          possibles.push(cur)
        }
      } else {
        possibles.push(cur)
      }
    })
  })
  return possibles;
}

function getCommands(start='A', target='^', pad=DIRPAD) {
  const posLookup = pad[0][0] === '7' ? NUM_POS : DIR_POS;
  const [startx, starty]= posLookup[start]
  const [endx, endy]= posLookup[target]
  const [dx, dy] = [endx - startx, endy - starty];
  // console.log(start, target, dx, dy, endx, endy)
  // dx = 2, dy = 2 >>vv or vv>>, avoiding blank button
  // dx = 2, dy = 1 >>v or v>>, avoiding blank button
  // dx = -1, dy = -1 <^ or ^<, avoiding blank button
  // dx = 0, dy = 1 v
  const count = Math.abs(dx) + Math.abs(dy)
  if (count === 0) {
    return ['A']
  }
  if (count === 1) {
    const deltaKey = [dx,dy].join(',')
    return [DELTA_DIR[deltaKey] + 'A']
  }
  const valid = [];
  const xKey = [Math.abs(dx) / dx, 0]
  const yKey = [0, Math.abs(dy) / dy]
  // validate corners
  if (pad[starty][dx + startx] !== '') {
    const xs = DELTA_DIR[xKey].repeat(Math.abs(dx)) + DELTA_DIR[yKey].repeat(Math.abs(dy))
    valid.push(xs + 'A')
  }
  if (pad[dy + starty][startx] !== '') {
  // if ([startx, dy].join(',') in posLookup) {
    const ys = DELTA_DIR[yKey].repeat(Math.abs(dy)) + DELTA_DIR[xKey].repeat(Math.abs(dx))
    valid.push(ys + 'A')
  }

  return valid
}
function getSubstrings(dirs = []) {
  const subProblems = []
  dirs.forEach(dir => {
    dir.split('').forEach((chr, i) => {
      if (i in subProblems) {
        if (chr in subProblems[i]) {
          subProblems[i][chr] += 1
        } else {
          subProblems[i][chr] = 1
        }
      } else {
        subProblems.push({[chr]: 1})
      }
    })
  })
  return subProblems;
}
function getPossibleDirs(code='', pad=NUMPAD, startX=2, startY=3, visited={}) {
  const q = PriorityQueue();
  q.push({x:startX, y:startY, path: '', pointer: 0}, 0)
  const possibles = []
  let minLen = Infinity;
  while (q.length) {
    const [cur] = q.pop()
    // console.log('CUR', cur)
    let {x,y,path,pointer} = cur;
    if (path in visited) continue;
    visited[path] = true

    // if (path.length > 10) return;
    if (path.length > minLen) continue;
    if (pointer === code.length) {
      if (path.length <= minLen) {
        minLen = path.length
        possibles.push(path)
      }
      continue;
    }
    const target = code[pointer]
    const btn = pad[y][x]
    // TODO: need caching or a way of skipping cycles
    if (btn === '') continue;
    if (btn === target) {
      q.push({x,y,path: path + 'A',pointer: pointer + 1}, path.length + 1)
      continue;
    }
    const adjacents = DELTAS.map(([dx, dy]) => {
      const nextX = dx + x;
      const nextY = dy + y;
      if (inBounds(nextX, nextY, pad)) {
        return pad[nextY][nextX]
      }
      return null;
    })
    if (adjacents.includes(target)) {
      const i = adjacents.findIndex(a => a === target)
      const [dx, dy] = DELTAS[i]
      q.push({x: x + dx, y: y + dy, path: path + direction(dx, dy), pointer}, path.length + 1)
      
      continue;
    }
    const posLookup = pad[0][0] === '7' ? NUM_POS : DIR_POS;
    // TODO: could probably do something with target deltas instead of blindly going through DELTAS - if target pos is 0,0 and we're at 1,2 it would never make sense to move > or v
    // also the best path to a non-adjacent square is going to be continuous directions
    // e.g., <<^ or ^<< will always be better than <^< 
    // get manhattan distance to next target then form ideal ways to get there
    // this doesn't work tho
    // const [dx, dy] = getDeltas(x,y,posLookup[target])
    // const xdir = Math.abs(dx) / dx;
    // const ydir = Math.abs(dy) / dy;
    // const xCount = Math.abs(dx)
    // const yCount = Math.abs(dy)
    //
    // const nextX = dx + x;
    // const nextY = dy + y;
    // q.push({x: nextX, y:nextY, path: path + direction(xdir,0).repeat(xCount) + direction(0,ydir).repeat(yCount), pointer }, path.length + xCount + yCount)
    // q.push({x: nextX, y:nextY, path: path + direction(0, ydir).repeat(yCount) + direction(xdir, 0).repeat(xCount), pointer }, path.length + xCount + yCount)


    DELTAS.forEach(([dx,dy]) => {
      const nextX = dx + x;
      const nextY = dy + y;
      const last = path.length === 0 ? '' : path[path.length - 1]
      if (inBounds(nextX, nextY, pad) && !isOpposite(dx,dy,last)) {
        q.push({x: nextX, y: nextY, path: path + direction(dx, dy), pointer}, path.length + 1)
      }
    })
  }
  return possibles
}

const DIR_DELTA = {
  '>': [1,0],
  '<': [-1, 0],
  'v': [0, 1],
  '^': [0, -1],
}

const DELTA_DIR = {
  '1,0': '>',
  '-1,0': '<',
  '0,1': 'v',
  '0,-1': '^',
}

function getDelta(dir='>') {
  if (dir === 'A') return null;
  return DIR_DELTA[dir] 
}

function getOutput(dirs='', curr=[], pad=NUMPAD) {
  let output = ''
  let [x,y] = curr; 
  dirs.split('').forEach(dir => {
    if (dir === 'A') {
      output += pad[y][x]
    } else {
      const [dx,dy] = getDelta(dir)
      x = x + dx;
      y = y + dy;
    }
  })
  return output
}

function getDeltas(x=0,y=0,targetCoord=[]) {
  const [targetX, targetY] = targetCoord;
  return [(targetX - x), (targetY - y)]
}

function isOpposite(dx=0,dy=0,lastDir='>') {
  if (lastDir === '>') return dx === -1 && dy === 0;
  if (lastDir === '<') return dx === 1 && dy === 0;
  if (lastDir === '^') return dx === 0 && dy === 1;
  if (lastDir === 'v') return dx === 0 && dy === -1;
  return false;
}

function direction(x=0, y=0) {
  if (x ===0) {
    if (y===-1) return '^'
    return 'v'
  }
  if (x === 1) return '>'
  return '<'
}
function inBounds(x=0,y=0, arr=[[]]) {
  return x >= 0 && x < arr[0].length && y>= 0 && y < arr.length;
}

function parse(lines = []) {
  lines.forEach(line => {
    CODES.push(line.split(''))
  });
  NUMPAD.forEach((row, y) => {
    row.forEach((num, x) => {
      if (num !== '') {
        NUM_POS[num] = [x,y]
      }
    })
  })
  DIRPAD.forEach((row, y) => {
    row.forEach((dir, x) => {
      if (dir !== '') {
        DIR_POS[dir] = [x,y]
      }
    })
  })
}



module.exports = getAnswer;
