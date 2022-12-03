const { readFile } = require('../utils.js')

function findCommon(r1, r2) {
  for (i = 0; i < r1.length; i++) {
    for (j = 0; j < r2.length; j++) {
      if (r1[i] === r2[j]) return r1[i]
    }
  }
}
function getScore(letter) {
  let score;
  if (letter === letter.toUpperCase()) {
    score = letter.charCodeAt(0) - 38;
  } else {

    score= letter.charCodeAt(0) - 96;
  }
    console.log(letter,score)
  
  return score;
}
async function getPriorities(file='./input.txt') {
  const lines = await readFile(file);
  let total = 0;
  lines.forEach(contents => {
    const rucksack1 = contents.slice(0, contents.length / 2);
    const rucksack2 = contents.slice(contents.length / 2);
    // console.log(rucksack1, rucksack2)
    const common = findCommon(rucksack1.split(''), rucksack2.split(''))
    console.log(common)
    total += getScore(common)
  })
  console.log(total)
  return total
}

// lol i hate me
function findCommonThree(sacks=[]) {
  for (let i = 0; i < sacks[0].length; i++) {
    for (let j = 0; j < sacks[1].length; j++) {
      for (let k = 0; k < sacks[2].length; k++) {
        if (sacks[0][i] === sacks[1][j] && sacks[1][j] === sacks[2][k]) return sacks[0][i]
      }
    }
  }
}

async function getBadges(file='./input.txt') {
  const lines = await readFile(file);
  let total = 0;
  let currGroup = [];
  lines.forEach((contents, i) => {
    currGroup.push(contents.split(''))
    if (i%3 === 2) {
      const common = findCommonThree(currGroup)
      total += getScore(common)
      currGroup = [];
    }  
  });
  console.log(total)
}
module.exports = {
  getPriorities,
  getBadges,
} 
