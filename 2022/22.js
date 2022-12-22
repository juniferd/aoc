const { readFile } = require('../utils.js')
const MAP ={}
const X_RANGES = {}
const Y_RANGES = {}

function createMapInstructions(lines) {
  let instructions = [];
  let mapDone = false;
  let start = null;

  lines.forEach((line, j) => {
    const y = j + 1
    if (line === '') {
      mapDone = true;
    } else if (mapDone) {
      const regexp = /(\d+|R|L)/g
      instructions = line.match(regexp)
    } else {

      let minX = Infinity;
      let maxX = 0;

      line.split('').forEach((content, i) => {
        const x = i + 1
        if (start === null && content === '.') {
          start = [x,y]
        }
        if (x > maxX && content !== ' ') {
          maxX = x
        }
        if (x < minX && content !== ' ') {
          minX = x
        }
        if (x in X_RANGES) {
          if (y > X_RANGES[x][1] && content !== ' ') {
            X_RANGES[x][1] = y
          }
          if (y < X_RANGES[x][0] && content !== ' ') {
            X_RANGES[x][0] = y
          }
        } else {
          if (content !== ' ') {
            X_RANGES[x] = [y,y]
          }
        }

        if (content !== ' ') {
          MAP[[x, y]] = content;
        }
      })

      Y_RANGES[y] = [minX, maxX]
    }
  })
  return {instructions, start}
}

function getNewPosition(currPos, dir) {
  const [x, y] = currPos;
  let newPos
  let foundNextPosition = false;

  if (dir === '>') {
    newPos = [x + 1, y] 
    if (!(newPos in MAP)) {
      newPos = [Y_RANGES[y][0], y]
    }
  } else if (dir === '<') {
    newPos = [x - 1, y]
    if (!(newPos in MAP)) {
      newPos = [Y_RANGES[y][1], y]
    }
  } else if (dir === '^') {
    newPos = [x, y - 1]
    if (!(newPos in MAP)) {
      newPos = [x, X_RANGES[x][1]]
    }
  } else if (dir === 'v') {
    newPos = [x, y + 1]
    if (!(newPos in MAP)) {
      newPos = [x, X_RANGES[x][0]]
    }
  }
  return newPos;
}

function move(pos, num, dir) {
  // move until num done or hit a #
  let [x, y] = pos;
  let done = false;
  while (!done) {
    if (num === 0) return [x, y]
    const newPos = getNewPosition([x,y], dir)
    if (MAP[newPos] === '#') return [x, y]
    num -= 1;
    x = newPos[0]
    y = newPos[1]
  }
  return [x, y];
}

// clockwise
const DIRS = ['>', 'v', '<', '^']

function rotate(currDir, instruction) {
  const currIndex = DIRS.findIndex(dir => dir === currDir);

  if (instruction === 'R') {
    const newIndex = currIndex + 1;
    if (newIndex >= DIRS.length) return DIRS[0]
    return DIRS[newIndex] 
  } else {
    const newIndex = currIndex - 1;
    if (newIndex < 0) return DIRS[3];
    return DIRS[newIndex]
  }
}


function walkMap(start, instructions) {
  let currDir = '>'
  let currPos = start;
  instructions.forEach(instruction => {
    if (instruction === 'R' || instruction === 'L') {
      currDir = rotate(currDir, instruction)
      // rotate
    } else {
      // move
      const num = Number(instruction)
      currPos = move(currPos, num, currDir) 
    }
    // console.log('CURRPOS', currPos, 'DIR', currDir)
  })
  return {currPos, currDir}
}

function calculate(dir, pos) {
  const dirs = ['>', 'v', '<', '^'];
  return (1000 * pos[1] + 4 * pos[0] + dirs.findIndex(d => d === dir))
}

async function getMonkeyPosition(file='../input.txt') {
  const lines = await readFile(file);
  const {start, instructions} = createMapInstructions(lines);

  const {currDir, currPos} = walkMap(start, instructions)
  console.log(calculate(currDir, currPos))
}

module.exports = getMonkeyPosition;
