const fs = require('fs')
const readline = require('readline')

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

module.exports = {
  readFile,
  binaryToDecimal,
}
