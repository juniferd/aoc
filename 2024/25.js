const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  console.log(lines);
}

module.exports = getAnswer;