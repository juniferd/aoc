const {readFile} = require('./utils.js');

async function getArea() {
  const instructions = await readFile('./input.txt', String, ' ');
  
  let position = 0;
  let depth = 0;

  instructions.forEach(([direction, dist]) => {
    dist = +dist;
    direction = direction.toLowerCase();
    if (direction === 'forward') {
      position += dist;
    }
    if (direction === 'down') {
      depth += dist;
    }
    if (direction === 'up') {
      depth -= dist;
    }
    // if (direction === 'back') {
    //   position -= dist;
    // }
  }) 

  console.log(position * depth)
  return position * depth;
}

async function getAim() {
  const instructions = await readFile('./input.txt', String, ' ');

  let position = 0;
  let depth = 0;
  let aim = 0;

  instructions.forEach(([direction, dist]) => {
    dist = +dist;
    direction = direction.toLowerCase();
    if (direction === 'forward') {
      position += dist;
      depth += (aim * dist);
    }
    if (direction === 'down') {
      aim += dist;
    }
    if (direction === 'up') {
      aim -= dist;
    }
  });
  console.log(position * depth)
};

module.exports = {
  getArea,
  getAim,
}
