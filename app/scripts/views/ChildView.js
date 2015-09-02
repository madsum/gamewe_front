define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'templates',
  'moment'
], function($, _, Backbone, BaseView, JST) {

  'use strict';

  var ChildView = BaseView.extend({

    template: JST['app/scripts/templates/childTemplate.hbs'],

    className: 'view view-child',

    events: {
      "click .render-child": "renderChild"
    },

    renderChild: function(e) {
      this.render();
    },

    initialize: function() {
      console.log('views/ChildView.js');
    },

    render: function() {
      this.$el.html(this.template({
        moment: moment()
          .locale($.cookie('language'))
          .format('L, LTS')
      }));

      this.$el.i18n();

      this.delegateEvents();

      return this;
    }
  });

  return ChildView;
});
