var OpenLayers = require('script-loader!./lib/OpenLayers/OpenLayers.js')
var LayoutView = require('./views/editor-layout')
var angular = require('angular')
var EditorModule = require('./components/editor')

var app = angular.module('app', [
    EditorModule
])

angular.bootstrap(document.getElementById('app'), ['app'], { strictDi: true })

'use strict';

window.GeoJsonEditor = LayoutView;
