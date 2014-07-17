
var cli = require('./cliutils');
var _ = require('lodash');
var isError = require('util').isError;

var operations = {
    f: _.filter,
    m: _.map
};

exports.processContent = function(json) {
    var error = null;
    var output;

    try {
        output = JSON.parse(json);
    } catch (e) {
        throw new Error("Unable to parse input. " + e.toString())
    }

    var gotError = false;

    cli.rawArgs.forEach(function(val){
        if (error) return;        // skip next operation if already onError

        var opt = cli.rawArgAsOption(val);
        if (!opt) return false;

        var expr = cli.expression(opt);
        if (!expr) return;  // skip invalid expression

        if (cli.argv.d) {
            console.log("Executing... ", opt, "-> ", expr);
        }

        var op = operations[opt];
        if (!op) throw new Error("No operation defined for option: " + opt)

        output = op(output, function(x) {
            try {
                return eval(expr)
            } catch (e) {
                var message = e.toString() + " executing " + opt + " --> " + expr + ". "
                error = new Error(message, e);
                return ""
            }
        });

        if (cli.argv.d) {
            console.log("Got ",gotError ? output.toString() : output);
        }
    });

    if (error) throw error;

    return output;
};