const { readFile } = require('../utils.js')

async function getVisibleTrees(file = '../input.txt') {
  const lines = await readFile(file)
  const trees = lines.map((line) => line.split('').map((l) => +l))
  console.log(trees)
  const Y_SIZE = trees.length
  const X_SIZE = trees[0].length

  let visible = X_SIZE * 2 + (Y_SIZE - 2) * 2

  for (let i = 1; i < Y_SIZE - 1; i++) {
    for (let j = 1; j < X_SIZE - 1; j++) {
      const tree = trees[i][j]
      console.log(i, j, tree)
      const treesLeft = Array(j)
        .fill()
        .map((_, z) => trees[i][z])
      const treesRight = trees[i].slice(j + 1)
      const treesDown = Array(i)
        .fill()
        .map((_, z) => trees[z][j])
      const treesUp = Array(Y_SIZE - i - 1)
        .fill()
        .map((_, z) => trees[Y_SIZE - 1 - z][j])
      console.log('treesDown', treesUp)
      // every tree going down is less
      let t
      if (treesLeft.every((t) => t < tree)) {
        visible += 1
        continue
      }
      if (treesRight.every((t) => t < tree)) {
        visible += 1
        continue
      }
      if (treesDown.every((t) => t < tree)) {
        visible += 1
        continue
      }
      if (treesUp.every((t) => t < tree)) {
        visible += 1
        continue
      }
      // every tree going up is less
      // every tree going right is less
      // every tree going left is less
    }
  }
  console.log(visible)
}

function getTreeCount(trees, target) {
  const largestIndex = trees.findIndex((t) => t >= target)
  return largestIndex === -1 ? trees.length : largestIndex + 1
}

// this is the dumbest shit i've seen
function getScore(i, j, trees) {
  const tree = trees[i][j]
  let total = 1
  let index = i - 1
  let curr = 0

  // decrement by one, check tree
  for (y = i - 1; y > -1; y--) {
    if (trees[y][j] < tree) {
      curr += 1
    }
    if (trees[y][j] >= tree) {
      curr += 1
      break
    }
  }
  total *= curr
  curr = 0

  for (y = i + 1; y < trees.length; y++) {
    if (trees[y][j] < tree) {
      curr += 1
    }
    if (trees[y][j] >= tree) {
      curr += 1
      break
    }
  }
  total *= curr
  curr = 0

  for (x = j - 1; x > -1; x--) {
    if (trees[i][x] < tree) {
      curr += 1
    }
    if (trees[i][x] >= tree) {
      curr += 1
      break
    }
  }
  total *= curr
  curr = 0

  for (x = j + 1; x < trees[0].length; x++) {
    if (trees[i][x] < tree) {
      curr += 1
    }
    if (trees[i][x] >= tree) {
      curr += 1
      break
    }
  }
  total *= curr

  return total
}
async function getBestScenicScore(file = '../input.txt') {
  const lines = await readFile(file)
  const trees = lines.map((line) => line.split('').map((l) => +l))

  console.log(trees)
  const Y_SIZE = trees.length
  const X_SIZE = trees[0].length

  let best = 0

  for (let i = 1; i < Y_SIZE - 1; i++) {
    for (let j = 1; j < X_SIZE - 1; j++) {
      const tree = trees[i][j]
      console.log('---')
      console.log(i, j, tree)
      const treesToLeft = Array(j)
        .fill()
        .map((_, z) => trees[i][z])
        .reverse()
      console.log(treesToLeft, getTreeCount(treesToLeft, tree))

      const treesToRight = trees[i].slice(j + 1)
      console.log(treesToRight, getTreeCount(treesToRight, tree))

      const treesAbove = Array(i)
        .fill()
        .map((_, z) => trees[z][j])
        .reverse()
      console.log(treesAbove, getTreeCount(treesAbove, tree))

      const treesBelow = Array(Y_SIZE - i - 1)
        .fill()
        .map((_, z) => trees[z + i + 1][j])
      console.log(treesBelow, getTreeCount(treesBelow, tree))

      const score =
        getTreeCount(treesToLeft, tree) *
        getTreeCount(treesToRight, tree) *
        getTreeCount(treesAbove, tree) *
        getTreeCount(treesBelow, tree)
      // const score = getScore(i, j, trees)
      if (score > best) {
        console.log('best', tree, score)
        best = score
      }
    }
  }
  console.log(best)
}

module.exports = getBestScenicScore
