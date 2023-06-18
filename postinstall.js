var fs = require('fs')

// Workaround to fix function getComponentDecoratorMetadata from storybook 6.3.7.
// See https://github.com/storybookjs/storybook/issues/14828.
// TODO: Remove this as soon as issue is solved in a future release.
var file = './node_modules/@storybook/angular/dist/client/angular-beta/utils/NgComponentAnalyzer.js'
fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(
    '    return decorators.reverse().find((d) => d instanceof core_1.Component);',
    'return decorators[0];'
  );

  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
