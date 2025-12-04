const { readFile } = require('../utils.js')

const MAP = {}
let X = 0;
let Y = 0;

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  buildMap(lines);
  console.log(MAP)
  console.log(X, Y)
  // part one
  // let tot = 0
  // Object.keys(MAP).forEach((key) => {
  //   const [x, y] = key.split(',').map(n => parseInt(n))
  //   const numPaperAround = getPaperAround(x, y)
  //   console.log('x,y', x, y, 'total around', numPaperAround)
  //   if (numPaperAround < 4) {
  //     tot += 1
  //   }
  // })
  // console.log('tot', tot)

  // part two
  let removable = true;
  let tot = 0;
  while (removable) {
    let deleted = false;
    Object.keys(MAP).forEach((key) => {
      const [x, y] = key.split(',').map(n => parseInt(n))
      const numPaperAround = getPaperAround(x, y)
      // console.log('x,y', x, y, 'total around', numPaperAround)
      if (numPaperAround < 4) {
       delete MAP[key]
       deleted = true;
       tot += 1;
     }
    })
    if (!deleted) removable = false;
  }
  console.log('tot', tot)
}

function getPaperAround(x = 0, y = 0) {
  const adjs = getAdjacents(x, y)
  const count = adjs.reduce((res, coord) => {
    const [adjX, adjY] = coord;
    const key = `${adjX},${adjY}`
    if (key in MAP) {
      return res + 1
    }
    return res;
  }, 0)
  return count;
}

function getAdjacents(x = 0, y = 0) {
  const deltas = [-1, 0, 1]
  const adjs = [];
  deltas.forEach((xDelta) => {
    deltas.forEach((yDelta) => {
      const newX = xDelta + x;
      const newY = yDelta + y;
      if (newX === x && newY === y) {
        // console.log('skip')
      } else if (newX > -1 && newX <= X && newY > -1 && newY <= Y) {
        adjs.push([newX, newY])
      }
    })
  })
  return adjs;
}

function buildMap(lines=[]) {
  lines.forEach((line, yIndex) => {
    line.split('').forEach((sq, xIndex) => {
      const key = `${xIndex},${yIndex}`;
      if (sq === '@') {
        MAP[key] = sq
      }
      if (xIndex > X) {
        X = xIndex
      }
    })
    if (yIndex > Y) {
      Y = yIndex
    }
  })
}

module.exports = getAnswer;
