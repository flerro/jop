
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

var isError = require('util').isError;
var _ = require('lodash');

var transformCallback = function (content, expr) {
    return _.transform(content, function(out, it, key){
        try {
            eval(expr)
        } catch (e) {
            return e;
        }
    });
};

var execs = {
    c: _.size,
    count: _.size,
    countby: _.countBy,
    f: _.filter,
    findall: _.filter,
    find: _.find,
    g: _.groupBy,
    groupby: _.groupBy,
    head: { wrapper: function (content, n) {
        try {
            return _.head(content, n)
        } catch(e) {
            return e;
        }
    }},
    indexof: _.findIndex,
    keys: _.keys,
    lastindexof: _.findLastIndex,
    collect: { wrapper: function (content, property) {
        try {
            return _.map(content, property)
        } catch (e) {
            return e;
        }
    }},
    min: _.min,
    max: _.max,
    prop: { wrapper: function (content, name) {
        try {
            return _.result(content, name)
        } catch (e) {
            return e;
        }
    }},
    s: _.sortBy,
    sortby: _.sortBy,
    sample: { wrapper: function (content, n) {
        try {
            return _.sample(content, n)
        } catch (e) {
            return e;
        }
    }},
    t: { wrapper: transformCallback },
    transform: { wrapper: transformCallback },
    tail: { wrapper: function (content, n) {
        try {
            return _.tail(content, _.size(content) - n)
        } catch (e) {
            return e;
        }
    }},
    values: _.values,
    d: _.identity,
    h: _.identity,
    help:_.identity,
    p: _.identity,
    pretty: _.identity
};



exports.availableOperations = _.keys(execs);

/**
 * Parse input JSON content and process the resulting object using a pipeline of given operations
 *
 * @param jsonstr       input JSON as string
 * @param operations    a list of operations with the related expression to evaluate,
 *                      eg. [{opt: 'f', expr: 'x.age > 18'}, {opt: 'p', expr: true}]
 * @param DEBUG         optional DEBUG flag to trace each operation output
 * @returns the output object after all operations have been executed
 * @throws Error if the operation for a given option is NOT recognizable as an available operation
 */
exports.processContent = function(jsonstr, operations, DEBUG) {
    var content;

    try {
        content = JSON.parse(jsonstr);
    } catch (e) {
        throw new Error("Unable to parse input. " + e.toString())
    }

    operations.forEach(function(val){
        var opt = val.opt;
        var expr = val.expr;
        var op = execs[opt];
        if (!op) throw new Error("No operation defined for option: " + opt);

        if (op === _.identity) return            // skip next operation if is identity function

        var operationCallback = function(it, val, key) {
                                    try {
                                        return eval(expr)
                                    } catch (e) {
                                        return e
                                    }
                                };

        content = _.isFunction(op) ? op(content, operationCallback) : op.wrapper(content, expr);

        if (isError(content)) {
            var error = pipelineError(content, opt, expr)
            if (DEBUG) console.trace(error.message, "executing >>", opt, ":", expr);
            throw error
        } else {
            if (DEBUG) console.log( " >>> ", opt, ":", expr, " --> ", content);
        }

    });

    return content;
};

var pipelineError = function(err, opt, expr) {
    var message = (err ? err.toString() : "Error") + " executing >> " + (opt || "unknown opt") + " : " + (expr || "unknown expr")
    if (!err) {
        err = new Error()
    }
    err.message += (" executing '" + (opt || "opt") + ": " + (expr || "unknown expr") + "'")
    return err;
};

