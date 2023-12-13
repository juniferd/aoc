const { readFile } = require('../utils.js')

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  const maps = assembleMaps(lines)
  console.log(maps)
  let sum = 0
  maps.forEach(({ pattern, rowMax, colMax }, index) => {
    const horizontals = checkHorizontalReflection(pattern, rowMax, colMax)
    const verticals = checkVerticalReflection(pattern, rowMax, colMax)
    maps[index].originalReflection = [horizontals, verticals]
    // sum += verticals
    // sum += 100 * horizontals
  })

  maps.forEach(({ pattern, rowMax, colMax, originalReflection }, index) => {
      const [horizontals, verticals] = findAlternateReflection(
        pattern,
        rowMax,
        colMax,
        originalReflection
      )
      sum += verticals
      sum += 100 * horizontals
  })
  console.log(sum)
}

function findAlternateReflection(pattern, rowMax, colMax, originalReflection) {
  console.log('======')
  console.log('rowMax', rowMax, 'colMax', colMax)
  console.log('original map')
  draw(pattern, rowMax, colMax)
  console.log(' ')
  let found = [0, 0]
  for (let i = 0; i < rowMax; i++) {
    for (let j = 0; j < colMax; j++) {
      // swap
      const pos = [i, j]
      const swappedChar = pattern[pos] === '#' ? '.' : '#'
      const newPattern = { ...pattern, [pos]: swappedChar }

      const horizontals = checkHorizontalReflection(newPattern, rowMax, colMax, originalReflection[0])
      if (horizontals > 0 && horizontals !== originalReflection[0]) {
        found[0] = horizontals
      }
      const verticals = checkVerticalReflection(newPattern, rowMax, colMax, originalReflection[1])
      if (verticals > 0 && verticals !== originalReflection[1]) {
        found[1] = verticals
      }
      if (found[0] > 0 || found[1] > 0) {
        console.log('swapped', pos)
        console.log('found', horizontals, verticals)
        draw(newPattern, rowMax, colMax)
        console.log('-----')
        break
      }
    }
    if (found[0] > 0 || found[1] > 0) break
  }
  // return found
  const res = found[0] > 0 || found[1] > 0 ? found : originalReflection
  console.log('original', originalReflection)
  console.log('new found', res)
  return res
}

function checkHorizontalReflection(pattern, rowMax, colMax, matchedRowOrCol) {
  const stack0 = []
  const stack1 = []
  for (let i = 0; i < rowMax; i++) {
    const row = getRowOrCol(pattern, i, colMax)
    if (i === 0) {
      stack0.push(row)
    } else {
      stack1.unshift(row)
    }
  }
  return findReflection(rowMax, stack0, stack1, matchedRowOrCol)
}

function checkVerticalReflection(pattern, rowMax, colMax, matchedRowOrCol) {
  const stack0 = []
  const stack1 = []
  for (let i = 0; i < colMax; i++) {
    const col = getRowOrCol(pattern, i, rowMax, false)
    if (i === 0) {
      stack0.push(col)
    } else {
      stack1.unshift(col)
    }
  }
  return findReflection(colMax, stack0, stack1, matchedRowOrCol)
}

function findReflection(rowOrColMax, stack0, stack1, matchedRowOrCol) {
  let numRows = 0
  for (let start = 1; start < rowOrColMax; start++) {
    // console.log('---')
    // console.log('testing', start)
    // console.log(stack0.join('\n'))
    // console.log(' ')
    // console.log(stack1.join('\n'))
    // console.log(' ')
    const mirrorLength = Math.min(stack0.length, stack1.length)
    const smallerStack = stack0.length <= stack1.length ? stack0 : stack1
    const largerStack = stack0.length > stack1.length ? stack0 : stack1
    // check all stack0 against latter part of stack1
    if (
      smallerStack.join() ===
      largerStack.slice(largerStack.length - mirrorLength).join()
      && start !== matchedRowOrCol
    ) {
      numRows = start
      break
    }
    stack0.push(stack1.pop())
  }

  // console.log('num rows', numRows)
  return numRows
}

function getRowOrCol(pattern, index, max, row = true) {
  let rowOrCol = ''
  for (let i = 0; i < max; i++) {
    const pos = row ? [index, i] : [i, index]
    rowOrCol += pattern[pos]
  }
  return rowOrCol
}

function draw(pattern, rowMax, colMax) {
  for (let i = 0; i < rowMax; i++) {
    let row = ''
    for (let j = 0; j < colMax; j++) {
      const pos = [i, j]
      row += pattern[pos]
    }
    console.log(row)
  }
}

function assembleMaps(lines) {
  const maps = []
  let pattern = {}
  let row = 0
  let colMax = 0

  lines.forEach((line) => {
    if (line === '') {
      maps.push({ pattern, rowMax: row, colMax: colMax + 1 })
      row = 0
      colMax = 0
      pattern = {}
    } else {
      line.split('').map((c, col) => {
        const pos = [row, col]
        pattern[pos] = c
        if (col > colMax) {
          colMax = col
        }
      })
      row += 1
    }
  })
  maps.push({ pattern, rowMax: row, colMax: colMax + 1 })

  return maps
}

module.exports = getAnswer
