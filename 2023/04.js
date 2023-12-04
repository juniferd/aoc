const { readFile } = require('../utils.js')

const SCRATCH_CARDS = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  assembleCards(lines)
  const stack = Object.keys(SCRATCH_CARDS)

  let tot = 0;
  while (stack.length > 0) {
    const currId = stack.pop();

    // skip if card id out of bounds
    if (!(currId in SCRATCH_CARDS)) break;
    
    const numCopies = SCRATCH_CARDS[currId]; 
    // console.log('num copies', numCopies)
    // if (numCopies > 0) {
      for (let i = 0; i < numCopies; i++) {
        const nextIdNum = Number(currId) + i + 1;
        stack.push(nextIdNum)
      }
    // }

    tot += 1;
    // console.log('tot', tot)
    // console.log('----')
     
  }
  console.log(tot)
}

function assembleCards(lines) {
  lines.forEach((line) => {
    const [card1, card2] = line.split('|')
    const [cardId, winningNums] = card1.split(':')

    const winning = {}
    winningNums
      .trim()
      .split(/\s+/)
      .forEach((winNum) => {
        winNum = Number(winNum)
        winning[winNum] = true
      })
    const id = cardId.slice(5).trim()

    let numMatches = 0;
    card2.split(/\s+/).forEach((cardNum) => {
      if (cardNum in winning) {
        numMatches += 1;    
      }
    });
    SCRATCH_CARDS[id] = numMatches    
  })
}

function assembleCardsPartOne(lines) {
  let tot = 0
  lines.forEach((line) => {
    const [card1, card2] = line.split('|')
    const [_, winningNums] = card1.split(':')
    const WINNING = {}

    winningNums
      .trim()
      .split(/\s+/)
      .forEach((winNum) => {
        winNum = Number(winNum)
        WINNING[winNum] = true
      })

    let sum = 0
    card2.split(/\s+/).forEach((cardNum) => {
      if (cardNum in WINNING) {
        console.log('match', cardNum)
        if (sum === 0) {
          sum = 1
        } else {
          sum *= 2
        }
      }
    })
    // console.log(sum)
    tot += sum
  })
  console.log(tot)
}

module.exports = getAnswer
