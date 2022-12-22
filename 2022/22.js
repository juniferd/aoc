const { readFile } = require('../utils.js')
const MAP ={}
const X_RANGES = {}
const Y_RANGES = {}
// clockwise
const DIRS = ['>', 'v', '<', '^']
const REGIONS = {}

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

const TRANSITIONS_2 = {
  '1,0': {
    '<' : {
      dest: [0,2], 
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return size - y + 1}
    },
    '^' : {
      dest: [0,3], 
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return x }
    },
  },
  '2,0': {
    '^' : {
      dest: [0,3], 
      dir: '^',
      xTransition: (x, y, size) => { return x },
      yTransition: (x, y, size) => { return size }
    },
    '>' : {
      dest: [1,2], 
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return size - y + 1}
    },
    'v' : {
      dest: [1,1], 
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return x }
    },
  },
  '1,1': {
    '>' : {
      dest: [2,0], 
      dir: '^',
      xTransition: (x, y, size) => { return y },
      yTransition: (x, y, size) => { return size }
    },
    '<' : {
      dest: [0,2], 
      dir: 'v',
      xTransition: (x, y, size) => { return y },
      yTransition: (x, y, size) => { return 1 }
    },
  },
  '1,2': {
    '>' : {
      dest: [2,0], 
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return size - y + 1}
    },
    'v' : {
      dest: [0,3], 
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return x }
    },
  },
  '0,2': {
    '^' : {
      dest: [1,1], 
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return x }
    },
    '<' : {
      dest: [1,0], 
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return size - y + 1 }
    },
  },
  '0,3': {
    '>' : {
      dest: [1,2], 
      dir: '^',
      xTransition: (x, y, size) => { return y },
      yTransition: (x, y, size) => { return size }
    },
    '<' : {
      dest: [1,0], 
      dir: 'v',
      xTransition: (x, y, size) => { return y },
      yTransition: (x, y, size) => { return 1 }
    },
    'v' : {
      dest: [2,0], 
      dir: 'v',
      xTransition: (x, y, size) => { return x },
      yTransition: (x, y, size) => { return 1 }
    },
  },
  
}

const TRANSITIONS = {
  '0,1': {
    '<' : {
      dest: [3,2], 
      dir: '^',
      xTransition: (x, y, size) => { return size - y + 1},
      yTransition: (x, y, size) => { return size }
    },
    '^': {
      dest: [2, 0],
      dir: 'v',
      xTransition: (x, y, size) => { return size - x + 1},
      yTransition: (x, y, size) => { return 1 }
    },
    'v' : {
      dest: [2, 2],
      dir: '^',
      xTransition: (x, y, size) => { return size - x + 1},
      yTransition: (x, y, size) => { return size }
    }
  },
  '1,1': {
    '^' : {
      dest: [2, 0],
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return x }
    },
    'v' : {
      dest: [2, 2],
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return size - x + 1}
    },
  } ,
  '2,1': {
    '>' : {
      dest: [3, 2],
      dir: 'v',
      xTransition: (x, y, size) => { return size - y + 1},
      yTransition: (x, y, size) => { return 1 }
    }
  },
  '2,0': {
    '<' : {
      dest: [1, 1],
      dir: 'v',
      xTransition: (x, y, size) => { return size - y + 1},
      yTransition: (x, y, size) => { return 1 }
    },
    '>' : {
      dest: [3, 2],
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return size - y + 1}
    },
    '^' : {
      dest: [0, 1],
      dir: 'v',
      xTransition: (x, y, size) => { return size - x + 1},
      yTransition: (x, y, size) => { return 1 }
    }
  },
  '2,2': {
    'v' : {
      dest: [0, 1],
      dir: '^',
      xTransition: (x, y, size) => { return size - x + 1},
      yTransition: (x, y, size) => { return size }
    },
    '<' : {
      dest: [1, 1],
      dir: '^',
      xTransition: (x, y, size) => { return size - y + 1},
      yTransition: (x, y, size) => { return size }
    }

  },
  '3,2': {
    'v' : {
      dest: [0, 1],
      dir: '>',
      xTransition: (x, y, size) => { return 1 },
      yTransition: (x, y, size) => { return size - x + 1}
    },
    '^' : {
      dest: [2, 1],
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return size - x + 1}
    },
    '>' : {
      dest: [2, 0],
      dir: '<',
      xTransition: (x, y, size) => { return size },
      yTransition: (x, y, size) => { return size - y + 1}
    }

  }



}

function getNewWrappedPosDir(normalizedX, normalizedY, region, cubeSize, dir) {
  const target = TRANSITIONS_2[region][dir];

  const newRegion = target.dest;
  const normPos = [target.xTransition(normalizedX, normalizedY, cubeSize), target.yTransition(normalizedX, normalizedY, cubeSize)];
  const denormPos = [normPos[0] + newRegion[0]*cubeSize, normPos[1] + newRegion[1]*cubeSize]
  const newDir = target.dir;

  const ret = [denormPos, newDir];
  console.log([normalizedX, normalizedY, region, dir], "TURNS INTO", ret)

  return ret;
}

function getNewCubePosition(currPos, dir, cubeSize) {
  const [x, y] = currPos;
  const region = REGIONS[[x,y]]
  let newPos
  let newDir = dir;
  const normalizedX = currPos[0] - (region[0] * cubeSize)
  const normalizedY = currPos[1] - (region[1] * cubeSize)

  if (dir === '>') {
    newPos = [x + 1, y] 
  } else if (dir === '<') {
    newPos = [x - 1, y]
  } else if (dir === '^') {
    newPos = [x, y - 1]
  } else if (dir === 'v') {
    newPos = [x, y + 1]
  }

  if (!(newPos in MAP)) {
    console.log("LOOKING UP", newPos)
    const [pos, wrappedDir] = getNewWrappedPosDir(normalizedX, normalizedY, region, cubeSize, dir)
    newPos = pos;
    newDir = wrappedDir
  }

  if (MAP[newPos] === '#') return {newPos: currPos, newDir: dir}
  console.log(dir, 'xy', x, y,  'region', region, newPos)
  return {newPos, newDir};

}

function move(pos, num, dir, cubeSize) {
  // move until num done or hit a #
  let [x, y] = pos;
  let done = false;
  let oldDir = dir;
  while (!done) {
    if (num === 0) return [[x, y], dir]
    let newPos;
    let newDir;
    if (cubeSize) {
      const res = getNewCubePosition([x,y], dir, cubeSize)
      newPos = res.newPos
      dir = res.newDir
      console.log('newDir', res.newDir)
    } else {
      newPos = getNewPosition([x,y], dir)
    }
    if (MAP[newPos] === '#') {
      console.log('HIT WALL')
      return [[x, y], dir]
    }
    num -= 1;
    x = newPos[0]
    y = newPos[1]
  }
  return [[x, y], dir];
}

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


function walkMap(start, instructions, cubeSize) {
  let currDir = '>'
  let currPos = start;
  instructions.forEach(instruction => {
    console.log('INSTRUCTION:', instruction, 'currPos', currPos, 'currDir', currDir)
    if (instruction === 'R' || instruction === 'L') {
      currDir = rotate(currDir, instruction)
      // rotate
    } else {
      // move
      const num = Number(instruction)
      const res = move(currPos, num, currDir, cubeSize)
      currPos = res[0]
      currDir = res[1]
    }
  })
  return {currPos, currDir}
}

function calculate(dir, pos) {
  const dirs = ['>', 'v', '<', '^'];
  console.log(pos[1], pos[0], dir, dirs.findIndex(d => d=== dir))
  return (1000 * pos[1] + 4 * pos[0] + dirs.findIndex(d => d === dir))
}

function inRange(x, xRange) {
  return x >= xRange[0] && x <= xRange[1]
}

function getRegions(start) {
  const n = Math.min(...Object.values(X_RANGES).map(([y0,y1]) => y1 - y0 + 1), ...Object.values(Y_RANGES).map(([x0,x1]) => x1 - x0 + 1))

  Object.keys(MAP).forEach((coord) => {
    let [x,y] = coord.split(',')
    const region = [Math.floor((Number(x) - 1) / n) , Math.floor((Number(y) - 1) / n)]
    REGIONS[coord] = region
  })
  // console.log(REGIONS)
  return n;

}
async function getMonkeyPosition(file='../input.txt') {
  const lines = await readFile(file);
  const {start, instructions} = createMapInstructions(lines);

  const n = getRegions()

  // const {currDir, currPos} = walkMap(start, instructions)
  const {currDir, currPos} = walkMap(start, instructions, n)
  console.log(calculate(currDir, currPos))
}

module.exports = getMonkeyPosition;
