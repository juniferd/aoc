function update(r, a, x) {
  return [r[0] + a[0], r[1] + a[1]]
}


function ways() {
  let counts = {}
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        let s = i + j + k
        if (!(s in counts)) {
          counts[s] = 1
        } else {
          counts[s] += 1
        }
      }
    }
  }

  return counts
}

const WAYS = ways()
console.log("WAYS", WAYS)
function solve(s1, p1, s2, p2, turn, cache={}) {
  let cacheKey = `${s1},${p1}:${s2},${p2}:${turn}`
  if (p1 >= 21) {
    return 1
  }
  if (p2 >= 21) {
    return 0
  }

  if (cacheKey in cache) {
    return cache[cacheKey]
  }


  let ret = 0;
  if (turn) {
    for (let k in WAYS) {
      let s = (s1 + Number(k))
      if (s > 10) { s -= 10 }
      ret += solve(s, p1 + s, s2, p2, !turn, cache) * WAYS[k]
    }
  } else {
    for (let k in WAYS) {
      let s = (s2 + Number(k))
      if (s > 10) { s -= 10 }
      ret += solve(s1, p1, s, p2 + s, !turn, cache) * WAYS[k]
    }
  }


  cache[cacheKey] = ret

  return ret
}


function solve2(s1, p1, s2, p2, cache={}) {
  if (p2 <= 0) { return [0, 1] }

  let ck = `${s1},${p1}:${s2},${p2}`
  if (ck in cache) { return cache[ck]; }

  let ret = [0, 0]
  for (let k in WAYS) {
    let s = (s1 + Number(k))
    if (s > 10) { s -= 10 }

    let [r2, r1] = solve2(s2, p2, s, p1 - s, cache)
    ret[0] += r1 * WAYS[k]
    ret[1] += r2 * WAYS[k]
  }

  cache[ck] = ret

  return ret;

}

console.log(solve2(3, 21, 4, 21))
