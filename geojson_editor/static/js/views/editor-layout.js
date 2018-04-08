var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
var tmpl = require('../../templates/editor-layout.handlebars')

var TagModel = require('../models/tag')
var LayerModel = require('../models/layer')
var TagsCollection = require('../collections/tags')
var GlobalTagsCollection = require('../collections/globalTags')
var GlobalTagsView = require('./globalTags')
var TagsView = require('./tags')
var MapView = require('./map')

module.exports = Backbone.View.extend({

  el: $("#layout"),

  events: {
    "click .btn.save-layer": "saveLayer",
    "click .btn.export-layer": "exportLayer"
  },

  template: tmpl,

  initialize: function(options) {
    var self = this;

    self.tags_collection = new TagsCollection();
    // self.globalTagsCollection = new GlobalTagsCollection();
    self.globalTags = new TagModel();

    self.layer = new LayerModel({
      filename: options.filename,
      url: options.resourceURL
    })

    self.render();
    self.attachSubViews();

    self.layer.on("featureEvent", self.featureEvent, self);

    self.layer.on("change:collectionTags", self.onGlobalTagsSet, self);

    self.tags_collection.on("updated", self.setUpdatedFlag, self);
  },

  render: function () {
    this.$el.html(this.template());
  },

  attachSubViews: function () {
    var self = this;

    self.collectionTagsView = new GlobalTagsView({
      el: $('#globalTags'),
      model: self.globalTags
    });

    self.tags_view = new TagsView({
      el: $('#tags'),
      collection: self.tags_collection,
      selectedLayer: self.layer
    });
    
    self.mapView = new MapView({
      model: self.layer
    });

    self.mapView.panAndZoom();
  },

  setUpdatedFlag: function (event) {
    this.layer.set("updated", true);
  },

  featureEvent: function (event) {
    var self = this;

    if (event.type == "featureselected") {
      self.tags_collection.parseFeature(event.feature);
    } else if (event.type == "featureunselected") {
      self.tags_collection.reset();
    };
  },

  onGlobalTagsSet: function (model) {
    var self = this;
    var layerProperties = model.get("collectionTags");
    if (layerProperties.hasOwnProperty('tags')) {
      self.globalTags.set(layerProperties.tags);
    };
  },

  saveLayer: function () {
    var geojson = this.mapView.getLayerGeoJSON();

    this.layer.save(geojson);
  },

  exportLayer: function (event) {
    console.log(event);
  }
});
