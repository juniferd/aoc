const { readFile } = require('../utils.js')

async function foo(file='../input.txt') {
  const lines = await readFile(file);
  console.log(lines);
}

module.exports = foo;