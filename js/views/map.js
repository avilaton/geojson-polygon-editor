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

        window.map = this.map;

        this.baselayer = new OpenLayers.Layer.OSM('OSM Map');

        this.map.addLayer(this.baselayer);

        this.format = new OpenLayers.Format.GeoJSON({
          'internalProjection': this.map.baseLayer.projection,
          'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });

        this.addVectorLayer(self.model);

        // this.addSelectControl().activate();
        this.addEditingControls();
        // this.addEditingToolbar();

        this.model.on("change:filename", self.setCurrent, self);

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

      addSelectControl: function () {
        var self = this,
          control;

        this.selectControl = new OpenLayers.Control.SelectFeature(self.vectorLayer, {
          clickout: true, toggle: true,
          multiple: false, hover: false
        });

        this.selectControl.handlers['feature'].stopDown = false;
        this.selectControl.handlers['feature'].stopUp = false;

        this.map.addControl(self.selectControl);

        return this.selectControl;
      },

      addEditingToolbar: function (layerId) {
        var self = this;
        var control = new OpenLayers.Control.EditingToolbar(self.vectorLayer);
        this.map.addControl(control);
      },

      addEditingControls: function () {
        var self = this;
        var ctrls = {};

        ctrls.point = new OpenLayers.Control.DrawFeature(
          self.vectorLayer,
          OpenLayers.Handler.Point,
          {'displayClass': 'olControlDrawFeaturePoint'}
        );

        ctrls.path = new OpenLayers.Control.DrawFeature(
          self.vectorLayer,
          OpenLayers.Handler.Path,
          {'displayClass': 'olControlDrawFeaturePath'}
        );

        ctrls.poly = new OpenLayers.Control.DrawFeature(
          self.vectorLayer,
          OpenLayers.Handler.Polygon,
          {'displayClass': 'olControlDrawFeaturePolygon'}
        );

        ctrls.modify = new OpenLayers.Control.ModifyFeature(self.vectorLayer);

        ctrls.select = new OpenLayers.Control.SelectFeature(self.vectorLayer, {
          clickout: true, 
          toggle: true,
          multiple: false, 
          hover: false
        });

        ctrls.snap = new OpenLayers.Control.Snapping({
          layer: self.vectorLayer,
          targets: [self.vectorLayer],
          greedy: false
        });

        ctrls.snap.activate();

        ctrls.select.handlers['feature'].stopDown = false;
        ctrls.select.handlers['feature'].stopUp = false;

        var panel = new OpenLayers.Control.Panel({
          defaultControl: ctrls.select
        });

        panel.addControls([
          ctrls.point,
          ctrls.path,
          ctrls.poly,
          ctrls.modify,
          ctrls.select
        ]);

        this.map.addControl(panel);
      },

      addVectorLayer: function (model) {
        var self = this;
        var filename = model.get("filename");

        this.vectorLayer = new OpenLayers.Layer.GML(
          "Vector Layer",
          "./data/" + filename,
          {
            format: OpenLayers.Format.GeoJSON,
            styleMap: Styles["select"],
            visibility: true
        });

        this.map.addLayer(self.vectorLayer);

        this.vectorLayer.events.on({
          "featureselected": self.selectedFeature,
          "featureunselected": self.selectedFeature, 
          scope: self
        });
        this.vectorLayer.events.fallThrough = true;
      },

      setCurrent: function (selectedLayer) {
        var self = this;
        var filename = selectedLayer.get("filename");
        this.vectorLayer.setUrl('./data/'+ filename);
      },

      getLayerGeoJSON: function (layerId) {
        var features = this.map.getLayer(layerId).features;
        var GeoJSONString = this.format.write(features);
        var GeoJSONObject;

        if (features[0]) {
          GeoJSONObject = JSON.parse(GeoJSONString);
          GeoJSONObject.crs = this.format.createCRSObject(features[0]);
        };
        
        GeoJSONString = JSON.stringify(GeoJSONObject);
        return GeoJSONString;
      },

      selectedFeature: function (event) {
        this.model.set("selected", event.feature);
        this.model.trigger("featureEvent", event);
      }

    }); 

return MapView;
});
