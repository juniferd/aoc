const { readFile } = require('./utils.js')

async function mostCalories(file = './input.txt') {
  const calories = await readFile(file, String)
  let currCalorieCount = 0
  let maxCalorieCount = 0
  calories.forEach((calorie) => {
    if (calorie === '') {
      if (currCalorieCount > maxCalorieCount) {
        maxCalorieCount = currCalorieCount
      }
      currCalorieCount = 0
    } else {
      currCalorieCount += +calorie
    }
  })
  console.log(maxCalorieCount)
  return maxCalorieCount
}

async function topThreeTotal(file = './input.txt') {
  const calories = await readFile(file, String)

  let caloriesPerElf = []

  let currCalorieCount = 0

  calories.forEach((calorie) => {
    if (calorie === '') {
      caloriesPerElf.push(currCalorieCount)
      currCalorieCount = 0
    } else {
      currCalorieCount += +calorie
    }
  })
  caloriesPerElf.push(currCalorieCount)

  const res = caloriesPerElf.sort((a, b) => a - b).slice(-3)
  console.log(caloriesPerElf)
  console.log(res)
  console.log(res.reduce((acc, num) => num + acc, 0))
}

module.exports = {
  mostCalories,
  topThreeTotal,
}
