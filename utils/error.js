// array in which will store the errors
let errors = [];
// function checking the input count of rows and columns. It accept message, to be possible to print different text when checking rows or columns
function isCorrectInputParam(int, message) {
  if (
    parseInt(int) !== int ||
    typeof int !== "number" ||
    int % 2 !== 0 ||
    int < 2 ||
    int > 100
  ) {
    // function which set error in the array of errors
    setError(message);
  }
}
// compare count of bricks in the input layer with count of bricks determined on the base of input count of columns and rows
function isCountBricksCorrect(countBricks, countBricksInFirstLayer){
  if (countBricks !== countBricksInFirstLayer) {
    setError("-1 The count of bricks of input layer don't match the requested count of bricks");
  }
}
// function which set error with the given message 
function setError(message) {
  errors.push(message);
}
// function - printing the errors
function printErrors() {
  errors.map((err) => console.log(err));
  errors = [];
}
// function - checking for errors
function isThereErrors(){
  return errors.length ? true : false;
}

module.exports = { 
  isCorrectInputParam,
  isCountBricksCorrect,
  setError,
  printErrors,
  isThereErrors
};
