define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'config',
  'templates',
  'bootstrap-daterangepicker',
  'qtip2',
  'autonumeric',
  'bootstrap-modal'
], function($, _, Backbone, BaseView, Config, JST) {

  'use strict';

  var DefaultView = BaseView.extend({

    template: JST['app/scripts/templates/defaultTemplate.hbs'],

    className: 'view view-default',

    initialize: function(options) {
      console.log('views/DefaultView.js', Config.attribute);

      this.options = options;
    },

    render: function() {
      this.$el.html(this.template({
        options: this.options,

        param1: Math.random().toString(36).substring(7),
        param2: Math.random().toString(36).substring(7),

        isParam1Set: _.isNull(this.options._value1) ? false : true,
        isParam2Unset: !_.isNull(this.options._value2) ? false : true,

        isParam1SetDesc: _.isNull(this.options._value1) ? $.t('boolean.false') : $.t('boolean.true'),
        isParam2UnsetDesc: !_.isNull(this.options._value2) ? $.t('boolean.false') : $.t('boolean.true'),

        selectList: [
          { key: 'Key 1', value: 'Value 1' },
          { key: 'Key 2', value: 'Value 2' },
          { key: 'Key 3', value: 'Value 3' }
        ]
      }));

      $('#input-daterangepicker', this.$el).daterangepicker();

      $('#input-autonumeric', this.$el).autoNumeric('init');

      $('[title]', this.$el).qtip({
        style: { classes: 'qtip-tipsy' },
        position: { my: 'bottom center', at: 'top center' }
      });

      this.$el.i18n();

      this.delegateEvents();

      return this;
    }
  });

  return DefaultView;
});
