const { readFile } = require('../utils.js')

const PATTERNS={}
const TOWELS=[]
let MAX_PATT_LEN = 0;

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(PATTERNS)
  console.log(TOWELS)
  countPossible();
}

function countPossible() {
  let tot = 0;
  TOWELS.forEach((towel, i) => {
    const cache = {}

    const res = traverse(0, towel, cache)
    console.log('res', towel, res)

    tot += res

  });
  console.log('TOT:', tot)
}

function sum(...values) {
  return values.reduce((total, value) => total + value, 0)
}

function traverse(start = 0, towel='', cache={}, patterns = Object.keys(PATTERNS)) {
  const cacheKey = start
  // console.log('testing', cacheKey, cache)
  if (cacheKey in cache) return cache[cacheKey];

  const subTowel = towel.slice(start);
  // console.log(subTowel, start)
  if (start === towel.length) {
    return 1;
  }

  const possibles = patterns.filter(patt => subTowel.startsWith(patt));

  if (possibles.length === 0) return 0;

  const res = sum(...possibles.map((patt) => {
    return traverse(start + patt.length, towel, cache)
  }));

  cache[cacheKey] = res;
  return res;

}

function parse(lines = []) {
  let mode = 'P';
  lines.forEach(line => {
    if (line === '') {
      mode = 'T';
      return;
    }
    if (mode === 'P') {
      const patts = line.split(', ')
      patts.forEach(patt => {
        PATTERNS[patt] = patt
        if (patt.length > MAX_PATT_LEN) {
          MAX_PATT_LEN = patt.length
        }
      })
    } else if (mode === 'T') {
      TOWELS.push(line)
    }
  })
}

module.exports = getAnswer;
