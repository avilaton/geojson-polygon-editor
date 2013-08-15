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
      "change input[name=capasOption]": "onClickRadio",
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

      this.mapView.setVisibility(layer, visibility);
    },

    onClickRadio: function (event) {
      var target = event.currentTarget;
      event.stopPropagation();
      console.log(this.mapView.selectControl);

      var allOptions = $("input[name="+target.name+"]");
      for (var i = allOptions.length - 1; i >= 0; i--) {
        this.mapView.setVisibility(allOptions[i].value, false)
      };

      this.mapView.setVisibility(event.currentTarget.value, true);
      this.mapView.setSelectable(event.currentTarget.value);
    },

    export: function () {
      var layerId = $('#layerId').val();
      console.log(layerId);
      this.mapView.toJSON(layerId);
    }

  }); 

  return View;
});
