// copy-pasta-ed - tyyyyy
function PriorityQueue() {
  const arr = [];
  let length = 0;

  function parent(i) {
    return Math.floor((i-1) / 2)
  }

  function swap(i, j) {
    let temp = arr[i];
    arr[i] = arr[j]
    arr[j] = temp;
  }

  function setLength(l) {
    ret.length = l
    length = l
  }

  function push(value, priority) {
    arr[length] = [value, priority];
    let i = length
    setLength(i+1)

    while (i != 0 && arr[parent(i)][1] > arr[i][1]) {
      swap(parent(i), i);
      i = parent(i)
    }
  }

  function rebalance(i) {
    if (i > length) {
      return
    }
    

    let l = 2*i + 1
    let r = 2*i + 2
    let smallest = i
    if (l < length && arr[l][1] < arr[i][1]) {
      smallest = l;
    }

    if (r < length && arr[r][1] < arr[smallest][1]) {
      smallest = r;
    }

    if (smallest != i) {
      swap(i, smallest)
      rebalance(smallest);
    }
  }

  function pop() {
    let ret = arr[0];
    setLength(length-1)

    arr[0] = arr[length]

    rebalance(0);  

    return ret;
  }

  const ret = {
    push: push,
    pop: pop,
    length: length
  }

  return ret;
}


module.exports = PriorityQueue
