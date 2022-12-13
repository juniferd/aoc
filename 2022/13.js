const { readFile } = require('../utils.js')

function assemblePairs(lines) {
  const pairs = [];
  let left;
  let right;
  lines.forEach((line) => {
    if (line === '') {
      pairs.push({left, right})
      left = null;
      right = null;
    } else if (!left) {
      left = eval(line)
    } else {
      right = eval(line)
    }
  })
  pairs.push({left, right})
  return pairs;
}

function isOrdered({left, right}, cache) {
  console.log('-----')
  // console.log('l: ', JSON.stringify(left)) 
  // console.log('r: ', JSON.stringify(right))

  // const key = `${JSON.stringify(left)}-${JSON.stringify(right)}`
  // if (key in cache) return cache[key];
  let curr = 0;
  for (let i = 0; i < left.length && i < right.length; i++) {
    const currLeft = left[i];
    const currRight = right[i];
    console.log('currLeft', currLeft)
    console.log('currRight', currRight)
    if (Array.isArray(currLeft) && Number.isInteger(currRight)) {
      curr = isOrdered({left: currLeft, right: [currRight]}, cache);
      if (curr != 0) { return curr }
    }
    if (Number.isInteger(currLeft) && Array.isArray(currRight)) {
      curr = isOrdered({left: [currLeft], right: currRight}, cache)
      if (curr != 0) { return curr; }
    }
    if (Number.isInteger(currLeft) && Number.isInteger(currRight)) {
      if (currLeft === currRight) continue;
      return currLeft < currRight ? -1 : 1;
    }
    if (Array.isArray(currLeft) && Array.isArray(currRight)) {
      curr = isOrdered({left: currLeft, right: currRight}, cache)
      if (curr != 0) { return curr }
    }
  }
  if (left.length > right.length) return 1;
  if (right.length > left.length) return -1;

  // cache[key] = curr;

  console.log('l? ', JSON.stringify(left))
  console.log('r? ', JSON.stringify(right))
  console.log('in order? ', curr)
  return 0;
}

function getIndicesOrderedPairs(allPairs) {
  const cache = {}
  const indices = [];

  allPairs.forEach((pairs, i) => {
    console.log('\n')
    console.log('testing', i + 1)
    console.log('start l:', JSON.stringify(pairs.left))
    console.log('start r:', JSON.stringify(pairs.right))
    const ordered = isOrdered(pairs, cache)
    console.log('ordered? ', i + 1, ordered)
    if (ordered == -1) {
      indices.push(i + 1)
      // console.log(JSON.stringify(pairs.left))
      // console.log(JSON.stringify(pairs.right))
      // console.log('---')
    }
  })
  console.log('indices', indices)
  return indices;
}

async function getSumOrderedPairs(file='../input.txt') {
  const lines = await readFile(file);
  const pairs = assemblePairs(lines)

  const indices = getIndicesOrderedPairs(pairs)
  console.log(indices.reduce((acc, i) => acc + i, 0))
}

function assemblePackets(lines) {
  const pairs = [[[2]], [[6]]];
  lines.forEach((line) => {
    if (line === '') {
      return;
    } else {
      pairs.push(eval(line))
    }
  })
  return pairs;
}
async function getSortedPackets(file='../input.txt') {
  const lines = await readFile(file);
  const packets = assemblePackets(lines)

  const indices = []
  packets.sort((a, b) => isOrdered({left: a, right: b}))

  packets.forEach((packet, i) => {
    if (JSON.stringify(packet) === JSON.stringify([[2]]) || JSON.stringify(packet) === JSON.stringify([[6]])) {
      indices.push(i + 1)
    }
  })

  console.log(indices.reduce((acc, curr) => acc * curr,1 ))
  
}

module.exports = getSortedPackets;
