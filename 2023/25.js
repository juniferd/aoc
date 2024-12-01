const { readFile, writeFile } = require('../utils.js')

const GRAPH = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createGraph(lines)
  // createViz(file.split('.txt')[0])
  let cutSize = cutWires()
  while (cutSize.length > 3) {
    const start = +new Date()
    cutSize = cutWires()
    const end = +new Date()
    console.log("CUT", cutSize, cutSize.length)
    console.log("TOOK", end - start + "ms")
  }
  // cut at [ [ 'tjz', 'vph'  ], [ 'lnr', 'pgt'  ], [ 'jhq', 'zkt'  ]  ]
  // const cuts = [
  //   ['tjz', 'vph'],
  //   ['lnr', 'pgt'],
  //   ['jhq', 'zkt'],
  // ]
  // countComponents(cuts)
}

function countComponents(cuts) {
  const A = { [cuts[0][0]]: cuts[0][0] }
  const B = { [cuts[0][1]]: cuts[0][1] }
  const q = [
    { node: cuts[0][0], component: A },
    { node: cuts[0][1], component: B },
  ]

  for (let i = 0; i < q.length; i++) {
    const curr = q[i]
    const nexts = getNextNodes(curr.node)
    // console.log('curr', curr, 'next', nexts)
    nexts.forEach((next) => {
      if (!(next in curr.component)) {
        curr.component[next] = next
        q.push({ node: next, component: curr.component })
      }
    })
  }
  const aLength = Object.keys(A).length
  const bLength = Object.keys(B).length
  console.log(aLength, bLength, aLength * bLength)
  console.log(countVerticesEdges())

  function getNextNodes(node) {
    const nexts = []
    if (node in GRAPH) {
      GRAPH[node].forEach((next) => {
        const testEdge = [next, node].sort()
        if (!edgeIsCut(testEdge, cuts)) {
          nexts.push(next)
        }
      })
    }
    const nextEntries = Object.entries(GRAPH).filter(([_, nodes]) =>
      nodes.includes(node)
    )
    nextEntries.forEach(([next]) => {
      const testEdge = [next, node].sort()
      if (!edgeIsCut(testEdge, cuts)) {
        nexts.push(next)
      }
    })
    return nexts
  }

  function edgeIsCut(edge, cuts) {
    return (
      cuts.findIndex(([cutA, cutB]) => {
        return [cutA, cutB].sort().join(',') === edge.sort().join(',')
      }) > -1
    )
  }
}

function countVerticesEdges() {
  const VERTICES = {}
  const EDGES = {}
  Object.entries(GRAPH).forEach(([nodeA, connections]) => {
    connections.forEach((nodeB) => {
      const edge = [nodeA, nodeB].sort()
      EDGES[edge] = edge
      VERTICES[nodeA] = nodeA
      VERTICES[nodeB] = nodeB
    })
  })
  return {
    vertices: Object.keys(VERTICES).length,
    edges: Object.keys(EDGES).length,
  }
}

function createViz(input) {
  let str = 'strict graph wires {\n'
  str += '  node [fontname="Helvetica,Arial,sans-serif"]\n'
  Object.keys(GRAPH).forEach((node) => {
    str += `  ${node} -- { ${GRAPH[node].join(' ')} };\n`
  })
  str += '}'
  writeFile(`graph-25-${input}.txt`, str)
}

let ID = 0
function cutWires() {
  const VERTICES = {}
  const EDGES = {}
  const ORIGINS = {}
  Object.entries(GRAPH).forEach(([nodeA, connections]) => {
    connections.forEach((nodeB) => {
      const edge = [nodeA, nodeB].sort()
      EDGES[edge] = edge
      ORIGINS[edge] = [edge]
      VERTICES[nodeA] = nodeA
      VERTICES[nodeB] = nodeB
    })
  })

  console.log(Object.keys(EDGES).length)
  console.log('num vertices', Object.keys(VERTICES).length)

  // TODO min cut? max flow? kargers?
  while (true) {
    let keys = Object.keys(EDGES)
    if (keys.length == 1) {
      break
    }

    const rnd = Math.floor(Math.random() * keys.length)
    const randomEdge = EDGES[keys[rnd]]
    contract(EDGES, randomEdge)
  }
  console.log(Object.values(EDGES))
  console.log('----')
  let ret = []
  Object.values(EDGES).map(([a, b]) => {
    ret = ORIGINS[[a, b]]
  })

  return ret

  function contract(edges, edge) {
    // replace an edge [u, v] with new vertex uv
    edge.sort()
    if (edge in edges) {
      // EDGES[edge.join('')] = [edge.join('')]
      // delete all edges [u, v]
      delete edges[edge]
    } else {
      console.log('ERROR')
    }
    const [u, v] = edge
    const newVertex = 'edge' + ++ID

    // TODO: This is too slow. we should just look up the
    // neighbors of this edge
    Object.keys(edges).forEach((connection) => {
      const [nodeA, nodeB] = connection.split(',')

      let newEdge = []

      // for every edge [w, u] replace with [w, uv]
      // for every edge [w, v] replace with [w, uv]
      if (nodeA === u || nodeA === v) {
        newEdge = [newVertex, nodeB].sort()
      } else if (nodeB === u || nodeB === v) {
        newEdge = [nodeA, newVertex].sort()
      } else {
        return
      }

      delete edges[connection]
      if (!ORIGINS[newEdge]) {
        ORIGINS[newEdge] = []
      }
      ORIGINS[newEdge].push(...ORIGINS[connection])
      edges[newEdge] = newEdge
    })
  }
}

function createGraph(lines) {
  lines.forEach((line) => {
    let [node, connections] = line.split(/\:\s/)
    connections = connections.split(' ')
    GRAPH[node] = connections
  })
}

module.exports = getAnswer
