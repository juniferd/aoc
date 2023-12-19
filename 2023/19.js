const { readFile } = require('../utils.js')

WORKFLOWS = {}
RATINGS = []

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createWorkflowsAndRatings(lines)
  // console.log(WORKFLOWS)
  // console.log(RATINGS)
  partTwo()
}

function partTwo() {
  const ACCEPTED = []
  const VISITED = {}
  traverse()
  // console.log(ACCEPTED)
  console.log(getComboSize(ACCEPTED))

  function getComboSize(accepted) {
    return accepted.reduce((acc, curr) => {
      const ranges = Object.values(curr)
      let currTot = 1
      ranges.forEach(([a, b]) => (currTot *= b - a + 1))
      // console.log(currTot)
      return acc + currTot
    }, 0)
  }

  function traverse(
    parts = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
    node = 'in'
  ) {
    const key = `${Object.entries(parts)}-${node}`
    if (key in VISITED) {
      console.log('VISITED')
      return
    }
    if (node === 'A') {
      console.log('ACCEPTED', parts)
      ACCEPTED.push(parts)
      return
    }
    if (node === 'R') {
      console.log('REJECTED', parts)
      return
    }
    VISITED[key] = true
    const workflow = WORKFLOWS[node]
    // console.log('CURR', parts)
    workflow.forEach(({ part, comparisonOperator, val, next }) => {
      if (comparisonOperator === '<') {
        traverse({ ...parts, [part]: [parts[part][0], val - 1] }, next)
        parts[part] = [val, parts[part][1]]
      } else if (comparisonOperator === '>') {
        traverse({ ...parts, [part]: [val + 1, parts[part][1]] }, next)
        parts[part] = [parts[part][0], val]
      } else if (!part) {
        traverse(parts, next)
      }
    })
  }
}

function partOne() {
  let tot = 0
  RATINGS.forEach((rating) => {
    const acceptedOrRejected = performWorkflow(rating)
    if (acceptedOrRejected === 'A') {
      tot += Object.values(rating).reduce((acc, r) => acc + r, 0)
    }
  })
  console.log(tot)
}

function performWorkflow(rating, next = 'in') {
  if (next === 'A') return 'A'
  if (next === 'R') return 'R'
  const workflow = WORKFLOWS[next]
  const matchedNext = workflow.find(
    ({ part, comparisonOperator, val, next }) => {
      if (comparisonOperator === '<') {
        return rating[part] < val
      } else if (comparisonOperator === '>') {
        return rating[part] > val
      } else if (!part) {
        return true
      }
    }
  )
  return performWorkflow(rating, matchedNext.next)
}

function createWorkflowsAndRatings(lines) {
  let workflow = true
  lines.forEach((line) => {
    if (workflow) {
      if (line === '') {
        workflow = false
      } else {
        const { id, rules } = createWorkflow(line)
        WORKFLOWS[id] = rules
      }
    } else {
      const res = createRating(line)
      RATINGS.push(res)
    }
  })
}

function createWorkflow(line) {
  const [id, _, rules] = line.split(/(\{|\})/)
  const res = []
  rules.split(',').forEach((rule) => {
    const a = rule.split(/(\>|\<|\:)/)
    if (a.length === 1) {
      res.push({ next: a[0] })
    } else {
      const [part, comparisonOperator, valStr, _, next] = a
      res.push({ part, comparisonOperator, val: Number(valStr), next })
    }
  })
  return { id, rules: res }
}

function createRating(line) {
  const res = {}
  line
    .split(/(\{|\})/)[2]
    .split(',')
    .forEach((partStr) => {
      const [part, countStr] = partStr.split('=')
      res[part] = Number(countStr)
    })
  return res
}

module.exports = getAnswer
