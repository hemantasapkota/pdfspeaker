define(function(require, exports, module) {

  var Engine              = require('famous/core/Engine'),
      Surface             = require('famous/core/Surface'),
      Transform           = require('famous/core/Transform'),
      SequentialLayout    = require('famous/views/SequentialLayout'),
      StateModifier       = require('famous/modifiers/StateModifier'),
      EventHandler        = require('famous/core/EventHandler'),
      ContainerSurface    = require('famous/surfaces/ContainerSurface');
      RenderNode          = require('famous/core/RenderNode');

  var container = new ContainerSurface({
      size: [undefined, undefined],
      content: '',
      properties: {
          overflow             : 'hidden',
          backgroundColor      : 'white',
          '-webkit-app-region' : 'drag'
      }
    });

  var sequentialLayout = new SequentialLayout({direction: 0});
  var surfaces = [];

  var makeControlIcon = function(icon) {
    return new Surface({
      size: [40, 50],
      classes: ['fa', icon],
      properties: {
        cursor        : 'pointer',
        lineHeight    : '50px',
        textAlign     : 'center',
        // border        : '1px dotted'
      }
    });
  };

  //Flip
  var eventHandler = new EventHandler();

  var quitSurface  = makeControlIcon('fa-close');
  var flipSurface  = makeControlIcon('fa-toggle-left');
  var playSurface  = makeControlIcon('fa-play');
  var toTopSurface = makeControlIcon('fa-arrow-up');
  var menuSurface  = makeControlIcon('fa-th-large');

  quitSurface.on('click', function() {
    window.close(true);
  });

  var flipstatus = 'left';
  flipSurface.on('click', function() {
    if (flipstatus == 'left') {
      flipSurface.removeClass('fa-toggle-left');
      flipSurface.addClass('fa-toggle-right');
      flipstatus = 'right';
    } else {
      flipSurface.removeClass('fa-toggle-right');
      flipSurface.addClass('fa-toggle-left');
      flipstatus = 'left';
    }
    eventHandler.emit('shouldFlipViews', true);
  });

  var toggleIcon = false;
  var togglePlayIcon = function() {
    toggleIcon = !toggleIcon;
    if (toggleIcon) {
      playSurface.removeClass('fa-play');
      playSurface.addClass('fa-pause');
    } else {
      playSurface.removeClass('fa-pause');
      playSurface.addClass('fa-play');
    }
  };

  toTopSurface.on('click', function() {
    eventHandler.emit('toTop', true);
  });

  playSurface.on('click', function() {
    eventHandler.emit('shouldPlay', true);
    togglePlayIcon();
  });

  menuSurface.setProperties({
    marginLeft: '260px',
  });

  menuSurface.on('click', function() {
    //Drop menu
    eventHandler.emit('showMenu', true);
  });

  surfaces.push(quitSurface);
  surfaces.push(flipSurface);
  surfaces.push(playSurface);
  surfaces.push(toTopSurface);

  var statusSurface = new Surface({
      size: [200, 50],
      content: 'Hiring is Obsolete',
      properties: {
        marginLeft            : '115px',
        lineHeight            : '50px',
        textAlign             : 'center',
        cursor                : 'default',
        '-webkit-user-select' : 'none',
      }
  });

  surfaces.push(statusSurface);
  surfaces.push(menuSurface);

  sequentialLayout.sequenceFrom(surfaces);
  container.add(sequentialLayout);

  container.setIsPlaying = function(status) {
    toggleIcon = status;
    togglePlayIcon();
  };

  container.setTitle = function(title) {
    statusSurface.setContent(title);
  }

  container.showMenu = function() {
    eventHandler.emit('showMenu', true);
  }

  module.exports = container;
  module.exports.eventHandler = eventHandler;
});
