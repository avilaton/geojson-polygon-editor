define([
	"underscore",
	"backbone",
	"handlebars"],
function (_, Backbone, Handlebars) {

	console.log("tags view");
	var TagsView = Backbone.View.extend({
		template: Handlebars.compile($("#tagsTemplate").html()),

		initialize: function(){ 
			console.log("Alerts suck."); 
			console.log(this.template({}));
			this.render();
		},

        render: function () {
        	this.$el.html(this.template(this.model));
        }

	}); 

	return TagsView;
});
