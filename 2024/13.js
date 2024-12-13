const { readFile } = require('../utils.js')

const MACHINES = [];

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  // doPartOne()
  doPartTwo()
}

function doPartTwo() {
  const res = [];
  MACHINES.forEach(({a,b,prize}, i) => {
    const ADJUSTED = 10000000000000
    // find intersection
    console.log('------', i+1, '------')
    const [aPress, bPress] = findIntersection(a, b, [prize[0] + ADJUSTED, prize[1] + ADJUSTED])
    if (aPress !== Infinity) {
      res.push(3 * aPress + bPress)
      console.log('FOUND', i+1, aPress, bPress)
    }
  })
  console.log(res.reduce((acc,curr) => acc + curr, 0))

}

function findIntersection(a=[0,0], b=[0,0], prize=[0,0]) {
  const aPress = ((prize[0]/b[0]) - (prize[1]/b[1])) / ((a[0]/b[0]) - (a[1]/b[1]))
  const bPress = (prize[0] - (a[0] * aPress)) / b[0]
  console.log('a', aPress, 'b', bPress)
  const error = 0.0002
  if (Math.abs(aPress - Math.round(aPress)) < error && Math.abs(bPress - Math.round(bPress)) < error) return [Math.round(aPress), Math.round(bPress)]
  return [Infinity, Infinity]
}

function doPartOne() {
  const res = [];
  MACHINES.forEach(({a,b,prize}) => {
    const cache = {}
    const tokens = press(0, [0,0], a, b, prize, cache)
    if (tokens < Infinity) {
      res.push(tokens)
    }
  })
  console.log(res.reduce((acc,curr) => acc + curr, 0))
}

function press(currCost=0, currPos=[Infinity,Infinity], a=[0,0], b=[0,0], prize=[0,0], cache={}) {
  const key = `${currCost}-${currPos}`;
  console.log('KEY', key)
  if (key in cache) {
    console.log('cache', cache[key])
    return cache[key]
  }

  if (currPos[0] === prize[0] && currPos[1] === prize[1]) {
    return currCost;
  }

  if (currPos[0] > prize[0] || currPos[1] > prize[1]) {
    return Infinity;
  }

  // pressing A costs 3
  const left = press(currCost + 3, [currPos[0] + a[0], currPos[1] + a[1]], a, b, prize, cache)
  // pressing B costs 1
  const right = press(currCost + 1, [currPos[0] + b[0], currPos[1] + b[1]], a, b, prize, cache)

  const res = Math.min(left, right)
  if (res !== Infinity) {
    console.log('TOKENS', res)
  }
  cache[key] = res;

  return res;
}

function parse(lines = []) {
  let machine = {};
  lines.forEach((line) => {
    // buttons are always incrementing and never decrementing
    const btnMatch = /Button\s(A|B)\:\sX\+(\d*),\sY\+(\d*)/;
    if (line === '') {
      MACHINES.push(machine);
      machine = {}
    } else if (line.match(btnMatch)) {
      const [_,button,x,y] = line.match(btnMatch)
      machine[button.toLowerCase()] = [Number(x), Number(y)]
    } else {
      const prizeMatch= /Prize\:\sX\=(\d*),\sY\=(\d*)/;
      const [_,x,y] = line.match(prizeMatch)
      machine.prize = [Number(x), Number(y)]
    }
  })
  MACHINES.push(machine)
}

module.exports = getAnswer;
