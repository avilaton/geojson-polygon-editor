var SearchView = Backbone.View.extend({ 
	initialize: function(){ 
		console.log("Alerts suck."); 
	} 
}); 

// The initialize function is always called when instantiating a Backbone View. 
// Consider it the constructor of the class. 
var search_view = new SearchView(); 

console.log(search_view);