define(function(require, exports, module) {

  var Engine      = require("famous/core/Engine"),
      Surface     = require("famous/core/Surface"),
      Transform = require('famous/core/Transform'),
      SequentialLayout = require("famous/views/SequentialLayout"),
      StateModifier = require('famous/modifiers/StateModifier'),
      EventHandler = require('famous/core/EventHandler'),
      ContainerSurface = require("famous/surfaces/ContainerSurface");

  var container = new ContainerSurface({
      size: [undefined, undefined],
      content: "",
      properties: {
          "overflow"              : 'hidden',
          "background-color"      : 'white',
          "-webkit-app-region"    : 'drag'
      }
    });

  var sequentialLayout = new SequentialLayout({direction: 0});
  var surfaces = [];

  var statusSurface = new Surface({
      size: [undefined, 50],
      content: " Hackers & Painter - Paul Graham ",
      classes: ["fa", "fa-file-pdf-o"],
      properties: {
          "lineHeight"          : "50px",
          "textAlign"           : "left",
          "text-indent"         : "100px",
          "-webkit-user-select" : "none",
          "cursor"              : "default"
      }
  })

  var makeControlIcon = function(icon) {
    return new Surface({
      size: [40, 50],
      classes: ["fa", icon],
      content: '',
      properties: {
        cursor        : 'pointer',
        lineHeight    : '50px',
        textAlign     : 'center',
      }
    })
  };

  //Flip
  var eventHandler = new EventHandler();

  var quitSurface  = makeControlIcon("fa-close");
  var flipSurface  = makeControlIcon("fa-toggle-left");
  var playSurface  = makeControlIcon("fa-play");
  var toTopSurface = makeControlIcon("fa-arrow-up");

  quitSurface.on('click', function() {
    window.close(true);
  });

  var flipstatus = "left";
  flipSurface.on('click', function() {
    if (flipstatus == "left") {
      flipSurface.removeClass("fa-toggle-left");
      flipSurface.addClass("fa-toggle-right");
      flipstatus = "right";
    } else {
      flipSurface.removeClass("fa-toggle-right");
      flipSurface.addClass("fa-toggle-left");
      flipstatus = "left";
    }

    eventHandler.emit('shouldFlipViews', true);
  });

  var toggleIcon = false;
  var togglePlayIcon = function() {
    toggleIcon = !toggleIcon;
    if (toggleIcon) {
      playSurface.removeClass("fa-play");
      playSurface.addClass("fa-pause");
    } else {
      playSurface.removeClass("fa-pause");
      playSurface.addClass("fa-play");
    }
  };

  toTopSurface.on('click', function() {
    eventHandler.emit('toTop', true);
  });

  playSurface.on('click', function() {
    eventHandler.emit('shouldPlay', true);
    togglePlayIcon();
  });

  surfaces.push(quitSurface);
  surfaces.push(flipSurface);
  surfaces.push(playSurface);
  surfaces.push(toTopSurface);
  surfaces.push(statusSurface);

  sequentialLayout.sequenceFrom(surfaces);

  container.add(sequentialLayout);

  container.setIsPlaying = function(status) {
    toggleIcon = status;
    togglePlayIcon();
  };

  // module.exports = sequentialLayout;
  module.exports = container;
  module.exports.eventHandler = eventHandler;
});
