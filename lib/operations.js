
var _ = require('lodash');

exports.operations = {
    f: function(content, expr) { return _.filter(content, function(x) { return eval(expr) }) },
    m: function(content, expr) { return content },
    d: function(content, expr) { return content }
};
