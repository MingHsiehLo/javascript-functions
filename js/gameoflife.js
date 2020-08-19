function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(element => same(element, cell));
}

const printCell = (cell, state) => {
  // If I send the state first, it'll be the this value of the contains function
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  if (state.length === 0) return {topRight: [0,0], bottomLeft: [0,0]};
  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);
  return {topRight: [Math.max(...xs), Math.max(...ys)], bottomLeft: [Math.min(...xs), Math.min(...ys)]};
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
};

const getNeighborsOf = ([x, y]) => [
  [x-1, y+1], [x, y+1], [x+1, y+1],
  [x-1, y],             [x+1, y],
  [x-1, y-1], [x, y-1], [x+1, y-1]
];

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(el => contains.bind(state)(el));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);
  return (
    livingNeighbors.length === 3 || (livingNeighbors.length === 2 && contains.call(state, cell))
    );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let resultArr = [];
  for (let y = topRight[1]+1; y >= bottomLeft[1]-1; y--) {
    for (let x = bottomLeft[0]-1; x <= topRight[0]+1; x++) {
      resultArr = resultArr.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
      // if(willBeAlive([x, y], state)) {
      //   resultArr.push([x, y]);
      // }
    }
  }
  return resultArr;
};

const iterate = (state, iterations) => {
  const resultArr = [state];
  for (let i = 0; i < iterations; i++) {
    resultArr.push(calculateNext(resultArr[resultArr.length-1]));
  }
  return resultArr;
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };

  const main = (pattern, iterations) => {
    iterate(startPatterns[pattern], iterations).map(el => console.log(printCells(el)));
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;