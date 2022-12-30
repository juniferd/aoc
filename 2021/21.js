const { readFile } = require('../utils.js')

function getPlayers(lines) {
  const players = {}
  lines.forEach((line) => {
    const [_, start] = line.split(': ')
    const [player] = line.split(' starting')
    players[player.slice(7)] = Number(start)
  })

  return players
}
async function playDice(file = '../input.txt') {
  const lines = await readFile(file)
  const players = getPlayers(lines)

  let turn

  let player1Score = 0
  let player2Score = 0

  let player1 = players[1]
  let player2 = players[2]

  // die is deterministic and will return 1-100 in order
  let player = '1'
  for (let i = 1; i < 10000; i++) {
    const moves = i % 100 === 0 ? 100 : i % 100
    if (player === '1') {
      player1 += moves
    } else {
      player2 += moves
    }
    // after 3 rolls turn ends move to next player
    if (i % 3 === 0) {
      console.log('turn', i)
      if (player === '1') {
        const finalScore =
          player1 % 10 === 0 && player1 !== 0 ? 10 : player1 % 10
        player1Score += finalScore
        player1 = finalScore
        console.log('player 1', player1Score)
      } else {
        const finalScore =
          player2 % 10 === 0 && player2 !== 0 ? 10 : player2 % 10
        player2Score += finalScore
        player2 = finalScore
        console.log('player 2', player2Score)
      }
      if (player1Score >= 1000 || player2Score >= 1000) {
        console.log('done at', i, 'player', player, 'won')
        turn = i
        break
      }
      player = player === '1' ? '2' : '1'
    }
  }
  console.log(player1Score, player2Score)
  if (player === '1') {
    console.log(player2Score * turn)
  } else {
    console.log(player1Score * turn)
  }
}

const DICE = [1, 2, 3]

function resolveLocation(location, numMoves) {
  let res = location + numMoves
  if (res % 10 > 0) {
    res = res % 10
  }
  return res
}

function play(
  rolls = 0,
  currMoves = 0,
  currPlayer = '1',
  players = {},
  cache = {},
  tracking = '1'
) {
  const key = `${rolls}-${currMoves}-${currPlayer}-${players['1'].location}-${players['1'].score}-${players['2'].location}-${players['2'].score}`
  if (key in cache) {
    return cache[key]
  }

  // resolve score
  if (rolls % 3 === 0 && rolls > 0) {
    const newLocation = resolveLocation(players[currPlayer].location, currMoves)
    players[currPlayer].location = newLocation
    players[currPlayer].score += newLocation
    currMoves = 0
    currPlayer = currPlayer === '1' ? '2' : '1'
  }

  if (players['1'].score >= 21 || players['2'].score >= 21) {
    // track a player
    const res = players[tracking].score >= 21 ? 1 : 0
    return res
  }

  let wins = 0
  DICE.forEach((outcome) => {
    const winCount = play(
      rolls + 1,
      currMoves + outcome,
      currPlayer,
      { 1: { ...players['1'] }, 2: { ...players['2'] } },
      cache,
      tracking
    )
    wins += winCount
  })

  cache[key] = wins

  return cache[key]
}

async function playDiracDice(file = '../input.txt') {
  const lines = await readFile(file)
  const players = getPlayers(lines)
  const cache1 = {}
  const cache2 = {}
  play(
    0,
    0,
    '1',
    {
      1: { location: players['1'], score: 0 },
      2: { location: players['2'], score: 0 },
    },
    cache1,
    '1'
  )

  const res1 = Object.values(cache1).reduce(
    (acc, val) => Math.max(acc, val),
    -Infinity
  )
  play(
    0,
    0,
    '1',
    {
      1: { location: players['1'], score: 0 },
      2: { location: players['2'], score: 0 },
    },
    cache2,
    '2'
  )
  console.log('player 1', res1)
  const res2 = Object.values(cache2).reduce(
    (acc, val) => Math.max(acc, val),
    -Infinity
  )
  console.log('player 2', res2)
  console.log(Math.max(res1, res2))
}

module.exports = playDiracDice
