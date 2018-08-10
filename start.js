var writeFile = require('write');
var inquirer = require('inquirer');
const fs = require('fs');

let sass = fs.readFileSync('template/template.scss', 'utf8');
let main = fs.readFileSync('template/Template.js', 'utf8');

inquirer.prompt([{
    type: "text",
    message: "Component Name?",
    name: "name",
  },
  {
    type: 'list',
    message: "Stylesheet?",
    name: "stylesheet",
    choices: ['sass', 'css', 'none', ]
  },
  // {
  //   type: 'list',
  //   message: "Add Jest .test.js file?",
  //   name: "tests",
  //   choices: ['yes', 'no',]
  // },
  {
    type: 'list',
    message: "Has state?",
    name: "state",
    choices: ['yes', 'no',]
  }
]).then(function (res) {
// Error Handling:
  // no component name
  if (res.name.length == 0) {console.log("oops");}

  let name = res.name.toLowerCase()

  let component = {
    nameLowercase: name,
    nameUppercase: name.charAt(0).toUpperCase() + name.substr(1),
    styleSheet: res.stylesheet,
    state: res.state,
  }


// Main File
  let main = fs.createWriteStream('output/secret.js');
  // imports
  add(main, 0, "import React from 'react';");
  add(main, 0,  "import PropTypes from 'prop-types';");
  // component has external stylesheet
  component.styleSheet !== 'none' ?
    add(main, 0,  "import './" + component.nameUppercase + ".css'") :
    null;
  add(main, 0,  "");
  add(main, 0,  "class "+component.nameUppercase+" extends React.Component {");
  // component has state
  component.state == 'yes' ?
    add(main, 1, "constructor(props) {") +
    add(main, 2, "super(props);") +
    add(main, 2, "this.state = {") +
    add(main, 3, "counter: 0") +
    add(main, 2, "};") +
    add(main, 2, "this.handleClick = this.handleClick.bind(this);") +
    add(main, 1, "}") :
    null;
  add(main, 0,  "");
  add(main, 1, "render() {");
  add(main, 2, "return (");
  component.styleSheet !== 'none' ?
    add(main, 3, "<div className='"+ component.nameLowercase +".css'>") :
    add(main, 3, "<div>");
  add(main, 4, "<h1>Hello, {this.state.counter}</h1>");
  add(main, 3, "</div>");
  add(main, 2, ")");
  add(main, 1, "}");
  add(main, 0, "}");
  add(main, 0,  "");
  // proptypes
  add(main, 0, component.nameUppercase+".propTypes = {");
  add(main, 0, "// name: PropTypes.string.isRequired");
  add(main, 0, "};");
  add(main, 0, "");
  add(main, 0, component.nameUppercase+".defaultProps = {");
  add(main, 1,  "name: PropTypes.string.isRequired");
  add(main, 0,  "};");
  add(main, 0, "");
  add(main, 0, "export default "+component.nameUppercase+"");

  main.on('finish', () => {
    console.log('component created');
  });

  main.end();

  const primary = getRandomColor();
  const secondary = getInvertedColor(primary);

// Stylesheet
  let style = fs.createWriteStream('output/secret.css');
  style.write("."+component.nameLowercase + " {\n");
  style.write("  background-color: " + primary + ";\n");
  style.write("  color: " + secondary + ";\n");
  style.write("  width: 100px;\n");
  style.write("  height: 100px;\n");
  style.write("}\n");

  style.on('finish', () => {
    console.log('sylesheet created');
  });
  style.end();


});



// imports = (component) => {

//   // let output = \n";
//   // output+="import PropTypes from 'prop-types';\n"
//   // External Stylesheet
//   component.styleSheet == 'css' || component.styleSheet == 'sass' ?
//     output+="import './" + component.nameUppercase + "." + component.styleSheet + "';\n":
//     null;
//     output+="\n";
//   return output;
// }





props = (name) => {
  return getRandomColor();
}

getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

getInvertedColor = (hexnum) => {

  var splitnum = hexnum.split("");
  splitnum.shift();

  console.log(splitnum);

  var resultnum = "";
  var simplenum = "FEDCBA9876".split("");
  var complexnum = new Array();
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";

  for(i=0; i<6; i++){
    if(!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]];
    } else if(complexnum[splitnum[i]]){
      resultnum += complexnum[splitnum[i]];
    } else {
      return false;
    }
  }
  return '#' + resultnum;
}

add = (stream, tabs, str) => {
  tabs = '  '.repeat(tabs)
  stream.write(tabs + str + "\n");
}