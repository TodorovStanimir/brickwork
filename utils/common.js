function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    const temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function generateRandom(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num % 2 != 0 ? generateRandom(min, max) : num;
}

module.exports = {
  shuffle,
  generateRandom
}
