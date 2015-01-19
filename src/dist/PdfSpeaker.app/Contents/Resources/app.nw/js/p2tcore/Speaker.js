var spawn = require('child_process').spawn;
var speakerChild = {};

var opts = {};

var notifyEnd = function() {
  var child = spawn('say', ['End of the book.'], {detached: true});
  child.unref();
}

var speak = function() {
  if (opts.index >= opts.textData.length) {
    window.updateSpeakProgress(opts.textData[opts.index], opts.index, opts.textData.length);
    notifyEnd();
    return;
  }

  var item = opts.textData[opts.index];
  if (!item) {
    ++opts.index;
    speak();
    return;
  }

  window.updateSpeakProgress(opts.textData[opts.index], opts.index, opts.textData.length);

  speakerChild = spawn('say', [item], {detached: true});
  speakerChild.on('close', function(err, signal) {
    speakerChild.unref();
    if (opts.pause) {
      return;
    }

    ++opts.index;
    speak();
  });
}

var start = function() {
  if (!opts.textData) {
    opts.textData = opts.textOriginal.split('\n');
    opts.index = window.localStorage.getItem("currentIndex") || 0;
    opts.playing = true;
  }
  speak();
}

var pause = function() {
  opts.pause = true;
  opts.playing = false;

  if (speakerChild) {
    speakerChild.kill('SIGHUP');
  }
}

var resume = function() {
  opts.playing = true;
  opts.pause = false;
  speak();
}

module.exports = function(text) {
  return {
    Start: function() {
      opts.textOriginal = text;
      return start();
    },
    Pause: function() {
      return pause();
    },
    Resume: function() {
      return resume();
    },
    IsPlaying: function() {
      return opts.playing;
    },
    Kill: function() {
      pause();
    },
    SeekTo: function(index) {
      pause();
      opts.index = index;
      setTimeout(function(){
        resume()
      }, 1000);
    },
    CorpusLength: function() {
      return opts.textData.length;
    }
  };
}
