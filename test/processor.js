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
var jop = require('../lib/processor');

var people = '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]'
var jsonAsJSON = '{"type":"sample","link":"http://file-sample.com/json","name":"JavaScript Object Notation","metadata":[{"name":"extension","val":".json"},{"name":"media_type","val":"application/json"},{"name":"website","val":"json.org"}]}'

exports['Count'] = function(test){
    var operations = [{opt: 'c', expr: 'true'}]
    var expectedOutput = 3
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done();
};

exports['Complex pipeline: filter, map, filter'] = function(test){
    var operations = [{opt: 'f',  expr: 'it.age > 18'}, {opt: "collect", expr: "name"}, {opt: 'f',  expr: 'it.indexOf("B") == 0'}]
    var expectedOutput = ["Beatrice"]
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done();
};

exports['Filter items'] = function(test){
    var operations = [{opt: 'f',  expr: 'it.age > 18'}]
    var expectedOutput = [{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21}]
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done();
};

exports['Max age'] = function(test){
    var operations = [{opt: 'max',  expr: 'it.age'}]
    var expectedOutput = {"name":"Beatrice", "age": 21}
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done();
};

exports['Min age'] = function(test){
    var operations = [{opt: 'min',  expr: 'it.age'}]
    var expectedOutput = {"name":"Carlo", "age": 16}
    test.deepEqual(expectedOutput, jop.processContent(people, operations))
    test.done();
};

exports['Count people by age'] = function (test) {
    var operations = [{opt: 'countby',  expr: 'it.age > 18'}];
    var operations2 = [{opt: 'countby',  expr: 'it.age'}];
    var expectedOutput = { true: 2, false:  1};
    var expectedOutput2 = { "19": 1, "21": 1, "16": 1};
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.deepEqual(jop.processContent(people, operations2), expectedOutput2);
    test.done();
};

exports['Find first person containing "a" in name'] = function (test) {
    var operations = [{opt: 'find',  expr: 'it.name.indexOf("a") > 0'}];
    var expectedOutput = {"name": "Andrea", "age": 19};
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Group people by being over 18 years old'] = function (test) {
    var operations = [{opt: 'groupby',  expr: 'it.age > 18'}];
    var expectedOutput = {
        false: [{"name": "Carlo", "age": 16}],
        true:  [{"name": "Andrea", "age": 19}, {"name": "Beatrice", "age": 21}]
    };
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Index of 19 years old person'] = function (test) {
    var operations = [{opt:"indexof", expr: "it.age === 19"}];
    var expectedOutput = 0;
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Index of the last 19 years old person'] = function (test) {
    var operations = [{opt:"lastindexof", expr: "it.age === 19"}];
    var expectedOutput = 0;
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Collect people age'] = function (test) {
   var operations = [{opt:"collect", expr: "age"}];
    var expectedOutput = [ 19, 21, 16 ];
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Sort people by age'] = function (test) {
    var operations = [{opt: 'sortby', expr: "it.age"}];
    var expectedOutput = [{name:'Carlo',age:16},{name:'Andrea',age:19},{name:'Beatrice',age:21}];
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Replace age with DOB (transform)'] = function (test) {
    var operations = [{opt:"t", expr: "out[key] = { name: it.name, dob: new Date(2014, 1, 1).getFullYear() - it.age }"}];
    var operations1 = [{opt:"transform", expr: "out[key] = _.merge(_.omit(it, 'age'), { dob: new Date(2014, 1, 1).getFullYear() - it.age })"}];
    var expectedOutput = [{name:'Andrea',dob:1995},{name:'Beatrice',dob:1993},{name:'Carlo',dob:1998}];
    test.expect(2);
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.deepEqual(jop.processContent(people, operations1), expectedOutput);
    test.done();
};

exports['Add DOB property (transform)'] = function (test) {
    var operations = [{opt:"t", expr: "out[key] = _.merge(_.mapValues(it), {dob: (new Date(2014, 1, 1).getFullYear() - it.age)} )"}];
    var expectedOutput = [{name:'Andrea',age:19,dob:1995},{name:'Beatrice',age:21,dob:1993},{name:'Carlo',age:16,dob:1998}];
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Get first person (head)'] = function (test) {
    var operations = [{opt:"head", expr: 1}];
    var expectedOutput = [ {"name": "Andrea", "age": 19} ];
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Get last person (tail)'] = function (test) {
    var operations = [{opt: 'tail', expr: 1}];
    var expectedOutput = [{"name": "Carlo", "age": 16}];
    test.deepEqual(jop.processContent(people, operations), expectedOutput);
    test.done();
};

exports['Sample random person'] = function (test) {
    var operations = [{opt:"sample", expr: 2}];
    var expectedOutput = 2;
    test.strictEqual(_.size(jop.processContent(people, operations)), expectedOutput);
    test.done();
};

exports['Get metadata from jsonAsJSON (prop)'] = function (test) {
    var operations = [{opt:"prop", expr: "metadata"}];
    var expectedOutput = [{name:'extension',val:'.json'},{name:'media_type',val:'application/json'},{name:'website',val:'json.org'}];
    test.deepEqual(jop.processContent(jsonAsJSON, operations), expectedOutput);
    test.done();
};

exports['Collect keys from jsonAsJSON'] = function (test) {
    var operations = [{opt:"keys", expr: "true"}];
    var expectedOutput = [ 'type', 'link', 'name', 'metadata' ];
    test.deepEqual(jop.processContent(jsonAsJSON, operations), expectedOutput);
    test.done();
};

exports['Collect values from jsonAsJSON'] = function (test) {
    var operations = [{opt:"values", expr: "true"}];
    var expectedOutput = [ 'sample',
                            'http://file-sample.com/json',
                            'JavaScript Object Notation',
                            [ { name: 'extension', val: '.json' },
                                { name: 'media_type', val: 'application/json' },
                                { name: 'website', val: 'json.org' } ] ];
    test.deepEqual(jop.processContent(jsonAsJSON, operations), expectedOutput);
    test.done();
};

exports['Invalid operation'] = function(test) {
    var operations = [{opt: 'cacca', expr: 'true'}]
    test.throws(function() { jop.processContent(people, operations) }, Error)
    test.done();
}
