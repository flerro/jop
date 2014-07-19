
var optimist = require('optimist');
var fs = require('fs');

/**
 * CLI option definition
 */
var argv = optimist.usage('A commandline JSON processor\nUsage: $0 [options] [input.json]', {
        'flat': {
            description: 'Flatten output',
            boolean: true
        },
        'p': {
            description: 'Pretty-print output',
            boolean: true,
            alias: 'pprint'
        },
        'h': {
            description: 'Display usage informations',
            boolean: true,
            alias: 'help'
        }
    }).argv;

/**
 * Extract JSON transformation expression for the given option
 * @param val a value to extract the option from
 * @returns false if option is invalid
 *          or does not match an expression (eg. boolean helper flag)
 */
var expression = function(opt) {
    var expr = argv[opt];
    if (!expr || expr === true) return false;    // ignore boolean flags

    if (Array.isArray(expr)) {
        expr = expr.shift();
    }

    return expr
};

/**
 * Create a readable stream from file
 *  or from STDIN (if no file given in commandline).
 *
 *  Throws an error if given file does not exist.
 *
 * @returns a node.js readable stream
 */
exports.jsonContentAsStream = function() {
    if (argv._.length > 0) {
        var inputfile = argv._[0];
        if (!fs.existsSync(inputfile)) {
            throw new Error("Unable to read: '" + inputfile + "'");
        }
        return fs.createReadStream(inputfile,{flags: 'r', autoClose: true});
    } else {
        return process.stdin;
    }
}

exports.debug = argv.d;
exports.showHelp = argv.h;
exports.prettyprint = argv.p;
exports.usage = optimist.showHelp;

/**
 * Extract all processing instructions from command line arguments
 * @returns an array of object containing type of operation and expression
 *          Eg.  -p -f "x.age > 18" -d -m "{ x.name }"
 *           -->
 *               [ { opt: 'f', expr: 'x.age > 18' },
 *                   { opt: 'm', expr: '{ x.name } }]
 */
exports.instructions = function() {
    var options = [];
    process.argv.forEach(function(val){
        var isoption = val.indexOf("-") == 0
                        && !(val == '-d')
                        && !(val == '-h' || val == '--help')
                        && !(val == '-p' || val == '--pprint');
        if (isoption) {
            var opt = val.replace(/-/g,"");
            var expr = expression(opt);
            options.push({opt: opt, expr: expr});
        }
    })
    return options;
};