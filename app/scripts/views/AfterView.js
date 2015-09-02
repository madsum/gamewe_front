define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView'
],
function($, _, Backbone, BaseView) {

  'use strict';

  var AfterView = BaseView.extend({

    initialize: function() {
      console.log('views/AfterView.js');

      this.constructor.__super__.initialize.apply(this);
    },
  });

  return AfterView;
});
