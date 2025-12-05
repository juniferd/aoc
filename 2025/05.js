const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  const [fresh, avail] = readLines(lines)
  console.log(fresh)
  // part one
  // let tot = 0
  // avail.forEach(id => {
  //   if (getFresh(id, fresh)) {
  //     tot += 1
  //   }
  // })
  // console.log(tot)
  
  // part two
  const tuples = [];
  fresh.forEach(([start, end]) => {
    tuples.push([start, 'S'])
    tuples.push([end, 'E'])
  })
  tuples.sort((a,b) => a[0] - b[0])
  console.log(tuples)
  let currStart = 0;
  let currEnd = 0;
  let stack = [];
  let tot = 0;
  tuples.forEach(([val, marker]) => {
    console.log('---')
    console.log(stack)
    console.log('VAL', val, marker)
    if (marker === 'S') {
      if (stack.length === 0) {
        currStart = val;
      }
      stack.push(marker)
    } else {
      const lastMarker = stack.pop();
      if (stack.length === 0) {
        tot += val - currStart
        if (currEnd !== currStart) {
          tot += 1
        }
        currEnd = val
      }     
    }
    console.log('tot', tot)
  })
  console.log(tot)
}

function getLength(range=[]) {
  const [first, last] = range;
  return last - first + 1;
}

function getFresh(id=0, fresh=[]) {
  for (let i = 0; i < fresh.length; i++) {
    const [left, right] = fresh[i]
    if (id >= left && id <= right) return true;
  }
}

function notThis() {
  fresh.sort((a, b) => a[0] - b[0])
  console.log(fresh)
  let tot = 0;
  const visited = [];
  fresh.forEach(([first, last]) => {
    console.log('testing', first, '-', last)
    // go through each range in visited and test if first/last fall within range to look for overlaps  
    for (let i = 0; i < visited.length; i++) {
      const currRange = visited[i]
      if (first >= currRange[0] && first <= currRange[1]) {
        first = currRange[1] + 1
        break;
      } else if (last >= currRange[0] && last <= currRange[1]) {
        last = currRange[0] - 1
        break;
      }
    }
    if (first <= last) {
      tot += getLength([first, last])
      visited.push([first, last])
    } else {
      console.log('SKIP')
    }
  })
  console.log(visited)
  console.log(tot)
}

function readLines(lines=[]) {
  let mode = "FRESH"
  const fresh = []
  const avail = [];
  lines.forEach((line) => {
    if (line === '') {
      mode = "AVAIL"
    } else if (mode === 'FRESH') {
      const arr = line.split('-').map(d => parseInt(d))
      fresh.push(arr)
    } else {
      avail.push(parseInt(line))
    }
  })
  return [fresh, avail]
}
module.exports = getAnswer;
