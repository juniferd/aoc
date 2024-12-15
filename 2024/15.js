const { readFile } = require('../utils.js')

const BOXES = {}
const WALLS = {}
let X_MAX = 0;
let Y_MAX = 0;
let ROBOT = [];
const MOVES = [];

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  // parse(lines)
  // doPartOne();
  parse(lines, true)
  draw(true)
  doPartTwo();
}

const DIR_MAP = {
  '<': [-1, 0],
  'v': [0, 1],
  '>': [1, 0],
  '^': [0, -1],
}

function doPartTwo() {
  MOVES.forEach((dir,i) => {
    // if (i < 110) {
      console.log('-----',i,'-----')
      console.log('dir',dir, 'original robot', ROBOT)
      moveTwo(dir)
    // }
  })
  draw(true)
  console.log('MOVES.length', MOVES.length)
  console.log(getGPS())
}

function moveTwo(dir = '>') {
  const [dx, dy] = DIR_MAP[dir];
  const next = [ROBOT[0] + dx, ROBOT[1] + dy]
  const nextKey = next.join(',')

  // check for wall
  if (nextKey in WALLS) return;
  // check for box left
  if (nextKey in BOXES) {
    moveBoxesTwo([dx, dy])
    return;
  }
  // check for box right
  // only the left side of the box is stored in BOXES
  const maybeNext = [next[0] - 1, next[1]]
  if (maybeNext.join(',') in BOXES) {
    moveBoxesTwo([dx, dy])
    return;
  }

  ROBOT = next;
}

function moveBoxesTwo(delta=[]) {
  // if moving left/right can just increment/decrement by two
  // if moving up/down need to find all touching boxes in that direction

  let boxes = [];

  // if y = 0 then moving l/r, start with robot
  if (delta[1] === 0) {
    boxes = moveBoxes([delta[0] * 2, delta[1]], [ROBOT[0] + (delta[0] === 1 ? delta[0] : delta[0] * 2), ROBOT[1] + delta[1]], true)
    console.log('MOVE BOXES LEFT RIGHT', boxes)
  } else {
    boxes = flood(delta)
    console.log('MOVE BOXES UP DOWN', boxes)
  }

  if (boxes.length > 0) {
    ROBOT = ROBOT.map((c,i) => c + delta[i])
    boxes.sort((a,b) => {
      if (delta[0] === -1) return a[0] - b[0]
      if (delta[0] === 1) return b[0] - a[0]
      if (delta[1] === -1) return a[1] - b[1]
      if (delta[1] === 1) return b[1] - a[1]
    })
    boxes.forEach((box) => {
      const newBox = box.map((c,i) => c + delta[i])
      delete BOXES[box];
      BOXES[newBox] = newBox;
    })
  }
  // return boxes;
}

function flood(delta = []) {
  let boxes = [];
  const dxs = [-1, 0, 1];
  let done = false;
  // does every touching box need to have space? if one box has wall does it prevent movement?
  let stack = [[ROBOT[0] -1, ROBOT[1] + delta[1]], [ROBOT[0], ROBOT[1] + delta[1]]];

  const testWalls = [];
  while (stack.length > 0) {
    const curr = stack.pop();
    const currKey = curr.join(',')
    console.log('test curr', curr)
    if (currKey in BOXES) {
      boxes.push(curr)
      dxs.forEach(dx => {
        const coord = [curr[0] + dx, curr[1] + delta[1]]
        stack.push(coord)
      })
    } else if (currKey in WALLS) {
      testWalls.push(curr)
    }
  }
  console.log('TEST WALLS', testWalls, 'BOXES', boxes)
  // are any of the walls directly above/below a box? if so, empty the box list
  for (let i = 0; i < testWalls.length; i++) {
    const wall = testWalls[i];
    const [left, right] = [-1,0].map(d => [wall[0] + d, wall[1] - delta[1]])
    console.log('l,r: ',left, right)
    const boxKeys = boxes.map(b => b.join(','))

    if (boxKeys.includes(left.join(',')) || boxKeys.includes(right.join(','))) {
      boxes = []
      break;
    }
  }
  return boxes;
}

function doPartOne() {
  MOVES.forEach((dir) => {
    // console.log('dir', dir, 'robot', ROBOT)
    move(dir)
  })
  draw()
  console.log(getGPS())
}

function getGPS() {
  let tot = 0
  Object.values(BOXES).forEach(box => {
    tot += 100 * box[1] + box[0]
  })
  return tot
}

function move(dir = '>') {
  const [dx, dy] = DIR_MAP[dir];
  const next = [ROBOT[0] + dx, ROBOT[1] + dy]
  const nextKey = next.join(',')

  // check for wall
  if (nextKey in WALLS) return;
  // check for box
  if (nextKey in BOXES) {
    const boxes = moveBoxes([dx, dy], [next[0], next[1]])
    if (boxes.length > 0) {
      const delta = [dx, dy]
      ROBOT = ROBOT.map((c,i) => c + delta[i])
      const oldCoord = boxes[0];
      const newCoord = boxes[boxes.length - 1].map((c,i) => c + delta[i]);
      delete BOXES[oldCoord];
      BOXES[newCoord] = newCoord;
    }
    return;
  }

  ROBOT = next;
}

function draw(partTwo = false) {
  for (let y = 0; y <= Y_MAX; y++) {
    const row = [];
    for (let x = 0; x <= X_MAX; x++) {
      const coord = [x,y]
      const coordKey = coord.join(',')
      if (coordKey in BOXES) {
        if (partTwo) {
          row.push('[')
        } else {
          row.push('0')
        }
      } else if (coordKey in WALLS) {
        row.push('#')
      } else if (ROBOT[0] === coord[0] && ROBOT[1] === coord[1]) {
        row.push('@')
      } else if (partTwo && [x-1,y].join(',') in BOXES) {
        row.push(']')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }

}

function moveBoxes(delta = [], curr=[], partTwo = false) {
  // add delta until hit space or wall
  let boxes = [];
  let done = false;
  // let curr = [ROBOT[0] + delta[0], ROBOT[1] + delta[1]]
  while (!done) {
    const currKey = curr.join(',')
    console.log('curr', curr)
    if (currKey in BOXES) {
      boxes.push(curr)
      curr = [curr[0] + delta[0], curr[1] + delta[1]]
      continue;
    }
    if (currKey in WALLS) {
      done = true;
      if (partTwo && delta[0] === -2) {
        // check for space before
        let testCoord = [curr[0] + 1, curr[1]]
        if (testCoord.join(',') in WALLS) {
          boxes = [];
        }
      } else {
        boxes = [];
      }
      break;
    }
    done = true;
  }

  return boxes
  
  // console.log('boxes', boxes)
}

function parse(lines = [], partTwo = false) {
  let mode = 'MAP'
  lines.forEach((line, y) => {
    if (mode === 'MAP') {
      const row = line.split('')
      if (row.length < 1) {
        mode = 'FISH'
      }
      row.forEach((char, x) => {
        const coord = [partTwo ? x*2 : x,y]
        let coord2;
        if (partTwo) {
          coord2 = [coord[0] + 1, coord[1]]
        }
        switch(char) {
          case '#':
            WALLS[coord] = coord
            if (partTwo) {
              WALLS[coord2] = coord2
            }
            break;
          case 'O':
            BOXES[coord] = coord;
            break;
          case '@':
            ROBOT = coord;
        }
        if (x > X_MAX) {
          X_MAX = x
        }
      })
      if (y > Y_MAX) {
        Y_MAX = y
      }
    } else {
      line.split('').forEach(dir => MOVES.push(dir))
    }
  })

  if (partTwo) {
    X_MAX = (X_MAX * 2) + 1
  }
}

module.exports = getAnswer;
