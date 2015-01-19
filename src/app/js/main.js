/**
 * Copyright (c) 2014 Famous Industries, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * @license MIT
 */

/**
 * HeaderFooterLayout
 * ------------------
 *
 * HeaderFooterLayout is a layout which will arrange three renderables
 * into a header and footer area of defined size and a content area
 * of flexible size.
 *
 * In this example we create a basic HeaderFooterLayout and define a
 * size for the header and footer
 */
define(function(require, exports, module) {
    var Engine             = require('famous/core/Engine');
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var StateModifier      = require('famous/modifiers/StateModifier');
    var Transform          = require('famous/core/Transform');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var Easing             = require('famous/transitions/Easing');
    var RenderController   = require("famous/views/RenderController");

    var MenuView           = require('./views/MenuView');
    var PlayHeaderView     = require('./views/PlayHeaderView');
    var PlayBodyView       = require('./views/PlayBodyView');
    var PlayFooterView     = require('./views/PlayFooterView');

    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    Transitionable.registerMethod('spring', SpringTransition);

    var mainContext = Engine.createContext();

    var layout = new HeaderFooterLayout({
        headerSize: 50,
        footerSize: 50
    });

    layout.header.add(PlayHeaderView);

    //position to the center
    var bodyRenderController = new RenderController();
    layout.content.add(bodyRenderController);

    var bodySurfaces = [];
    bodySurfaces.push(PlayBodyView);
    bodySurfaces.push(MenuView);

    bodyRenderController.show(bodySurfaces[0]);

    PlayBodyView.eventHandler.on('seekToPosition', function(data) {
      PlayHeaderView.setIsPlaying(false);
    });

    PlayBodyView.eventHandler.on('finishedSpeaking', function(data) {
      PlayHeaderView.setIsPlaying(true);
    });

    var togglemenu = false;
    PlayHeaderView.eventHandler.on('showMenu', function(data) {
      bodySurfaces[1].toggle();
      togglemenu = !togglemenu;
      if (togglemenu) {
        bodyRenderController.show(bodySurfaces[1]);
      } else {
        bodyRenderController.show(bodySurfaces[0]);
      }
    });

    PlayHeaderView.eventHandler.on('shouldFlipViews', function(data) {
      PlayBodyView.flip();
    });

    PlayHeaderView.eventHandler.on('shouldPlay', function(data) {
      PlayBodyView.play();
    });

    PlayHeaderView.eventHandler.on('toTop', function(data) {
      PlayBodyView.scrollTo(0);
    });

    MenuView.eventHandler.on('changeContent', function(title) {
      PlayHeaderView.setTitle(title);
      PlayHeaderView.setIsPlaying(true);
      PlayHeaderView.showMenu();
      PlayBodyView.switchContent(title);
    });

    layout.footer.add(PlayFooterView);

    mainContext.add(layout);
});
