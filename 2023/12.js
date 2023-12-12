const { readFile } = require('../utils.js')

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  const rows = assembleArrangements(lines)
  console.log(rows)
  let sum = 0
  rows.forEach((row, index) => {
    // const res = traverse(0, row.springs, row.arrangements)
    // console.log(row.springs, row.arrangements)
    const newSprings = Array(5)
      .fill('')
      .map((_) => row.springs)
      .join('?')
    const newArrs = Array(5)
      .fill('')
      .map((_) => row.arrangements)
      .join()
      .split(',')
      .map((n) => Number(n))
    console.log(newArrs, newSprings)
    const res = dpTraversal(newSprings + '.', newArrs)
    console.log('res', res)
    sum += res
  })
  console.log('sum', sum)
}

function springsMatchArrangement(springs, arrangements) {
  const groups = springs.split(/\.+/).filter((n) => n !== '')
  const groupLengths = groups.map((n) => n.length).join()
  const strArrangements = arrangements.join()
  console.log(
    'is match?',
    groups,
    groupLengths,
    strArrangements,
    groupLengths === strArrangements
  )
  return groupLengths === strArrangements
}

function dpTraversal(springs, arrangements) {
  const VISITED = {}
  const res = dpTraverse(0, 0, 0)
  return res

  function dpTraverse(springIndex, arrangementIndex, group, curr) {
    console.log('testing', springIndex, arrangementIndex, group, curr)
    if (springIndex >= springs.length) {
      if (arrangementIndex !== arrangements.length) return 0
      console.log('springs', springs.length)
      return 1
    }
    // if (arrangementIndex === arrangements.length) return 0;

    const key = `${springIndex}-${arrangementIndex}-${group}-${curr}`
    if (key in VISITED) return VISITED[key]
    let left = 0
    let right = 0
    if (!curr) {
      curr = springs[springIndex]
    }
    if (curr === '.') {
      if (group > 0) {
        if (group === arrangements[arrangementIndex]) {
          arrangementIndex += 1
          group = 0
        } else {
          // no match
          return 0
        }
      }
      left = dpTraverse(springIndex + 1, arrangementIndex, group)
    } else if (curr === '#') {
      left = dpTraverse(springIndex + 1, arrangementIndex, group + 1)
    } else if (curr === '?') {
      left = dpTraverse(springIndex, arrangementIndex, group, '.')
      right = dpTraverse(springIndex, arrangementIndex, group, '#')
    }

    VISITED[key] = left + right

    return left + right
  }
}

function traverse(index = 0, springs = '', arrangements = []) {
  console.log('testing', springs)
  // find first ? in springs
  const unknownSprings = springs.match(/\?/)

  if (!unknownSprings) {
    // evaluate and see if the arrangements work
    const isMatch = springsMatchArrangement(springs, arrangements)
    if (isMatch) return 1
    return 0
  }

  const unknownSpringIndex = unknownSprings.index

  const left = traverse(
    unknownSpringIndex,
    springs.slice(0, unknownSpringIndex) +
      '.' +
      springs.slice(unknownSpringIndex + 1),
    arrangements
  )
  const right = traverse(
    unknownSpringIndex,
    springs.slice(0, unknownSpringIndex) +
      '#' +
      springs.slice(unknownSpringIndex + 1),
    arrangements
  )

  return left + right
}

function assembleArrangements(lines) {
  return lines.map((line) => {
    let [springs, arrangements] = line.split(' ')
    arrangements = arrangements.split(',').map((n) => Number(n))
    return { springs, arrangements }
  })
}

module.exports = getAnswer
