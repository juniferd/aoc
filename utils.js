const fs = require('fs')
const readline = require('readline')

async function writeFile(outputFile = './output.txt', data = '') {
  fs.writeFileSync(outputFile, data)
  console.log('successful')
}

async function readFile(
  inputFile = './input.txt',
  coerceType = String,
  separator
) {
  const fileStream = fs.createReadStream(inputFile)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  const output = []
  for await (const line of rl) {
    output.push(separator ? line.split(separator) : coerceType(line))
  }

  console.log(output)

  return output
}

function binaryToDecimal(binaryNumber = '00100') {
  return binaryNumber
    .split('')
    .reverse()
    .reduce((acc, curr, i) => {
      // console.log('acc', acc, 'curr', curr, 'i', i)
      return 2 ** i * Number(curr) + acc
    }, 0)
}

function decimalToBinary(num=10, size) {
  let i = Math.floor(Math.log2(num));
  let curr = num;
  let res = Array(i+1).fill(0).map((_, n) => {
    const on = 2 ** (i - n);
    // console.log('curr', curr, on, n, i)
    if (curr - on >= 0) {
      curr -= on;
      return 1;
    }
    return 0;
  })

  if (size) {
    while (res.length < size) {
      res.unshift(0);
    }
  }

  return res.join('')
}

// TODO: rename me - this isn't accurate
function hexadecimalToBinary(hex='D2A1') {
  return hex
    .split('')
    .reduce((acc, curr) => {
      let decimal = +curr;
      if (isNaN(+curr)) {
        decimal = curr.charCodeAt(0) - 55
      }
      return acc + decimalToBinary(decimal, 4)
    }, '')
}

module.exports = {
  readFile,
  writeFile,
  binaryToDecimal,
  decimalToBinary,
  hexadecimalToBinary,
}
