const { readFile } = require('../utils.js')

async function getAnswer(file='../input.txt') {
  const lines = await readFile(file);
  // doPart1(lines)
  doPart2(lines)
}

function doPart2(lines = []) {
  let tot = 0;
  lines.forEach(line => {
    let [target, nums] = line.split(': ')
    target = Number(target)
    nums = nums.split(' ').map(n => Number(n))
    const res = validateWithConcat(target, nums)
    if (res) {
      tot += target
    }
  })
  console.log('total', tot)
}

function validateWithConcat(target=0, nums=[]) {
  console.log('---')
  const ret = traverseWithConcat(1, target, nums, nums[0]);
  console.log('is match?', ret)
  if (ret > -Infinity) return 1
}

function traverseWithConcat(index=0, target=0, nums=[], currTotal=0) {
  if (currTotal > target) return -Infinity;
  if (index === nums.length) {
    if (currTotal === target) return 1;
    return -Infinity;
  }
  const left = traverseWithConcat(index + 1, target, nums, currTotal + nums[index])
  const right = traverseWithConcat(index + 1, target, nums, currTotal * nums[index])
  const center = traverseWithConcat(index + 1, target, nums, Number(`${currTotal}${nums[index]}`))

  return Math.max(left, right, center)
}

function doPart1(lines = []) {
  let tot = 0;
  lines.forEach(line => {
    let [target, nums] = line.split(': ')
    target = Number(target)
    nums = nums.split(' ').map(n => Number(n))
    // reversing this was dumb
    const res = validate(target, nums.reverse())
    if (res) {
      tot += target
    }
  })
  console.log('total', tot)
}

function validate(target=0, nums=[]) {
  console.log('----')
  const ret = traverse(0, target, nums)
  console.log('ret', ret)
  if (ret > -Infinity) return ret;
}

function traverse(index=0,target=0,nums=[]) {
  console.log('CURR', index, target, nums[index])
  if (index === nums.length - 1 && target === nums[index]) {
    console.log('TARGET 0')
    return nums[index]
  }
  if (index === nums.length - 1 && target !== nums[index]) {
    return -Infinity;
  }
  // if (currTotal > target) return Infinity;
  const left = traverse(index + 1, target - nums[index], nums) + nums[index]
  const right = traverse(index + 1, target / nums[index], nums) * nums[index]

  return Math.max(left, right)

}

module.exports = getAnswer;
