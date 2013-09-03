define(["OpenLayers",
  "backbone",
  "views/styles"],
  function (OpenLayers, Backbone, Styles) {
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
          setTimeout( function() { self.map.updateSize();}, 100);
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

      addSelectControl: function (layerIds) {
        var self = this,
          layers = [],
          control;

        for (var i = 0; i < layerIds.length; i++) {

          this.map.getLayer(layerIds[i]).events.on({
            "featureselected": this.selectedFeature,
            "featureunselected": this.selectedFeature, 
            scope: self
          });
          this.map.getLayer(layerIds[i]).events.fallThrough = true;

          layers.push(this.map.getLayer(layerIds[i]));
        };

        control = new OpenLayers.Control.SelectFeature(
          layers,
          {
            clickout: true, toggle: true,
            multiple: false, hover: false
          }
        );
        control.id = "selectControl";

        control.handlers['feature'].stopDown = false;
        control.handlers['feature'].stopUp = false;

        self.map.addControl(control);
        control.activate();
      },

      addLayer: function (spec) {
        var layer;

        layer = new OpenLayers.Layer.GML(spec.name, spec.filename, {
          format: OpenLayers.Format.GeoJSON,
          styleMap: Styles[spec.style],
          visibility: false
        });
        layer.id = spec.id;

        this.map.addLayer(layer);
      },

      setVisibility: function (layerId,visibility) {
        var control = this.map.getControl("selectControl");

        this.map.getLayer(layerId).setVisibility(visibility);
      },

      setSelectable: function (layerId) {
        var layer = this.map.getLayer(layerId),
          control = this.map.getControl("selectControl");

        control.setLayer(layer);
      },

      toJSON: function (features) {
        var result = this.format.write(features);
        console.log("feature to json", result);
        $('#result').text(result);
        // this.trigger("featureselected");
      },

      selectedFeature: function (event) {
        App.vent.trigger("featureselected", event);
      }

    }); 

  return MapView;
});
