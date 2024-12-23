const { readFile, writeFile } = require('../utils.js')

const MAP = {}
async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // generateDiGraph()
  console.log(MAP)
  // let biggest = 0;
  // Object.entries(MAP).forEach(([key, neighbors]) => {
  //   if (neighbors.length > biggest) {
  //     biggest = neighbors.length;
  //     console.log(key, neighbors, neighbors.length)
  //   }
  //
  // })
  // console.log(biggest)
  // partOne();
  partTwo();
}

function partTwo() {
  const allNodes = Object.keys(MAP);
  const visited = {};
  const connections = {};
  allNodes.forEach((node,i) => {
    console.log('node', node, i)
    getBestInterconnected(connections, visited, node)
    // console.log(connections)
  });

  console.log(connections);
  let max = 0;
  let best = '';
  Object.keys(connections).forEach(connection => {
    if (connection.length > max) {
      best = connection
      max = connection.length
    }
  })
  console.log(best)
}

function getBestInterconnected(connections={}, visited={}, node='') {
  const stack = [];
  stack.push({node, connected: {}})
  while (stack.length) {
    let {node, connected} = stack.pop();
    connected = {...connected}

    const connecteds = Object.keys(connected)
    const nexts = MAP[node];

    if (node === 'co' || node === 'de') {
      console.log('NODE', node, connected)
    }
    const connectedKeys = Object.keys(connected).sort().join(',')
    const key = connectedKeys + '-' + node;
    if (key in visited) return;
    visited[key] = true;
    // check every connections
    let every = true;

    connecteds.forEach(connection => {
      if (!(MAP[connection].includes(node))) {
        // console.log('return early', connection, node)
        every = false;
      }
    });
    console.log('EVERY?', every)
    if (!every) {
      const connectedKeys = Object.keys(connected).sort().join(',')
      connections[connectedKeys] = connectedKeys;
      continue;
    }
    // console.log('EVERY CONNECTED', node, connecteds)

    if (node in connected) {
      console.log('NODE CONNECTED', node, connected)
      const [newKey] = key.split('-')
      connections[newKey] = newKey;
      continue;
    }

    MAP[node].forEach(next => {
      const nextConnected = {...connected, [node]: node}
      if (node === 'co' || node === 'de') {
        console.log('NEXT', node, '->', next, nextConnected)
      }
      stack.push({node: next, connected: {...connected, [node]: node}})
    })
  }
}

function partOne() {
  // get sets of three where one computer name starts with t
  const subsetNodes = Object.keys(MAP).filter(key => key.startsWith('t'))
  console.log(subsetNodes)
  const visited = {}
  const connections = {}
  subsetNodes.forEach(node => {
    getAllConnections(connections, node)
  })
  console.log(connections)
  console.log(Object.keys(connections).length)
}

function getAllConnections(connections={}, node='') {
  const visited = {}
  const stack = []
  stack.push({node, path:[]})
  while (stack.length) {
    const {node, path} = stack.pop();

    console.log(node, path)
    const keyPath = [...path]
    const key = keyPath.sort().join(',')
    if (path.length === 3) {
      // check to make sure the last one is connected to first
      console.log('path', path, MAP[path[path.length - 1]])
      // console.log(MAP[path[path.length - 1]])
      if (MAP[path[path.length - 1]].includes(path[0])) {
        connections[key] = key
      }
      visited[key] = true;
      continue;
    }
    // if (key in visited) continue;
    visited[key] = true;
    // get next
    MAP[node].forEach(next => {
      if (!path.includes(next)) {
        stack.push({node: next, path: [...path, node]})
      }
    })
  }
}

// this isn't right lol
function traverse(node='', connected=[], visited={}, connections={}) {
  const key = connected.sort().join(',')
  if (key in visited) return visited[key]
  if (connected.length === 3) {
    console.log('found')
    connections[key] = connected
    return 1;
  }

  connected.push(node)
  console.log('node', node, MAP[node])
  const res = MAP[node].reduce((acc, cur) => acc + traverse(cur, connected, visited, connections), 0)
  connected.pop()

  visited[key] = res;

  return res;
}

function printGraph() {
  let str = ''
  Object.keys(MAP).forEach(key => {
    str += `${key} -- {${MAP[key].join(' ')}}\n`
  })
  return str;
  // return Object.keys(MAP).map(key => `${key}--${MAP[key]}\n`)
}
function generateDiGraph() {
  const content = `graph network {
${printGraph()}
}  
`
  writeFile('./output23.txt', content)
}

function parse(lines=[]) {
  lines.forEach(line => {
    const [a,b] = line.split('-')
    if (a in MAP) {
      MAP[a].push(b)
    } else {
      MAP[a] = [b]
    }
    if (b in MAP) {
      MAP[b].push(a)
    } else {
      MAP[b] = [a]
    }
  })
}

module.exports = getAnswer;
