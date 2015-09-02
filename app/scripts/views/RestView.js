define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'views/FormView',
  'models/TerritoryCollection',
  'templates'
], function($, _, Backbone, BaseView, FormView, TerritoryCollection, JST) {

  'use strict';

  var RestView = BaseView.extend({

    template: JST['app/scripts/templates/restTemplate.hbs'],

    className: 'view view-rest',

    events: {
      "click .btn-save": "saveTerritory",
      "click .btn-delete": "deleteTerritory"
    },

    saveTerritory: function(e) {
      var id = $(e.currentTarget).data('id');
      var model = this.territoryCollection.at(id);
      model.trigger('save', model);
    },

    deleteTerritory: function(e) {
      var id = $(e.currentTarget).data('id');
      var model = this.territoryCollection.at(id);
      model.trigger('delete', model);
    },

    initialize: function() {
      console.log('views/RestView.js');

      this.child = {
        formView: new FormView()
      };
    },

    fetchTerritoryCollection: function() {
      var self = this;

      var promise = new TerritoryCollection().fetch({
        reset: true,
        wait: true,
        success: function(collection, response, options) {
          self.territoryCollection = collection;
        },
        error: function(collection, response, options) {}
      });

      return promise;
    },

    render: function() {
      var self = this;

      self.fetchTerritoryCollection().then(function(response, status, xhr) {

      }).then(function() {

        self.$el.html(self.template({
          territoryCollection: self.territoryCollection
        }));

        $('#form-view', self.$el).html(self.child.formView.render().el);

        self.$el.i18n();

        self.delegateEvents();

      });

      return this;
    }
  });

  return RestView;
});
