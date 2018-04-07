var tmpl = require('../../templates/global-tags.handlebars')

define([
  "underscore",
  "backbone",
  "../../templates/global-tags.handlebars"
  ],
function (_, Backbone) {

  var View = Backbone.View.extend({
    
    // el: $("#tags"),

    template: tmpl,

    events: {

    },

    initialize: function(options){ 

      this.listenTo(this.model, "change", this.render);
      this.render();

    },

    render: function () {
      var self = this;
      this.$el.html(this.template({tags: self.model.toJSON()}) 
      );

    },

    removeTag: function (event) {
      var $target = $(event.currentTarget);
        
      this.collection.remove($target.data("id"));
      this.collection.storeFeature();

    },

    newTag: function (event) {
      this.collection.newTag();
    },

    saveTag: function (event) {
      var $target = $(event.currentTarget);
      var model = this.collection.get($target.data("id"));

      if ($target.hasClass("key")) {
        model.set({key: $target.text()});
      } else if ($target.hasClass("value")){
        model.set({value: $target.text()});
      };
      this.collection.storeFeature();
    },

    onEditableFocus: function (event) {
      // $(event.currentTarget).select();
    }

  }); 

  return View;
});
