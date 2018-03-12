define([
  "underscore",
  "backbone",
  "../models/tag"],
  function (_, Backbone, TagModel) {

    var TagsCollection = Backbone.Collection.extend({
      model: TagModel,
      
      initialize: function () {
      }

    }); 

    return TagsCollection;
  });
