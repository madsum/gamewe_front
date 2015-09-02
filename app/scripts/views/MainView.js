define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'views/ChildView',
  'views/RestView',
  'templates'
], function($, _, Backbone, BaseView, ChildView, RestView, JST) {

  'use strict';

  var MainView = BaseView.extend({

    template: JST['app/scripts/templates/mainTemplate.hbs'],

    className: 'view view-main',

    events: {
      "click .render-child": "renderChild"
    },

    renderChild: function(e) {
      $('#child-view', this.$el).html(this.child.childView.render().el);
    },

    initialize: function() {
      console.log('views/MainView.js');

      this.child = {
        childView: new ChildView(),
        restView: new RestView()
      };
    },

    render: function() {
      this.$el.html(this.template());

      $('#child-view', this.$el).html(this.child.childView.render().el);
      $('#rest-view', this.$el).html(this.child.restView.render().el);

      this.$el.i18n();

      this.delegateEvents();

      return this;
    }
  });

  return MainView;
});
