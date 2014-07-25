# jop

A commandline JSON processor powered by [node.js](http://groovy.codehaus.org/).

## Install

    npm install jop -g 

## Tests

    nodeunit test
    
## Usage

```


Usage: jop [OPTIONS] [JSON]

  Process JSON in input executing an operation for each OPTION.

  Many OPTIONS requires a javascript expression that is evaluated on each item of the input
  collection to perform the requested operation. In the expression context, current item can
  be referenced via "it" and lodash javascript library is exposed via "_".

Examples:
  jop --findall "it.age > 18" people.json                              Find all people older than 18
  jop --collect "age" people.json                                      Get people age as an array
  jop --max "it.age" people.json                                       Get max age for people
  jop -t "out[key]={name: it.name, dob: 2014 - it.age}" people.json    Obtain year from people age
  jop --prop metadata --count simple.json                              Count metadata property items


Options:
  -c, --count      Count all elements in input                                                      
  --countby        Count elements in input grouping by the given expression                         
  -f, --findall    Find all elements satisfying given expression                                    
  --find           Find first element satisfying given expression                                   
  -g, --groupby    Group input elements using given expression                                      
  --indexof        Find index of the first element matching the given expression                    
  --lastindexof    Find index of the last element matching the given expression                     
  --collect        Collect the value of the given property name the input collection                
  --min            Find the element having the max output for the given expression                  
  --max            Find the element having the min output for the given expression                  
  --head           Return the first n nodes, where n is a given number                                [default: 5]
  -s, --sortby     Sort input elements using the optionally provided expression                     
  --sample         Get n random elments from input, where n is a given number                         [default: 2]
  -t, --transform  Transform input node using the given expression, where "out" is the result object
  --tail           Return last n elements, where n is a given number                                  [default: 5]
  -p, --pretty     Pretty-print output                                                              
  --prop           Return value for a given property name                                           
  --keys           Collect object keys from input                                                   
  --values         Collect object values from input                                                 
  -h, --help       Display usage information                                                                                             
                                   
```

For more examples read the [related article on my blog](http://www.rolanfg.net/TBD/json-processor-nodejs)


