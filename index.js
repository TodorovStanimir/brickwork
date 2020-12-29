const { isCorrectInputParam, isCountBricksCorrect, setError, printErrors, isThereErrors } = require("./utils/error");
const { shuffle, generateRandom} = require('./utils/common')

function bricks(rows, columns, layout) {
  // We checking is the count of rows an even number, is the count of rows integer number, is the count of rows exceeding 100
  // The message passed to this function will be displayed, if the count of rows is not correct value
  isCorrectInputParam(rows, "-1 Row is not correct value");
  // We checking is the count of columns an even number, is the count of columns integer number, is the count of columns exceeding 100
  // The message passed to this function will be displayed, if the count of columns is not correct value
  isCorrectInputParam(columns, "-1 Column is not correct value");
  // If the result of the function isThereError() is true we will print the messages provided by the previous functions and will stop the execution of the application
  if (isThereErrors()) { return printErrors(); }
  // Using the input count of rows and columns we calculate count of bricks in each layer and hold them in the variable countBricks
  const countBricks = (rows * columns) / 2;
  // In this variable we hold an array of input layer of bricks. Each brick is Integer number
  const bricks = layout.split(" ").map(Number);
  // Checking if the count of bricks in input layer matching the count of bricks determined on the base of count the rows and columns
  // If count of bricks in input layer is not correct this function set an error in the array of errors and condition in next checking is true
  isCountBricksCorrect(countBricks, bricks.length / 2);
  // If count of bricks in input layer is not correct we printing the appropriate message and stop the execution of the application
  if (isThereErrors()) { return printErrors(); }
  // in this variable of type object, we will keep information for each brick, which we will use to check how many times the brick is included in input layer
  const firstLayer = {};
  // in this variable we will keep the biggest count of the bricks. We will use it to find the length of the biggest count of bricks.
  let biggestNumber = 1;
  // with this loops we will fill the object firstLayer with input information
  for (let row = 1; row <= rows; row++) {
    // we declare this variable of type Boolean and set it to false. In the future, we will use it to stop first loop, if found an error
    let stop = false;
    for (let column = 1; column <= columns; column++) {
      // the variable "brick" hold information for the number of the current brick. We are finding current brick calculating its position using
      // the numbers of the current row and column
      const brick = bricks[(row - 1) * columns + (column - 1)];
      // checking if the current brick is included in the found bricks. If it is not include, we add it
      if (!(brick in firstLayer)) {
        // we add brick together with information for start and end row and column. The start row and columns are the same like end rows and columns
        firstLayer[brick] = { startR: row, endR: row, startC: column, endC: column };
      } else {
        // if in the input layer, the brick is find for second or next time, we get the information by the previous meets.
        const { startR, endR, startC, endC } = firstLayer[brick];
        // We check the information of the previous times we found the brick, and if the next checking is true, this mean that
        // the brick have been find two times and now is the third time - we have wrong input layer.
        if (startR !== endR && startC !== endC) {
          // this function set new Error - corresponding to the type of error.
          setError(`brick number ${brick} consists more then 2 pieces`);
          stop = true;
          break;
        }
        // if the brick is find for second time we execute the code down, and update the information for end row and column
        firstLayer[brick] = { ...firstLayer[brick], endR: row, endC: column };
      }
    }
    // we stop the loop 
    if (stop) break;
  }
  // checking for the error of the execution, of the previous code. We printing the error, if found. 
  if (isThereErrors()) { return printErrors(); }
  
  let brick = 1;
  // with the next code we check are all bricks exist in the input layer and is there any brick consist only one piece /not two/
  while (brick <= countBricks) {
    // we check is the brick exist in the input layer, and if not exist, we setting an error showing which brick not exist in the input layer
    if (!(brick in firstLayer)) {
      setError(`-1 brick number ${brick} not exists in input layer`);
      brick++;
      continue;
    }
    const { startR, endR, startC, endC } = firstLayer[brick];
    // we check is the brick have the same start and end row and start and end column, 
    // and if yes, we setting an error showing which brick consists only one piece
    if (startR === endR && startC === endC) {
      setError(`-1 brick number ${brick} consists only one piece`);
      break;
    }
    brick++;
  }
  // checking for the error - result of the execution, of the previous code. We printing the error, if found. 
  if (isThereErrors()) { return printErrors(); }
  // in this variable we store array of all shuffled bricks, included in the input layer
  const availableBricks = shuffle(Object.keys(firstLayer).map(Number));
  // we will store the output layer, in this variable
  const outputArr = [];
  // calculating the count of vertical bricks for second layer, using count of columns in input layer and function generateRandom, which
  // returning a random even number of columns between 0 and columns devided by 3 - if the columns are multiples of 3 or 2
  const countVerticalCells = generateRandom(0, columns % 3 === 0 ? columns / 3 : 2);
  // calculating a step between two vertical columns. The step is 3 - if count of columns is multiple of 3
  // the step is 5 - if count of columns is bigger then 8. The step is 1 in all other cases.
  const step = (countVerticalCells !== 0 && columns % 3 === 0) ? 3 : (countVerticalCells !== 0 && columns > 8) ? 5 : 1;
  // in this array will keep numbers of all vertical columns
  const verticalColumns = [];

    // filling the array with the numbers of the vertical columns
    let columnsWithVerticalCell = 0;
    while (verticalColumns.length < countVerticalCells) {
      verticalColumns.push(columnsWithVerticalCell);
      columnsWithVerticalCell+=step;
    }

  // filling the array with bricks in second /output/ layer
  for (let row = 0; row < rows; row++) {
    // variable in which will store the current row of the output layer
    const currentRow = [];
    
    for (let column = 0; column < columns; column++) {
      // variable which store the brick from the input layer, located on the current row and column
      const brick = bricks[row * columns + column];
      // variable which store the available brick, taken from the array of available bricks
      let availableBrick = availableBricks.shift();
      // while loop which finding first available brick, different then brick on the same position of the input layer
      while (availableBrick === brick) {
        // checking is the last available brick equals to the penult brick in the input layer
        if (availableBricks.length === 0 && availableBrick === brick ) {
          // checking is the last available brick equals to last brick in the input layer. 
          // if this is true, setting a new error and stop the execution of the infinite loop
          if (bricks[row * columns + column + 1] && bricks[row * columns + column + 1] === availableBrick) {
            setError(`-1 There is not decision, because the last available brick ${availableBrick} is the same like last two columns in the input layer`)
            break;
          }
          // if the result of previous checking is false - this mean we can use the brick to fill the second layer.
          // we only stop the execution of the infinite loop.
          break;
        }
        // if we have other available bricks, and if the available brick is the same like brick on the same position in the input layer
        // we returning available brick in the array of available bricks
        availableBricks.push(availableBrick);
        // taking the next available brick
        availableBrick = availableBricks.shift();
      }
      // adding the available brick in the current row
      if (row % 2 !== 0 && verticalColumns.includes(column)) {
        currentRow.push(outputArr[row-1][currentRow.length]);
        availableBricks.push(availableBrick);
      } else if (row % 2 === 0 && verticalColumns.includes(column)) {
        currentRow.push([availableBrick]);
        if (biggestNumber < availableBrick) { biggestNumber = availableBrick; }
      } else {
        currentRow.push([availableBrick, availableBrick]);
        if (biggestNumber < availableBrick) { biggestNumber = availableBrick; }
        column++;
      }
    }
    // adding the current row in the output /second/ layer
    outputArr.push(currentRow);
  }

  if (isThereErrors()) { return printErrors(); }
  // taking the length of the brick with biggest number. 
  // For example if we have 50 rows and 50 columns, the biggest brick number is 1250 /50*50/2/ and the length is 4
  const maxLengthNumber = biggestNumber.toString().length;
  // We will use this variable to know max length of the brick number and two spaces around it
  const totalLength = maxLengthNumber+2;
  
  outputArr.map((row, indRow) => {
    // variable in which, we will store signs forming first row of each brick
    let startRow = ""
    // variable in which, we will store signs forming middle row row of each brick
    let middleRow = "";
    // variable in which, we will store signs forming end row of each brick
    let endRow = "";
    // variable in which, we will store signs forming single row between two bricks
    let cementRow = "";
    row.map((cell, indColumn) => {
      // variable in which, we will store length of the number of the current brick
      const lengthCellNumb = cell[0].toString().length;
      // variable in which, we will store length of signs before the number of the current brick
      const before = Math.floor((totalLength-lengthCellNumb) / 2);
      // variable in which, we will store length of signs after the number of the current brick
      const after = totalLength-before-lengthCellNumb;
      // checking the length of the current brick. If the brick is vertical the length is equal to 1
      if(cell.length===1) {
        // forming the middle row
        middleRow+=`*${' '.repeat(before)}${cell[0]}${' '.repeat(after)}*`;
        //checking the previouse row. If the current brick is part of the previous row, we print empty signs in the start row, otherwise asterisks
        if (outputArr[indRow-1] && outputArr[indRow-1][indColumn][0]===cell[0]) {
          startRow+=`*${' '.repeat(before)}${' '.repeat(lengthCellNumb)}${' '.repeat(after)}*`;
        } else {
          startRow+=`*${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}*`;
        }
        //checking the next row. If the current brick is part of the next row, we print empty signs in the end row and cement row, otherwise asterisks
        if (outputArr[indRow+1] && outputArr[indRow+1][indColumn] && outputArr[indRow+1][indColumn][0]===cell[0]) {
          endRow+=`*${' '.repeat(before)}${' '.repeat(lengthCellNumb)}${' '.repeat(after)}*`;
          cementRow+=`*${' '.repeat(before)}${' '.repeat(lengthCellNumb)}${' '.repeat(after)}*`;
        } else {
          endRow+=`*${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}*`;
          cementRow+=`-${'-'.repeat(before)}${'-'.repeat(lengthCellNumb)}${'-'.repeat(after)}-`;
        }
      } else {
        // if the brick is horizontal we print all rows using this part of code
        middleRow+=`*${' '.repeat(before)}${cell[0]}${' '.repeat(after)}${' '.repeat(after)}${cell[0]}${' '.repeat(before)}*`;
        startRow+=`*${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}*`;
        endRow+=`*${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}${'*'.repeat(before)}${'*'.repeat(lengthCellNumb)}${'*'.repeat(after)}*`;
        cementRow+=`-${'-'.repeat(before)}${'-'.repeat(lengthCellNumb)}${'-'.repeat(after)}${'-'.repeat(before)}${'-'.repeat(lengthCellNumb)}${'-'.repeat(after)}-`;
      }
        // adding dash symbol after each brick, except last one in the row
        if (indColumn < row.length-1) {
        startRow+='-';
        middleRow+='-';
        endRow+='-';
        cementRow+="-";
        }
    });
    console.log(startRow+'\n'+middleRow+'\n'+endRow+(indRow+1<rows ? '\n'+cementRow : '' ));
  });
}

bricks(2, 4, "1 1 2 2 4 4 3 3");
bricks(2, 8, "1 1 2 2 6 5 5 8 3 3 4 4 6 7 7 8");
bricks(4, 8, "1 2 2 12 5 7 7 16 1 10 10 12 5 15 15 16 9 9 3 4 4 8 8 14 11 11 3 13 13 6 6 14");
bricks(4, 10, "1 2 3 4 5 6 7 8 9 10 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 11 12 13 14 15 16 17 18 19 20");
bricks(14, 20, "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140");
bricks(4, 12, "1 1 3 4 5 6 7 8 9 10 11 12 2 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 13 14 15 16 17 18 19 20 21 22 23 24");

