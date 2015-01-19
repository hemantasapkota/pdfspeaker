var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var Speaker = require('./Speaker');

var opts = {};
var speaker = null;

var loadBook = function(cb) {
  var execPath = path.dirname(process.execPath);
  var toolPath = path.resolve('tools/pdftotext');
  var nodePath = path.join(execPath, path.resolve('tools/node'));

  window.console.log(execPath);

  try {
    var resolved = path.resolve(opts.pathToBook);

    var child = spawn(toolPath, ['-layout', resolved],
      {execPath: nodePath}
    );
    child.stderr.on('data', function(data) {
      window.console.log(String(data));
    });
    child.on('exit', function(code, signal) {
      //replace pdf extension with txt
      var textfile = resolved.slice(0, -3) + "txt";
      fs.readFile(path.resolve(textfile), function(err, data) {
        opts.fullText = String(data);
        cb(opts.fullText);
      });
    });
    child.unref();
  } catch (e) {
    window.console.log(e);
  }
}

var start = function(pathToBook) {
  if (speaker && speaker.IsPlaying()) {
    speaker.Pause();
  } else if (speaker && !speaker.IsPlaying()) {
    speaker.Resume();
  } else {
    speaker = Speaker(opts.fullText);
    speaker.Start();
  }
}

module.exports = function (pathToBook, cb) {

  opts.pathToBook = pathToBook;
  loadBook(cb);

  return {
    Start: function() {
      return start();
    },
    Speaker: function() {
      return speaker || undefined;
    },
    SeekTo: function(index) {
      speaker.SeekTo(index);
    },
  }
};
