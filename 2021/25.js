const { readFile } = require('../utils.js')

const MAP_SOUTH = {}
const MAP_EAST = {}
const NEXT_TURN = {}
let X_MAX = 0;
let Y_MAX = 0;

function initializeMap(lines) {
  lines.forEach((row, y) => {
    if (y > Y_MAX) {
      Y_MAX = y
    }
    row.split('').forEach((cuke, x) => {
      if (x > X_MAX) {
        X_MAX = x
      }
      
      if (cuke === 'v') {
        MAP_SOUTH[[x,y]] = 'v';
      }
      if (cuke === '>') {
        MAP_EAST[[x,y]] = '>';
      }
    });
  })
}

function drawMap() {
  for (let y = 0; y <= Y_MAX; y++) {
    const row = []
    for (let x = 0; x <= X_MAX; x++) {
      const pos = [x, y];
      if (pos in MAP_EAST) {
        row.push('>')
      } else if (pos in MAP_SOUTH) {
        row.push('v')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function getNextTurns(dir) {
  const nextTurns = {}
  if (dir === '>') {
    // get east
    Object.keys(MAP_EAST).forEach((pos) => {
      let [x,y] = pos.split(',')
      x = Number(x)
      y = Number(y)
      const nextPos = [x === X_MAX ? 0 : x + 1, y];
      if (!(nextPos in MAP_EAST) && !(nextPos in MAP_SOUTH)) {
        nextTurns[nextPos] = [pos, '>']  
      }
    });
  } else {
    // get south
    Object.keys(MAP_SOUTH).forEach((pos) => {
      let [x,y] = pos.split(',')
      x = Number(x)
      y = Number(y)
      const nextPos = [x, y === Y_MAX ? 0 : y+1];
      if (!(nextPos in MAP_SOUTH) && !(nextPos in MAP_EAST)) {
        nextTurns[nextPos] = [pos, 'v']
      }
    });
  }
  return nextTurns;
}

function updateTurns(nextTurns) {
  Object.entries(nextTurns).forEach(([newPos, tuple]) => {
    const [oldPos, cuke] = tuple;
    // console.log('oldPos', oldPos, 'cuke', cuke, 'newPos', newPos)
    if (cuke === '>') {
      delete MAP_EAST[oldPos];
      MAP_EAST[newPos] = cuke;
    } else if (cuke === 'v') {
      delete MAP_SOUTH[oldPos];
      MAP_SOUTH[newPos] = cuke;
    }
  })
}

async function getSeaCucumberStep(file='../input.txt') {
  const lines = await readFile(file);
  initializeMap(lines)

  drawMap()

  // console.log(Object.keys(MAP_EAST).length , Object.keys(MAP_SOUTH).length)
  let i = 1;
  for (i; i < 620000; i++) {
    const nextTurnsEast = getNextTurns('>');
    updateTurns(nextTurnsEast)
    const nextTurnsSouth = getNextTurns('v');
    updateTurns(nextTurnsSouth)
    if (Object.keys(nextTurnsEast).length + Object.keys(nextTurnsSouth).length === 0) break;

    console.log('\nTURN', i);
    // drawMap()
  }
  console.log('TURN:', i)
}

module.exports = getSeaCucumberStep;
