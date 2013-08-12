define([
  "underscore",
  "backbone",
  "handlebars",
  "views/map",
  "views/tags"],
function (_, Backbone, Handlebars, MapView, TagsView) {

  var View = Backbone.View.extend({
    el: $("#layout"),
    events: {
      "click .checkbox": "onClickBarrios",
      "click #export": "export",
      "featureselected": "rendertags"
    },
    layers: {},

    template: Handlebars.compile($("#layoutTemplate").html()),

    initialize: function() {

      this.render();
      this.mapView = new MapView();

    },

    render: function () {
      this.$el.html(this.template(this.model));
    },

    rendertags: function () {
      console.log("catched");
    },

    onClickBarrios: function (event) {
      var layer = event.currentTarget.control.value,
        visibility = event.currentTarget.control.checked;

      this.mapView.toggleLayer(layer, visibility);
    },

    export: function () {
      var layerId = $('#layerId').val();
      console.log(layerId);
      this.mapView.toJSON(layerId);
    }

  }); 

  return View;
});
