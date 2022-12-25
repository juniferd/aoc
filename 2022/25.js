const { readFile } = require('../utils.js')

const SNAFU_LOOKUP = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
}

function getSNAFUToDecimal(number) {
  const digits = number.split('').reverse()
  let tot = 0;
  digits.forEach((digit, i) => {
    const res = 5 ** i * SNAFU_LOOKUP[digit]
    tot += res
  }) 
  return tot
}

/*
 * 1 => 1
 * 2 => 2
 * 3 => 1=
 * 4 => 1-
 * 5 => 10
 * 6 => 11
 * 7 => 12
 * 8 => 2=
 * 9 => 2-
 * 10 => 20
 * 11 => 21
 * 12 => 22
 * 13 => 1==
 * 14 => 1=-
 * 15 => 1=0
 * 16 => 1=1
 * 17 => 1=2
 * 18 => 1-=
 * 19 => 1--
 * 20 => 1-0
 * 21 => 1-1
 * 22 => 1-2
 * 23 => 10=
 * 24 => 10-
 * 25 => 100
 * 26 => 101
 * 27 => 102
 * 28 => 11=
 * 29 => 11-
 * 30 => 110
 * 31 => 111
 * 32 => 112
 * 33 => 12=
 * 34 => 12-
 * 35 => 120
 * 36 => 121
 * 37 => 122
 * 38 => 2==
 * 
 * 125 => 1000
 */
function getDecimalToSNAFU(numbers) {
  
}

function generateSNAFU() {
  const res = {}
  const snafus = {}

  const nums = [2, 1, 0, '-', '='];
  nums.forEach(num => snafus[num] = true)
  
  for (let i = 0; i < 5; i++) {
    const keys = Object.keys(snafus);
    nums.forEach(num => {
      keys.forEach((key) => {
        const newKey = `${key}${num}`
        const val = getSNAFUToDecimal(newKey)
        snafus[newKey] = val
        res[val] = newKey
      })
    })
    // console.log(res)
  }
  return res
}

function getTarget(total) {
  const res = Array(20).fill('2')
  let found = false

  while (!found) {

  }
}

function convertBase5ToSNAFU(num) {
  const strs = String(num).split('')
  let str = ''
  for (let i = strs.length - 1; i > -1; i--) {
    const curr = Number(strs[i])
    if (curr > 2) {
      const next = Number(strs[i - 1])
      strs[i - 1] = next + 1
      if ( curr === 3 ) {
        str += '='
      } else if (curr == 4) {
        str += '-'
      } else if (curr === 5) {
        str += '0'
      }
      // str += curr === 4 ? '-' : '='
    } else {
      str += curr
    }
  }
  return str.split('').reverse()
}

function convertToBase5(num) {
  return num.toString(5)
}

async function getSum(file='../input.txt') {
  const numbers = await readFile(file);

  let total = 0;
  numbers.forEach(number => {
    total += getSNAFUToDecimal(number)
  })
  console.log('total', String(total).length, total, Math.floor(total % 5))
  const base5 = convertToBase5(total)
  console.log(convertBase5ToSNAFU(base5).join(''))

  console.log(convertToBase5(4098))
  console.log(convertBase5ToSNAFU(convertToBase5(4098)), getSNAFUToDecimal('12=-0='))
  

  // console.log('22222222222222222222'.length, getSNAFUToDecimal('22222222222222222222'), String(getSNAFUToDecimal('22222222222222222222')).length)
  // console.log(getSNAFUToDecimal('12222222222222222222'), String(getSNAFUToDecimal('22222222222222222222')).length)
  // console.log(getSNAFUToDecimal('122-0000000000000000'), String(getSNAFUToDecimal('22222222222222222222')).length)
}

module.exports = getSum;
