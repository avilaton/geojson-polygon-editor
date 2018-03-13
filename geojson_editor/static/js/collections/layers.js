define([
  "underscore",
  "backbone",
  "../models/storage",
  "../models/layer"],
  function (_, Backbone, Storage, LayerModel) {

    var LayersCollection = Backbone.Collection.extend({
      model: LayerModel,

      initialize: function () {
        this.storage = new Storage('./api/layers.json');
        this.selected = new this.model;
      },

      fetch: function (layerId) {
        var self = this;
        var request = self.storage.list();

        request.done(function (result) {
          self.add(result.items);
        });

        return request;
      },

      select: function (layerId) {
        var self = this;

        var newSelected = _.find(self.models, function (model) {
          return model.get("filename") == layerId;
        });

        self.selected.set(newSelected.attributes);

      }

    }); 

    return LayersCollection;
  });
