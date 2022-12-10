const { readFile } = require('../utils.js')

function moveNope(prevTail, prevHead, currHead, map) {
  let tail
  if (currHead[0] === prevTail[0] && currHead[1] !== prevTail[1]) {
    // move horizontally
    console.log('horizontal', currHead)
    if (map[0].length <= currHead[1]) {
      map = map.map((row) => {
        Array(currHead[1] + 1 - map[0].length).forEach((_) => {
          row.push(0)
        })
      })
    }
    const diff = currHead[1] - prevHead[1]
    tail = [currHead[0], prevTail[1] + diff]
  } else if (currHead[1] === prevTail[1] && currHead[0] !== prevTail[0]) {
    // move vertically
    console.log('vertical', currHead)
  } else {
    // do a diagonal and then
    console.log('diagonal', currHead)
  }
  return { map, tail }
}

function moveHead(dict, dir, num, prevX, prevY, isTail) {
  let x = prevX
  let y = prevY
  if (dir === 'R') {
    for (let i = 0; i < num; i++) {
      dict[`${prevX + i + 1},${prevY}`] = 1
    }
    x = prevX + num
  } else if (dir === 'L') {
    for (let i = 0; i < num; i++) {
      dict[`${prevX - i - 1},${prevY}`] = 1
    }
    x = prevX - num
  } else if (dir === 'U') {
    for (let i = 0; i < num; i++) {
      dict[`${prevX},${prevY + i + 1}`] = 1
    }
    y = prevY + num
  } else if (dir === 'D') {
    for (let i = 0; i < num; i++) {
      dict[`${prevX},${prevY - i - 1}`] = 1
    }
    y = prevY - num
  }
  return { x, y }
}

function move(dict, dir, prevHeadX, prevHeadY) {
  let x = prevHeadX
  let y = prevHeadY

  if (dir === 'R') {
    x += 1
  } else if (dir === 'L') {
    x -= 1
  } else if (dir === 'U') {
    y += 1
  } else if (dir === 'D') {
    y -= 1
  }
  dict[`${x}-${y}`] = 1
  return { x, y }
}

function moveTail(newX, newY, tailX, tailY) {
  let diffX = newX - tailX;
  diffX = Math.min(diffX, 1)
  diffX = Math.max(diffX, -1)
  let diffY = newY - tailY;
  diffY = Math.min(diffY, 1)
  diffY = Math.max(diffY, -1)
  if (Math.abs(newX - tailX) > 1 || Math.abs(newY - tailY) > 1) {
    // needs to move diagonally
    
    // console.log('diffX', diffX, diffY, prevX - tailX, prevY - tailY)
    // tailX = prevX
    // tailY = prevY
    tailX += diffX
    tailY += diffY
  }
  return {tailX, tailY}
}

function buildMap(positions) {
  let dictHead = {}
  let dictTail = {}
  let headX = 0
  let headY = 0
  let tailX = 0
  let tailY = 0
  // row, col is the H position but we need to keep track of T
  positions.forEach(([dir, num]) => {
    num = +num
    console.log('pos', dir, num)
    Array(num)
      .fill()
      .forEach((_) => {
        const { x: newX, y: newY } = move(dictHead, dir, headX, headY)
        const {tailX: newTailX, tailY: newTailY} = moveTail(newX, newY, headX, headY, tailX, tailY)

        headX = newX
        headY = newY

        tailX = newTailX
        tailY = newTailY

        dictTail[`${tailX}-${tailY}`] = 1


      })
  })
  return dictTail
}
// async function foo(file = '../input.txt') {
//   const lines = await readFile(file)
//   const positions = lines.map((l) => l.split(' '))
//   console.log(positions)
//   const map = buildMap(positions)
//   console.log(Object.keys(map).length + 1)
// }

function buildMap2(positions, ropeLength=1) {
  let dictHead = {}
  let dictTail = {}
  let rope = Array(ropeLength).fill('').map((_) => ([0, 0]));
  console.log(rope)
  // row, col is the H position but we need to keep track of T
  positions.forEach(([dir, num]) => {
    num = +num
    console.log('pos', dir, num)
    Array(num)
      .fill()
      .forEach((_) => {
        let [headX, headY] = rope[0]
        const { x: newHeadX, y: newHeadY } = move(dictHead, dir, headX, headY)
        rope[0] = [newHeadX, newHeadY]
        for (let i = 1; i < rope.length; i++) {

          const [tailX, tailY] = rope[i];

          const {tailX: newTailX, tailY: newTailY} = moveTail(rope[i - 1][0], rope[i - 1][1], tailX, tailY)
          rope[i] = [newTailX, newTailY]
        }

        dictTail[`${rope[ropeLength-1].join('-')}`] = 1


      })
  })
  return dictTail
}

async function getTail(file = '../input.txt') {
  const lines = await readFile(file)
  const positions = lines.map((l) => l.split(' '))
  const map = buildMap2(positions, 10)
  console.log(map)
  console.log(Object.keys(map).length)

  // const wahtever = Array(10).fill('-').map((_) => Array(10).fill('-'))
  // Object.keys(map).forEach((coord) => {
  //   const [col, row] = coord.split('-')
  //   wahtever[+row][+col] = 'x'
  // })
  // console.log(wahtever.join('\n'))
}

module.exports = getTail
