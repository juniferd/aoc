const { readFile } = require('../utils.js')

const RULES = [];
const UPDATES = [];

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  parse(lines)
  console.log(RULES);
  console.log(UPDATES)

  // part 1
  // const validUpdates = UPDATES.filter((pages) => {
  //   const [isValid] = validate(pages)
  //   console.log('pages', pages, 'is valid?', isValid)
  //   return isValid;
  // })
  // console.log(validUpdates)
  // let total = 0;
  // validUpdates.forEach(pages => {
  //   const middle = getMiddle(pages)
  //   total += middle
  // })
  // part 2
  const invalidUpdates = UPDATES.filter((pages) => {
    const [isValid] = validate(pages)
    return !isValid;
  })
  console.log(invalidUpdates)
  // order invalid pages
  const orderedPages = invalidUpdates.map((pages) => reorder(pages));
  let total = 0;
  orderedPages.forEach(pages => {
    const middle = getMiddle(pages)
    total += middle
  })
  console.log('total', total)
}

function reorder(pages = []) {
  const subsetRules = RULES.filter(([a, b]) => {
    const indexA = pages.findIndex(page => page === a);
    const indexB = pages.findIndex(page => page === b);
    return indexA > -1 && indexB > -1
  });
  console.log('---')
  console.log(pages)
  console.log('subset rules', subsetRules)
  let allValid = false;
  while (!allValid) {
    const [valid,rule] = validate(pages, subsetRules)
    if (!valid) {
      swap(pages, rule)
    } else {
      allValid = true;
    }
  }
  console.log('correct pages', pages)
  return pages
}

function swap(pages = [], rule = []) {
  const [a,b] = rule
  const indexA = pages.findIndex(page => page === a)
  const indexB = pages.findIndex(page => page === b)
  const pageA = pages[indexA]
  const pageB = pages[indexB]
  pages[indexA] = pageB
  pages[indexB] = pageA
}

function getMiddle(pages = []) {
  const len = pages.length;
  const mid = Math.floor(len / 2);
  return pages[mid]
}

function validate(pages = [], rules = RULES) {
  for (let i = 0; i < rules.length; i++) {
    const [a,b] = rules[i];
    const indexA = pages.findIndex(page => page === a)
    const indexB = pages.findIndex(page => page === b)
    if (indexB === -1 || indexA === -1) continue;
    if (indexB < indexA) return [false, [a,b]];
  }
  return [true];
}

function parse(lines = []) {
  let mode = 'RULES';
  lines.forEach((line) => {
    console.log('line', line)
    if (line === '') {
      mode = 'UPDATES'
    } else if (mode === 'RULES') {
      RULES.push(line.split('|').map(n => Number(n)))
    } else {
      UPDATES.push(line.split(',').map(n => Number(n)))
    }
  })
}

module.exports = getAnswer;
