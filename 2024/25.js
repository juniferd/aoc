const { readFile } = require('../utils.js')

const KEYS = [];
const LOCKS = [];

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(KEYS[0])
  console.log(LOCKS[0])
  const valids = {}
  KEYS.forEach((key, i) => {
    LOCKS.forEach(lock => {
      const valid = validate(lock, key)
      if (valid) {
        const validKey = key.join(',') + '-' + lock.join(',')
        valids[validKey] = lock
        console.log('valid', key, lock)
      } else {
        console.log('invalid', key, lock)
      }
    })
  })
  console.log(Object.keys(valids).length)
}

function validate(lock, key) {
  let valid = true;
  lock.forEach((l, i) => {
    const k = key[i];
    if (k + l > 5) {
      valid = false;
      return;
    }
  })
  return valid;
}

function parse(lines = []) {
  let curr = [0,0,0,0,0]
  let mode = 'K'
  lines.forEach((line, i) => {
    if (line === '') {
      if (mode === 'K') {
        KEYS.push(curr)
      } else {
        LOCKS.push(curr)
      }
      curr = [0,0,0,0,0];
    } else if (i % 8 === 0 && curr.join(',') === '0,0,0,0,0') {
      if (line === '#####') {
        mode = 'L'
      } else {
        mode = 'K'
      }
    } else if (i % 8 === 6 && mode === 'K') {
      // skip
    } else {
      line.split('').forEach((l, i) => {
        if (l === '#') {
          curr[i] += 1
        }
      })
    }
  })
  if (mode === 'K') {
    KEYS.push(curr)
  } else {
    LOCKS.push(curr)
  }
}

module.exports = getAnswer;
