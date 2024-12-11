const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const stones = parse(lines)
  console.log(stones)
  blink(75, stones)
  //console.log(stones.length)
}

function blink(n = 6, stones = []) {
  const lookup = {}
  let prev = stones.reduce((acc,curr) => {
    return {
      ...acc,
      [curr]: 1
    }
  }, {})
  for (let i = 0; i < n; i++) {
    console.log('----', i)
    const next = update2(prev, lookup)
    prev = {...next}
    console.log(Object.values(next).reduce((acc,curr) => acc + curr, 0))
    // update(stones)
    // console.log(stones.length)
  }
}

function update2(prev={}, lookup={}) {
  const next = {};
  Object.entries(prev).forEach(([stone,count]) => {
    let nextStones = []
    if (stone in lookup) {
      //console.log('found lookup', stone, lookup[stone])
      nextStones = lookup[stone]
    } else {
      nextStones = calc(Number(stone));
      lookup[stone] = nextStones
      console.log('next stones', stone, nextStones)
    }
    nextStones.forEach(nextStone => {
      if (nextStone in next) {
        next[nextStone] += count
      } else {
        next[nextStone] = count
      }
    })
  })
  return next
}

function calc(stone = 0) {
    if (stone === 0) {
      // console.log('replace')
      return [1]
    } else if (String(stone).length % 2 === 0) {
      // console.log('split')
      const [left, right] = splitStone(stone)
      return [left, right]
    } else {
      // console.log('mult')
      return [stone * 2024]
    }
}

function update(stones = []) {
  let i = 0;
  while (i < stones.length) {
    const stone = stones[i]
    if (stone === 0) {
      // console.log('replace')
      stones[i] = 1
      i++
    } else if (String(stone).length % 2 === 0) {
      // console.log('split')
      const [left, right] = splitStone(stone)
      stones[i] = left;
      stones.splice(i+1,0,right)
      i += 2
    } else {
      stones[i] = stone * 2024
      // console.log('mult')
      i++
    }
  }
  return stones;
}

function splitStone(stone = 0) {
  stone = String(stone);
  stoneLength = Math.floor(stone.length / 2);
  left = stone.slice(0,stoneLength)
  right = stone.slice(stoneLength)
  return [Number(left), Number(right)]
}

function parse(lines = []) {
  const parsed = lines[0].split(' ').map(n => Number(n))
  return parsed
}


module.exports = getAnswer;
