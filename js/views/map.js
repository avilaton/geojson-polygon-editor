define(["OpenLayers",
  "backbone",
  "views/tags",
  "models/tags",
  "views/styles"],
function (OpenLayers, Backbone, TagsView, TagsModel, Styles) {
  'use strict';

  var MapView = Backbone.View.extend({
    el: $("#mapBox"),

    setup: function () {
      var self = this;

      self.layers = {
        barrios: {
          name: "Barrios",
          filename: "data/barrios.json",
          style: "select"
        },
        distritos: {
          name: "Distritos", 
          filename: "data/distritos.geojson",
          style: "overlay"
        },
        cpc: {
          name: "Zonas CPC", 
          filename: "data/cpc.geojson",
          style: "overlay"
        }
      };

      self.tags_model = new TagsModel();

      self.tags_view = new TagsView({
        el: $("#tags"),
        model: self.tags_model
      });
    },

    initialize: function(){
      var self = this,
        bodyheight = $(window).height();

      $("#mapBox").height(bodyheight-80);
      $(window).resize(function() {
        bodyheight = $(window).height();
        $("#mapBox").height(bodyheight-80);
        setTimeout( function() { self.map.updateSize();}, 100);
      });

      this.setup();

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

      this.addLayer("barrios");
      this.addLayer("distritos");
      this.addLayer("cpc");

      this.addSelectControl("barrios");

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

    addSelectControl: function (layerId) {
      var self = this,
        layer = this.map.getLayer(layerId),
        control;

      layer.events.on({
        "featureselected": this.selectedFeature,
        "featureunselected": this.selectedFeature, 
        scope: self
      });

      control = new OpenLayers.Control.SelectFeature(
        layer,
        {
          clickout: true, toggle: true,
          multiple: false, hover: false
        }
      );

      control.handlers['feature'].stopDown = false;
      control.handlers['feature'].stopUp = false;
      this.map.addControl(control);
      control.activate();
      layer.events.fallThrough = true;
    },

    addLayer: function (layerId) {
      var layer, spec;
      
      spec = this.layers[layerId];

      layer = new OpenLayers.Layer.GML(spec.name, spec.filename, {
        format: OpenLayers.Format.GeoJSON,
        styleMap: Styles[spec.style],
        visibility: false
      });
      layer.id = layerId;

      this.map.addLayer(layer);
    },

    toggleLayer: function (layer,visibility) {
        this.map.getLayer(layer).setVisibility(visibility);
    },

    toJSON: function (layerId) {
      var result = this.format.write(this.map.getLayer(layerId).features);
        $('#result').text(result);
      this.trigger("featureselected");
      console.log(this);
    },

    render: function () {},

    selectedFeature: function (event) {
      var self = this,
        feature = event.feature;

      if (event.type == "featureselected") {
        self.tags_model.buildTagsArray(feature.data);
      } else if (event.type == "featureunselected") {
        self.tags_model.buildTagsArray({});
      };

    }

  }); 

  return MapView;
});
