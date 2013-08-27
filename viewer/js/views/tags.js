define([
  "underscore",
  "backbone",
  "handlebars",
  "text!../../templates/tags.handlebars"
  ],
function (_, Backbone, Handlebars, TagsTemplate) {

  var TagsView = Backbone.View.extend({
    
    el:$("#tags"),

    template: Handlebars.compile(TagsTemplate),

    events: {
      "click .tag-edit": "editTag"
    },

    initialize: function(model){ 
      
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },

    render: function () {
      var self = this,
        testTags = [{title:"a", desc: "b"}];
      console.log("collection changed", self.collection.toJSON());
      //this.$el.html(this.template({tags:testTags}));
      this.$el.html(this.template({
          tags: self.collection.toJSON()
        }) 
      );
      console.log(self.collection);
    },

    editTag: function (event) {
      console.log("edit this tag",event);
      var $target = $(event.currentTarget);
        
      var model = this.collection.get($target.data("id"));
      console.log(model);
    }

  }); 

  return TagsView;
});
