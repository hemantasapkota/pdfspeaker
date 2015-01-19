var gui = require('nw.gui');

define(function(require, exports, module) {

  var Engine      = require("famous/core/Engine"),
      Surface     = require("famous/core/Surface"),
      Transform = require('famous/core/Transform'),
      StateModifier = require('famous/modifiers/StateModifier'),
      EventHandler = require('famous/core/EventHandler'),
      InputSurface = require("famous/surfaces/InputSurface"),
      SequentialLayout = require("famous/views/SequentialLayout"),
      ContainerSurface = require("famous/surfaces/ContainerSurface");

  var container = new ContainerSurface({
      size: [undefined, undefined],
      content: '',
      properties: {
          'overflow'              : 'hidden',
          'background-color'      : 'white',
      }
    });

  var layout = new SequentialLayout({direction: 0});
  var surfaces = [];

  var input = new InputSurface({
      size: [430, 20],
      name: 'inputSurface',
      placeholder: 'We\'re launching soon. Subscribe now to get updates.',
      value: '',
      type: 'email',
      properties: {
        marginTop   : '5px',
        marginLeft  : '5px',
        color       : '#34495e'
      }
  });

  var subbtn = new Surface({
    size: [100, 40],
    content: 'Subscribe',
    properties: {
      textAlign                : 'center',
      backgroundColor          : '#16a085',
      marginLeft               : '10px',
      marginTop                : '5px',
      lineHeight               : '40px',
      color                    : 'white',
      cursor                   : 'pointer',
      '-webkit-user-select'    : 'none',
    }
  });

  var checkoutLabel = new Surface({
    size: [150, 40],
    content: ' pdfspeaker.com ',
    classes: ["fa", "fa-external-link"],
    properties: {
      backgroundColor          : '#d35400',
      lineHeight               : '40px',
      marginLeft               : '15px',
      marginTop                : '5px',
      textAlign                : 'center',
      cursor                   : 'pointer',
      color                    : 'white'
    }
  });

  checkoutLabel.on('click', function(){
    gui.Shell.openExternal("http://www.pdfspeaker.com");
  });

  surfaces.push(input);
  surfaces.push(subbtn);
  surfaces.push(checkoutLabel);

  layout.sequenceFrom(surfaces);

  container.add(layout);

  module.exports = container;
});
