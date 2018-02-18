// require.config({
//     baseUrl: 'static/js',
//     shim: {
//         OpenLayers: {
//             exports: 'OpenLayers'
//         },
//         handlebars: {
//             exports: 'Handlebars'
//         }
//     },
//     paths: {
//         "backbone": "../bower_components/backbone-amd/backbone",
//         "jquery": "../bower_components/jquery/jquery",
//         "OpenLayers": "lib/OpenLayers/OpenLayers",
//         "underscore": "../bower_components/underscore-amd/underscore",
//         "handlebars": "../bower_components/handlebars/handlebars",
//         "text": "../bower_components/requirejs-text/text"
//     }
// });

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
