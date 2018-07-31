var writeFile = require('write');
var inquirer = require('inquirer');
const fs = require('fs');

let sass = fs.readFileSync('template/template.sass', 'utf8');
let main = fs.readFileSync('template/Template.js', 'utf8');


inquirer.prompt([
  {
    type: "text",
    message: "Component Name?",
    name: "name",
  }
]).then(function(inquirerResponse) {

  let low = inquirerResponse.name.toLowerCase();
  var up = low.charAt(0).toUpperCase() + low.substr(1)

  console.log(low);
  console.log(up);

  // fs.readFile('template/hello.sass', function (err, data) {
  //   if (err) throw err;
  //   console.log(data);
  // });

  writeFile('output/'+up+'/'+up+'.js', main, function(err) {
    if (err) console.log(err);
  });

  writeFile('output/'+up+'/'+low+'.sass', sass, function(err) {
    if (err) console.log(err);
  });

  // writeFile('test/' + name +'.sass', index, function(err) {
  //   if (err) console.log(err);
  // });


});

// let index = "/n mport Sidebar from \'./Sidebar\'\; /n export default Sidebar\;"



