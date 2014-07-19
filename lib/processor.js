
var _ = require('lodash');

var execs = {
    f: _.filter,
    m: _.map,
    r: _.reduce,
    t: _.transform,
    flat: _.flatten
};

exports.processContent = function(json, operations, DEBUG) {
    var error = null;
    var content;

    try {
        content = JSON.parse(json);
    } catch (e) {
        throw new Error("Unable to parse input. " + e.toString())
    }

    var gotError = false;

    operations.forEach(function(val){
        if (error) return;        // skip next operation if already onError

        var opt = val.opt;
        var expr = val.expr;

        if (DEBUG) {
            console.log("Executing... ", opt, "-> ", expr);
        }

        var op = execs[opt];
        if (!op) throw new Error("No operation defined for option: " + opt)

        content = op(content, function(x, val, key) {
            try {
                return eval(expr ? expr : content)
            } catch (e) {
                var message = e.toString() + " executing " + opt + " --> " + expr + ". "
                error = new Error(message, e);
                return ""
            }
        });

        if (DEBUG) {
            console.log("Got ", error ? error.toString() : content);
        }
    });

    if (error) throw error;

    return content;
};