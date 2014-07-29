A commandline JSON processor powered by [node.js](http://nodejs.org/).

For general informations about _jop_ please [read this blog post](http://www.rolanfg.net/2014/07/29/json-processor-commandline-nodejs/).

## Install

Use [npm](http://github.com/isaacs/npm) to install _jop_ globally:

    npm install jop -g 

Run the tests with [nodeunit](https://github.com/caolan/nodeunit):

    nodeunit test
    
## Usage options

To test installation and display all available command options, invoke _jop_ with the ```-h``` option

```
 → jop -h

Usage: jop [OPTIONS] [JSON]
  Process JSON in input executing an operation for each OPTION.
  Many OPTIONS require a javascript expression that is evaluated on each item of the input
  collection to perform the requested operation. In the expression context, current item 
  can be referenced via "it" and Lo-Dash javascript library via "_".
  
...

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

JSON content can be passed as input file or piped in from standard input (except on cygwin - cfr. [Known issues](#known-issues)).

## Usage examples

Input files used in the following examples:

```
 → cat people.json
[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21},{"name":"Carlo", "age":16}]

 → cat simple.json
{
    "type": "sample",
    "link": "http://file-sample.com/json",
    "name": "JavaScript Object Notation",
    "metadata": [
        {
            "name": "extension",
            "val": ".json"
        },
        {
            "name": "media_type",
            "val": "application/json"
        },
        {
            "name": "website",
            "val": "json.org"
        }
    ]
}
```

### Pretty-printing

Display input pretty-printed

```
 → jop -p people.json
[
  {
    "name": "Andrea",
    "age": 19
  },
  {
    "name": "Beatrice",
    "age": 21
  },
  {
    "name": "Carlo",
    "age": 16
  }
]
```

### Filtering 

Find items in a collection of objects

```
 → jop -f "it.age > 18" people.json 
[{"name":"Andrea","age":19},{"name":"Beatrice", "age": 21}]

 → jop -f "it.age > 18" --collect "name" -f "it.indexOf("B") == 0"  people.json
["Beatrice"]

 → jop --find "it.name.indexOf("a") > 0" people.json
{"name": "Andrea", "age": 19}

 → jop --indexof "it.age === 19" people.json
0

 → jop --lastindexof "it.age === 19" people.json
0
```

Extract a subset of objects from a collection

```
 → jop --head 1 people.json
[ {"name": "Andrea", "age": 19} ]

 → jop --tail 1 people.json
[{"name": "Carlo", "age": 16}]

 → jop --sample 2 people.json
[{name:"Carlo",age:16},{name:"Andrea",age:19}]
```

Get object having max/min property value (```age``` value)

```
 → jop --max "it.age" people.json
{"name":"Beatrice", "age": 21}

 → jop --min "it.age" people.json
{"name":"Carlo", "age": 16}
```

### Counting, grouping, sorting

Counting objects

```
 → jop --count  people.json
3

 → jop --countby "it.age" people.json
{ "19": 1, "21": 1, "16": 1}

 → jop --countby "it.age > 18" people.json
{ true: 2, false:  1}
```

Grouping objects from a collection

```
 → jop --groupby "it.age" people.json
{ "19": 1, "21": 1, "16": 1}

 → jop --groupby "it.age > 18" people.json
{ true"19": 1, "21": 1, "16": 1}
```

Sorting objects in a collection

```
 → echo "[1,3,2]" | jop -s it
[1,2,3]

 → jop --sortby "it.age" people.json
[{name:"Carlo",age:16},{name:"Andrea",age:19},{name:"Beatrice",age:21}]
```

### Extracting values 

Collect property value (```age``` value) for each object in the collection 

```
 → jop --collect "age" people.json
[ 19, 21, 16 ]
```

Get the value of a property (eg. ```metadata``` property)

```
 → jop --prop "metadata" simple.json
[{name:"extension",val:".json"},{name:"media_type",val:"application/json"},{name:"website",val:"json.org"}]
```

### Transformation 

The ```transform``` option iterates over a collection binding, in the expression context, also:
  - ```out``` as the global result object
  - ```key``` as the current object key

So it is possible to tranform input into something else
(```it```, as usual, is the current object value).

Tranform input collection (create a person with name and year of birth)

```
 → jop -t "out[key] = { name: it.name, dob: new Date().getFullYear() - it.age }" -p people.json
[
  {
    "name": "Andrea",
    "age": 19,
    "yob": 1995
  },
  {
    "name": "Beatrice",
    "age": 21,
    "yob": 1993
  },
  {
    "name": "Carlo",
    "age": 16,
    "yob": 1998
  }
]
```

Transform input adding a property (eg. year of birth) to each object

```
 → jop -t "out[key] = _.merge( _.mapValues(it), {yob: (new Date().getFullYear() - it.age)} )" -p people.json
[
  {
    "name": "Andrea",
    "age": 19,
    "yob": 1995
  },
  {
    "name": "Beatrice",
    "age": 21,
    "yob": 1993
  },
  {
    "name": "Carlo",
    "age": 16,
    "yob": 1998
  }
]

```

The example above shows also how to use the ```_``` variable to access [Lo-Dash library](http://lodash.com/docs) methods in the expression context.

### Known issues

Still no major issues at the moment. However I had no chance to really stress test _jop_, so your mileage may vary.

Please be aware that _jop_ works **on cygwin** but **input piping is NOT supported** (this is a _known node.js limitation_), eg.:

```
 → echo "{"a":1}" | jop -p
Error: EINVAL, invalid argument
```

Workaround: redirect output of the first command to file, than feed this file to _jop_ as input. 
