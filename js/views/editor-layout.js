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
        "featureselected": "rendertags",
        "click .btn.save-layer": "saveLayer",
        "click .btn.export-layer": "exportLayer"
      },

      template: Handlebars.compile(tmpl),

      initialize: function(vent) {
        var self = this;

        self.layers = new LayersCollection();

        self.layers.fetch().done(function () {
          self.render();
        });

        self.tags_collection = new TagsCollection();

        vent.on("featureselected",function (event) {
          self.mapEvent(event);
        });

        // self.layers.selected.on("change", )
      },

      render: function () {
        var self = this;
        var layers = self.layers.toJSON();
        
        this.$el.html(this.template({layers: layers}));

        self.tags_view = new TagsView({
          el: $('#tags'),
          collection: self.tags_collection
        });

        self.mapView = new MapView({
          collection: self.layers
        });

        self.mapView.panAndZoom();

        this.mapView.setVisibility("obrasprivadas.geojson", true);

        self.mapView.addSelectControl(["obrasprivadas.geojson","usodesuelo.geojson", "personas.geojson"]);
      },

      mapEvent: function (event) {
        var self = this;

        if (event.type == "featureselected") {
          self.tags_collection.parseFeature(event.feature);
        } else if (event.type == "featureunselected") {
          self.tags_collection.reset();
        };
      },

      // setCurrent: function (layerId) {
      //   var self = this;

      //   _.each(self.layers.models, function (model) {
      //     self.mapView.setVisibility(model.attributes.filename, false)
      //   });

      //   this.mapView.setVisibility(layerId, true);
      // },

      onChangeLayer: function (event) {
        var $target = $(event.currentTarget);

        this.layers.select($target.val());

        // this.setCurrent($target.val());
      },

      saveLayer: function () {
        var layerId = this.layers.selected.get("filename");
        var geojson = this.mapView.getLayerGeoJSON(layerId);
        // console.log("save layer with content:", geojson);
        this.layers.selected.save(geojson);
      },

      exportLayer: function (event) {
        console.log(event);
      }
    }); 

return View;
});
