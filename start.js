var writeFile = require('write');
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: "text",
    message: "Component Name?",
    name: "name",
  }
]).then(function(inquirerResponse) {
  const name = inquirerResponse.name;
  console.log(name);
  // myGame.guess(guess) ? endGameMenu() : guessLetter();

});


writeFile('test/foo', 'This is content...', function(err) {
  if (err) console.log(err);
});