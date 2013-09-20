define(["OpenLayers",
  "backbone",
  "views/styles"],
  function (OpenLayers, Backbone, Styles) {
    'use strict';

    var MapView = Backbone.View.extend({
      el: $("#mapBox"),

      initialize: function(layers){
        var self = this,
        bodyheight = $(window).height();

        $("#mapBox").height(bodyheight-80);
        $(window).resize(function() {
          bodyheight = $(window).height();
          $("#mapBox").height(bodyheight-80);
          setTimeout( function() { self.map.updateSize();}, 100);
        });

        this.map = new OpenLayers.Map('map', {
          controls : [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher({'ascending':false}),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.MousePosition({
              displayProjection: new OpenLayers.Projection("EPSG:4326")
            }),
            new OpenLayers.Control.Attribution()
          ]
        });

        this.baselayer = new OpenLayers.Layer.OSM('OSM Map');

        this.map.addLayer(this.baselayer);

        this.format = new OpenLayers.Format.GeoJSON({
          'internalProjection': this.map.baseLayer.projection,
          'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });

        _.each(self.collection.models, function (model) {
          self.addLayer(model.attributes);
        });

        this.collection.selected.on("change", self.setCurrent, self);

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

        _.each(self.collection.models, function (layerModel) {
          var layer = self.map.getLayer(layerModel.attributes.filename);
          layers.push(layer);
          layer.events.on({
            "featureselected": self.selectedFeature,
            "featureunselected": self.selectedFeature, 
            scope: self
          });
          layer.events.fallThrough = true;
        });

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

        layer = new OpenLayers.Layer.GML(spec.filename, "./data/" + spec.filename, {
          format: OpenLayers.Format.GeoJSON,
          styleMap: Styles["select"],
          visibility: false
        });
        layer.id = spec.filename;

        this.map.addLayer(layer);
      },

      setVisibility: function (layerId,visibility) {
        this.map.getLayer(layerId).setVisibility(visibility);
      },

      setSelectable: function (layerId) {
        var layer = this.map.getLayer(layerId),
        control = this.map.getControl("selectControl");

        control.setLayer(layer);
      },

      setCurrent: function (selectedLayer) {
        var self = this;

        this.selectedLayer = selectedLayer;

        _.each(self.collection.models, function (model) {
          self.setVisibility(model.attributes.filename, false)
        });

        this.setVisibility(selectedLayer.get("filename"), true);
      },

      getLayerGeoJSON: function (layerId) {
        var features = this.map.getLayer(layerId).features;
        var GeoJSONString = this.format.write(features);
        var GeoJSONObject;

        // console.log(features);
        
        if (features[0]) {
          GeoJSONObject = JSON.parse(GeoJSONString);
          GeoJSONObject.crs = this.format.createCRSObject(features[0]);
        };
        
        GeoJSONString = JSON.stringify(GeoJSONObject);
        return GeoJSONString;
      },

      selectedFeature: function (event) {
        this.selectedLayer.set("selected", event.feature);
        this.selectedLayer.trigger("featureEvent", event);
      }

    }); 

return MapView;
});
