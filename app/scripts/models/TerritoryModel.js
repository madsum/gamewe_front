define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone, AlertView) {

  var TerritoryModel = Backbone.Model.extend({

    idAttribute: 'id',

    urlRoot: 'http://localhost:3000/territory',

    initialize: function() {
      this.on("save", function(model) {
        model.save({}, {
          success: function(model, response, options) {},
          error: function(model, response, options) {}
        });
      });

      this.on("delete", function(model) {
        model.destroy({
          contentType: 'application/json',
          data: JSON.stringify(model.attributes)
        }, {
          success: function(model, response, options) {},
          error: function(model, response, options) {}
        });
      });
    }
  });

  return TerritoryModel;
});
