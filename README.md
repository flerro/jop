# jop

A commandline JSON processor powered by [node.js](http://groovy.codehaus.org/).

## Install

npm install jop -g 

## Usage

```
Usage: jop [options] [input.json]

Options:
  -c, --count    Count all elements in input                                               
  --countby      Count elements in input grouping by the given expression                  
  -f, --findall  Find all elements satisfying given expression                             
  --find         Find first element satisfying given expression                            
  --flat         Flatten output                                                            
  --fold         Execute given expression recusively on elements from the first to the last
  --foldLeft     Execute given expression recusively on elements from the last to the first
  -g, --groupby  Group input elements using given expression                               
  --indexof      Find index of the first element matching the given expression             
  --lastindexof  Find index of the last element matching the given expression              
  -m, --map      Transform each node to be the output of the given expression              
  --min          Find the element having the max output for the given expression           
  --max          Find the element having the min output for the given expression           
  --head         Return the first n nodes, where n is a given number                         [default: 5]
  -s, --sort     Sort input elements using the provided expression                         
  --sample       Get n random elments from input, where n is a given number                  [default: 2]
  -t             Transform input node using the given expression                           
  --tail         Return last n elements, where n is a given number                           [default: 5]
  -p, --pprint   Pretty-print output                                                       
  -h, --help     Display usage information                                                 
```

For more examples read the [related article on my blog](http://www.rolanfg.net/TBD/json-processor-nodejs)
