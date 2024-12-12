const { readFile } = require('../utils.js')

const MAP = {}
const PLANTS = {}
let X_MAX = 0;
let Y_MAX = 0;

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  const regions = getAreas({...PLANTS});
  getPerimeters(regions);
  getSides(regions);
  let tot = 0;
  Object.entries(regions).forEach(([plant, subRegions]) => {
    subRegions.forEach(region => {
      console.log(plant, region.area, region.sides)
      tot += region.area * region.sides
    })
  })
  console.log(tot)
}

function getSides(plants = {}) {
  Object.entries(plants).forEach(([plant, regions]) => {
    regions.forEach(region => {
      // check C F I M S
      // if (plant === 'O') {
        region.sides = getNumSides(plant, region)
      // }
      // region.sides = getNumSides(plant, region)
    })
  })
}

// TODO: lol wtf clean this up this is terrible

function getNumSides(plant = 'A', region = {}) {
  const {perimeterSquares} = region;

  // scan l,r,u,d
  let tot = 0;
  // console.log('perimeterSquares', perimeterSquares)
  const perimeterVisited = {}
  const zoomedPerimeter = zoom(Object.entries(perimeterSquares))
  console.log('zoomed', zoomedPerimeter)
  
  // draw(zoomedPerimeter, -2,9,19,30)

  let curr = Object.values(zoomedPerimeter).sort((a,b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])[0]
  let walkedAll = false;
  let dir, prevDir;
  let count = 1;

  // console.log(zoomedPerimeter)
  while (!walkedAll) {
    console.log('curr', curr)
    if (Object.keys(perimeterVisited).length === Object.keys(zoomedPerimeter).length) {
      walkedAll = true;
      break
    }
    perimeterVisited[curr.join(',')] = curr;
    const {cornerFound,next, dir:nextDir, prevDir: newPrevDir} = walk(curr, zoomedPerimeter, dir, prevDir, perimeterVisited)
    if (!nextDir) {
      console.log('stop here', count)
      // remove all the perimeter visited from zoomedPerimeter map
      Object.keys(perimeterVisited).forEach(key => {
        delete zoomedPerimeter[key]
      })
      if (Object.keys(zoomedPerimeter).length === 0) break;
      // reset
      curr = Object.values(zoomedPerimeter).sort((a,b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])[0]
      console.log(zoomedPerimeter)
      dir = undefined;
      prevDir = undefined;
      count += 1
      continue;
    }
    curr = next;
    dir = nextDir;
    prevDir = newPrevDir;
    if (cornerFound) {
      count += 1
    }
  }
  console.log('corners', plant, count)

  return count;
}
const DELTA_MAP = {
  "-1,0": "W",
  "1,0": "E",
  "0,-1": "N",
  "0,1": "S",
  "-1,-1": "NW",
  "-1,1": "SW",
  "1,-1": "NE",
  "1,1": "SE",
}
const DIRS_MAP = {
  'W': [-1,0],
  'E': [1,0],
  'N': [0, -1],
  'S': [0, 1],
  'NE': [1, -1],
  'NW': [-1, -1],
  'SE': [1, 1],
  'SW': [-1, 1],
}
const NEXT_DIRS = {
  'N': ['W','E','NW', 'NE'],
  'S': ['W','E','SE', 'SW'],
  'E': ['N','S','SE', 'NE'],
  'W': ['N','S','SW', 'NW'],
}
function walk(coord = [], perimeterMap = {}, dir = null, prevDir = null, visited ={}) {
  // console.log('CURR', coord, dir) 
  if (!dir) {
    // find direction
    const deltas = Object.keys(DELTA_MAP).map(delt => delt.split(',').map(n => Number(n)))
    for (let i = 0; i < deltas.length; i++) {
      const delta = deltas[i];
      const testCoord = [coord[0] + delta[0], coord[1] + delta[1]];
      if (testCoord.join(',') in perimeterMap) {
        // set dir
        dir = DELTA_MAP[delta.join(',')]
        break;
      }
    }
    return {next: coord, dir, prevDir: dir, cornerFound: false}
  }

  const delta = DIRS_MAP[dir];
  let nextCoord = coord.map((n, i) => n + delta[i]);
  if (nextCoord.join(',') in perimeterMap && !(nextCoord.join(',') in visited)) return {next: nextCoord, dir, prevDir, cornerFound: false}

  // find next direction
  const deltas = NEXT_DIRS[dir].map(d => DIRS_MAP[d])
  let nextDir
  for (let i = 0; i < deltas.length; i++) {
    const delta = deltas[i];
    const testCoord = [coord[0] + delta[0], coord[1] + delta[1]];
    // console.log('testing', testCoord)
    if (testCoord.join(',') in perimeterMap) {
      if (testCoord.join(',') in visited) {
        console.log('ALREADY VISITED', testCoord)
      } else {
        // set dir
        nextDir = DELTA_MAP[delta.join(',')]
        nextCoord = testCoord
        break;
      }
    }
  }
  // count corner here?
  // console.log('CORNER FOUND', coord)
  if (['NE','SE','NW','SW'].includes(nextDir)) {
    // set new direction
    const dirSet = new Set();
    nextDir.split('').forEach(d => dirSet.add(d))
    // console.log('dirSet', dirSet, 'prevDir', dir)
    dirSet.delete(dir)
    nextDir = dirSet.values().next().value
    // console.log('DIAGONAL FOUND')
  }
  return {next: nextCoord, dir: nextDir, prevDir: dir, cornerFound: true}
}

function draw(coords = {}, xMin = 10, xMax = 30, yMin = -2, yMax = 14 ) {
  for (let y = yMin; y <= yMax; y++) {
    const row = [];
    for (let x = xMin; x <= xMax; x++) {
      const key = [x,y].join(',')
      if (key in coords) {
        row.push('#')
      } else {
        row.push('.')
      }
    }
    console.log(row.join(''))
  }
}

function zoom(squares = [], mult = 3) {
  // console.log('squares', squares)
  const deltas = [-1, 0, 1];
  const zoomed = {}
  squares.forEach(([strCoord, dirs]) => {
    const coord = strCoord.split(',').map(n => Number(n)) 
    const centerCoord = [coord[0] * mult, coord[1] * mult];
    dirs.forEach(dir => {
      let newCoords;
      if (dir === 'U') {
        newCoords = deltas.map(delta => [centerCoord[0] + delta, centerCoord[1] - 1])
      }
      if (dir === 'D') {
        newCoords = deltas.map(delta => [centerCoord[0] + delta, centerCoord[1] + 1])
      }
      if (dir === 'L') {
        newCoords = deltas.map(delta => [centerCoord[0] - 1, centerCoord[1] + delta])
      }
      if (dir === 'R') {
        newCoords = deltas.map(delta => [centerCoord[0] + 1, centerCoord[1] + delta])
      }
      newCoords.forEach(newCoord => zoomed[newCoord.join(',')] = newCoord)
    })
  })
  return zoomed 
}


function scanOld(dir = 'R', squares=[], visited={}) {
  squares.sort((a,b) => {
    if (dir === 'R' || dir === 'L') return a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]
    if (dir === 'U' || dir === 'D') return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  })

  if (dir === 'R') {
    const minXSquares = []
    let pointerY = -1;
    let minX = Infinity;
    console.log(squares)
    squares.forEach(([x,y]) => {
      if (y === pointerY && x < minX) {
        minX = x
      } else if (y !== pointerY) {
        if (minX < Infinity) {
          minXSquares.push([minX, pointerY])
        }
        pointerY = y
        minX = x
      }
    })
    minXSquares.push([minX, pointerY])
    console.log('R', minXSquares)
    return countDeltas(minXSquares, 0, visited)
  }
  if (dir === 'L') {
    const maxXSquares = []
    let pointerY = -1;
    let maxX = -Infinity;
    squares.forEach(([x,y]) => {
      if (y === pointerY && x > maxX) {
        maxX = x
      } else if (y !== pointerY) {
        if (maxX > -Infinity) {
          maxXSquares.push([maxX, pointerY])
        }
        pointerY = y
        maxX = x
      }
    })
    maxXSquares.push([maxX, pointerY])
    console.log('L', maxXSquares)
    return countDeltas(maxXSquares, 0, visited)
  }
  if (dir === 'D') {
    const minYSquares = []
    let pointerX = -1;
    let minY = Infinity;
    squares.forEach(([x,y]) => {
      if (x === pointerX && y < minY) {
        minY = y
      } else if (x !== pointerX) {
        if (minY < Infinity) {
          minYSquares.push([pointerX, minY])
        }
        pointerX = x
        minY = y
      }
    })
    minYSquares.push([pointerX, minY])
    console.log('D', minYSquares)
    return countDeltas(minYSquares, 1, visited)
  }
  if (dir === 'U') {
    const maxYSquares = []
    let pointerX = -1;
    let maxY = -Infinity;
    squares.forEach(([x,y]) => {
      if (x === pointerX && y > maxY) {
        maxY = y
      } else if (x !== pointerX) {
        if (maxY > -Infinity) {
          maxYSquares.push([pointerX, maxY])
        }
        pointerX = x
        maxY = y
      }
    })
    maxYSquares.push([pointerX, maxY])
    console.log('U', maxYSquares)
    return countDeltas(maxYSquares, 1, visited)
  }
}

function countDeltas(squares = [], pos = 0, visited={}) {
  if (squares.length < 1) return 0
  let last = squares[0][pos]
  let count = 1;
  visited[squares[0].join(',')] = squares[0]
  for (let i = 1; i < squares.length; i++) {
    const curr = squares[i][pos]
    const key = squares[i].join(',')
    visited[key] = squares[i]
    if (curr !== last) {
      count += 1
      last = curr
    }
  }
  return count;
}


function getPerimeters(plants = {}) {
  Object.entries(plants).forEach(([plant, regions]) => {
    regions.forEach(region => {
      region.perimeter = getPerimeter(plant, region)
    })
  })
}

function getPerimeter(plant = 'A', region = {}) {
  const {visited} = region;
  region.perimeterSquares = {};
  const squares = Object.values(visited)
  let count = 0;
  while (squares.length > 0) {
    curr = squares.pop();
    const arounds = getAround(...curr);
    arounds.forEach((around, index) => {
      if (!inBounds(...around) || MAP[around.join(',')] !== plant) {
        count += 1
        const key = curr.join(',')
        const dir = getDirection(index)
        if (key in region.perimeterSquares) {
          region.perimeterSquares[key].push(dir)
        } else {
          region.perimeterSquares[key] = [dir]
        }
      }
    })
  }
  return count
}

function getDirection(index=0) {
  switch(index) {
    case 0:
      return 'L'
    case 1:
      return 'R'
    case 2:
      return 'U'
    case 3:
      return 'D'
  }
}

function getAround(x=0,y=0) {
  return [[x-1, y], [x+1, y], [x, y-1], [x, y+1]]
}

function getAreas(plants = PLANTS) {
  const areas = {}
  Object.entries(plants).forEach(([plant, coords]) => {
    const regions = [];
    while (coords.size > 0) {
      const {value: curr} = coords.values().next();
      const visited = {};
      flood(visited, curr, plant)
      let area = 0;
      Object.keys(visited).forEach(visitCoord => {
        coords.delete(visitCoord);
        area += 1
      })
      regions.push({visited, area})
    }
    console.log('plant:', plant, 'regions:', regions)
    areas[plant] = regions
  })
  return areas;
}

function flood(visited = {}, coord = "0,0", plant = 'A') {
  const [x,y] = coord.split(',').map(n => Number(n))
  visited[coord] = [x,y];
  const nexts = getAroundValid(x, y, plant, visited)
  nexts.forEach(next => {
    flood(visited, next.join(','), plant)
  })
}

function getAroundValid(x = 0, y = 0, plant = 'A', visited = {}) {
  return [[x-1, y], [x+1, y], [x, y-1], [x, y+1]]
    .filter((coord) => {
      const key = coord.join(',')
      return inBounds(...coord) && MAP[key] === plant && !(key in visited)
    })
}

function inBounds(x = 0, y = 0) {
  return x >= 0 && x <= X_MAX && y >= 0 && y <= Y_MAX;
}

function parse(lines=[]) {
  lines.forEach((line, y) => {
    line.split('').forEach((region, x) => {
      const key = [x,y].join(",")
      MAP[key] = region
      if (x > X_MAX) {
        X_MAX = x
      }
      if (region in PLANTS) {
        PLANTS[region].add(key)
      } else {
        PLANTS[region] = new Set();
        PLANTS[region].add(key)
      }
    })
    if (y > Y_MAX) {
      Y_MAX = y
    }
  })
}

module.exports = getAnswer;
