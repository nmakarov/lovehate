var fs = require('fs');
var graph;


function getPattern(word, position) {
  return position >= 0 && position < word.length ?
    word.substr(0, position) + '.' + word.substr(position+1)
    : word;
}

function getMatches(arr, regexp, seen, res) {
  var r = res ? res : {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].match(regexp) && seen.indexOf(arr[i]) === -1) {
      r[arr[i]] = true;
    }
  }
  return Object.keys(r).length ? r : false;
}


var makeGraph = function (words) {
  var g = {};
  var word, iw, lw = words.length;
  var i, l;
  var chars = 'abcdefghijklmnopqrstuvwxyz';
  var char, ic, lc = chars.length;
  var tword, it, lt;

  // each word from dictionary
  for (iw = 0; iw < lw; iw++) {
    word = words[iw];
    if (iw % 100 === 0) {
      console.info('', iw, ' of ', lw, ' ', word);
    }

    // pemutate each letter
    for (i = 0, l = word.length; i < l; i++) {

      var pattern = getPattern(word, i);
      var leafs = getMatches(words, pattern, [word], g[word]);
      if (leafs) {
        g[word] = leafs;
      }

    }
  }

  return g;
};

var findPath = function(graph, start, stop) {

};


function transformWord(graph, start, goal) {

  // all possible paths are accumulated here:
  var paths = [[start]];
  var seen = [];

  // check every path. Three options:
  // 1. last word is goal --> done.
  // 2. last word is seen --> deadend; remove path.
  // 3. last word is new one --> make new paths
  while (paths.length) {

    // take first available path from `paths`
    var currentPath = paths.shift();
    // word - last one from path
    var currentWord = currentPath[currentPath.length - 1];

    if (currentWord === goal) {
      // target reached; return.
      return currentPath;
    } else if (-1 !== seen.indexOf(currentWord)) {
      // word has been seen; do nothing and take next path.
      continue;
    }

    // create as many new paths as per graph
    seen.push(currentWord);

    // for each of the word's children
    transforms = graph[currentWord];
    for (var index in transforms) {

      // make sure current word is not in the path already to avoid circular paths
      if (-1 === currentPath.indexOf(index)) {

        // hacky way to clone current path
        var newPathStr = JSON.stringify(currentPath);
        var newPath = JSON.parse(newPathStr);

        // add current new word to the end of an old path
        newPath.push(index);
        // now add to the `paths` array this new path.
        paths.push(newPath);
      }
    }

  } // while
}


// without extension
var filename = '3';

// 1. get the graph
try {
  // get prepared graph from .json file
  var json = fs.readFileSync(filename + '.json').toString();
  graph = JSON.parse(json);
  console.info('>> Graph from file.');
} catch (e) {
  // .json doesn't exist or broken; generate graph and save it.
  var words = fs.readFileSync(filename + '.txt').toString().toLowerCase().split("\n");
  graph = makeGraph(words);
  fs.writeFileSync(filename + '.json', JSON.stringify(graph));
  console.info('>> Graph generated.');
}

// 2. get shortest path
var path = transformWord(graph, 'cat', 'dog');
// var path = transformWord(graph, 'love', 'hate');

console.info('path:', path);

