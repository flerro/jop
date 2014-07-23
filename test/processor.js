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


var jop = require('../lib/processor');

var people = '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]'
var simple = '{"type":"sample","link":"http://file-sample.com/json","name":"JavaScript Object Notation","metadata":[{"name":"extension","val":".json"},{"name":"media_type","val":"application/json"},{"name":"website","val":"json.org"}]}'

exports['Filter items'] = function(test){
    var operations = [{opt: 'f', expr: 'x.age > 18'}]
    var expectedOutput = [{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21}]
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done()
};

exports['Complex pipeline: filter, map, filter'] = function(test){
    var operations = [{opt: 'f', expr: 'x.age > 18'}, {opt: "m", expr: "{ x.name }"}, {opt: 'f', expr: 'x.indexOf("B") == 0'}]
    var expectedOutput = ["Beatrice"]
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done()
};

exports['Max age'] = function(test){
    var operations = [{opt: 'max', expr: 'x.age'}]
    var expectedOutput = {"name":"Beatrice", "age": 21}
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done()
};

exports['Min age'] = function(test){
    var operations = [{opt: 'min', expr: 'x.age'}]
    var expectedOutput = {"name":"Carlo", "age": 16}
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done()
};