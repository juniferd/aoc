const { readFile } = require('../utils.js')

function isUnique(numbers) {
  const dict = {}
  for (let i = 0; i < numbers.length; i++) {
    number = numbers[i]
    if (number in dict) {
      console.log('repeat', number)
      return false
    }
    dict[number] = true
  }
  return true
}

function moveNumber(index, numbers, maxLength) {
  const [num] = numbers[index]
  let numWraps = Math.floor(Math.abs((num + index) / maxLength))
  let newIndex = (num + index) % maxLength

  if (numWraps > 0 && num < 0) {
    newIndex -= numWraps
  }
  if (numWraps > 0 && num > 0) {
    newIndex += numWraps
  }

  let k = 0
  while (newIndex >= maxLength) {
    // console.log('wrap to front')
    newIndex = newIndex - maxLength + 1
    k += 1
  }
  while (newIndex <= 0) {
    // console.log('wrap to back')
    newIndex = newIndex + maxLength - 1
    k += 1
  }


  if (index === newIndex) return numbers

  const currTuple = numbers.splice(index, 1)

  numbers = numbers
    .slice(0, newIndex)
    .concat(currTuple)
    .concat(numbers.slice(newIndex))
  return numbers
  // return numbers.slice(0,newIndex).concat([numbers[index]]).concat(numbers.slice(newIndex))
}

function getNewNums(targetIndex, zeroIndex, numbers, length) {
  const i = (targetIndex + zeroIndex) % length
  return numbers[i]
}

// how to deal with dupes?
async function mix(file = '../input.txt') {
  const numbers = await readFile(file, Number)
  const DECRYPTION = 811589153
  let numbersWithOriginalIndex = numbers.map((number, i) => [
    number * DECRYPTION,
    i,
  ])
  const maxLength = numbers.length

  for (let j = 0; j < 10; j++) {
    const start = +new Date()
    for (let i = 0; i < numbers.length; i++) {
      const currIndex = numbersWithOriginalIndex.findIndex(
        ([_, index]) => i === index
      )

      numbersWithOriginalIndex = moveNumber(
        currIndex,
        numbersWithOriginalIndex,
        maxLength
      )
    }
    console.log("TOOK", +new Date() - start);
  }
  console.log(numbersWithOriginalIndex.map(([n]) => n))

  const zeroIndex = numbersWithOriginalIndex.findIndex(([num]) => num === 0)
  const indices = [1000, 2000, 3000]
  const res = indices.map((targetIndex) => {
    return getNewNums(
      targetIndex,
      zeroIndex,
      numbersWithOriginalIndex,
      maxLength
    )
  })
  console.log(res)
  console.log(res.reduce((acc, [n]) => acc + n, 0))
}

module.exports = mix
