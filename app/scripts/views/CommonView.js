define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'templates',
  'jquery-cookie'
], function($, _, Backbone, BaseView, JST) {

  'use strict';

  var CommonView = BaseView.extend({

    template: JST['app/scripts/templates/commonTemplate.hbs'],

    className: 'view view-common',

    events: {
      "click #language a": "setLanguage"
    },

    setLanguage: function(e) {
      e.preventDefault();
      $.cookie('language', $(e.currentTarget).data('language'));
      location.reload();
    },

    initialize: function() {
      console.log('views/CommonView.js');

      this.render().el;
    },

    render: function() {
      this.$el.html(this.template());

      this.$el.i18n();

      this.delegateEvents();

      return this;
    }
  });

  return CommonView;
});
