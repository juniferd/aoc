const { readFile } = require('../utils.js')

function createRule(monkeyRules, currMonkey, rules) {
  monkeyRules[currMonkey] = rules
  return monkeyRules
}

function getItemsModulo(monkeyRules) {
  const monkeyKeys = Object.keys(monkeyRules)
  let updatedItems = Array(monkeyKeys.length).fill('');
  let divisors = Array(monkeyKeys.length).fill('')
  monkeyKeys.forEach((monkey) => {
    const {items, test} = monkeyRules[monkey];
    const monkeyIndex = +monkey.slice(6, 8);
    const divisor = +test.slice(13);
    divisors[monkeyIndex] = divisor
    updatedItems[monkeyIndex] = items;
  })

  const moduloItems = updatedItems.map((items) => {
    return items.map((item) => {
      item = +item;
      return divisors.map((divisor) => {
        return [Math.floor(item / divisor), item % divisor]
      })
    })
  })
  return {moduloItems, divisors};
}

function createRules(lines) {
  const monkeyRules = {};
  let currMonkey;
  let currRules = {}
  lines.forEach((line) => {
    line = line.trimStart()
    if (line.startsWith('Monkey')) {
      currMonkey = line.toLowerCase();
    } else if (line.startsWith('Starting')) {
      currRules.items = line.slice(16).split(',')
    } else if (line.startsWith('Operation')) {
      currRules.operation = line.slice(11)
    } else if (line.startsWith('Test')) {
      currRules.test = line.slice(6)
    } else if (line.startsWith('If true')) {
      currRules.true = line.slice(18)
    } else if (line.startsWith('If false')) {
      currRules.false = line.slice(19)
    } else if (line === '') {
      createRule(monkeyRules, currMonkey, currRules)
      currRules = {}
    }
  });
  createRule(monkeyRules, currMonkey, currRules)
  return monkeyRules;
}

function getWorry(item, operations) {
  const newVal = operations[4] === 'old' ? item : +operations[4]
  if (operations[3] === '*') {
    return item * newVal
  }
  if (operations[3] === '+') {
    return item + newVal
  }
}

// [3, 0] = 3 * 13 + 0 //39
// 39 * 39 = 1521
// [3, 0] * [3, 0] = (3 * 13 + 0) * (3 * 13 + 0) = (3 * 3 * 13) * 13 + 0 = [117, 0]
// [3, 4] * [3, 4] = (3 * 13 + 4) * (3 * 13 + 4) = 13 * (3 * 3 * 13 + (2 * 4 * 3)) + (4 * 4) = [141, 16] = [142, 3]
// [3, 1] = 3 * 13 + 1
// [3, 1] + [3, 1] = (3 * 13 + 1) + (3 * 13 + 1) = [2 * 3 * 13, 1 + 1] = [6, 2]
// [3, 2] * 4 = (3 * 13 + 2) * 4 = [3 * 4, 2 * 4] = [12, 8]
// [3, 3] + 5 = (3 * 13 + 3) + 5 = [3, 3 + 5] = [3, 8]
function getWorries(items, operations, divisors) {
  return items.map((item, i) => {
    const divisor = divisors[i];
    const newVal = operations[4] === 'old' ? item : +operations[4]
    const [quotient, remainder] = item;
    let newQuotient;
    let newRemainder;
    if (operations[3] === '*') {
      if (operations[4] === 'old') {
        newQuotient = quotient ** 2 * divisor + (remainder * quotient * 2)
        newRemainder = remainder ** 2
      } else {
        newQuotient = quotient * newVal;
        newRemainder = remainder * newVal;
      }
    } else if (operations[3] === '+') {
      if (operations[4] === 'old') {
        newQuotient = quotient * 2
        newRemainder = remainder * 2
      } else {
        newQuotient = quotient
        newRemainder = remainder + newVal
      }
    }
    newQuotient += Math.floor(newRemainder / divisor)
    newRemainder -= Math.floor(newRemainder / divisor) * divisor
    return [newQuotient, newRemainder]
  })
}

function testMonkey(worry, test) {
  const val = +test.slice(13)
  return worry % val === 0
}

function doMonkeyTurn(monkey, inspections, monkeyRules) {
  const {items, operation, test, true: ifTrue, false: ifFalse} = monkeyRules[monkey];
  while (items.length > 0) {
    let item = +items.shift();
    // console.log('curr item', item)
    // inspect item
    inspections[monkey] += 1
    // get new worry level
    let worry = getWorry(item, operation.split(' '))
    // monkey bored
    // console.log('worry', worry)
    // worry = Math.floor(worry / 3)
    // console.log('worry 2', worry)
    // test
    const testResult = testMonkey(worry, test)
    // update mokey state
    if (testResult) {
      const newMonkey = monkeyRules[`${ifTrue}:`]
      newMonkey.items.push(worry)  
    } else {
      const newMonkey = monkeyRules[`${ifFalse}:`]
      newMonkey.items.push(worry)  
    }
  }
}

function testMonkeyModulo(worries, monkeyIndex) {
  return worries[monkeyIndex][1] === 0
}

function doMonkeyTurnModulo(monkeyIndex, monkeyRules, inspections, moduloItems, divisors) {
  const {operation, true: ifTrue, false: ifFalse} = monkeyRules[`monkey ${monkeyIndex}:`];
  let newModuloItems = [...moduloItems];
  let items = newModuloItems[monkeyIndex] ?? []

  // console.log('TURN FOR MONKEY:', monkeyIndex)
  // console.log('MONKEY HAS', items)
  while (items.length > 0) {
    let dItems = items.shift();
    // console.log('curr item', item)
    // inspect item
    if (monkeyIndex in inspections) {
      inspections[monkeyIndex] += 1
    } else {
      inspections[monkeyIndex] = 1
    }
    // get new worry level
    // console.log('curr item', dItems)
    let worries = getWorries(dItems, operation.split(' '), divisors)
    // console.log('original', dItems)
    // console.log('old item:', (dItems[0][0] * divisors[0]) + dItems[0][1])
    // console.log('new worry:', worries[0][0] * divisors[0] + worries[0][1])
    // monkey bored
    // console.log('worry', worry)
    // worry = Math.floor(worry / 3)
    // console.log('worry 2', worry)
    // test
    const testResult = testMonkeyModulo(worries, monkeyIndex)
    // update mokey state
    if (testResult) {
      const newMonkeyIndex = ifTrue.slice(7)
      // console.log('isTrue: move', dItems, ' to monkey ',newMonkeyIndex)
      newModuloItems[newMonkeyIndex].push(worries)  
    } else {
      const newMonkeyIndex = ifFalse.slice(7)
      // console.log('isFalse: move', dItems, ' to monkey ',newMonkeyIndex)
      newModuloItems[newMonkeyIndex].push(worries)  
    }
    newModuloItems[monkeyIndex] = []
  }
  // console.log('end of turn items', newModuloItems.map(items => items[0]))
  return newModuloItems;
}

function chaseMonkeys(monkeyRules, inspections, rounds, moduloItems, divisors) {
  for (let i = 0; i < rounds; i++) {
    Object.keys(monkeyRules).forEach((monkey) => {
      doMonkeyTurn(monkey, inspections, monkeyRules)
      // console.log(Object.keys(monkeyRules).map(m => ({ [m]: monkeyRules[m].items })))
    })
  }
}
function chaseMonkeysModulo(monkeyRules, inspections, moduloItems, divisors) {
  let newModuloItems = [...moduloItems]
  divisors.forEach((_, i) => {
    newModuloItems = doMonkeyTurnModulo(i, monkeyRules, inspections, moduloItems, divisors);
  });
  return newModuloItems;
}

async function getMonkeyBusiness(file='../input.txt') {
  const lines = await readFile(file);
  const monkeyRules = createRules(lines);
  // console.log(monkeyRules)
  let {moduloItems, divisors} = getItemsModulo(monkeyRules)
  const inspections = {};
  // go 20 rounds

  const ROUNDS = 10000;
  // how to handle large numbers
  for (let i = 0; i < ROUNDS; i++) {
    // console.log('>>>> ROUND ', i)
    moduloItems = chaseMonkeysModulo(monkeyRules, inspections, moduloItems, divisors)
  }
  // // find 2 monkeys with most number of inspections
  // console.log('inspections', inspections)
  const sortedValues = Object.values(inspections).sort((a,b) => b - a);
  // console.log(sortedValues)
  console.log(sortedValues[0] * sortedValues[1])
}

module.exports = getMonkeyBusiness;
