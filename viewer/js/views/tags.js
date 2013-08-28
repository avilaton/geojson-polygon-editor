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
      "click .edit-tag": "editTag",
      "click .remove-tag": "removeTag"
    },

    initialize: function(model){ 
      
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "remove", this.render);
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },

    render: function () {
      var self = this;
      
      this.$el.html(this.template({
          tags: self.collection.toJSON()
        }) 
      );

      console.log("collection changed", self.collection.toJSON());
    },

    removeTag: function (event) {
      var $target = $(event.currentTarget);
        
      var model = this.collection.get($target.data("id"));
      this.collection.remove($target.data("id"));
      this.collection.storeFeature();
      this.collection.trigger("updatetags");
      // console.log(this.collection.dataFromTags());

    }

  }); 

  return TagsView;
});
