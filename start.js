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

  // const styleSheet = res.stylesheet;

  // sass = sass.replace("%name%", low);
  // main = main.replace("%name%", low);
  // main = main.replace("%name%", low);
  // main = main.replace("%name%", low);
  // main = main.replace("%Name%", up);
  // main = main.replace("%Name%", up);
  // main = main.replace("%Name%", up);
  // main = main.replace("%Name%", up);
  // main = main.replace("%Name%", up);

  // // console.log(res);

  // writeFile('output/'+up+'/'+up+'.js', main, function(err) {
  //   if (err) console.log(err);
  // });

  // writeFile('output/'+up+'/'+low+'.scss', sass, function(err) {
  //   if (err) console.log(err);
  // });

  let writeStream = fs.createWriteStream('output/secret.js');

  writeStream.write(imports(component));
  writeStream.write("class "+component.nameUppercase+" extends React.Component {\n");
  writeStream.write(state(component));
  writeStream.write("}\n\n");
  writeStream.on('finish', () => {
    console.log('component created');
  });

  // close the stream
  writeStream.end();

});

imports = (component) => {
  let output = "import React, { Component } from 'react';\n";
  // External Stylesheet
  component.styleSheet == 'css' || component.styleSheet == 'sass' ?
    output+="import './" + component.nameUppercase + "." + component.styleSheet + "';\n":
    null;
    output+="\n";
  return output;
}

state = (component) => {
  let output = "";
  if (component.state = 'yes') {
    output+="  constructor(props) {\n" +
    "    super(props);\n" +
    "    this.state = {\n" +
    "      date: new Date(),\n" +
    "    };\n" +
    "  }\n"
    return output;
  }
};


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