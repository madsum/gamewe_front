define([
  'jquery',
  'underscore',
  'backbone'
],
/**
  * BaseView for all app views.
  * @module core/BaseView
  * @augments Backbone.View
  */
function($, _, Backbone) {

  'use strict';

  var BaseView = Backbone.View.extend({

    initialize: function() {}
  });

  return BaseView;
});