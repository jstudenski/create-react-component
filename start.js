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
  let mainFile = fs.createWriteStream('output/secret.js');
  // imports
  add(mainFile, "import React, { Component } from 'react';", 0);
  add(mainFile, "import PropTypes from 'prop-types';", 0);
  // component has external stylesheet
  component.styleSheet !== 'none' ?
    add(mainFile, "import './" + component.nameUppercase + ".css'", 0) :
    null;
  add(mainFile, "", 0);
  add(mainFile, "class "+component.nameUppercase+" extends React.Component {", 0);
  // component has state
  component.state == 'yes' ?
    add(mainFile, "constructor(props) {", 1) +
    add(mainFile, "super(props) {", 2) +
    add(mainFile, "this.state = {", 2) +
    add(mainFile, "name: 'world',", 3) +
    add(mainFile, "};", 2) +
    add(mainFile, "}", 1) :
    null;


  add(mainFile, "", 0);
  add(mainFile, "", 0);
    //   output+="constructor(props) {" +
    //   "    super(props);" +
    //   "    this.state = {" +
    //   "      name: 'world'," +
    //   "    };\n" +
    //   "  }\n"
    //   return output;
    // }


 // mainFile.write(\n");
//  mainFile.write(state(component));
  mainFile.write(contents(component));
  mainFile.write("}\n\n");
  mainFile.write(propTypes(component));
  mainFile.write("export default "+component.nameUppercase+"\n\n");
  mainFile.on('finish', () => {
    console.log('component created');
  });
  // close the stream
  mainFile.end();

// Stylesheet
  let styleStream = fs.createWriteStream('output/secret.css');
  styleStream.write("."+component.nameLowercase + " {\n");
  styleStream.write("  background-color: " + getRandomColor() + ";\n");
  styleStream.write("  width: 100px;\n");
  styleStream.write("  height: 100px;\n");
  styleStream.write("}\n");

  styleStream.on('finish', () => {
    console.log('sylesheet created');
  });
  styleStream.end();


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


contents = (component) => {
  let output = "  render() {\n" +
  "    return (\n"

  if (component.styleSheet == 'css' || component.styleSheet == 'sass') {
    output += "       <div styleName='"+ component.nameLowercase +".css'>\n";
  } else {
    output += "      <div>\n";
  };
  output += "        <h1>Hello, {this.props.name}</h1>;\n" +
  "    </div>\n" +
  "  }\n"
  return output;
}

propTypes = (component) => {
  let output = component.nameUppercase+".propTypes = {\n" +
    "  // name: PropTypes.string.isRequired\n" +
  "};\n\n" +
  component.nameUppercase+".defaultProps = {\n" +
    "  // name: 'Stranger'\n" +
  "};\n\n"
  return output;
}

props = (name) => {
  return getRandomColor();
}

getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


add = (stream, str, tabs) => {
  tabs = '  '.repeat(tabs)
  stream.write(tabs + str + "\n");
}