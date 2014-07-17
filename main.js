
var cli = require('./lib/cliutils');
var jsonproc = require('./lib/operations');

var fromStdin = cli.argv.$1 ? true : false;
var jsonstr = '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]';

var output = JSON.parse(jsonstr);

cli.rawArgs.forEach(function(val) {
    var opt = cli.rawArgAsOption(val);
    if (!opt) return false;

    var expr = cli.expression(opt);
    if (!expr) return;  // skip invalid expression

    if (cli.argv.d) {
        console.log("Executing... ", opt, "-> ", expr);
    }

    try {
        output = jsonproc.operations[opt](output, expr);
        if (cli.argv.d) {
            console.log("Got ", output);
        }
    } catch (e) {
        console.log("ERROR: ", e.toString() , "executing", opt, ": ", expr)
    }

});

console.log( cli.argv.p ? JSON.stringify(output, undefined, 2) : JSON.stringify(output));
