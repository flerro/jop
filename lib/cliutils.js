
var argv = require('optimist').argv;

exports.argv = argv;

exports.rawArgAsOption = function(val) {
    var isoption = val.indexOf("-") == 0;
    return isoption ? val.replace(/-/g,"") : false;
};

exports.rawArgs = process.argv;

/**
 * Extract JSON transformation expression for the given option
 * @param val a value to extract the option from
 * @returns false if option is invalid
 *          or does not match an expression (eg. boolean helper flag)
 */
exports.expression = function(opt) {
    var expr = argv[opt];
    if (!expr || expr === true) return false;    // ignore boolean flags

    if (Array.isArray(expr)) {
        expr = expr.pop();
    }

    return expr
};
