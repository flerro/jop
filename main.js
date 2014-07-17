
var cli = require('./lib/cliutils');
var jop = require('./lib/operations');

var indent = 2;
var fromStdin = cli.argv.$1 ? true : false;
var jsonstr = '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]';

try {
    var out = jop.processContent(jsonstr);
    console.log( cli.argv.p ? JSON.stringify(out, undefined, indent) : JSON.stringify(out));
} catch (e) {
    console.trace(e.toString());
}
