const { readFile } = require('../utils.js')

const NUMS = []
async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // doPartOne()
  doPartTwo()
}

function doPartTwo() {
  // let num = BigInt(123)
  // const changes = getChanges(num, 10)
  // console.log(changes)
  const possibleSequences = []
  NUMS.forEach((num, i) => {
    num = BigInt(num)
    const changes = getChanges(num)
    // changes.forEach((change,j) => console.log(j, ': ', change))
    const seq = getAllSequences(changes)
    possibleSequences.push(seq)
  })
  
  // possibleSequences.forEach(seq => {
  //   console.log(seq['-2,1,-1,3'])
  // })
  //
  const allSeqKeys = mergeKeys(possibleSequences)

  const best = getBest(possibleSequences, allSeqKeys)
  console.log('best', best)
}

function mergeKeys(seqs=[]) {
  const keys = {};
  seqs.forEach(seq => {
    Object.keys(seq).forEach(key => {
      keys[key] = key
    })
  })
  return keys;
}

function getBest(seqs=[], allKeys={}) {
  const keys = Object.keys(allKeys)
  let best = 0
  keys.forEach(testKey => {
    let sum = 0;
    seqs.forEach(seq => {
      if (testKey in seq) {
        sum += seq[testKey]
      } else {
        sum += 0
      }
    })
    console.log('new sum', sum, testKey)
    if (sum > best) {
      best = sum
    }
  })
  console.log('best', best)
  return best
}

function getAllSequences(changes=[]) {
  const res = {}
  const stack = [];
  stack.push({seq:[], pointer:0})

  const visited = {}
  while (stack.length) {
    const curr = stack.pop();
    // console.log(curr, stack.length)
    const {seq, pointer} = curr;
    const visitedKey = `${seq}-${pointer}`
    if (visitedKey in visited) {
      continue;
    }
    if (seq.length === 4) {
      const seqPrice = changes[pointer - 1].price;
      // if (seq.join(',') === '-2,1,-1,3') {
      //   console.log('hey', seqPrice)
      // }
      res[seq] = seqPrice;
      continue;
    }
    if (pointer === changes.length) continue;

    visited[visitedKey] = true;
    const {change} = changes[pointer];
    if (change === 0) {
      stack.push({seq: [], pointer: pointer + 1})
      continue;
    }
    
    stack.push({seq: [...seq, change], pointer: pointer + 1})
    stack.push({seq: [change], pointer: pointer + 1})
  }
  return res;
}

function getChanges(num=0n, turns=2000) {
  const changes = []
  let prev = null;
  for (let i = 0; i < turns; i++) {

    let price = num.toString()
    price = Number(price[price.length - 1])
    const change = prev === null ? null : price - prev;

    changes.push({price, change})
    num = generate(num)
    prev = price
  }
  return changes
}

function doPartOne() {
  // let num = BigInt(123)
  // console.log('orig', num)
  // for (let i = 0; i < 10; i++) {
  //   num = generate(num, i)
  //   console.log('new num',i, num)
  // }
  let tot = 0n
  NUMS.forEach(num => {
    console.log('orig', num)
    num = BigInt(num)
    for (let i = 0; i < 2000; i++) {
      num = generate(num)
    }
    tot += num
    console.log(num)
  })
  console.log('tot:', tot)
}

function generate(num = 0n) {
  // mult by 64 then mix then prune
  const mult = num * 64n;
  num = mix(num, mult)
  num = prune(num)
  // divide by  32 and prune
  const div = num / 32n
  num = mix(num, div)
  num = prune(num)
  // mult by 2048 then mix then prune
  const mult2 = num * 2048n
  num = mix(num, mult2)
  num = prune(num)
  return num
}

function mix(a= 0n, b=0n) {
  return a ^ b 
}
function prune(a=0n) {
  return a % 16777216n;
}

function parse(lines = []) {
  lines.forEach(line => {
    NUMS.push(Number(line))
  })
}

module.exports = getAnswer;
