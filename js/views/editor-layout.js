define([
  "underscore",
  "backbone",
  "handlebars",
  "collections/tags",
  "collections/layers",
  "views/map",
  "views/tags",
  "text!../../templates/editor-layout.handlebars"
  ],
  function (_, Backbone, Handlebars, 
    TagsCollection, LayersCollection, 
    MapView, TagsView, tmpl) {

    var View = Backbone.View.extend({

      el: $("#layout"),

      events: {
        "change select.layer": "onChangeLayer",
        "click .btn.save-layer": "saveLayer",
        "click .btn.export-layer": "exportLayer"
      },

      template: Handlebars.compile(tmpl),

      initialize: function(vent) {
        var self = this;

        self.layers = new LayersCollection();
        self.tags_collection = new TagsCollection();

        self.layers.fetch().done(function () {
          self.render();
          self.attachSubViews();
        });

        self.layers.selected.on("featureEvent", self.featureEvent, self);

        self.layers.selected.on("change:collectionTags", self.onCollectionTagsSet, self);

        self.tags_collection.on("updated", self.setUpdatedFlag, self);

      },

      render: function () {
        var self = this;
        var layers = self.layers.toJSON();
        
        this.$el.html(this.template({layers: layers}));
      },

      attachSubViews: function () {
        var self = this;

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

        // this.mapView.setVisibility("obrasprivadas.geojson", true);

        // self.mapView.addSelectControl();
        // self.mapView.addControlPanel();
        // self.mapView.addEditingToolbar("cpc.geojson");
      },

      setUpdatedFlag: function (event) {
        this.layers.selected.set("updated", true);
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

      onCollectionTagsSet: function (event) {
        console.log(event);
      },

      saveLayer: function () {
        var geojson = this.mapView.getLayerGeoJSON();

        this.layers.selected.save(geojson);
      },

      exportLayer: function (event) {
        console.log(event);
      }
    }); 

return View;
});
