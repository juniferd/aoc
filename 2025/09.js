const { readFile } = require('../utils.js')
const fs = require("fs")

const MAP ={}
const VERTICES = []
let xMax= 0
let yMax = 0

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  readInput(lines)
  // part one
  // let largestArea = 0;
  // for (let i = 0; i < VERTICES.length; i++) {
  //   for (let j = i + 1; j < VERTICES.length; j++) {
  //     const a = VERTICES[i]
  //     const b = VERTICES[j]
  //     const area = getArea(a, b)
  //     if (area > largestArea) {
  //       console.log('largest found', a, b, area)
  //       largestArea = area;
  //     }
  //   }
  // }
  // console.log(largestArea)

  // part 2
  // originally just made an svg and looked at it in illustrator
  // makeSVG()
  // areas from visually eyeballed rectangles in illustrator
  // 1509880386
  // 1448913804
  // 1362604248
  // 89098 * 16989 = 1513685922 + 212174 = 1513898096
  // 1513792010
  // (89098 + 16989) * 2 = 212174
  // 88874 * 16989 = 1509880386 + 211726 = 1510092112
  // 89152
  // 4582310446

  const perimeter = getPerimeter()
  const yMap = getMinMax(perimeter)
  console.log(yMap)

  const allPairs = makePairs()
  let largestArea = 0;
  allPairs.forEach(([a,b]) => {
    const currVertices = [a, [a[0], b[1]], b, [b[0], a[1]]]
    // manually trim the circle in half :shrug: oh well
    // <= 48393, >= 50355
    if (Math.max(...currVertices.map(n => n[1])) <= 48393 || Math.min(...currVertices.map(n => n[1])) >= 50355) {
      // const currPerimeter = getPerimeter(currVertices)
      const valid = arePointsValid(currVertices, yMap)
      if (valid) {
        const area = getArea(a, b)
        if (area > largestArea) {
          console.log('largest area', a, b, area)
          largestArea = area
        }
      }
    }
    // console.log(getPerimeter([a,b]))
  })
  console.log(largestArea)
  
}

function arePointsValid(points=[], yMap={}) {
  for (let i = 0; i < points.length; i++) {
    const vertex = points[i]
    const [xMin, xMax] = yMap[vertex[1]]
    if (vertex[0] < xMin || vertex[0] > xMax) return false
  }
  return true;
}

function getMinMax(perimeter = []) {
  const yMap ={}
  perimeter.forEach(([x,y]) => {
    if (y in yMap) {
      const [xMin, xMax] = yMap[y]
      if (x < xMin) {
        yMap[y][0] = x
      }
      if (x > xMax) {
        yMap[y][1] = x
      }
    } else {
      yMap[y] = [x, x]
    }
  })
  return yMap
}

function makePairs() {
  const pairs = []
  for (let i = 0; i < VERTICES.length; i++) {
    for (let j = i + 1; j < VERTICES.length; j++) {
      const a = VERTICES[i]
      const b = VERTICES[j]
      pairs.push([a, b])
    }
  }
  return pairs
}


function getPerimeter(vertices=VERTICES) {
  const perimeter = [];
  let prev = vertices[0]
  for (let index = 1; index < vertices.length; index++) {
    const curr = vertices[index]
    const dir = getDir(prev, curr)
    // console.log('---')
    // console.log(prev, curr, dir)
    addToPerimeter(prev, curr, dir, perimeter) 
    prev = curr
  }
  // close the loop
  const curr = vertices[0]
  const dir = getDir(prev, curr)
  addToPerimeter(prev, curr, dir, perimeter)
  return perimeter
}

function addToPerimeter(prev, curr, dir, perimeter) {
    const length = getLength(prev, curr)
    for (let i = 0; i < length; i++) {
      const coord = [prev[0] + dir[0], prev[1] + dir[1]]
      // console.log(coord)
      perimeter.push(coord)
      prev = coord;
    }

}

function getLength(prev, curr) {
  const dx = curr[0] - prev[0]
  const dy = curr[1] - prev[1]
  return (Math.abs(dx) + Math.abs(dy))
}

function getDir(prev=[], curr=[]) {
  const dx = curr[0] - prev[0]
  const dy = curr[1] - prev[1]
  let normDx =dx / Math.abs(dx);
  let normDy = dy / Math.abs(dy);
  if (isNaN(normDx)) {
    normDx = 0
  }
  if (isNaN(normDy)) {
    normDy = 0
  }
  return [normDx, normDy]
  // if (normDx === 0 && normDy === 1) return 'S'
  // if (normDx === 0 && normDy === -1) return 'N'
  // if (normDx === 1 && normDy === 0) return 'E'
  // if (normDx === -1 && normDy === 0) return 'W'
}

function makeSVG() {
  const path = VERTICES.map((c, _) => `L ${c[0]/100} ${c[1]/100}`).join(" ")
  const lastNode = VERTICES[VERTICES.length - 1];
  const output = `M ${lastNode[0]/100} ${lastNode[1]/100}`;
  const outPath = `${output} ${path}`
  const svg = `<svg width="999" height="999" xmlns="http://www.w3.org/2000/svg">
    <path d="${outPath}" stroke="black"/>
  </svg>`
  fs.writeFile("./output.svg", svg, (err) => {})
}


function getArea(a=[], b=[]) {
  return (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1)
}

function readInput(lines=[]) {
  lines.forEach(line => {
    const coord = line.split(',').map(n => +n)
    MAP[coord] = coord
    VERTICES.push(coord)
  })
  const coords = Object.values(MAP)

  coords.forEach(coord => {
    const [x,y] = coord;
    if (x > xMax) {
      xMax = x
    }
    if (y > yMax) {
      yMax = y
    }
  })
  xMax += 1
  yMax += 1
}

module.exports = getAnswer;
