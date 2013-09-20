define([
  "underscore",
  "backbone",
  "models/tag"],
  function (_, Backbone, TagModel) {

    var TagsCollection = Backbone.Collection.extend({
      model: TagModel,
      
      initialize: function () {
      },

      parseFeature: function (feature) {
        var self = this;
        var counter = 0;

        self.feature = feature;

        _.each(feature.attributes, function (item, index) {
          self.add({
            id: counter,
            key: index,
            value: item
          });
          counter++;
        });
      },

      storeFeature: function () {
        var self = this,
        result = {};

        _.each(self.models, function (item, index) {
          result[item.get('key')] = item.get('value');
        });

        self.feature.attributes = result;
        return result;
      },

      newTag: function () {
        var self = this;

        this.add({key:"", value: "", id: self.length+1});
      }

    }); 

    return TagsCollection;
  });
