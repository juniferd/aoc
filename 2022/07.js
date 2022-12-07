const { readFile } = require('../utils.js')

function createTree(root, lines) {
  let parent = root;
  let currLevel = [];
  lines.forEach((line, i) => {
     // console.log('---')
     // console.log(line)
     // console.log(parent?.name, currLevel.map(n => n.name))
    if (line.startsWith('$')) {
      // command
      const [_, cmd, dirName] = line.split(' ');

      if (cmd === 'ls') {
        currLevel = []
      } else if (cmd === 'cd' && dirName === '/') {
        // root
        parent = root;
      } else if (cmd === 'cd' && dirName === '..') {
        // go up a directory
        parent.addChildren(currLevel)
        parent = parent.parent
        currLevel = parent.children
        console.log('currLevel', currLevel.map(n => n.name), 'paret', parent.name)
        
      } else if (cmd === 'cd' && dirName !== '/') {
        parent.addChildren(currLevel)
        parent = currLevel.find(node => node.name === dirName)
        currLevel = []
      }
    } else if (line.startsWith('dir')) {
      // this level has a directory
      const [_, dirName] = line.split('dir ');
      const node = new Node(dirName, parent);
      currLevel.push(node);
    } else {
      // this level has files with sizes
      const [size, fileName] = line.split(' ');
      const node = new Node(fileName, parent, +size, null)
      currLevel.push(node)
    }
  });
  parent.addChildren(currLevel)
  return root;
}

class Node {
  constructor(name, parent, size=null, children=[]) {
    this.name = name;
    this.parent = parent;
    this.children = children;
    this.size = size;
  }

  addChild(child) {
    this.children.push(child)
  }

  addChildren(children) {
    // you could have different sized nodes you don't want to overwrite
    const uniqChildren = new Set();

    this.children.forEach(c => uniqChildren.add(c))
    children.forEach(c => uniqChildren.add(c))
    this.children = []
    uniqChildren.forEach(c => this.children.push(c))
  }

  replaceChildren(children) {
    this.children = children
  }
}

function traverseTree(node, i, cache, cacheKey='') {
  cacheKey+=`${i}-${node.name}`
  console.log(`${Array(i).join('   ')}${node.size ? '--' : '|-'} ${node.name} ${node.size ?? ''}`)
  if (cacheKey in cache) return cache[cacheKey]
  if (node.children) {
    const subsize = node.children.reduce((acc, n) => {
      return acc + traverseTree(n, i + 1, cache, cacheKey)  
    }, 0)
    if (!(cacheKey in cache)) {
      cache[cacheKey] = subsize
    }
    return subsize;
  }
  return node.size ?? 0;
}
async function findSpace(file='../input.txt') {
  const MAX_SIZE = 100000;
  const lines = await readFile(file);
  const node = new Node('/');
  createTree(node, lines);
  console.log(node)
  const cache = {}
  traverseTree(node, i=1, cache)
  console.log(cache)
  res = 0;
  Object.entries(cache).forEach(([k, v]) => {
    if (k.split('.').length === 1 && v < MAX_SIZE) {
      res += v
    }
  })
  console.log('directory', res);

  const MAX_SPACE = 70000000;
  const MIN_FREE = 30000000;
  const totalUsed = cache['1-/']

  const sorted = Object.values(cache).sort((a, b) => a-b)
  console.log('sroted', sorted, totalUsed)
  console.log(sorted.find(n => {
    const idk = MAX_SPACE - totalUsed + n > MIN_FREE;
    console.log(idk, MAX_SPACE - totalUsed + n, n)
    return idk
  }))
}

module.exports = findSpace;
