const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const [start, MAP, xSize, ySize] = readInput(lines)
  console.log(start)
  console.log(MAP)
  console.log(xSize)
  console.log(ySize)
  runTachyon2(start, MAP, xSize, ySize)
}

function runTachyon2(start, MAP, xSize, ySize) {
  const cache = {}
  const paths = traverse(start, `${start}`,MAP, xSize, ySize, cache)
  console.log(paths)
}
function traverse(curr, path, MAP, xSize, ySize, cache) {
  if (path in cache) return cache[path]
  if (!isValid(curr[0], curr[1], xSize, ySize)) {
    console.log('curr', curr, path)
    return 1;
  }
  const nexts = getNext(curr, MAP, xSize, ySize)
  if (nexts === null) {
    console.log('curr', curr, path)
    return 1
  }
  const left = traverse(nexts[0], `${curr}-${nexts[0]}`, MAP, xSize, ySize, cache)
  let right = 0;
  if (nexts.length > 1) {
    right = traverse(nexts[1], `${curr}-${nexts[1]}`, MAP, xSize, ySize, cache)
  }
  const tot = left + right;
  cache[path] = tot;
  return tot;
}

function runTachyonDontUse(start, MAP,xSize, ySize) {
  const queue = [[start]]
  const visited = {}
  while (queue.length) {
    const currPath = queue.pop();
    // console.log('curr', currPath)
    const curr = currPath.pop();
    const next = getNext(curr, MAP, xSize, ySize)
    if (next !== null) {
      if (next.length === 2) {
        // create new path
      }
        next.forEach(n => {
          const nextPath = [...currPath]
          nextPath.push(curr)
          if ((nextPath in visited)) {
            delete visited[nextPath]
          }
          nextPath.push(n)
          visited[nextPath] = nextPath 
          queue.push(nextPath)
        })
    }
  }
  console.log(Object.keys(visited).length)

}

function runTachyon(start, MAP, xSize, ySize) {
  const queue = [start]
  let splits = 0;
  const visited = {}
  while (queue.length) {
    const curr = queue.pop();
    const next = getNext(curr, MAP, xSize, ySize)
    if (next !== null) {
      if (next.length === 2) {
        splits += 1
      }
      next.forEach(n => {
        if (!(n in visited)) {
          visited[n] = n
          queue.push(n)
        }
      })
    }
  }
  console.log(splits)
}
function getNext(curr, MAP, xSize, ySize) {
  const nextCoordX = curr[0]
  const nextCoordY = curr[1] + 1;
  if (!isValid(nextCoordX, nextCoordY, xSize, ySize)) return null;
  const key = [nextCoordX, nextCoordY]
  if (key in MAP) {
    // split
    const left = [nextCoordX - 1, nextCoordY]
    const right = [nextCoordX + 1, nextCoordY]
    const res = [];
    if (isValid(left[0], left[1], xSize, ySize)) {
      res.push(left)
    }
    if (isValid(right[0], right[1], xSize, ySize)) {
      res.push(right)
    }
    return res;
  }
  return [[nextCoordX, nextCoordY]]
}

function isValid(coordX, coordY, xSize, ySize) {
  return coordX >= 0 && coordX <= xSize && coordY >= 0 && coordY <= ySize;
}

function readInput(lines = []) {
  let start = [];
  const MAP = {}
  let xSize = 0;
  let ySize = 0;

  lines.forEach((line, row) => {
    line.split('').forEach((chr, col) => {
      if (col > xSize) {
        xSize = col;
      }
      if (chr === 'S') {
        start = [col, row]
      } else if (chr === '^') {
        const key = [col, row]
        MAP[key] = key
      }
    })
    if (row > ySize) {
      ySize = row
    }
  })

  return [start, MAP, xSize, ySize]
}

module.exports = getAnswer;
