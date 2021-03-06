var $ = require('jquery')

define([
	"underscore",
	"backbone"],
function (_, Backbone) {

	var Model = Backbone.Model.extend({
		
		initialize: function () {
			this.directory = '/api/layers/';
		},

		save: function (geojson) {
			var self = this;
			var filename = self.get("filename");
			return $.ajax({
	            type: 'PUT',
	            dataType: 'json',
                contentType: 'application/json',
	            data: geojson,
	            url: self.directory + filename,
	            success: function( result ) {
	                return result;
	            }
	        });
		}
	}); 

	return Model;
});
