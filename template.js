if (require.main === module) {
  const { argv } = require('yargs/yargs')(process.argv.slice(2))
    .default('f', './2022/test.js')
    .alias('f', 'file')

  const { f, file } = argv;

  const fs = require('fs')

  let content = "const { readFile } = require('../utils.js')"

  content += "\n"
  content += "\n"
  content += "async function foo(file='../input.txt') {"
  content += "\n"
  content += "  const lines = await readFile(file);"
  content += "\n"
  content += "  console.log(lines);"
  content += "\n"
  content += "}"
  content += "\n"
  content += "\n"
  content += "module.exports = foo;"

  try {
    fs.writeFileSync(f ?? file, content)
  } catch (err) {
    console.error(err)
  }
}
