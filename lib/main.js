
var cli = require('./cliutils');
var jop = require('./processor');

if (cli.showHelp) {
    cli.usage();
    process.exit(0);
}

var json = cli.jsonContentAsStream();
var jsonContent = ""  // '[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]';
var indent = 2;

json.on('data', function(chunk){
    jsonContent += chunk;
});

json.on('end', function(){
    try {
        var out = jop.processContent(jsonContent, cli.instructions(), cli.debug);
        console.log( cli.prettyprint ? JSON.stringify(out, undefined, indent) : JSON.stringify(out));
    } catch (e) {
        if (console.debug) {
            console.trace(e.toString());
        } else {
            console.log(e.toString())
        }
    }
});