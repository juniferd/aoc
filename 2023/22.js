const { readFile } = require('../utils.js')

BLOCKS = []
const DANGER_BLOCKS = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  makeBlocks(lines)
  BLOCKS.sort((a, b) => {
    const aZ = a[0][2]
    const bZ = b[0][2]
    return aZ - bZ
  })
  // console.log(BLOCKS)
  const settled = settleBricks()
  getDisintegrating({...settled})
  getChainReaction(settled)
}

function getChainReaction(SETTLED) {
  let count = 0;
  Object.keys(DANGER_BLOCKS).forEach((index) => {
    const settled = {...SETTLED}
    index = Number(index);
    const positions = BLOCKS[index]
    positions.forEach((pos) => {
      delete settled[pos]
    })
    for (let j = index + 1; j < BLOCKS.length; j++) {
      const testBlock = []
      BLOCKS[j].forEach((b) => testBlock.push([...b]))
      testBlock.forEach((pos) => {
        delete settled[pos]
      })
      move(testBlock, settled)
      // test if testBlock and original block is same
      if (!isSame(testBlock, BLOCKS[j])) {
        count += 1
      }
      testBlock.forEach((pos) => settled[pos] = j)
    }
    console.log('>', count)
    positions.forEach((pos) => (settled[pos] = index))
  })
  // 1062 - too low
  // 3347 - too low
  // 678899 - too high
  // lol why - 70727 ok
  console.log('chain reaction', count)
}

function getDisintegrating(settled) {
  let count = 0
  BLOCKS.forEach((positions, i) => {
    // try removing block
    positions.forEach((pos) => {
      delete settled[pos]
    })
    let canDisintegrate = true
    for (let j = i + 1; j < BLOCKS.length; j++) {
      const testBlock = []
      BLOCKS[j].forEach((b) => testBlock.push([...b]))
      testBlock.forEach((pos) => {
        delete settled[pos]
      })
      move(testBlock, settled)
      // test if testBlock and original block is same
      BLOCKS[j].forEach((pos) => {
        settled[pos] = j
      })
      if (!isSame(testBlock, BLOCKS[j])) {
        canDisintegrate = false
        DANGER_BLOCKS[i] = BLOCKS[i]
        continue
      }
    }
    positions.forEach((pos) => (settled[pos] = i))
    if (canDisintegrate) {
      // console.log('can disintegrate', positions)
      count += 1
    }
  })
  console.log('count', count)
}

function isSame(blockA, blockB) {
  const isSameLength = blockA.length && blockB.length
  if (!isSameLength) return false
  const test = {}
  blockA.forEach((posA) => {
    const index = blockB.findIndex(
      ([bx, by, bz]) => posA[0] === bx && posA[1] === by && posA[2] === bz
    )
    if (index > -1) {
      test[index] = posA
    }
  })
  return Object.keys(test).length === blockA.length
}

function settleBricks() {
  let settled = {}

  BLOCKS[0].forEach((pos) => (settled[pos] = 0))

  for (let i = 1; i < BLOCKS.length; i++) {
    const curr = BLOCKS[i]
    // const minZ = Object.values(curr).sort((a, b) => a[2] - b[2])[0][2]
    move(curr, settled)
    curr.forEach((pos) => (settled[pos] = i))
  }
  return settled
}

function move(positions, settled) {
  const notIntersecting = positions.every((pos) => {
    return !(pos in settled)
  })
  const onFloor = positions.find((pos) => pos[2] === 1)
  if (onFloor && notIntersecting) return
  if (notIntersecting) {
    // decrement until there is one intersection
    positions.forEach((pos) => {
      pos[2] -= 1
    })
    move(positions, settled)
  } else {
    // increment
    positions.forEach((pos) => {
      pos[2] += 1
    })
  }
}

function makeBlocks(lines) {
  lines.forEach((line, index) => {
    const [a, b] = line.split('~')
    const start = makePositions(a)
    const end = makePositions(b)

    const blocks = []
    for (let i = start.x; i <= end.x; i++) {
      for (let j = start.y; j <= end.y; j++) {
        for (let k = start.z; k <= end.z; k++) {
          const block = [i, j, k]
          blocks.push(block)
        }
      }
    }
    BLOCKS.push(blocks)
  })
}

function makePositions(pos) {
  return pos.split(',').reduce((acc, size, i) => {
    if (i === 0) {
      return { ...acc, x: Number(size) }
    } else if (i === 1) {
      return { ...acc, y: Number(size) }
    } else {
      return { ...acc, z: Number(size) }
    }
  }, {})
}

module.exports = getAnswer
