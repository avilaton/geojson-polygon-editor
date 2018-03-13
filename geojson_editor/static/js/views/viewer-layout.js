var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
var tmpl = require('../../templates/viewer-layout.handlebars')

var TagsCollection = require('../collections/tags')
var LayersCollection = require('../collections/layers')
var MapView = require('./map')
var TagsView = require('./tags')


module.exports = Backbone.View.extend({
    el: $("#layout"),
    events: {
      "change select.layer": "onChangeLayer",
      "featureselected": "rendertags",
      "click .btn.save-layer": "saveLayer"
    },

    template: tmpl,

    initialize: function(vent) {
      var self = this;

      self.layers = new LayersCollection();
      self.tags_collection = new TagsCollection();

      self.layers.fetch().done(function () {
        self.render();
        self.attachSubViews();
      });

      self.layers.selected.on("featureEvent", self.featureEvent, self);
    },

    render: function () {
      var self = this;
      var layers = self.layers.toJSON();
  
      this.$el.html(this.template({layers: layers}));
    },  

    attachSubViews: function () {
      var self = this;
  
      // self.collectionTagsView = new GlobalTagsView({
      //   el: $('#globalTags'),
      //   model: self.globalTags
      // });
  
      self.tags_view = new TagsView({
        el: $('#tags'),
        collection: self.tags_collection,
        selectedLayer: self.layers.selected
      });
  
      // this should be a call firing the select event
      this.layers.select(self.layers.models[0].get("filename"));
      
      self.mapView = new MapView({
        model: self.layers.selected
      });
  
      self.mapView.panAndZoom();
    },
  
    featureEvent: function (event) {
      var self = this;
  
      if (event.type == "featureselected") {
        self.tags_collection.parseFeature(event.feature);
      } else if (event.type == "featureunselected") {
        self.tags_collection.reset();
      };
    },

    onChangeLayer: function (event) {
      var $target = $(event.currentTarget);
  
      this.layers.select($target.val());
    },
  
    export: function () {
      var layerId = $('#layerId').val();
      console.log(layerId);
      this.mapView.toJSON(layerId);
    }

  }); 
