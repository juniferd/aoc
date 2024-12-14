const { readFile } = require('../utils.js')

const ROBOTS = {};
// test case is 11x7
// const X_MAX=11;
// const Y_MAX=7;
// actual input is 101x103
const X_MAX=101;
const Y_MAX=103;
async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // doPartOne()
  // 313,414 - vertically (101 diff) + 10 offset
  // 379,482 - horizontally (103 diff) + 70 offset
  // 101 * n + 10, 103 * n + 70
  let start = 70
  let end = 20000
  let step = 103
  let interval = setInterval(() => {
    doPartTwo(start)
    start += step;
    if (start === end) {
      clearInterval(interval)
      console.log('stop')
    }
  }, 1000)
}

function doPartTwo(i=100) {
    const coords = {}
    Object.values(ROBOTS).forEach(({startX, startY, velX, velY}) => {
      const coord = move(i, startX, startY, velX, velY);
      if (coord in coords) {
        coords[coord] += 1
      } else {
        coords[coord] = 1
      }
    })
    console.log('-----',i,'-----')
    draw(coords)
}

function doPartOne() {
  const coords = {}
  Object.values(ROBOTS).forEach(({startX, startY, velX, velY}) => {
    const coord = move(100, startX, startY, velX, velY);
    if (coord in coords) {
      coords[coord] += 1
    } else {
      coords[coord] = 1
    }
  })
  draw(coords)

  // quadrants
  const quads = [
    {xRange:[0,Math.floor(X_MAX / 2) - 1], yRange:[0, Math.floor(Y_MAX / 2) - 1]},
    {xRange:[Math.ceil(X_MAX / 2), X_MAX - 1], yRange:[0, Math.floor(Y_MAX / 2) - 1]},
    {xRange:[0,Math.floor(X_MAX / 2) - 1], yRange:[Math.ceil(Y_MAX / 2), Y_MAX - 1]},
    {xRange:[Math.ceil(X_MAX / 2), X_MAX - 1], yRange:[Math.ceil(Y_MAX / 2), Y_MAX - 1]},
  ]

  // console.log('quad range', quads)

  let tot = [0, 0, 0, 0];
  Object.entries(coords).forEach(([coord,num]) => {
    let [x,y] = coord.split(',')
    x = Number(x)
    y = Number(y)
    // console.log('testing', coord)
    quads.forEach(({xRange,yRange}, i) => {
      if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
        // console.log('valid', i)
        tot[i] += num
      }
    }) 
  })
  console.log(tot.reduce((acc,curr) => acc * curr, 1))
}

function draw(coords={}) {
  const graph =[]
  for (let y = 0; y < Y_MAX; y++) {
    const row = [];
    for (let x = 0; x < X_MAX; x++) {
      const key = `${x},${y}`;
      if (key in coords) {
        row.push(coords[key])
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
    graph.push(row)
  }
  return graph;
}

function move(turns=100, x=0, y=0, vx=0, vy=0) {
  const finalX = turns * vx + x
  const finalY = turns * vy + y
  
  let normalizedX = finalX % X_MAX;
  let normalizedY = finalY % Y_MAX;

  if (normalizedX < 0) {
    normalizedX = X_MAX + normalizedX
  }
  if (normalizedY < 0) {
    normalizedY = Y_MAX + normalizedY
  }
  return [normalizedX, normalizedY];
}

function parse(lines = []) {
  lines.forEach((line,i) => {
    const strMatch = /p\=(\-*\d*),(\-*\d*)\sv\=(\-*\d*),(\-*\d*)/
    let [_,startX,startY,velX,velY] = line.match(strMatch)
    startX = Number(startX)
    startY = Number(startY)
    velX = Number(velX)
    velY = Number(velY)
    ROBOTS[i] = {startX,startY,velX,velY}
  })
}


module.exports = getAnswer;
