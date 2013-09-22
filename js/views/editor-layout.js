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
          collection: self.tags_collection
        });

        self.mapView = new MapView({
          collection: self.layers
        });

        self.mapView.panAndZoom();

        // this.mapView.setVisibility("obrasprivadas.geojson", true);

        self.mapView.addSelectControl();
        // self.mapView.addControlPanel();
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

      saveLayer: function () {
        var layerId = this.layers.selected.get("filename");
        var geojson = this.mapView.getLayerGeoJSON(layerId);

        this.layers.selected.save(geojson);
      },

      exportLayer: function (event) {
        console.log(event);
      }
    }); 

return View;
});
