var tmpl = require("../../templates/tags-list.handlebars")
var $ = require('jquery')

define([
  "underscore",
  "backbone"
  ],
function (_, Backbone) {

  var View = Backbone.View.extend({
    
    // el: $("#tags"),

    template: tmpl,

    events: {
      "click .new-tag": "newTag",
      "click .remove-tag": "removeTag",
      // "focus .editable": "onEditableFocus",
      "blur .editable": "saveTag"
    },

    initialize: function(options){ 
      this.selectedLayer = options.selectedLayer;

      this.listenTo(this.collection, "add remove reset", this.render);
      this.render();

    },

    render: function () {
      var self = this;
      this.$el.html(this.template({
          tags: self.collection.toJSON()
          , selectedLayer: self.selectedLayer ? self.selectedLayer.toJSON() : {}
        }) 
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
