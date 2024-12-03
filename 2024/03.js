const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);

  const ret = parse(lines);
  console.log(ret)
}

function parse(lines = []) {
  let tot = 0;
  let mode = 'DO'
  lines.forEach(line => {
    const [res, currMode] = compute(line, mode)
    mode = currMode
    tot += res
  })
  return tot;
}

function compute(line = '', mode = 'DO') {
  // const matches = line.matchAll(/(mul\(\d+,\d+\)/g)
  const matches = line.matchAll(/(mul\(\d+,\d+\)|do\(\)|don\'t\(\))/g)
  let tot = 0;
  let curr = matches.next();
  while (!curr.done) {
    const currVal = curr.value[0]
    console.log('curr', mode, currVal)
    if (currVal === "do()") {
      mode = 'DO'
      curr = matches.next()
      continue;
    }
    if (currVal === "don't()") {
      mode = 'DONT'
      curr = matches.next()
      continue;
    }
    if (mode === 'DO') {
      tot += multiply(currVal)
    }
    console.log('tot', tot)
    curr = matches.next()
  }
  return [tot, mode]
}

function multiply(val = '') {
  let [a, b] = val.split(',');
  a = a.slice(4);
  b = b.slice(0, -1);
  return +a * +b
}

module.exports = getAnswer;
