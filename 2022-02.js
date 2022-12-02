const { readFile } = require('./utils.js')

const RPS_POINT = {
  'X': 1,
  'Y': 2,
  'Z': 3,
}

const WINS = {
  'A': 'Y',
  'B': 'Z',
  'C': 'X',
}
const DRAWS = {
  'A': 'X',
  'B': 'Y',
  'C': 'Z',
}

function outcome(opponentMove, yourMove) {
  if (DRAWS[opponentMove] === yourMove) return 3;
  if (WINS[opponentMove] === yourMove) return 6;
  return 0;
}

// 0 lost, 3 draw, 6, win
async function scoreRPS(file='./input.txt') {
  const games = await readFile(file)
  let res = 0;
  games.forEach(game => {

    const [opponentMove, yourMove] = game.split(' ');
    const score = outcome(opponentMove, yourMove) + RPS_POINT[yourMove]
    res += score
    
  })
  console.log(res)
}

const EXPECTED_OUTCOME = {
  'X': 'LOSE',
  'Y': 'DRAW',
  'Z': 'WIN',
};
const LOSES = {
  'A': 'Z',
  'B': 'X',
  'C': 'Y',
}

function getYourMove(opponentMove, gameOutcome) {
  if (gameOutcome === 'Y') return DRAWS[opponentMove];
  if (gameOutcome === 'Z') return WINS[opponentMove];
  if (gameOutcome === 'X') return LOSES[opponentMove];
}

async function scoreRPS2(file='./input.txt') {
  const games = await readFile(file)
  let res = 0;
  games.forEach(game => {
    const [opponentMove, gameOutcome] = game.split(' ');
    const yourMove = getYourMove(opponentMove, gameOutcome);
    const score = outcome(opponentMove, yourMove) + RPS_POINT[yourMove]
    res += score;

  });
  console.log(res)

}
module.exports = scoreRPS2;
