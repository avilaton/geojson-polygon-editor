define(["OpenLayers",
	"backbone"],
function (OpenLayers, Backbone) {
	'use strict';

	var MapView = Backbone.View.extend({
		el: $("#mapBox"),

		initialize: function(){
		    var self = this,
		    	bodyheight = $(window).height();

		    $("#mapBox").height(bodyheight-80);
		    $(window).resize(function() {
			    bodyheight = $(window).height();
			    $("#mapBox").height(bodyheight-80);
			    setTimeout( function() { self.map.updateSize();}, 10);
		    });

			this.map = new OpenLayers.Map('map', {controls : [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.LayerSwitcher({'ascending':false}),
                new OpenLayers.Control.ScaleLine(),
                new OpenLayers.Control.MousePosition({displayProjection: 
                new OpenLayers.Projection("EPSG:4326")}),
                new OpenLayers.Control.Attribution()
                ]
            });
            this.baselayer = new OpenLayers.Layer.OSM('OSM Map');

	        this.map.addLayer(this.baselayer);

	        this.panAndZoom();

        	this.format = new OpenLayers.Format.GeoJSON({
	            'internalProjection': this.map.baseLayer.projection,
	            'externalProjection': new OpenLayers.Projection("EPSG:4326")
	        });
		},

		panAndZoom: function (lon, lat, zoom) {
			var lon = lon || -64.1857371;
			var lat = lat || -31.4128832;
			var zoom = zoom || 12;
	        this.map.setCenter(
	            new OpenLayers.LonLat(lon, lat).transform(
	                new OpenLayers.Projection("EPSG:4326"),
	                this.map.getProjectionObject()
	            ), zoom
	        );
		},

        render: function () {

        }

	}); 

	return MapView;
});
