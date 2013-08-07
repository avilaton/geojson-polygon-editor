var TagsView = Backbone.View.extend({
	template: Handlebars.compile($("#tagsTemplate").html()),

	initialize: function(){ 
		console.log("Alerts suck."); 
		console.log(this.template({}));
	} 
}); 

var tags_view = new TagsView(); 

console.log(tags_view);