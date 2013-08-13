define([
    "underscore",
    "backbone",
    "handlebars",
    "models/tags"],
function (_, Backbone, Handlebars, TagsModel) {

    console.log("tags view");

    var TagsView = Backbone.View.extend({
        
        el:$("#tags"),

        template: Handlebars.compile($("#tagsTemplate").html()),

        initialize: function(model){ 
            
            this.listenTo(this.model, "change", this.render);

            this.render();
        },

        render: function () {
          var self = this;

          this.$el.html(this.template(self.model.attributes));
        },


    }); 

    return TagsView;
});
