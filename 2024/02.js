const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const res = parseInput(lines)

  const count = countSafeReports(res);
  console.log('count', count)

}

function countSafeReports(reports) {
  return reports.reduce((acc, curr) => {
    const safe = countSafeWithTolerance(curr);
    console.log('report', curr, 'safe', safe)
    return safe ? acc + 1 : acc;
  }, 0);
}

// i feel like i should be able to do this recursively, but i guess it doesn't
// matter since i'm only ever removing one level and not a bunch of levels

function countSafeWithTolerance(levels = []) {
  if (countSafe(levels)) return true;

  // just brute force it with all the combos eff it
  const safeWithTolerance = levels.findIndex((_, index) => {
    const slicedLevels = levels.slice(0, index).concat(levels.slice(index + 1))
    if (countSafe(slicedLevels)) return true;
  });

  if (safeWithTolerance > -1) return true;

  return false; 
}

function countSafe(levels) {
  let last = null;
  let dir = null;
  // TODO what the hell fix this
  for (let i = 0; i < levels.length; i++) {
    const curr = levels[i];
    console.log('curr', curr, 'dir', dir)

    if (last === null) {
      last = curr;
      continue;
    } 

    if (dir === null) {
      dir = curr > last ? 'INC' : 'DEC';
    }

    if (curr > last && dir === 'DEC') {
      return false;
    }

    if (curr < last && dir === 'INC') {
      return false;
    }

    if (curr === last) {
      return false;
    }

    if (Math.abs(curr - last) > 3) {
      return false;
    }

    last = curr;
  }

  return true;
}

function parseInput(lines) {
  return lines.map(line => {
    const res = line.split(/\s+/)
    return res.map(level => Number(level))
  })

}

module.exports = getAnswer;
