
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Francesco Lerro
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var yargs = require('yargs');
var fs = require('fs');

var prettyprintIndent = 2;

var usageTitle =  '\nUsage: jop [EXPRESSIONS] [JSON]\n' +
                    'Process JSON in input evaluating a list of given EXPRESSIONS\n' +
                    'Example (filtering): jop -f "x.age > 18" input.json';

/**
 * CLI arguments definition
 */
var argv = yargs.usage(usageTitle, {
    c: {
        description: 'Count all elements in input',
        alias: 'count',
        boolean: true
    },
    countby: {
        description: 'Count elements in input grouping by the given expression',
        requiresArg: true
    },
    f: {
        description: 'Find all elements satisfying given expression',
        alias: 'findall',
        requiresArg: true
    },
    find: {
        description: 'Find first element satisfying given expression',
        requiresArg: true
    },
    'flat': {
        description: 'Flatten output',
        boolean: true
    },
    fold: {
        description: 'Execute given expression recursively on elements from the first to the last',
        requiresArg: true
    },
    foldLeft: {
        description: 'Execute given expression recursively on elements from the last to the first',
        requiresArg: true
    },
    g: {
        description: 'Group input elements using given expression',
        alias: 'groupby',
        requiresArg: true
    },
    indexof: {
        description: 'Find index of the first element matching the given expression',
        requiresArg: true
    },
    lastindexof: {
        description: 'Find index of the last element matching the given expression',
        requiresArg: true
    },
    m: {
        description: 'Transform each node to be the output of the given expression',
        alias: 'map',
        requiresArg: true
    },
    min: {
        description: 'Find the element having the max output for the given expression',
        requiresArg: true
    },
    max: {
        description: 'Find the element having the min output for the given expression',
        requiresArg: true
    },
    head: {
        description: 'Return the first n nodes, where n is a given number',
        requiresArg: true,
        default: 5
    },
    s: {
        description: 'Sort input elements using the provided expression',
        alias: 'sort'
    },
    sample: {
        description: 'Get n random elments from input, where n is a given number',
        requiresArg: true,
        default: 2
    },
    t: {
        description: 'Transform input node using the given expression'
    },
    tail: {
        description: 'Return last n elements, where n is a given number',
        requiresArg: true,
        default: 5
    },
    'p': {
        description: 'Pretty-print output',
        boolean: true,
        alias: 'pprint'
    },
    'd': {
        description: '',
        boolean: true
    },
    'h': {
        description: 'Display usage information',
        boolean: true,
        alias: 'help'
    }
}).argv;



/**
 * Extract operations pipeline from command line arguments
 * @returns an array of object containing type of operation and expression
 *          Eg.  -p -f "x.age > 18" -d -m "{ x.name }"
 *           -->
 *               [ { opt: 'f', expr: 'x.age > 18' },
 *                   { opt: 'm', expr: '{ x.name } }]
 */
var extractOperations = function() {
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

/**
 * Get an expression for the given option.
 * If option expression is an array (same option repeated in the pipeline) then shift it.
 *
 * @param opt a commandline option
 * @returns the expression related to the given option
 */
var expression = function(opt) {
    var expr = argv[opt];
    if (!expr || expr === true) return false;    // ignore boolean flags

    if (Array.isArray(expr)) {
        expr = expr.shift();
    }

    return expr
};


//
// Misc utils
//

exports.opts = {
    debug: argv.d,
    pipeline: extractOperations,
    usage: function(where) {
        if (argv.h) {
            yargs.showHelp( where ? where : console.log);
            return true
        } else {
            return false
        }
    }
};


exports.io = {
    /**
     * Create a readable stream from file
     *  or from STDIN (if no file given in commandline).
     *
     *  Throws an error if given file does not exist.
     *
     * @returns a node.js readable stream
     */
    inputStream: function() {
        if (argv._.length > 0) {
            var inputfile = argv._[0];
            if (!fs.existsSync(inputfile)) {
                throw new Error("Unable to read: '" + inputfile + "'");
            }
            return fs.createReadStream(inputfile,{flags: 'r', autoClose: true});
        } else {
            return process.stdin;
        }
    },

    printJson: function(content) {
        console.log( argv.p ? JSON.stringify(content, undefined, prettyprintIndent) : JSON.stringify(content));
    },

    printError: function(e) {
        if (argv.d) {
            console.trace(e.toString());
        } else {
            console.error(e.toString())
        }
    }
};
