var OpenLayers = require('script-loader!./lib/OpenLayers/OpenLayers.js')
var Backbone = require('backbone')
var _ = require('underscore')
var LayoutView = require('./views/editor-layout')

'use strict';

var App = {};

App.vent = _.extend({}, Backbone.Events);

App.layout_view = new LayoutView(App.vent);

window.App = App;

module.exports = App
