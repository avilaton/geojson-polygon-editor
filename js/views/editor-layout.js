define([
  "underscore",
  "backbone",
  "handlebars",
  "models/storage",
  "collections/tags",
  "views/map",
  "views/tags",
  "text!../../templates/editor-layout.handlebars"
  ],
function (_, Backbone, Handlebars, 
  Storage, TagsCollection, 
  MapView, TagsView, ViewLayoutTemplate) {

  var View = Backbone.View.extend({
    el: $("#layout"),
    events: {
      "click .checkbox": "onClickBarrios",
      "change input[name=capasOption]": "onClickRadio",
      "featureselected": "rendertags",
      "click .btn.save-layer": "saveLayer"
    },
    layers: {
      barrios: {
        name: "Barrios",
        id: "barrios",
        filename: "./data/barrios.geojson",
        style: "overlay"
      },
      distritos: {
        name: "Distritos", 
        id: "distritos",
        filename: "./data/distritos.geojson",
        style: "overlay"
      },
      cpc: {
        name: "Zonas CPC", 
        id: "cpc",
        filename: "./data/cpc.geojson",
        style: "overlay"
      },
      obrasprivadas: {
        name: "Obras Privadas",
        id: "obrasprivadas",
        filename: "./data/obrasprivadas.geojson",
        style: "select"
      },
      usodesuelo: {
        name: "Uso de Suelo",
        id: "usodesuelo",
        filename: "./data/usodesuelo.geojson",
        style: "select"
      },
      personas: {
        name: "Personas",
        id: "personas",
        filename: "./data/personas.geojson",
        style: "select"
      }
    },

    template: Handlebars.compile(ViewLayoutTemplate),

    initialize: function(vent) {
      var self = this;

      self.render();

      self.mapView = new MapView();

      self.mapView.panAndZoom();

      var files = new Storage('./data');
      files.list().done(function (result) {
        console.log("just got your files: ", result);
      });
      files.get('cpc.geojson');

      self.mapView.addLayer(self.layers.barrios);
      self.mapView.addLayer(self.layers.distritos);
      self.mapView.addLayer(self.layers.cpc);
      self.mapView.addLayer(self.layers.obrasprivadas);
      self.mapView.addLayer(self.layers.usodesuelo);
      self.mapView.addLayer(self.layers.personas);

      this.mapView.setVisibility("obrasprivadas", true);

      self.mapView.addSelectControl(["obrasprivadas","usodesuelo", "personas"]);

      self.tags_collection = new TagsCollection();

      self.tags_view = new TagsView({
        el: $("#tags"),
        collection: self.tags_collection
      });

      vent.on("featureselected",function (event) {
        self.mapEvent(event);
      });
    },

    render: function () {
      this.$el.html(this.template(this.model));
    },

    mapEvent: function (event) {
      var self = this;
      // this.mapView.toJSON(event.feature);

      if (event.type == "featureselected") {
        self.tags_collection.parseFeature(event.feature);
      } else if (event.type == "featureunselected") {
        self.tags_collection.reset();
      };
    },

    onClickBarrios: function (event) {
      var layer = event.currentTarget.control.value,
        visibility = event.currentTarget.control.checked;

      this.mapView.setVisibility(layer, visibility);
    },

    onClickRadio: function (event) {
      var target = event.currentTarget;
      event.stopPropagation();

      var allOptions = $("input[name="+target.name+"]");
      for (var i = allOptions.length - 1; i >= 0; i--) {
        this.mapView.setVisibility(allOptions[i].value, false)
      };

      this.mapView.setVisibility(event.currentTarget.value, true);
      // this.mapView.setSelectable(event.currentTarget.value);
    },

    export: function () {
      var layerId = $('#layerId').val();
      console.log(layerId);
      this.mapView.toJSON(layerId);
    }

  }); 

  return View;
});
