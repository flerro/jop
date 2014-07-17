
var _ = require('lodash');
var argv = require('optimist').argv;

var DEBUG = argv.debug;

var debug = function (msg){
    if (!DEBUG) return;
    console.log(msg)
};

var fromStdin = argv.$1 ? true : false;

var jsonstr = '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]';
var output = JSON.parse(jsonstr);

var operations = {
    f: function(content, expr) { return _.filter(content, function(x) { return eval(expr) }) },
    m: function(content, expr) { return content },
    d: function(content, expr) { return content }
};

var option = function(val) {
    var isoption = val.indexOf("-") == 0;
    return isoption ? val.replace(/-/g,"") : false;
};

process.argv.forEach(function(val, index, array) {
    var opt = option(val);
    if (!opt) return;

    var expr = argv[opt];
    if (Array.isArray(expr)) {
        expr = expr.pop();
    }

    if (argv.d) {
        console.log("Executing... ", opt, "-> ", expr);
    }

    var op = operations[opt];

    try {
        output = operations[opt](output, expr);
        if (argv.d) {
            console.log("Got ", output);
        }
    } catch (e) {
        console.log("ERROR: ", e.toString() , "executing", opt, ": ", expr)
    }

});

console.log( argv.p ? JSON.stringify(output, undefined, 2) : JSON.stringify(output));
