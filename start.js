var writeFile = require('write');

writeFile('output/foo', 'This is content...', function(err) {
  if (err) console.log(err);
});