define(function(require, exports, module) {

  var EventHandler   = require('famous/core/EventHandler');

  var eventHandler = new EventHandler();
  var spawn = window.require('child_process').spawn;
  var speakerChild = undefined;
  var opts = {};

  function Speaker(text) {
    opts.textOriginal = text;
    opts.textData = opts.textOriginal.split('\n');
    opts.index = window.localStorage.getItem("currentIndex") || 0;
    opts.playing = false;

    this.eventHandler().emit('updateSpeakProgress', opts);
  }

  Speaker.prototype.Start = function() {
    opts.playing = true;
    this.Speak();
  }

  Speaker.prototype.Pause = function() {
    opts.pause = true;
    opts.playing = false;
    if (speakerChild) {
      speakerChild.kill('SIGHUP');
    }
  }

  Speaker.prototype.Resume = function() {
    opts.playing = true;
    opts.pause = false;
    this.Speak();
  }

  Speaker.prototype.IsPlaying = function() {
    return opts.playing;
  };

  Speaker.prototype.Kill = function() {
    this.Pause();
  };

  Speaker.prototype.SeekTo = function(index) {
    this.Pause();
    opts.index = index;
    setTimeout(function(){
      Speaker.prototype.Resume()
    }, 1000);
  };

  Speaker.prototype.CorpusLength = function() {
    return opts.textData.length;
  };

  Speaker.prototype.notifyEnd = function() {
    var child = spawn('say', ['End of the book.'], {detached: true});
    child.unref();
  };

  Speaker.prototype.Speak = function() {
    var self = this;
    if (opts.index >= opts.textData.length) {
      eventHandler.emit('updateSpeakProgress', opts);
      this.notifyEnd();
      return;
    }

    var item = opts.textData[opts.index];
    if (!item) {
      ++opts.index;
      self.Speak();
      return;
    }

    eventHandler.emit('updateSpeakProgress', opts);

    speakerChild = spawn('say', [item], {detached: true});
    speakerChild.on('close', function(err, signal) {
      speakerChild.unref();
      if (opts.pause) {
        return;
      }

      ++opts.index;
      self.Speak();
    });
  };

  Speaker.prototype.eventHandler = function() {
    return eventHandler;
  };

  module.exports = Speaker;
});
