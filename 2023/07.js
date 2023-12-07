const { readFile } = require('../utils.js')

const HANDS = {};

const TREE = {};

const CARDS = {
  A:14,
  K:13,
  Q:12,
  J:11,
  T:10,
  9:9,
  8:8,
  7:7,
  6:6,
  5:5,
  4:4,
  3:3,
  2:2,
}
const CARDS_2 = {...CARDS, J:1}

// {
// id: a, left: {id: a, left: {}, right: {}}, right: []}
// }
async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  assembleHands(lines)
  const buckets = Array(7).fill('').map(n => ([]))

  Object.keys(HANDS).forEach(hand => {
    const type = getType(hand, true);

    buckets[type].push(hand)
  })

  buckets.forEach(bucket => {
    bucket.sort((a, b) => {
      for (let i = 0; i < a.length; i++) {
        if (CARDS_2[a[i]] < CARDS_2[b[i]]) {
          return -1
        }        
        if (CARDS_2[a[i]] > CARDS_2[b[i]]) {
          return 1;
        }
      }
    })
  });

  // buckets.forEach((bucket, i) => {
  //   console.log('bucket', i)
  //   bucket.forEach(b => console.log(b))
  //   console.log('---')
  // })
  let res = 0;
  let rank = 1;
  buckets.forEach(bucket => {
    bucket.forEach(hand => {
      res += (rank * HANDS[hand])
      rank += 1
    })
  })
  console.log('res', res)
}

// function createTree() {
//   Object.entries(HANDS).forEach(([hand, bid]) => {
//     if (!TREE.hand) {
//       TREE.hand = hand;
//       TREE.bid = bid;
//       TREE.left = {};
//       TREE.right = {};
//     } else {
//       const node = traverse(TREE, hand)
//       // insertNode(hand, bid)
//     }
//   })
// }
// 
// function insertNode(hand, bid, prevNode) {
// }
// 
// function traverse(currNode, hand) {
//   // compare hand with currNode.hand    
// 
// }

function getType(hand, jokers = false) {
  const cards = hand.split('');
  const dict = {};
  cards.forEach(card => {
    if (card in dict) {
      dict[card] += 1;
    } else {
      dict[card] = 1
    }
  });

  if (jokers && Object.keys(dict).find(card => card === 'J')) {
    return getTypeValueWithJokers(dict);
  }

  const cardCounts = Object.values(dict);
  return getTypeValues(cardCounts)
}

function getTypeValues(cardCounts) {
  // five of a kind
  if (cardCounts.length === 1) return 6;
  if (cardCounts.length === 2) {
    // four of a kind
    if (cardCounts.find(c => c == 4)) return 5;
    // full house
    return 4;
  }
  if (cardCounts.length === 3) {
    // 3 of a kind
    if (cardCounts.find(c => c === 3)) return 3;
    // two pair
    return 2;
  }
  // one pair
  if (cardCounts.length === 4) return 1;
  // high card
  return 0;

}
function getTypeValueWithJokers(cards) {
  const origTypeValue = getTypeValues(Object.values(cards));

  if (origTypeValue === 6) return 6;
  // 4 of a kind with joker is five of a kind
  if (origTypeValue === 5) return 6;
  // full house with joker is five of a kind
  if (origTypeValue === 4) return 6;
  // 3 of a kind becomes 4 JJJ12 -> 11112; 111J2 -> 11112
  if (origTypeValue === 3) return 5;
  // 2 pair becomes 4 of a kind or full house AAJJ1 -> AAAA1, AA11J -> AA111
  if (origTypeValue === 2) {
    if (cards['J'] === 2) return 5;
    return 4;
  }
  // 1 pair becomes 3 of a kind
  if (origTypeValue === 1) return 3;
  return 1;
}

function assembleHands(lines) {
  lines.forEach(line => {
    const [hand, bid] = line.split(' ');
    HANDS[hand] = Number(bid);
  })
}

module.exports = getAnswer;
