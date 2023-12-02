const { readFile } = require('../utils.js')

const COLORS = {
  red: 12,
  green: 13,
  blue: 14,
};

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  
  const res = lines.reduce((sum, line) => {
    const [_, turns] = getTurn(line);
    const minPossible = getMinimumPossibleColors(turns);
    // console.log(minPossible)
    const pwr = Object.values(minPossible).reduce((res, curr) => res * curr ,1);
    return sum + pwr
  }, 0)
  console.log(res)
}



function getMinimumPossibleColors(turns) {
  const colors = {
    red: 0,
    green: 0,
    blue: 0,
  }

  turns.forEach((turnColors) => {
    turnColors.forEach(([color, num]) => {
      if (num > colors[color]) {
        colors[color] = num;
      }
    });
  });

  return colors;

}

function getTurn(line) {
  const [origId, game] = line.split(': ');
  const id = Number(origId.slice(5));
  const turnsArr = game.split(';')
  const turns = turnsArr.map((turn) => {
    const colors = turn.split(',').map(t => {
      const [num, color] = t.trim().split(' ');
      return [color, Number(num)]
    });
    return colors;
  });
  // console.log(id)
  // console.log(turns)
  return [id, turns];
}

function partOne(lines) {
  let sum = 0;

  lines.forEach((line) => {
    const [origId, game] = line.split(': ');
    const id = origId.slice(5);
    const turns = game.split(';')
    let valid = true;
    for (let i = 0; i < turns.length; i++) {
      const colors = turns[i].split(',')
      colors.forEach((colorVal) => {
        const [num, color] = colorVal.trim().split(' ');
        if (num > COLORS[color]) {
          valid = false;
        }
      });
      if (!valid) break;
    }
    if (valid) {
      console.log('valid game', id)
      sum += Number(id);
    }

  })
  console.log(sum)
}

module.exports = getAnswer;
