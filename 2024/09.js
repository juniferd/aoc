const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  // doPartOne(lines)
  doPartTwo(lines)
}

function doPartTwo(lines = []) {
  const filesAndFreeSpace = lines[0].split('').map(n => Number(n))
  let ids = [];
  const counts = {};
  const spaces = [];
  let fileId = null;
  for (let i = 0; i < filesAndFreeSpace.length; i++) {
    const curr = filesAndFreeSpace[i];
    const id = Math.floor(i / 2);
    if (i % 2 === 0) {
      counts[id] = curr;
      fileId = id;
    } else {
      spaces.push(curr)
    }
    for (let j = 0; j < curr; j++) {
      ids.push(i % 2 === 0 ? id : '.')
    }
  }

  // console.log(counts)
  console.log(ids.join(','))
  console.log('SUM', ids.reduce((acc, curr) => curr === '.' ? acc : acc + curr, 0))
  console.log(filesAndFreeSpace.reduce((acc, curr) => acc + curr, 0))
  let done = false;
  let filePointer = filesAndFreeSpace.length % 2 === 0 ? filesAndFreeSpace.length - 2 : filesAndFreeSpace.length - 1;
  while (!done) {
    const fileCount = counts[fileId];
    const fileIndex = filesAndFreeSpace.slice(0, filePointer).reduce((acc, curr) => acc + curr, 0)
    
    for (let i = 1; i < filePointer; i += 2) {
      const spaceCount = filesAndFreeSpace[i];
      if (fileCount <= spaceCount) {
        const spaceIndex = filesAndFreeSpace.slice(0, i).reduce((acc, curr) => acc + curr, 0)
        // replace each of the empty spaces with file id
        for (let j = spaceIndex; j < spaceIndex + fileCount; j++) {
          ids[j] = fileId;
        }
        // decrement spaceCount
        filesAndFreeSpace[i] -= fileCount
        filesAndFreeSpace[filePointer] -= fileCount

        // replace each of the old file id spaces with 
        for (let j = fileIndex; j < fileIndex + fileCount; j++) {
          ids[j] = '.'
        }
        // increment fileCount
        filesAndFreeSpace[i - 1] += fileCount
        filesAndFreeSpace[filePointer - 1] += fileCount
        break;
      }
    }

    // decrement fileId
    fileId -= 1;
    filePointer -= 2;
    if (filePointer === 0) {
      done = true;
    }
    // console.log('---')
    // console.log(ids.join(','))
    // console.log(filesAndFreeSpace.join(','))
    
  }
    let tot = 0;
    for (let i = 0; i < ids.length; i++) {
      const curr = ids[i];
      tot += curr !== '.' ? (curr * i) : 0;
    }
    // console.log('ids', ids.join(','))
    console.log('SUM', ids.reduce((acc, curr) => curr === '.' ? acc : acc + curr, 0))
    console.log(filesAndFreeSpace.reduce((acc, curr) => acc + curr, 0))
    console.log('TOTAL:', tot)
}

function doPartOne(lines = []) {
  lines.forEach(line => {
    const filesAndFreeSpace = line.split('').map(n => Number(n))
    console.log(filesAndFreeSpace)
    let ids = []
    for (let i = 0; i < filesAndFreeSpace.length; i++) {
      const file = i % 2 === 0 ? true : false;
      const id = Math.floor(i / 2);
      const curr = filesAndFreeSpace[i];
      for (let j = 0; j < curr; j++) {
        ids.push(file ? id : '.')
      }
    }
    console.log(ids.join(','))
    // ids = ids.join('').split('').map(n => n === '.' ? '.' : Number(n))
    // console.log(ids)
    // TODO: verify IDs that are multiple digits occupy a single index position

    console.log('SUM', ids.reduce((acc, curr) => curr === '.' ? acc : acc + curr, 0))
    console.log('WHAT', ids.length)
    // move file blocks

    let lastIndex = 0;
    while (lastIndex < ids.length - 1) {
      curr = ids.pop();
      if (curr !== '.') {
        const freeIndex = findFreeIndex(ids, lastIndex)

        ids[freeIndex] = curr;
        lastIndex = freeIndex + 1
      }
    }
    console.log('done')
    console.log('SUM', ids.reduce((acc, curr) => acc + curr, 0))
    // console.log(ids.join(','))
    let tot = 0;
    for (let i = 0; i < ids.length; i++) {
      const curr = ids[i];
      const next = tot + (curr * i);
      if (next < tot) {
        console.log('UH OH')
      } 
      tot = next
    }
    // const tot = ids.reduce((acc, curr, index) => acc + (curr * index),0)
    console.log('total:', tot)
  })
}

function findFreeIndex(ids = [], start = 0) {
  for (let i = start; i < ids.length; i++) {
    const curr = ids[i];
    if (curr === '.') return i;
  }
  return ids.length;
}
module.exports = getAnswer;
