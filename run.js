if (require.main === module) {
  const {argv} = require('yargs/yargs')(process.argv.slice(2));

  console.log('argv: ', argv);
  const {h, help, f, file, m, module, _} = argv;

  if (h || help) {
    console.log('run ye ole scripts');
    console.log('------------------');
    console.log('-h --help      help');
    console.log('-f --file      file name');
    console.log('-m --module    module name');
    return;
  }

  const currFile = f ? require(f) : require(file);
  console.log('currFile: ', currFile);
  if (currFile && !m && !module) {
    currFile(..._);
    return;
  }
  const currModule = m ? currFile[m] : currFile[module];
  console.log('_:', _)

  currModule(..._);
}
