define([
  'jquery',
  'underscore',
  'backbone',
  'models/TerritoryModel'
], function($, _, Backbone, TerritoryModel) {

  var TerritoryCollection = Backbone.Collection.extend({

    model: TerritoryModel,

    url: 'http://localhost:3000/territories'
  });

  return TerritoryCollection;
});
