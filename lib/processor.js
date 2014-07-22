
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

var _ = require('lodash');

var execs = {
    c: _.size,
    count: _.size,
    countby: _.countBy,
    f: _.filter,
    findall: _.filter,
    flat: _.flatten,
    fold: _.foldr,
    foldLeft: _.foldl,
    g: _.groupBy,
    group: _.groupBy,
    indexof: _.findIndex,
    lastindexof: _.findLastIndex,
    m: _.map,
    map: _.map,
    min: _.min,
    max: _.max,
    head: _.head,
    pull: _.pull,
    s: _.sortBy,
    sample: _.sample,
    t: _.transform,
    tail: _.tail
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