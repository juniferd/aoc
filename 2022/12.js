const { readFile } = require('../utils.js')

function createElevation(lines) {
  let starts = []
  let start = [0, 0]
  let end = [0, 0]
  const elevs = {}

  lines.forEach((line, i) => {
    line.split('').forEach((elev, j) => {
      if (elev === 'S') {
        start = [i, j]
        elevs[[i, j]] = 0
        starts.push([i, j])
      } else if (elev === 'E') {
        end = [i, j]
        elevs[[i, j]] = 25
      } else if (elev === 'a') {
        starts.push([i, j])
        elevs[[i, j]] = elev.charCodeAt(0) - 97
      } else {
        elevs[[i, j]] = elev.charCodeAt(0) - 97
      }
    })
  })

  return { elevations: elevs, end, start, starts }
}

function getAdjacentIndices(currPos, elevations) {
  const [i, j] = currPos.split(',')
  return [
    [+i + 1, +j],
    [+i - 1, +j],
    [+i, +j + 1],
    [+i, +j - 1],
  ].filter(
    (pos) =>
      pos.join(',') in elevations &&
      elevations[pos.join(',')] - elevations[currPos] <= 1
  )
}

function findSmallestDistInQ(queue, dist) {
  let min = Infinity
  let index
  queue.forEach((key, i) => {
    if (dist[key] < min) {
      min = dist[key]
      index = i
    }
  })
  const pos = queue[index]
  queue.splice(index, 1)
  return pos
}
// djikstra's?
function getMinSteps(currPos, elevations, endPos) {
  const dist = {}
  const prev = {}
  const queue = []

  Object.keys(elevations).forEach((elev) => {
    dist[elev] = Infinity
    prev[elev] = undefined
    // queue.push(elev);
  })
  queue.push(currPos.join(','))

  dist[currPos.join(',')] = 0

  // console.log(elevations)
  while (queue.length) {
    // get the u with min dist
    const uIndex = findSmallestDistInQ(queue, dist)
    if (uIndex === undefined) {
      break;
    }
    // console.log('uIndex', uIndex, dist[uIndex])
    if (uIndex === endPos.join(',')) break;

    const neighbors = getAdjacentIndices(uIndex, elevations)
    
    neighbors.forEach((neighbor) => {
      const alt = dist[uIndex] + 1
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt
        prev[neighbor] = uIndex
        queue.push(neighbor.join(','));
      }

    })
  }
  // for (let i = 0; i < 5; i++) {
  //   const arr = []
  //   for (let j = 0; j < 8; j++) {
  //     const pos = `${i},${j}`;
  //     arr.push(dist[pos] < 10 ? ` ${dist[pos]}` : dist[pos])
  //   }
  //   console.log(arr.join(' '))
  // }
  /// console.log(dist, prev)

  return dist[endPos.join(',')]
  // const stack = [];
  // let u = endPos.join(',');
  // if (prev[u] || u === '0,0') {
  //   while (u) {
  //     stack.unshift(u);
  //     u = prev[u]
  //   }
  // }
  // console.log(stack)
  // console.log(stack.length - 1)
}

async function getShortestSteps(file = '../input.txt') {
  const lines = await readFile(file)
  const { elevations, start, end } = createElevation(lines)
  // console.log(elevations, end.join(','))
  getMinSteps(start, elevations, end)
}

async function getAllAShortestSteps(file = '../input.txt') {
  const lines = await readFile(file)
  const { elevations, starts, end } = createElevation(lines)
  
  let min = Infinity;

  // console.log(elevations, end.join(','))
  starts.forEach((start, i) => {
    const steps = getMinSteps(start, elevations, end)
    console.log(i, steps)
    if (steps < min) {
      min = steps
    }
  })
  console.log(min)
}

module.exports = getAllAShortestSteps
