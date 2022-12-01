if (require.main === module) {
  const {argv} = require('yargs/yargs')(process.argv.slice(2));

  console.log('argv: ', argv);
  const {f, m, file, module, _} = argv;

  const currFile = f ? require(f) : require(file);
  console.log('currFile: ', currFile);
  const currModule = m ? currFile[m] : currFile[module];
  console.log('_:', _)

  currModule(..._);
}
