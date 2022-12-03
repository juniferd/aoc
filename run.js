if (require.main === module) {
  const { argv } = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -f [filename] -m [module name] [optional inputs]')
    .describe('f', 'Load a file')
    .alias('f', 'file')
    .default('f', 'input.txt')
    .describe('m', 'Load a module')
    .alias('m', 'module')
    .help('h')

  console.log('argv: ', argv)
  const { f, file, m, module, _ } = argv

  const currFile = f ? require(f) : require(file)
  console.log('currFile: ', currFile)
  if (currFile && !m && !module) {
    currFile(..._)
    return
  }
  const currModule = m ? currFile[m] : currFile[module]
  console.log('_:', _)

  currModule(..._)
}
