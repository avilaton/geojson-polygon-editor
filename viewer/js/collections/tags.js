define([
	"underscore",
	"backbone",
  "models/tag"],
function (_, Backbone, TagModel) {

	var TagsCollection = Backbone.Collection.extend({
    model: TagModel,
    
		initialize: function () {
		},

		tagsFromData: function (data) {
			var self = this;
			var counter = 0;
			_.each(data, function (item, index) {
				console.log(item, index);
				self.add({
					id: counter,
					title: index,
					desc: item
				});
				counter++;
			});
		}
	}); 

	return TagsCollection;
});
