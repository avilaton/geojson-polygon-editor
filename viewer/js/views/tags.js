define([
  "underscore",
  "backbone",
  "handlebars",
  "models/tags",
  "text!../../templates/tags.handlebars"
  ],
function (_, Backbone, Handlebars, TagsModel, TagsTemplate) {

  var TagsView = Backbone.View.extend({
    
    el:$("#tags"),

    template: Handlebars.compile(TagsTemplate),

    initialize: function(model){ 
      
      this.listenTo(this.model, "change", this.render);
      this.render();
    },

    render: function () {
      var self = this,
        testTags = [{title:"a", desc: "b"}];

      this.$el.html(this.template(self.model.attributes));
      //this.$el.html(this.template({tags:testTags}));
    },


  }); 

  return TagsView;
});
