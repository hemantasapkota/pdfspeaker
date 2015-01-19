define(function(require, exports, module) {

  var Engine      = require("famous/core/Engine"),
      Surface     = require("famous/core/Surface"),
      Transform = require('famous/core/Transform'),
      Scrollview  = require("famous/views/Scrollview"),
      GridLayout  = require("famous/views/GridLayout"),
      SequentialLayout = require("famous/views/SequentialLayout"),
      ContainerSurface = require("famous/surfaces/ContainerSurface"),
      StateModifier = require('famous/modifiers/StateModifier');


  var container = new ContainerSurface({
    size: [undefined, undefined],
    classes: ['grey-bg'],
    properties: {
        overflow: 'hidden'
    }
  });

  //Sub header menu: Collections, Authors
  var grid0 = new GridLayout({dimensions: [6, 1]});
  var toolbarItems = [];
  var makeToolbarItem = function(name, icon) {
    return new Surface({
      size: [100, 20],
      classes: ["grey-bg", "fa", icon],
      content: name,
      properties: {
        cursor: "pointer",
        textAlign: "center",
        margin: "10px"
      }
    });
  }
  toolbarItems.push(makeToolbarItem(" Collections", "fa-book"));
  toolbarItems.push(makeToolbarItem(" Author", "fa-users"));
  toolbarItems.push(makeToolbarItem(" Categories", "fa-pencil"));
  toolbarItems.push(makeToolbarItem(" Settings", "fa-cog"));
  toolbarItems.push(makeToolbarItem(" Help", "fa-pencil"));
  toolbarItems.push(makeToolbarItem(" About", "fa-pencil"));
  grid0.sequenceFrom(toolbarItems);
  container.add(grid0);

  var scrollview = new Scrollview({direction: 1}, 10);

  //Grid of books
  var gridItems = [];
  var grid1 = new GridLayout({
    dimensions: [4, 4]
  });
  grid1.sequenceFrom(gridItems);
  for (var i = 0; i < 50; i++) {
    var addBooksSurface = new Surface({
      size: [undefined, 105],
      content: "<a href>Add New</a>",
      classes: ["grey-bg", "fa", "fa-plus"],
      properties: {
        lineHeight: '100px',
        textAlign: "center",
        border: "1px dotted"
      }
    });
    addBooksSurface.pipe(scrollview);
    gridItems.push(addBooksSurface);
  }

  var stateModifier = new StateModifier({
    transform: Transform.translate(0, 40, 0)
  });

  // container.add(stateModifier).add(grid1);

  scrollview.sequenceFrom(gridItems);
  container.add(stateModifier).add(scrollview);

  module.exports = container;
});
