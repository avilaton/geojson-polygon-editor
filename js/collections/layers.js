define([
	"underscore",
	"backbone",
  "models/layer"],
function (_, Backbone, LayerModel) {

	var LayersCollection = Backbone.Collection.extend({
    model: LayerModel,
    
		initialize: function () {
			
		}

	}); 

	return LayersCollection;
});
