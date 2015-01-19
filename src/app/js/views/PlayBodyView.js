var gui = window.require('nw.gui');

define(function(require, exports, module) {

  var Engine              = require('famous/core/Engine'),
      Surface             = require('famous/core/Surface'),
      Transform           = require('famous/core/Transform'),
      SequentialLayout    = require('famous/views/SequentialLayout'),
      StateModifier       = require('famous/modifiers/StateModifier'),
      EventHandler        = require('famous/core/EventHandler'),
      Flipper             = require('famous/views/Flipper'),
      Scrollview          = require('famous/views/Scrollview')
      GridLayout          = require('famous/views/GridLayout'),
      RenderNode          = require('famous/core/RenderNode'),
      ContainerSurface    = require('famous/surfaces/ContainerSurface'),
      EventHandler        = require('famous/core/EventHandler'),

      TextPlayer          = require('../p2tcore/TextPlayer');

  var container = new ContainerSurface({
      size: [undefined, undefined],
      content: "Loading...",
      properties: {
          "overflow": 'hidden',
          "background-color": '#ecf0f1'
      }
    });

  var singleLineBodySurface = new Surface({
      size: [undefined, undefined],
      content: "",
      properties: {
          "lineHeight"          : window.innerHeight - 150 + 'px',
          "textAlign"           : "center",
          "-webkit-user-select" : "none",
          "cursor"              : "default",
          "color"               : "#3498db",
          "font-weight"         : "lighter"
      }
  });

  var flipper = new Flipper();
  var eventHandler = new EventHandler();
  var scrollview = new Scrollview();
  var surfaces = [];

  var makeTextPlayer = function(file) {
    var txtPlayer = new TextPlayer(file, function(fulltext) {
      //update flipper
      var index = fulltext.indexOf('\n');
      singleLineBodySurface.setContent(fulltext.substr(0, index));
      flipper.setFront(singleLineBodySurface);

      var splits = fulltext.split('\n');

      surfaces.length = 0;
      scrollview.sequenceFrom(surfaces);

      for (var i = 0; i < splits.length; i++) {
        var back = new Surface({
          size: [undefined, 30],
          content: " " + splits[i],
          classes: ["fa"],
          properties: {
            "textAlign": "center",
            "-webkit-user-select" : "none",
            "cursor" : "default"
          }
        });

        back.on('mouseover', function(e){
          var index = surfaces.indexOf(this);
          var s = surfaces[index];
          s.addClass("fa-play");
        });

        back.on('mouseout', function(e) {
          var index = surfaces.indexOf(this);
          surfaces[index].removeClass("fa-play");
        });

        back.on('click', function(e) {
          eventHandler.emit('seekToPosition', true);
          var index = surfaces.indexOf(this);
          txtPlayer.SeekTo(index);
        });

        back.pipe(scrollview);
        surfaces.push(back);
      }
      flipper.setBack(new RenderNode(scrollview));
    });

    txtPlayer.Speaker().eventHandler().on('updateSpeakProgress', function(opts) {
      if (opts.index >= opts.textData.length) {
        singleLineBodySurface.setContent("END OF THE BOOK.");
        eventHandler.emit('finishedSpeaking', true);
        return;
      }
      singleLineBodySurface.setContent(opts.textData[opts.index]);
      scrollview.goToPage(opts.index);
      surfaces[opts.index].setProperties({'color' : '#3498db'});

      //Save index
      window.localStorage.setItem('currentIndex', opts.index);
    });

    return txtPlayer;
  }

  var txtPlayer = makeTextPlayer('books/Hiring_Is_Obsolete.txt');

  //Node WebKit Window Kill
  gui.Window.get().on('close', function() {
    if (txtPlayer.Speaker()) {
      txtPlayer.Speaker().Kill();
    }
    this.close(true);
  });

  var toggle = false;

  //API
  container.flip = function() {
    var angle = toggle ? 0 : Math.PI;
    flipper.setAngle(angle, {curve : 'easeOutBounce', duration : 900});
    toggle = !toggle;
  };

  container.play = function() {
    txtPlayer.Start();
  };

  container.switchContent = function(title) {
    t = "books/" + title.replace(/ /g, "_") + ".txt";
    txtPlayer.Stop();
    txtPlayer = makeTextPlayer(t);
  };

  container.scrollTo = function(index) {
    var speaker = txtPlayer.Speaker();
    if (!speaker) return;
    if (index < 0 || index > speaker.CorpusLength()) {
      return;
    }
    scrollview.goToPage(index);
  };

  container.add(flipper);

  module.exports = container;
  module.exports.eventHandler = eventHandler;
});
