var writeFile = require('write');
var inquirer = require('inquirer');
const fs = require('fs');

// let sass = fs.readFileSync('template/template.scss', 'utf8');
// let main = fs.readFileSync('template/Template.js', 'utf8');

// TODO: add test files
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

  // TODO: add error message or new prompt
  if (res.name.length == 0) {
    console.log("oops");
    return;
  }

  let name = res.name.toLowerCase()

  let comp = {
    lowercase: name,
    uppercase: name.charAt(0).toUpperCase() + name.substr(1),
    styleSheet: res.stylesheet,
    state: res.state,
  }

  // folder location
  const location = 'output/'+comp.uppercase+'/';
  // create the folder if it doesnt exist already
  // TODO: add error message "would you like to replace..?"
  if (!fs.existsSync(location)){
    fs.mkdirSync(location);
  };

  // TODO: index.js
  let index = fs.createWriteStream(location+'index.js');
  add(index, 0, "import "+comp.uppercase+" from './"+comp.uppercase+"';");
  add(index, 0, "");
  add(index, 0, "export default "+comp.uppercase+";");
  add(index, 0, "");
  index.on('finish', () => {
    console.log('index.js added');
  });
  index.end();
  // end index.js

  // Main File
  let main = fs.createWriteStream(location+comp.uppercase+'.js');
  // imports
  add(main, 0, "import React from 'react';");
  add(main, 0,  "import PropTypes from 'prop-types';");
  // component has external stylesheet
  comp.styleSheet !== 'none' ?
    add(main, 0,  "import './" + comp.lowercase + ".css'") :
    null;
  add(main, 0,  "");

  add(main, 0,  "class "+comp.uppercase+" extends React.Component {");
  // component has state
  comp.state == 'yes' ?
    add(main, 1, "constructor(props) {") +
    add(main, 2, "super(props);") +
    add(main, 2, "this.state = {") +
    add(main, 3, "counter: 0") +
    add(main, 2, "};") +
    add(main, 2, "this.handleClick = this.handleClick.bind(this);") +
    add(main, 1, "}") +
    add(main, 0, "") +
    // sample handle click function
    add(main, 1, "handleClick() {") +
    add(main, 2, "this.setState(prevState => ({") +
    add(main, 3, "counter: prevState.counter + 1") +
    add(main, 2, "}));") +
    add(main, 1, "}") :
    null;
  add(main, 0,  "");
  add(main, 1, "render() {");
  add(main, 2, "return (");
  comp.styleSheet !== 'none' ?
    add(main, 3, "<div className='"+ comp.lowercase +"'>") :
    add(main, 3, "<div>");
  comp.state == 'yes' ?
    add(main, 4, "<h1 onClick={this.handleClick}>Hello "+comp.uppercase+": {this.state.counter}</h1>") :
    add(main, 4, "<h1>Hello, World</h1>");
  add(main, 3, "</div>");
  add(main, 2, ")");
  add(main, 1, "}");
  add(main, 0, "}");
  add(main, 0,  "");
  // proptypes
  add(main, 0, comp.uppercase+".propTypes = {");
  add(main, 1, "// title: PropTypes.string.isRequired,");
  add(main, 0, "};");
  add(main, 0, "");
  add(main, 0, comp.uppercase+".defaultProps = {");
  add(main, 1, "// title: 'Hello World',");
  add(main, 0, "};");
  add(main, 0, "");
  // export
  add(main, 0, "export default "+comp.uppercase+"");
  main.on('finish', () => {
    console.log('component created');
  });
  main.end();

  // optional external stylesheet (css/scss)
  if (comp.styleSheet !== 'none') {
    const color = getRandomColor();
    const fileType = (comp.styleSheet == 'css') ? '.css' : '.scss';
    const style = fs.createWriteStream(location + comp.lowercase + fileType);
    add(style, 0, "." + comp.lowercase + " {");
    add(style, 1, "background-color: " + color.primary + ";");
    add(style, 1, "color: " + color.secondary + ";");
    add(style, 1, "width: 150px;");
    add(style, 1, "border-radius: 5px;");
    add(style, 0, "}");
    style.on('finish', () => { console.log('sylesheet created') });
    style.end();
  };

});

getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let colors = { primary:'#', secondary:'#'};
  for (let i = 0; i < 6; i++) {
    let rand = Math.floor(Math.random() * 16);
    colors.primary += letters[rand];
    colors.secondary += letters[letters.length-1-rand];
  }
  return colors;
}

add = (stream, tabs, str) => {
  tabs = '  '.repeat(tabs)
  stream.write(tabs + str + "\n");
}
