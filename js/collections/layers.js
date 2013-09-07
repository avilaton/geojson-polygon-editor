define([
  "underscore",
  "backbone",
  "models/storage",
  "models/layer"],
  function (_, Backbone, Storage, LayerModel) {

    var LayersCollection = Backbone.Collection.extend({
      model: LayerModel,

      initialize: function () {
        this.storage = new Storage('./data');
      },

      fetch: function (layerId) {
        var self = this;
        var request = self.storage.list();

        request.done(function (result) {
          self.add(result.items);
        });

        return request;
      }

    }); 

    return LayersCollection;
  });
