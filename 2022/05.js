const { readFile } = require('../utils.js')

// eff why
function followInstructions(str, crates, isUpdated) {
  const instructions = str.split(' ');
  let mode = ''
  let quantity = 0;
  let curr = [];
  instructions.forEach(instruction => {
    if (instruction === 'move') {
      mode = 'MOVE'
    }
    if (instruction === 'from') {
      mode = 'FROM'
    }
    if (instruction === 'to') {
      mode = 'TO'
    }
    if (!isNaN(+instruction)) {
      if (mode === 'MOVE') {
        quantity = +instruction;
      }
      if (mode === 'FROM') {
        if (isUpdated) {
          curr.push(...crates[+instruction - 1].slice(-quantity))
          for (i = 0; i < quantity; i++) {
            crates[+instruction -1].pop();
          }
        } else {
          for (i = 0; i < quantity; i++) {
            curr.push(crates[+instruction - 1].pop())
          }
        }
      }
      if (mode === 'TO') {
        for (i = 0; i < curr.length; i++) {
          crates[+instruction - 1].push(curr[i])
        } 
      }
    }
  })
  return crates;
}

function makeCrateStack(crateRow, crates) {
  const cratesCurr = crateRow.split(' ');
  let index = 0;
  let spCount = 0;
  cratesCurr.forEach((sp, i) => {
    if (sp === '') {
      spCount += 1;
      if (spCount % 4 === 0) {
        index += 1
      }
    }
    if (sp.startsWith('[')) {
      spCount = 0;
      // insert into crate array of array
      crates[index].unshift(sp[1])
      index += 1
    }
  });
  return crates;
}
async function arrangeCrates(file='../input.txt') {
  const lines = await readFile(file);
  let curr = '';
  let mode = 'CRATES';
  let crates = [[]];
  const instructions = [];
  const tempCrates = [];


  for (i = 0; i < lines.length; i++) {
    curr=lines[i];
    // console.log(curr == '')
    if (curr.startsWith(' 1')) {
      crates = curr.split('  ').map(c => ([]))
    } else if (curr == '') {
      mode = 'INSTRUCTIONS'
    } else if (mode === 'CRATES') {
      tempCrates.push(curr)
    } else if (mode === 'INSTRUCTIONS') {
      // console.log('instructions>>', curr)
      instructions.push(curr)
    }
  }

  tempCrates.forEach(crateRow => {
    makeCrateStack(crateRow, crates)
  })
  // console.log(crates)

  instructions.forEach(instruction => {
    followInstructions(instruction, crates)
  })
  // console.log(crates)

  // get top
  console.log(crates.map((stack) => stack.slice(-1)))
}

async function arrangeCrates2(file='../input.txt') {
  const lines = await readFile(file);
  let curr = '';
  let mode = 'CRATES';
  let crates = [[]];
  const instructions = [];
  const tempCrates = [];


  for (i = 0; i < lines.length; i++) {
    curr=lines[i];
    if (curr.startsWith(' 1')) {
      crates = curr.split('  ').map(c => ([]))
    } else if (curr == '') {
      mode = 'INSTRUCTIONS'
    } else if (mode === 'CRATES') {
      tempCrates.push(curr)
    } else if (mode === 'INSTRUCTIONS') {
      // console.log('instructions>>', curr)
      instructions.push(curr)
    }
  }

  tempCrates.forEach(crateRow => {
    makeCrateStack(crateRow, crates)
  })
  // console.log(crates)

  instructions.forEach(instruction => {
    followInstructions(instruction, crates, true)
  })
  // console.log(crates)

  // get top
  console.log(crates.map((stack) => stack.slice(-1)).join(''))
}

module.exports = arrangeCrates2;
