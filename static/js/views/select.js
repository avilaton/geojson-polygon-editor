define([
  "underscore",
  "backbone",
  "handlebars",
  "text!../../templates/select.handlebars"
  ],
function (_, Backbone, Handlebars, tmpl) {

  var View = Backbone.View.extend({
    template: Handlebars.compile(tmpl),
    events: {
      "change select": "onChangeSelect"
    },

    initialize: function(){ 

      this.listenTo(this.collection, "add remove reset", this.render);
      this.render();

    },

    render: function () {
      var self = this;

      this.$el.html(this.template({
          tags: self.collection.toJSON()
        }) 
      );

    }

  }); 

  return View;
});
