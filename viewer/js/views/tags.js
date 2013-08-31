define([
  "underscore",
  "backbone",
  "handlebars",
  "text!../../templates/tags-list.handlebars"
  ],
function (_, Backbone, Handlebars, TagsListTemplate) {

  var TagsView = Backbone.View.extend({
    
    el:$("#tags"),

    template: Handlebars.compile(TagsListTemplate),

    events: {
      "click .edit-add": "editAdd",
      "click .remove-tag": "removeTag",
      "focus .editable": "onEditableFocus",
      "blur .editable": "saveTag"
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

    },

    removeTag: function (event) {
      var $target = $(event.currentTarget);
        
      var model = this.collection.get($target.data("id"));
      this.collection.remove($target.data("id"));
      this.collection.storeFeature();
      this.collection.trigger("updatetags");

    },

    editAdd: function (event) {
      var $target = $(event.currentTarget);

      // this code should be moved to the collection id handling
      var newId = this.collection.max(function (model) {
        return model.get("id");
      }).get("id")+1;
      this.collection.add({title:"...", desc: "...", id: newId});
    },

    saveTag: function (event) {
      var $target = $(event.currentTarget);
      var model = this.collection.get($target.data("id"));
      if ($target.hasClass("key")) {
        model.set({title: $target.text()});
      } else if ($target.hasClass("value")){
        model.set({desc: $target.text()});
      };
      this.collection.storeFeature();
    },

    onEditableFocus: function (event) {
      // $(event.currentTarget).select();

      console.log(event);
    }

  }); 

  return TagsView;
});
