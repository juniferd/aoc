const { readFile } = require('../utils.js')

let MAP = {}
let NEXT_TURNS = {}
let START
let END
let X_SIZE
let Y_SIZE

function createMap(lines) {
  lines.forEach((line, y) => {
    if (y === 0) {
      START = [line.indexOf('.'), y]
    } else if (y === lines.length - 1) {
      END = [line.indexOf('.'), y]
    } else {
      line.split('').forEach((tile, x) => {
        if (['>', '<', '^', 'v'].includes(tile)) {
          MAP[[x, y]] = [tile]
        }
      })
    }
  })
  X_SIZE = lines[0].length
  Y_SIZE = lines.length
}

function getBlizzardPos(x,y, dir) {
  let newPos = [x,y]
  if (dir === '<') {
    return [x > 1 ? x - 1 : X_SIZE - 2, y] 
  } else if (dir === '>') {
    return [x < X_SIZE - 2 ? x + 1 : 1, y]
  } else if (dir=== '^') {
    return [x, y > 1 ? y - 1 : Y_SIZE - 2]
  } else if (dir === 'v') {
    return [x, y < Y_SIZE - 2 ? y + 1 : 1]
  }
}

function simulateNextTurns() {
  NEXT_TURNS = {}
  Object.entries(MAP).forEach(([pos, dirs]) => {
    let [x,y] = pos.split(',');
    x = Number(x)
    y = Number(y)
    dirs.forEach((dir) => {
      const newPos = getBlizzardPos(x,y,dir)
      if (newPos in NEXT_TURNS) {
        NEXT_TURNS[newPos].push([pos, dir])
      } else {
        NEXT_TURNS[newPos] = [[pos, dir]]
      }
    })
  })  
}

function performTurns() {
  MAP = {}
  Object.entries(NEXT_TURNS).forEach(([newPos, oldPoss]) => {
    oldPoss.forEach(([oldPos, dir]) => {
      if (newPos in MAP) {
        MAP[newPos].push(dir)
      } else {
        MAP[newPos] = [dir]
      }
    })
  })
}

function drawMap() {
  const arr = Array(Y_SIZE).fill('.').map((_, y) => {
    let row = Array(X_SIZE).fill('.')
    if (y === 0 || y === Y_SIZE - 1) {
      row.fill('#')
    }
    row.fill('#',0,1)
    row.fill('#',X_SIZE - 1)
    return row;
  });
  arr[START[1]][START[0]] = '.'
  arr[END[1]][END[0]] = '.'
  Object.entries(MAP).forEach(([pos, tiles]) => {
    let [x,y] = pos.split(',')
    x = Number(x)
    y = Number(y)
    arr[y][x] = tiles.length === 1 ? tiles[0] : tiles.length;
  })
  arr.forEach((row) => console.log(row.join('')))
}

function getAdjacents(x, y) {
  const positions = [[x-1,y], [x+1, y], [x, y-1], [x, y+1]];
  return positions.filter((pos) => {
    if (pos.join(',') === END.join(',')) return true;
    if (pos.join(',') === START.join(',')) return true;
    if (pos in NEXT_TURNS) return false;
    if (pos[0] <= 0) return false;
    if (pos[0] >= X_SIZE - 1) return false;
    if (pos[1] <= 0) return false;
    if (pos[1] >= Y_SIZE -1) return false;
    return true;
  }) 
}
async function reachGoal(file = '../input.txt') {
  const lines = await readFile(file)
  createMap(lines)

  drawMap()
  let found = false
  let i = 0;
  let queue = [[[START[0], START[1]], 0]];
  const destinations = [END, START, END];

  while (destinations.length) {
    let next = []
    simulateNextTurns() 

    const seen = {}

    while (queue.length) {
      const [curr, time] = queue.shift();
      if (curr in seen) continue;
      if (curr.join(',') === destinations[0].join(',')) {
        destinations.shift();
        next = [[curr, time + 1]]
        console.log('time', time, curr)
        break;
      }
      if (curr in MAP) continue;
      // get all available open tiles
      const adjacents = getAdjacents(curr[0], curr[1])
      adjacents.forEach((adj) => {
        next.push([adj, time+1])
      })
      next.push([curr, time + 1])
      seen[curr] = true
    }

    queue = next;

    performTurns()
    i += 1
    console.log('\nTURN', i, '------')
    // drawMap()
  }
  
}

module.exports = reachGoal
