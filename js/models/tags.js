define([
	"underscore",
	"backbone"],
function (_, Backbone) {

	console.log("tags model");

	var TagsModel = Backbone.Model.extend({

		initialize: function (data) {
			this.buildTagsArray(data);
		},

    buildTagsArray: function (data) {
      var result = [];

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          result.push({
            title: key,
            desc: data[key]
          });
        }
      };

      this.set({tags: result});
    }
	}); 

	return TagsModel;
});
