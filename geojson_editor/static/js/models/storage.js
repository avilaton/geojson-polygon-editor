var $ = require('jquery')

define([
	"underscore",
	"backbone"],
function (_, Backbone) {

	var StorageModel = Backbone.Model.extend({
		
		initialize: function (directory) {
			this.directory = directory;
		},

		list: function () {
			var self = this;
			return $.ajax( {
	            type: 'GET',
	            dataType: 'json',
	            url: self.directory,
	            success: function( result ) {
	                return result;
	            }
	        });
		},

		get: function (filename) {
			var self = this;
			return $.ajax( {
	            type: 'GET',
	            dataType: 'json',
				contentType: 'application/json',
	            url: self.directory + '/' + filename,
	            success: function( result ) {
	                console.log(result);
	                return result;
	            }
	        });
		},

		save: function (filename, content) {
			
		}
	}); 

	return StorageModel;
});
