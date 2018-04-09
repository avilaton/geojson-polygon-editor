var angular = require('angular')
var BackboneMapView = require('../../views/map')
var LayerModel = require('../../models/layer')

var ngModule = angular.module('MapModule', [])

function MapController ($http) {
    var ctrl = this

    this.$postLink = function () {
        var el = $('#myMap')

        var layer = new LayerModel({
            filename: 'personas.geojson',
        })
      
        var view = new BackboneMapView({
            model: layer,
            mapElement: 'myMap'
        })
        view.panAndZoom()
        console.log(el)
        layer.on('featureEvent', onFeatureEvent)
    }

    function onFeatureEvent(event){
        ctrl.onSelect(event)
    }
}

MapController.$inject = ['$http']

ngModule.component('map', {
    template: `
<div id="myMap" class="map-container">
</div>
`,
    controller: MapController,
    bindings :{
        onSelect: '&'
    }
});

module.exports = ngModule.name
