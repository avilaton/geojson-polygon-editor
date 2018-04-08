var OpenLayers = require('script-loader!./lib/OpenLayers/OpenLayers.js')
var LayoutView = require('./views/editor-layout')
var angular = require('angular')

var app = angular.module('app', [])

app.component("app", {
    template: `
<ul>
    <li ng-repeat="prod in $ctrl.products">{{prod}}</li>
</ul>
`,
    controller: [function() {
        this.products = ["Milk", "Bread", "Cheese"];
        
    }]
});

angular.bootstrap(document.getElementById('app'), ['app'], { strictDi: true })

'use strict';

window.GeoJsonEditor = LayoutView;
