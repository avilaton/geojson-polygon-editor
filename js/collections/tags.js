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

			_.each(feature.data, function (item, index) {
				self.add({
					id: counter,
					title: index,
					desc: item
				});
				counter++;
			});
		},

		storeFeature: function () {
			var self = this,
				result = {};

			_.each(self.models, function (item, index) {
				result[item.get('title')] = item.get('desc');
			});

			self.feature.data = result;
			return result;
		}

	}); 

	return TagsCollection;
});
