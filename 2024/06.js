const { readFile } = require('../utils.js')

let X_MAX = 0;
let Y_MAX = 0;
const OBSTACLES = {};
const VISITED = {};
let START = {dir: null, x: null, y: null};

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(START, X_MAX, Y_MAX)
  let foundExit = false;
  let currX = START.x;
  let currY = START.y;
  let currDir = START.dir
  while (!foundExit) {
    markOnMap(currX, currY, currDir);
    let {nextX, nextY, nextDir} = move(currX, currY, currDir)
    if (inBounds(nextX, nextY)) {
      currX = nextX;
      currY = nextY;
      currDir = nextDir;
    } else {
      foundExit = true;
    }
  }
  console.log(Object.keys(VISITED).length)

  draw(VISITED, OBSTACLES)
  // console.log(VISITED['7,7'])
  // Object.keys(VISITED).forEach(v => console.log(v))
  doPart2();
}

function doPart2() {
  let count = 0;
  Object.keys(VISITED).forEach((coord, i) => {
    // try adding a new obstacle at x,y
    let [x,y] = coord.split(',')
    x = Number(x)
    y = Number(y)
    // if (x === 3 && y === 6) {
    if (!(x === START.x && y === START.y)) {
      console.log(i, 'TEST OBSTACLE', x,y)
      const testObstacles = {...OBSTACLES};
      const key = `${x},${y}`
      testObstacles[key] = [x,y]

      let foundExit = false;
      let foundCycle = false;
      let currX = START.x;
      let currY = START.y;
      let currDir = START.dir
      let visited = {}
      while (!foundExit && !foundCycle) {
        // console.log('curr', currX, currY, currDir)
        markOnMap(currX, currY, currDir, visited);
        let {nextX, nextY, nextDir} = move(currX, currY, currDir, testObstacles)
        // find cycle
        const key = `${nextX},${nextY}`;
        if (key in visited && visited[key].findIndex(n => n === nextDir) > -1) {
          console.log('cycle found', visited[key])
          // draw(visited, testObstacles)
          foundCycle = true;
        } else if (inBounds(nextX, nextY)) {
          currX = nextX;
          currY = nextY;
          currDir = nextDir;
        } else {
          foundExit = true;
        }
      }
      if (foundCycle) {
        count += 1
      }
    }
  })
  console.log('count', count)
}

function draw(visited = {}, obstacles = {}) {
  for (let y = 0; y <= Y_MAX; y++) {
    let row = []
    for (let x = 0; x <= X_MAX; x++) {
      const key = `${x},${y}`;
      if (key in visited) {
        const dirs = visited[key]
        if (dirs.includes('v') || dirs.includes('^')) {
          if (dirs.includes('<') || dirs.includes('>')) {
            row.push('+')
          } else {
            row.push('|')
          }
        } else {
          row.push('-')
        }
      } else if (key in obstacles) {
        row.push('#')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function move(x = 0, y = 0, dir = '^', obstacles = OBSTACLES) {
  const [nextX, nextY] = getNextCoord(x, y, dir)
  const key = `${nextX},${nextY}`;
  if (key in obstacles) {
    // turn right
    if (dir === '^') return {nextX: x, nextY: y, nextDir: '>'}
    if (dir === '>') return {nextX: x, nextY: y, nextDir: 'v'}
    if (dir === 'v') return {nextX: x, nextY: y, nextDir: '<'}
    if (dir === '<') return {nextX: x, nextY: y, nextDir: '^'}
  }
  return {nextX, nextY, nextDir: dir}
}

function markOnMap(x = 0, y = 0, dir = '^', visited = VISITED) {
  const key = `${x},${y}`;
  if (key in visited) {
    visited[key].push(dir)
  } else {
    visited[key] = [dir]
  }
}


function inBounds(x = 0, y = 0) {
  return x > -1 && x <= X_MAX && y > -1 && y <= Y_MAX;
}

function getNextCoord(x = 0, y = 0, dir = '^') {
  if (dir === '^') {
    return [x, y-1]
  }
  if (dir === '>') {
    return [x+1, y]
  }
  if (dir === '<') {
    return [x-1, y]
  }
  if (dir === 'v') {
    return [x, y+1]
  }
}

function parse(lines = []) {
  lines.forEach((row, y) => {
    row.split('').forEach((char, x) => {
      if (['^', '>', '<', 'v'].includes(char)) {
        START.dir = char;
        START.x = x;
        START.y = y;
      }
      if (char === '#') {
        const key = `${x},${y}`;
        OBSTACLES[key] = [x,y];
      }
      if (x > X_MAX) {
        X_MAX = x
      }
      if (y > Y_MAX) {
        Y_MAX = y
      }
    })
  })
}

module.exports = getAnswer;
