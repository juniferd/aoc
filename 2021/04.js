const { readFile } = require('../utils.js')

let NUMS = [];
const CARDS = [];
const BINGO_VALS = {};
const HITS = {};

async function foo(file='../input.txt') {
  const lines = await readFile(file);
  assembleCards(lines);

  // go through each card and mark position
  // value: {card index: [row index, col index]}
  assembleBingoLookup(CARDS);

  // go through each of the nums called and mark hits
  // card index: {[row index, col index]: 1}
  
}

function assembleBingoLookup(cards) {
  CARDS.forEach((card, card_idx) => {
    card.forEach((row, row_idx) => {
      row.forEach((val, col_idx) => {
        if (val in BINGO_VALS) {
          BINGO_VALS[val][card_idx] = [row_idx, col_idx];
        } else {
          BINGO_VALS[val] = {[card_idx]: [row_idx, col_idx]};
        }
      });
    })
  });
}

function assembleCards(lines) {
  let card = [];

  lines.forEach((line, i) => {
    line = line.trim();

    if (i === 0) {
      NUMS = line.split(',')  
    } else if (line === '' && card.length > 0) {
      CARDS.push(card)
      card = [];
    } else if (line !== '') {
      const curr = getBingoCardLine(line);
      card.push(curr)
    }
  })
  CARDS.push(card)
}

function getBingoCardLine(line) {
  const res = [];

  let curr = '';
  for (i in line) {
    const chr = line[i]
    if (![' ', ''].includes(chr)) {
      curr += chr
    } else if (curr !== '') {
      res.push(Number(curr))
      curr = ''
    }
  }
  res.push(Number(curr))
  return res;
}

module.exports = foo;
