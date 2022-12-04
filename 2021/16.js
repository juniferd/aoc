const { readFile, hexadecimalToBinary, binaryToDecimal} = require('../utils.js')

function getLiteralValue(packets) {
    let res = ''
    let end = false;
    let sliceStart = 6;
    // literal value
    while (!end) {
      const sliceEnd = sliceStart + 5;
      const [start, ...rest] = packets.slice(sliceStart, sliceEnd);
      res += rest.join('')
      sliceStart = sliceEnd
      if (start === '0') {
        end = true;
      }
    }
    return binaryToDecimal(res);
}

async function decodePacket(file='../input.txt') {
  const lines = await readFile(file);

  // first convert hexadecimal to binary
  const original = hexadecimalToBinary(lines[0])
  console.log(original)
  const version = original.slice(0,3);
  const packetType = original.slice(3,6);
  console.log(version, binaryToDecimal(packetType))

  if (binaryToDecimal(packetType) === 4) {
    // literal
    console.log(getLiteralValue(original))
  } else {
    // operator
    // An operator packet contains one or more packets. To indicate which subsequent binary data represents its sub-packets, an operator packet can use one of two modes indicated by the bit immediately after the packet header; this is called the length type ID
  }
}

module.exports = decodePacket;
