const { readFile } = require('../utils.js')

/*
async function findSum2020(file='../input.txt') {
  const lines = await readFile(file, Number);
  const dict = {};

  // lines.forEach(num => {
  //   const res = 2020 - num;
  //   if (String(res) in dict) {
  //     console.log('found')
  //     console.log(res * num)
  //   } else {
  //     dict[num] = res;
  //   }
  // })
    //

  for (let i = 0; i < lines.length; i++) {
    const num = lines[i];
    dict[num] = num;
    for (let j = i+1; j < lines.length; j++) {
      const diff = 2020 - num - lines[j];
      if (diff in dict) {
        console.log(num * diff * lines[j])
        break;
      }
    }
  }
}
*/

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
}

module.exports = getAnswer;
