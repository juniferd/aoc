const { readFile } = require('../utils.js')

let SEEDS = []
const MAP = {}
const mapsOrder = []
const MEMO = {}

async function getAnswer(file = '../input.txt') {
  const lines = await readFile(file)
  createMaps(lines)
  console.log(mapsOrder)
  // console.log(SEEDS)
  // console.log(MAP)
  const SEED_RANGES = []
  let seedMin
  let seedMax
  SEEDS.forEach((seedOrDiff, i) => {
    let seedMinOrDiff = Number(seedOrDiff)
    if (i % 2 === 0) {
      seedMin = seedMinOrDiff
    } else {
      seedMax = seedMin + seedMinOrDiff - 1
      SEED_RANGES.push([seedMin, seedMax])
    }
  })
  console.log(SEED_RANGES)
  // console.log(MAP)
  let minLocation = Infinity
  SEED_RANGES.forEach((seedRange) => {
    const res = getDestinationRange(seedRange, 0)
    console.log('res', res)
    if (res < minLocation) {
      minLocation = res
    }
  })
  console.log('minLocation', minLocation)
  // SEEDS.forEach(seed => {
  //   let source = seed;
  //   mapsOrder.forEach((mapName) => {
  //     const res = getLocation(source, mapName);
  //     source = res;
  //     // console.log('seed',seed,'mapName',mapName, 'source', source)
  //   });
  //   if (source < minLocation) {
  //     minLocation = source;
  //   }
  // })
  // console.log(minLocation)
}

function getDestinationRange([sourceMin, sourceMax], mapNameIndex) {
  const mapName = mapsOrder[mapNameIndex]
  // console.log('testing', sourceMin, sourceMax, mapName, memoKey)
  if (!mapName) console.log(sourceMin)
  if (!mapName) return sourceMin

  const memoKey = `${sourceMin}-${sourceMax}-${mapNameIndex}`
  if (memoKey in MEMO) return MEMO[memoKey]

  const sourceSegments = getSourceSegments([sourceMin, sourceMax], mapName)
  console.log('SOURCE SEGMENTS', sourceSegments)
  const destSegments = sourceSegments.map(([segMin, segMax]) => [
    getLocation(segMin, mapName),
    getLocation(segMax, mapName),
  ])

  console.log('DEST SEGMENTS', destSegments)
  // console.log(sourceRanges)

  const res = Math.min(
    ...destSegments.map((source) =>
      getDestinationRange(source, mapNameIndex + 1)
    )
  )
  MEMO[memoKey] = res

  return res
}

function getSourceSegments([sourceMin, sourceMax], mapName) {
  const currMap = MAP[mapName]
  const rangeKeys = Object.keys(currMap)
  const points = []

  rangeKeys.forEach((rangeKey) => {
    const [keyMin, keyMax] = rangeKey.split('-')
    const kMin = Number(keyMin)
    const kMax = Number(keyMax)
    if (kMin > sourceMin && kMin < sourceMax) {
      points.push(kMin)
    }
    if (kMax > sourceMin && kMax < sourceMax) {
      points.push(kMax)
    }
  })

  points.sort((a, b) => a - b)
  if (points.length > 0) {
    const sources = []
    let last = sourceMin
    points.forEach((pt) => {
      sources.push([last + 1, pt])
      last = pt
    })
    sources.push([last + 1, sourceMax])
    return sources
  } else {
    return [[sourceMin, sourceMax]]
  }
}

function getLocation(source, mapName) {
  source = Number(source)
  const currMap = MAP[mapName]
  console.log('currMap', currMap)
  console.log('Mapping', source, 'To dest')
  const rangeKeys = Object.keys(currMap)
  for (let i = 0; i < rangeKeys.length; i++) {
    const sourceKey = rangeKeys[i]
    const [sourceMin, sourceMax] = sourceKey.split('-')
    const sMin = Number(sourceMin)
    const sMax = Number(sourceMax)
    if (source >= sMin && source <= sMax) {
      // get the diff
      const diff = source - sMin
      console.log('Mapped to', currMap[sourceKey][0] + diff, currMap[sourceKey])
      return currMap[sourceKey][0] + diff
    }
  }
  // if (source in MAP[mapName]) {
  //   return MAP[mapName][source]
  // }
  return Number(source)
}

function createMaps(lines) {
  let currMapName
  let currObj = {}

  lines.forEach((line, i) => {
    if (i === 0) {
      const [_, seeds] = line.split(':')
      SEEDS = seeds.trim().split(/\s+/)
    } else if (line === '') {
      if (!!currMapName) {
        MAP[currMapName] = currObj
        mapsOrder.push(currMapName)
      }
      currMapName = undefined
      currObj = {}
      // next map
    } else if (currMapName === undefined) {
      const [mapName] = line.split(' ')
      currMapName = mapName
    } else {
      const [dest, source, range] = line.split(' ')
      const destMax = Number(dest) + Number(range) - 1
      const sourceMax = Number(source) + Number(range) - 1

      currObj[`${source}-${sourceMax}`] = [Number(dest), destMax]

      // for (let j = 0; j < Number(range); j++) {
      //   const sourceId = Number(source) + j
      //   const destId = Number(dest) + j
      //   currObj[sourceId] = destId
      // }
    }
  })
  MAP[currMapName] = currObj
  mapsOrder.push(currMapName)
}

module.exports = getAnswer
