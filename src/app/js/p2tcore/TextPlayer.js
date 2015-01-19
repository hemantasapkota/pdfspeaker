
define(function(require, exports, module) {
  var path    = window.require('path');
  var fs      = window.require('fs');
  var Speaker = require('./Speaker');
  var speaker = null;

  function TextPlayer(path, cb) {
    var text = String(fs.readFileSync(path));
    cb(text);
    speaker = new Speaker(text);
  };

  TextPlayer.prototype.Start = function() {
    if (speaker && speaker.IsPlaying()) {
      speaker.Pause();
    } else if (speaker && !speaker.IsPlaying()) {
      speaker.Resume();
    } else {
      speaker.Start();
    }
  };

  TextPlayer.prototype.Stop = function() {
    if (speaker) {
      speaker.Pause();
    }
  };

  TextPlayer.prototype.Speaker = function() {
    return speaker || undefined;
  };

  TextPlayer.prototype.SeekTo = function(index) {
    return speaker.SeekTo(index);
  };

  module.exports = TextPlayer;
});
