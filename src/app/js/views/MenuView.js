define(function(require, exports, module) {

  var fs = window.require('fs');

  var Engine      = require('famous/core/Engine'),
      Surface     = require('famous/core/Surface'),
      Transform   = require('famous/core/Transform'),
      RenderNode  = require('famous/core/RenderNode'),
      Scrollview  = require('famous/views/Scrollview'),
      GridLayout  = require('famous/views/GridLayout'),
      SequentialLayout = require('famous/views/SequentialLayout'),
      ContainerSurface = require('famous/surfaces/ContainerSurface'),
      StateModifier = require('famous/modifiers/StateModifier'),
      SpringTransition = require('famous/transitions/SpringTransition'),
      Transitionable = require('famous/transitions/Transitionable');
      Deck          = require('famous/views/Deck'),
      EventHandler        = require('famous/core/EventHandler');

  Transitionable.registerMethod('spring', SpringTransition);

  var container = new ContainerSurface({
    size: [undefined, undefined],
    properties: {
        overflow: 'hidden',
        backgroundColor: '#2c3e50f'
    }
  });

  var scrollview = new Scrollview({direction: 1});

  //Grid of books
  var items = [];
  var decklayout = new Deck({
    itemSpacing: 4,
    transition: {
      method: 'spring',
      period: 300,
      dampingRatio: 0.5
      },
    stackRotation: 0
  });
  decklayout.sequenceFrom(items);

  var eventHandler = new EventHandler();

  var makeCollectionItem = function(title, sview) {
    var s = new Surface({
      size: [210, 50],
      content: title,
      properties: {
        color: '#34495e',
        lineHeight: '50px',
        backgroundColor: 'white',
        textAlign: 'center',
        cursor: 'pointer',
        borderStyle: 'solid',
        borderColor: ''
      }
    });

    s.on('mouseover', function(data) {
      s.setProperties({backgroundColor: '#f39c12', color: 'white'});
    });

    s.on('mouseout', function(data) {
      s.setProperties({backgroundColor: 'white', color: '#34495e'});
    })

    s.on('click', function(data) {
      eventHandler.emit('changeContent', s.getContent());
    });

    // s.pipe(sview);
    return s;
  }

  fs.readdir('books', function(err, files) {
    for (var i = 0; i < files.length; i++) {
      var f = files[i].replace('.txt', '').split('_').join(' ');
      items.push(makeCollectionItem(f, scrollview));
    }
  })

  var modifier = new StateModifier({
    align : [.5, .5],
    center: [.5, .5],
    transform: Transform.translate(-80, -175, 0)
  });

  container.add(modifier).add(decklayout);

  container.on('click', function() {
  });

  //container API
  container.toggle = function() {
    decklayout.toggle();
  }

  module.exports = container;
  module.exports.eventHandler = eventHandler;
});
